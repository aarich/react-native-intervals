import { Audio } from 'expo-av';
import { Action, ActionType } from '../../types';
import { getAudioInfo, play } from '../audio';
import Executor from './Executor';

export default class AnnotatedAction {
  action: Action;
  elapsedMs: number;
  private isCurrentlyPlayingAction: boolean;

  // For GoTo
  totalPasses: number;
  // For Sound
  private playingSound?: Audio.Sound;
  // For Pause
  hasResumed: boolean;

  constructor(action: Action) {
    this.action = action;
    this.elapsedMs = 0;
    this.totalPasses = 0;
    this.hasResumed = false;
    this.isCurrentlyPlayingAction = false;
  }

  public tick(ms: number) {
    this.elapsedMs += ms;
  }

  public get isFinished(): boolean {
    if (this.action.type === ActionType.goTo) {
      return true;
    } else if (this.action.type === ActionType.pause) {
      return this.hasResumed;
    } else {
      return this.action.params.time * 1000 <= this.elapsedMs;
    }
  }

  public get nextNodeIndex(): number {
    if (
      this.action.type === ActionType.goTo &&
      this.totalPasses < this.action.params.times - 1
    ) {
      return this.action.params.targetNode;
    }

    return this.action.index + 1;
  }

  public get progress(): number {
    switch (this.action.type) {
      case ActionType.pause:
        return this.hasResumed ? 1 : 0.5;
      case ActionType.goTo:
        return (100 * this.totalPasses) / this.action.params.times;
      default:
        return (100 * this.elapsedMs) / this.time;
    }
  }

  /** @returns total time in ms */
  public get time(): number {
    return this.action.type === ActionType.goTo ||
      this.action.type === ActionType.pause
      ? 0
      : this.action.params.time * 1000;
  }

  public onLeave() {
    this.totalPasses++;
    this.isCurrentlyPlayingAction = false;
    if (this.playingSound) {
      const sound = this.playingSound;

      sound
        .setStatusAsync({ shouldPlay: false })
        .then(() => sound.unloadAsync())
        .then(() => (this.playingSound = undefined));
    }
  }

  public onStart(executor: Executor, isRapid?: boolean) {
    this.isCurrentlyPlayingAction = true;
    this.elapsedMs = 0;
    if (!isRapid && this.action.type === ActionType.sound) {
      play(getAudioInfo(this.action.params.sound), {
        isLooping: true,
      }).then((sound) => this.handleNewlyPlayedSound(sound));
    }

    if (this.action.type === ActionType.pause) {
      executor.pause();
    }
  }

  public onPause() {
    this.isCurrentlyPlayingAction = false;
    if (this.playingSound) {
      const sound = this.playingSound;

      sound.setStatusAsync({ shouldPlay: false }).then(() => {
        sound.unloadAsync();
      });
    }
  }

  public onResume() {
    this.isCurrentlyPlayingAction = true;
    this.hasResumed = true;
    if (this.action.type === ActionType.sound) {
      play(getAudioInfo(this.action.params.sound), {
        isLooping: true,
        positionMillis: this.elapsedMs,
      }).then((sound) => this.handleNewlyPlayedSound(sound));
    }
  }

  public skip() {
    switch (this.action.type) {
      case ActionType.act:
      case ActionType.wait:
      case ActionType.sound:
        this.elapsedMs = this.action.params.time * 1000;
        break;
      default:
        break;
    }
  }

  public get viewLabel(): string | undefined {
    if (this.action.type === ActionType.goTo) {
      const more = Math.max(this.action.params.times - this.totalPasses, 1);
      return `Return to step ${this.action.params.targetNode + 1}. Repeats ${
        more - 1
      } more time${more - 1 === 1 ? '' : 's'}`;
    }
  }

  /**
   * For start and resume, check if we've already exited the action. This avoids a race condition
   * where the sound node is skipped out of before the sound has been loaded. This way, as soon as the
   * sound is loaded we check to make sure we haven't already exited the action.
   */
  private handleNewlyPlayedSound(sound: Audio.Sound) {
    this.playingSound = sound;
    if (!this.isCurrentlyPlayingAction) {
      // it means we already exited. Stop the sound
      sound
        .setStatusAsync({ shouldPlay: false })
        .then(() => sound.unloadAsync())
        .then(() => (this.playingSound = undefined));
    }
  }
}
