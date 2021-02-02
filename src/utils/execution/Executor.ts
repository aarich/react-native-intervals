import { Action, ActionType } from '../../types';

import AnnotatedAction from './AnnotatedAction';

export type RunStatus = 'notstarted' | 'running' | 'paused' | 'done';

const msToViewable = (duration: number) => {
  const portions: string[] = [];

  const msInHour = 1000 * 60 * 60;
  const hours = Math.trunc(duration / msInHour);
  if (hours > 0) {
    portions.push(hours + ':');
    duration = duration - hours * msInHour;
  }

  const msInMinute = 1000 * 60;
  const minutes = Math.trunc(duration / msInMinute);
  portions.push((minutes > 9 ? '' : '0') + minutes + ':');
  duration = duration - minutes * msInMinute;

  const seconds = Math.trunc(duration / 1000);
  portions.push((seconds > 9 ? '' : '0') + seconds);

  // portions.push('.' + (duration % 1000) / 100);

  return portions.join('');
};

export default class Executor {
  public status: RunStatus;
  public currentNodeIndex?: number;
  public totalElapsedMs: number;

  private initialFlow: Action[];
  private annotatedFlow: AnnotatedAction[];

  private setLabelOverides: (l: (string | undefined)[]) => void;
  private setNodeProgresses: (progress: (number | undefined)[]) => void;

  constructor(
    flow: Action[],
    setLabelOverides: (labelOverrides: (string | undefined)[]) => void,
    setCurrentNodeProgress: (progress: (number | undefined)[]) => void
  ) {
    this.initialFlow = flow;
    this.annotatedFlow = flow.map((action) => new AnnotatedAction(action));
    this.currentNodeIndex = 0;
    this.status = 'notstarted';
    this.totalElapsedMs = 0;
    this.setLabelOverides = setLabelOverides;
    this.setNodeProgresses = setCurrentNodeProgress;
  }

  public tick(ms: number) {
    if (this.status !== 'running') {
      return;
    }
    this.totalElapsedMs += ms;

    this.currentNode?.tick(ms);

    while (this.currentNode?.isFinished && this.status === 'running') {
      const currentNode = this.currentNode;
      const nextNodeIndex = currentNode.nextNodeIndex;

      currentNode.onLeave();
      if (nextNodeIndex === this.annotatedFlow.length) {
        // We're at the end;
        this.finish();
      } else {
        this.currentNodeIndex = nextNodeIndex;
        this.currentNode.onStart();
      }
    }

    this.setLabelOverides(this.getLabelOverrides());
    this.setNodeProgresses(this.getNodeProgresses());
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
  }
  public start(): void {
    this.status = 'running';
  }
  public pause(): void {
    this.status = 'paused';
  }
  public resume(): void {
    this.status = 'running';
  }

  private get currentNode(): AnnotatedAction | undefined {
    return typeof this.currentNodeIndex === 'undefined'
      ? undefined
      : this.annotatedFlow[this.currentNodeIndex];
  }

  public totalElapsed(): string {
    return msToViewable(this.totalElapsedMs);
  }

  public currentElapsed(): string {
    return msToViewable(this.currentNode?.elapsedMs || 0);
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
