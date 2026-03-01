import { AudioPlayer } from 'expo-audio';
import Executor from '../execution/Executor';
import { play } from '../audio/play';
import { AUDIO_FILES } from '../audio/library';
import { syncLiveActivity, stopLiveActivity } from './liveActivity';
import {
  scheduleIntervalNotifications,
  cancelIntervalNotifications,
} from './notifications';

class LiveActivityManager {
  private silentPlayer: AudioPlayer | null = null;
  private lastNotificationSignature: string = '';
  private lastNotificationSyncMs = 0;
  private syncQueue: Promise<void> = Promise.resolve();
  private readonly notificationResyncMs = 15000;

  /**
   * Syncs Live Activity, notifications, and background keepalive for timer state.
   */
  public async sync(
    executor: Executor,
    timerName: string,
    showLiveActivity: boolean,
  ) {
    this.syncQueue = this.syncQueue
      .catch(() => undefined)
      .then(() => this.syncInternal(executor, timerName, showLiveActivity));
    await this.syncQueue;
  }

  /**
   * Internal sync body that isolates failures between background subsystems.
   */
  private async syncInternal(
    executor: Executor,
    timerName: string,
    showLiveActivity: boolean,
  ) {
    const status = executor.getLiveStatus();
    const isRunning = status.status === 'running';

    try {
      await syncLiveActivity(status, showLiveActivity);
    } catch (e) {
      console.error('Live Activity sync failed', e);
    }

    if (isRunning) {
      this.ensureSilentAudio(true);
      await this.syncNotifications(executor, timerName);
      return;
    }

    await this.clearNotifications();
    this.ensureSilentAudio(false);
  }

  /**
   * Refreshes upcoming alerts when step/run state changes or on periodic resync.
   */
  private async syncNotifications(executor: Executor, timerName: string) {
    const now = Date.now();
    const notificationSignature = `${timerName}|${
      executor.currentNodeIndex ?? -1
    }|${executor.status}`;
    const shouldResync =
      notificationSignature !== this.lastNotificationSignature ||
      now - this.lastNotificationSyncMs >= this.notificationResyncMs;

    if (!shouldResync) {
      return;
    }

    const alerts = executor.getUpcomingAlerts(40);
    try {
      await scheduleIntervalNotifications(timerName, alerts);
      this.lastNotificationSignature = notificationSignature;
      this.lastNotificationSyncMs = now;
    } catch (e) {
      console.error('Notification sync failed', e);
    }
  }

  /**
   * Stops any tracked interval notifications for non-running states.
   */
  private async clearNotifications() {
    if (this.lastNotificationSignature === '') {
      return;
    }

    this.lastNotificationSignature = '';
    this.lastNotificationSyncMs = 0;
    try {
      await cancelIntervalNotifications();
    } catch (e) {
      console.error('Failed to clear interval notifications', e);
    }
  }

  /**
   * Starts/stops silent looping audio used to keep execution alive in background.
   */
  private ensureSilentAudio(shouldPlay: boolean) {
    if (shouldPlay) {
      if (!this.silentPlayer && AUDIO_FILES.length > 0) {
        // Use an existing audio file at 0 volume to maintain background execution
        try {
          this.silentPlayer = play(AUDIO_FILES[0], {
            isLooping: true,
            volume: 0,
          });
        } catch (e) {
          console.error('Failed to start silent background audio', e);
          this.silentPlayer = null;
        }
      }
    } else {
      if (this.silentPlayer) {
        try {
          this.silentPlayer.pause();
          this.silentPlayer.remove();
        } catch (e) {
          console.error('Failed to stop silent background audio', e);
        }
        this.silentPlayer = null;
      }
    }
  }

  /**
   * Stops all background integrations and resets manager-internal tracking state.
   */
  public async stop() {
    this.syncQueue = this.syncQueue
      .catch(() => undefined)
      .then(() => this.stopInternal());
    await this.syncQueue;
  }

  /**
   * Internal stop body that serially tears down all background side effects.
   */
  private async stopInternal() {
    this.ensureSilentAudio(false);
    this.lastNotificationSignature = '';
    this.lastNotificationSyncMs = 0;

    try {
      await stopLiveActivity();
    } catch (e) {
      console.error('Failed to stop Live Activity', e);
    }

    try {
      await cancelIntervalNotifications();
    } catch (e) {
      console.error('Failed to stop interval notifications', e);
    }
  }
}

export const liveActivityManager = new LiveActivityManager();
