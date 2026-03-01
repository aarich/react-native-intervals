import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { ActionType } from '../../types';

export type UpcomingAlert = {
  offsetMs: number;
  step: number;
  title: string;
  actionType: ActionType;
};

export type NotificationPermissionState =
  | 'enabled'
  | 'disabled'
  | 'undetermined'
  | 'unavailable';

let initialized = false;
let intervalNotificationIds: string[] = [];

const ensurePermissions = async () => {
  if (Platform.OS === 'web') {
    return false;
  }

  const existing = await Notifications.getPermissionsAsync();
  if (existing.granted) {
    return true;
  }

  if (existing.status !== 'undetermined' || existing.canAskAgain === false) {
    return false;
  }

  const requested = await Notifications.requestPermissionsAsync();
  return requested.granted;
};

export const getNotificationPermissionState =
  async (): Promise<NotificationPermissionState> => {
    if (Platform.OS === 'web') {
      return 'unavailable';
    }

    const permission = await Notifications.getPermissionsAsync();
    if (permission.granted) {
      return 'enabled';
    }
    if (permission.status === 'undetermined') {
      return 'undetermined';
    }
    return 'disabled';
  };

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

export const initializeIntervalNotifications = async () => {
  if (initialized) {
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
};

export const cancelIntervalNotifications = async () => {
  await Promise.all(
    intervalNotificationIds.map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => undefined),
    ),
  );
  intervalNotificationIds = [];
};

export const scheduleIntervalNotifications = async (
  timerName: string,
  upcomingAlerts: UpcomingAlert[],
) => {
  await initializeIntervalNotifications();
  await cancelIntervalNotifications();

  if (upcomingAlerts.length === 0) {
    return;
  }

  const isAllowed = await ensurePermissions();
  if (!isAllowed) {
    return;
  }

  const scheduleStart = Date.now();
  const ids = await Promise.all(
    upcomingAlerts.map((alert) => {
      const ms = Math.max(alert.offsetMs, 0);
      return Notifications.scheduleNotificationAsync({
        content: {
          title: timerName,
          body: `Step ${alert.step}: ${alert.title}`,
          sound: 'default',
          data: { actionType: alert.actionType },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: new Date(scheduleStart + ms),
          channelId: Platform.OS === 'android' ? 'interval-alerts' : undefined,
        },
      });
    }),
  );

  intervalNotificationIds = ids;
};
