import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ActionType } from '../../types';

export type UpcomingAlert = {
  offsetMs: number;
  title: string;
  actionType: ActionType;
};

export type NotificationPermissionState =
  | 'enabled'
  | 'disabled'
  | 'undetermined'
  | 'unavailable';

let initialized = false;
let initializePromise: Promise<void> | null = null;
let intervalNotificationIds: string[] = [];
let notificationQueue: Promise<void> = Promise.resolve();

/**
 * Ensures notification mutations run sequentially to avoid schedule/cancel races.
 */
const enqueueNotificationOperation = async <T>(operation: () => Promise<T>) => {
  let result: T | undefined;
  let operationError: unknown;

  notificationQueue = notificationQueue
    .catch(() => undefined)
    .then(async () => {
      try {
        result = await operation();
      } catch (e) {
        operationError = e;
      }
    });

  await notificationQueue;
  if (operationError) {
    throw operationError;
  }
  return result as T;
};

/**
 * Returns whether local notification permissions are currently available.
 */
const ensurePermissions = async () => {
  if (Platform.OS === 'web') {
    return false;
  }

  try {
    const existing = await Notifications.getPermissionsAsync();
    if (existing.granted) {
      return true;
    }

    if (existing.status !== 'undetermined' || existing.canAskAgain === false) {
      return false;
    }

    const requested = await Notifications.requestPermissionsAsync();
    return requested.granted;
  } catch (e) {
    console.error('Failed to verify notification permissions', e);
    return false;
  }
};

/**
 * Reads the current app notification permission state for settings UI.
 */
export const getNotificationPermissionState =
  async (): Promise<NotificationPermissionState> => {
    if (Platform.OS === 'web') {
      return 'unavailable';
    }

    try {
      const permission = await Notifications.getPermissionsAsync();
      if (permission.granted) {
        return 'enabled';
      }
      if (permission.status === 'undetermined') {
        return 'undetermined';
      }
      return 'disabled';
    } catch (e) {
      console.error('Failed to read notification permission state', e);
      return 'disabled';
    }
  };

/**
 * Requests notification permission immediately when the platform can prompt.
 */
export const requestNotificationPermissionImmediately =
  async (): Promise<NotificationPermissionState> => {
    await initializeIntervalNotifications();

    if (Platform.OS === 'web') {
      return 'unavailable';
    }

    const current = await Notifications.getPermissionsAsync();
    if (current.granted) {
      return 'enabled';
    }

    if (current.status === 'undetermined' && current.canAskAgain !== false) {
      const requested = await Notifications.requestPermissionsAsync();
      return requested.granted ? 'enabled' : 'disabled';
    }

    return 'disabled';
  };

/**
 * Sets handlers/channels once per app session before scheduling notifications.
 */
export const initializeIntervalNotifications = async () => {
  if (initialized) {
    return;
  }

  if (initializePromise) {
    await initializePromise;
    return;
  }

  initializePromise = (async () => {
    if (Platform.OS === 'web') {
      initialized = true;
      return;
    }

    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const isSound =
          notification.request.content.data?.actionType === ActionType.sound;
        return {
          shouldShowAlert: true,
          shouldPlaySound: !isSound, // don't play sound for sound notifications since they are already playing the audio
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        };
      },
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('interval-alerts', {
        name: 'Interval Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        sound: 'default',
      });
    }

    initialized = true;
  })().catch((e) => {
    initializePromise = null;
    throw e;
  });

  await initializePromise;
};

/**
 * Cancels only notifications tracked by this module and clears tracked IDs.
 */
const cancelTrackedNotifications = async () => {
  const idsToCancel = intervalNotificationIds;
  intervalNotificationIds = [];

  await Promise.all(
    idsToCancel.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch((e) => {
        console.error(`Failed to cancel notification ${id}`, e);
      }),
    ),
  );
};

/**
 * Serially cancels all tracked interval notifications.
 */
export const cancelIntervalNotifications = async () => {
  await enqueueNotificationOperation(cancelTrackedNotifications);
};

/**
 * Replaces tracked interval notifications with alerts for upcoming timer steps.
 */
export const scheduleIntervalNotifications = async (
  timerName: string,
  upcomingAlerts: UpcomingAlert[],
) => {
  await enqueueNotificationOperation(async () => {
    await initializeIntervalNotifications();
    await cancelTrackedNotifications();

    if (upcomingAlerts.length === 0) {
      return;
    }

    const isAllowed = await ensurePermissions();
    if (!isAllowed) {
      return;
    }

    const scheduleStart = Date.now();
    const settledIds = await Promise.allSettled(
      upcomingAlerts.map((alert) => {
        const ms = Math.max(alert.offsetMs, 0);
        return Notifications.scheduleNotificationAsync({
          content: {
            title: timerName,
            body: alert.title,
            sound: 'default',
            data: { actionType: alert.actionType },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: new Date(scheduleStart + ms),
            channelId:
              Platform.OS === 'android' ? 'interval-alerts' : undefined,
          },
        });
      }),
    );

    intervalNotificationIds = settledIds.flatMap((result, index) => {
      if (result.status === 'fulfilled') {
        return [result.value];
      }
      console.error(
        `Failed to schedule alert ${index + 1}/${upcomingAlerts.length}`,
        result.reason,
      );
      return [];
    });
  });
};
