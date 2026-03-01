import { Action, ActionType } from '../../types';
import { getActionInfo } from '../actions';
import { calculateRuntime, msToViewable } from '../api';
import { LiveStatus } from '../background/liveActivity';
import { UpcomingAlert } from '../background/notifications';
import AnnotatedAction from './AnnotatedAction';

export type RunStatus = 'notstarted' | 'running' | 'paused' | 'done';

export default class Executor {
  public status: RunStatus;
  public currentNodeIndex?: number;
  public totalElapsedMs: number;
  public lastTickTimeMs: number;

  private initialFlow: Action[];
  private annotatedFlow: AnnotatedAction[];
  private finalElapsedTimeMs: number;

  private setLabelOverides: (l: (string | undefined)[]) => void;
  private setNodeProgresses: (progress: (number | undefined)[]) => void;

  constructor(
    flow: Action[],
    setLabelOverides: (labelOverrides: (string | undefined)[]) => void,
    setCurrentNodeProgress: (progress: (number | undefined)[]) => void,
  ) {
    this.finalElapsedTimeMs = calculateRuntime(flow);
    this.initialFlow = flow;
    this.annotatedFlow = flow.map((action) => new AnnotatedAction(action));
    this.currentNodeIndex = 0;
    this.status = 'notstarted';
    this.totalElapsedMs = 0;
    this.setLabelOverides = setLabelOverides;
    this.setNodeProgresses = setCurrentNodeProgress;
    this.lastTickTimeMs = Date.now();
  }

  public tick(ms: number) {
    if (this.status !== 'running') {
      return;
    }
    this.lastTickTimeMs = Date.now();
    this.totalElapsedMs += ms;

    this.currentNode?.tick(ms);

    this.handleNodeFinish();

    this.setLabelOverides(this.getLabelOverrides());
    this.setNodeProgresses(this.getNodeProgresses());
  }

  private handleNodeFinish() {
    while (this.currentNode?.isFinished && this.status === 'running') {
      const currentNode = this.currentNode;
      const currentIndex = this.currentNodeIndex as number;
      const nextNodeIndex = currentNode.nextNodeIndex;

      currentNode.onLeave();
      if (nextNodeIndex === this.annotatedFlow.length) {
        // We're at the end;
        this.finish();
      } else {
        // If it's a go to we need to reset any intermediate go tos and pauses
        if (currentNode.action.type === ActionType.goTo) {
          for (let i = currentIndex - 1; i >= nextNodeIndex; i--) {
            if (this.initialFlow[i].type === ActionType.goTo) {
              this.annotatedFlow[i].totalPasses = 0;
            } else if (this.initialFlow[i].type === ActionType.pause) {
              this.annotatedFlow[i].hasResumed = false;
            }
          }
        }
        this.currentNodeIndex = nextNodeIndex;
        this.currentNode.onStart(this);
      }
    }
  }

  private finish() {
    this.status = 'done';
    this.currentNodeIndex = undefined;
  }

  public skipNode() {
    this.currentNode?.skip();
  }

  public reset() {
    this.annotatedFlow = this.initialFlow.map(
      (action) => new AnnotatedAction(action),
    );
    this.currentNodeIndex = 0;
    this.status = 'notstarted';
    this.totalElapsedMs = 0;
    this.setNodeProgresses(this.initialFlow.map(() => undefined));
  }
  public start(): void {
    this.status = 'running';
    this.lastTickTimeMs = Date.now();
    if (this.totalElapsedMs === 0) {
      this.currentNode?.onStart(this);
    }
  }
  public pause(): void {
    this.status = 'paused';
    this.currentNode?.onPause();
  }
  public resume(): void {
    this.status = 'running';
    this.currentNode?.onResume();
  }

  private get currentNode(): AnnotatedAction | undefined {
    return typeof this.currentNodeIndex === 'undefined'
      ? undefined
      : this.annotatedFlow[this.currentNodeIndex];
  }

  public totalElapsed(countUp: boolean): string {
    if (countUp) {
      return msToViewable(this.totalElapsedMs);
    } else {
      return msToViewable(this.finalElapsedTimeMs - this.totalElapsedMs);
    }
  }

  public currentElapsed(countUp: boolean): string {
    if (countUp) {
      return msToViewable(this.currentNode?.elapsedMs || 0);
    } else {
      return msToViewable(
        (this.currentNode?.time || 0) - (this.currentNode?.elapsedMs || 0),
      );
    }
  }

  public getLiveStatus(): LiveStatus {
    const action = this.currentNode?.action;
    const activeDetails = action
      ? getActionInfo(action.type).getActiveDetails(action)
      : undefined;
    const details =
      activeDetails ||
      (action?.type === ActionType.pause
        ? { title: action.params.name, subtitle: '' }
        : action?.type === ActionType.goTo
          ? { title: 'Transitioning', subtitle: '' }
          : undefined);

    const nextStepName = this.getNextStepName();

    return {
      status: this.status,
      totalElapsedMs: this.totalElapsedMs,
      currentElapsedMs: this.currentNode?.elapsedMs || 0,
      title: details?.title,
      nextStepName,
      currentStepMs: this.currentNode?.elapsedMs || 0,
      totalStepMs: this.currentNode?.time || 0,
    };
  }

  private getNextStepName(): string | undefined {
    if (typeof this.currentNodeIndex === 'undefined') {
      return undefined;
    }

    const currentAction = this.initialFlow[this.currentNodeIndex];
    const nextIndex =
      currentAction.type === ActionType.goTo
        ? this.annotatedFlow[this.currentNodeIndex].nextNodeIndex
        : this.currentNodeIndex + 1;

    if (nextIndex >= this.initialFlow.length) {
      return undefined;
    }

    const nextAction = this.initialFlow[nextIndex];
    if (nextAction.type === ActionType.pause) {
      return nextAction.params.name;
    }
    if (nextAction.type === ActionType.goTo) {
      return getActionInfo(nextAction.type).getDetails(nextAction);
    }

    return (
      getActionInfo(nextAction.type).getActiveDetails(nextAction)?.title ||
      getActionInfo(nextAction.type).getDetails(nextAction)
    );
  }

  public getUpcomingAlerts(maxAlerts = 100): UpcomingAlert[] {
    if (
      this.status !== 'running' ||
      typeof this.currentNodeIndex === 'undefined' ||
      this.currentNodeIndex >= this.initialFlow.length
    ) {
      return [];
    }

    const results: UpcomingAlert[] = [];
    const passes = this.annotatedFlow.map((node) => node.totalPasses);
    let index = this.currentNodeIndex;
    let elapsedOffsetMs = 0;
    let first = true;
    let iterations = 0;

    while (index < this.initialFlow.length && results.length < maxAlerts) {
      if (iterations++ > 10000) {
        break;
      }

      const action = this.initialFlow[index];
      if (action.type === ActionType.pause) {
        break;
      }

      if (action.type === ActionType.goTo) {
        passes[index]++;
        if (passes[index] === action.params.times) {
          passes[index] = 0;
          index++;
        } else {
          index = action.params.targetNode;
        }
        first = false;
        continue;
      }

      const elapsedMs = first ? this.currentNode?.elapsedMs || 0 : 0;
      const durationMs = action.params.time * 1000;
      const remainingMs = Math.max(durationMs - elapsedMs, 0);

      if (!first) {
        results.push({
          offsetMs: elapsedOffsetMs,
          step: action.index + 1,
          title: getActionInfo(action.type).getDetails(action),
          actionType: action.type,
        });
      }

      elapsedOffsetMs += remainingMs;
      index++;
      first = false;
    }

    return results;
  }

  public get showStart(): boolean {
    return this.status === 'notstarted';
  }
  public get showPause(): boolean {
    return this.status === 'running';
  }
  public get showReset(): boolean {
    return ['done', 'paused'].includes(this.status);
  }
  public get showResume(): boolean {
    return this.status === 'paused';
  }
  public get showSkip(): boolean {
    return (
      this.status === 'running' &&
      this.currentNodeIndex !== undefined &&
      this.currentNodeIndex < this.annotatedFlow.length - 1
    );
  }

  private getLabelOverrides() {
    return this.annotatedFlow.map((action) => action.viewLabel);
  }

  private getNodeProgresses() {
    return this.annotatedFlow.map((node, i) =>
      // If it's the current node, or if it's a goto node
      i === this.currentNodeIndex || node.action.type === ActionType.goTo
        ? node.progress
        : undefined,
    );
  }
}
