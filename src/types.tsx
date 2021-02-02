export enum ActionType {
  sound = 'sound',
  act = 'act',
  wait = 'wait',
  goTo = 'goTo',
}

export type BottomTabParamList = {
  Timers: undefined;
  More: undefined;
};

export type TimersParamList = {
  LibraryScreen: undefined;
  ViewScreen: { id: string };
  EditScreen: { id?: string };
};

export type MoreParamList = {
  MoreScreen: undefined;
};

export type Timer = {
  id: string;
  name: string;
  description?: string;
  flow: Action[];
};

type BaseAction = {
  type: ActionType;
  index: number;
};

type ActAction = {
  type: ActionType.act;
  params: ActParams;
};

type WaitAction = {
  type: ActionType.wait;
  params: WaitParams;
};

type SoundAction = {
  type: ActionType.sound;
  params: SoundParams;
};

type GoToAction = {
  type: ActionType.goTo;
  params: GoToParams;
};

// PARAMS

export type SoundParams = {
  soundType: string; // TODO enumerate
  time: number;
};

export type GoToParams = {
  targetNode: number;
  times: number;
};

export type WaitParams = {
  time: number;
};
export type ActParams = {
  time: number;
  name: string;
};

export type pAction<T extends ActionType> = (
  | ActAction
  | WaitAction
  | SoundAction
  | GoToAction
) &
  BaseAction & { type: T };

export type Action = (ActAction | WaitAction | SoundAction | GoToAction) &
  BaseAction;
