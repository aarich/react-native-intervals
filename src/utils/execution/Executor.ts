import { Action, ActionType } from '../../types';
import { calculateRuntime, msToViewable } from '../api';
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
    setCurrentNodeProgress: (progress: (number | undefined)[]) => void
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

  public tick(ms: number, isRapid?: boolean) {
    if (!isRapid && this.status !== 'running') {
      return;
    }
    this.lastTickTimeMs = Date.now();
    this.totalElapsedMs += ms;

    this.currentNode?.tick(ms);

    while (
      this.currentNode?.isFinished &&
      (this.status === 'running' || isRapid)
    ) {
      const currentNode = this.currentNode;
      const currentIndex = this.currentNodeIndex as number;
      const nextNodeIndex = currentNode.nextNodeIndex;

      currentNode.onLeave();
      if (nextNodeIndex === this.annotatedFlow.length) {
        // We're at the end;
        this.finish();
      } else {
        // If it's a go to we need to reset any intermediate go tos
        if (currentNode.action.type === ActionType.goTo) {
          for (let i = currentIndex - 1; i >= nextNodeIndex; i--) {
            if (this.initialFlow[i].type === ActionType.goTo) {
              this.annotatedFlow[i].totalPasses = 0;
            }
          }
        }
        this.currentNodeIndex = nextNodeIndex;
        this.currentNode.onStart(isRapid);
      }
    }

    this.setLabelOverides(this.getLabelOverrides());
    this.setNodeProgresses(this.getNodeProgresses());
  }

  public replaySince(lastActiveTimeMs: number, msInterval: number) {
    const now = new Date().getTime();
    for (let time = lastActiveTimeMs; time < now; time += msInterval) {
      if (this.status === 'done') {
        break;
      }
      this.tick(msInterval, true);
    }
  }

  private finish() {
    this.status = 'done';
    this.currentNodeIndex = undefined;
  }

  public reset() {
    this.annotatedFlow = this.initialFlow.map(
      (action) => new AnnotatedAction(action)
    );
    this.currentNodeIndex = 0;
    this.status = 'notstarted';
    this.totalElapsedMs = 0;
    this.setNodeProgresses(this.initialFlow.map(() => undefined));
  }
  public start(): void {
    if (this.totalElapsedMs === 0) {
      this.currentNode?.onStart();
    }
    this.status = 'running';
    this.lastTickTimeMs = Date.now();
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
        (this.currentNode?.time || 0) - (this.currentNode?.elapsedMs || 0)
      );
    }
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

  private getLabelOverrides() {
    return this.annotatedFlow.map((action) => action.viewLabel);
  }

  private getNodeProgresses() {
    return this.annotatedFlow.map((node, i) =>
      // If it's the current node, or if it's a goto node
      i === this.currentNodeIndex || node.action.type === ActionType.goTo
        ? node.progress
        : undefined
    );
  }
}
