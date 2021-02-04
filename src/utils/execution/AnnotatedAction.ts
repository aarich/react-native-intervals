import { AUDIO_FILES, play } from '../audio';
import { Action, ActionType } from '../../types';

import { Audio } from 'expo-av';

export default class AnnotatedAction {
  action: Action;
  elapsedMs: number;

  // For GoTo
  totalPasses: number;
  // For Sound
  private playingSound?: Audio.Sound;

  constructor(action: Action) {
    this.action = action;
    this.elapsedMs = 0;
    this.totalPasses = 0;
  }

  public tick(ms: number) {
    this.elapsedMs += ms;
  }

  public get isFinished(): boolean {
    if (this.action.type === ActionType.goTo) {
      return true;
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

  public get progress(): number | undefined {
    if (this.action.type === ActionType.goTo) {
      return (100 * this.totalPasses) / this.action.params.times;
    }
    return (100 * this.elapsedMs) / (this.action.params.time * 1000);
  }

  public get time(): number {
    return this.action.type === ActionType.goTo
      ? 0
      : this.action.params.time * 1000;
  }

  public onLeave() {
    this.totalPasses++;
    if (this.playingSound) {
      const sound = this.playingSound;

      sound
        .setStatusAsync({ shouldPlay: false })
        .then(() => sound.unloadAsync())
        .then(() => (this.playingSound = undefined));
    }
  }

  public onStart(isRapid?: boolean) {
    this.elapsedMs = 0;
    if (!isRapid && this.action.type === ActionType.sound) {
      play(AUDIO_FILES[this.action.params.sound], { isLooping: true }).then(
        (sound) => (this.playingSound = sound)
      );
    }
  }

  public onPause() {
    if (this.playingSound) {
      const sound = this.playingSound;

      sound.setStatusAsync({ shouldPlay: false }).then(() => {
        sound.unloadAsync();
      });
    }
  }

  public onResume() {
    if (this.action.type === ActionType.sound) {
      play(AUDIO_FILES[this.action.params.sound], {
        isLooping: true,
        positionMillis: this.elapsedMs,
      }).then((sound) => (this.playingSound = sound));
    }
  }

  public get viewLabel(): string | undefined {
    if (this.action.type === ActionType.goTo) {
      const more = Math.max(this.action.params.times - this.totalPasses, 0);
      return `Return to step ${
        this.action.params.targetNode + 1
      }. Repeats ${more} more time${more === 1 ? '' : 's'}`;
    }
  }
}
