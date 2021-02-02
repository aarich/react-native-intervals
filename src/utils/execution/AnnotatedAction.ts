import { Action, ActionType } from '../../types';

export default class AnnotatedAction {
  action: Action;
  elapsedMs: number;

  // For GoTo
  totalPasses: number;
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
      this.totalPasses < this.action.params.times
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

  public onLeave() {
    this.totalPasses++;
  }

  public onStart() {
    this.elapsedMs = 0;
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
