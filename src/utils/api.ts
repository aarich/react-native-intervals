import { Action, ActionType, Timer } from '../types';

import { TimersState } from '../redux/reducers/timersReducer';
import { getActionInfo } from './actions';

export const createNewID = (existingTimers: TimersState) => {
  if (Object.keys(existingTimers).length === 0) {
    return '1';
  }

  const sortedIds = Object.keys(existingTimers)
    .map((id) => Number.parseInt(id))
    .sort();

  return `${sortedIds[sortedIds.length - 1] + 1}`;
};

export const validateFlow = (actions: Action[]) => {
  if (actions.length === 0) {
    throw new Error('Missing steps');
  }

  actions.forEach((action, i) =>
    getActionInfo(action.type).validate(action, i + 1)
  );

  for (let i = 0; i < actions.length; i++) {
    const action = actions[i];
    if (action.type === ActionType.goTo) {
      const target = action.params.targetNode;

      if (actions[target].type === ActionType.goTo) {
        throw new Error(
          `Can't go to another Go To. (Step ${i + 1} is returning to step ${
            target + 1
          }`
        );
      }

      // Check all the nodes between
      for (let j = target; j < i; j++) {
        if (actions[j].type === ActionType.goTo) {
          throw new Error(
            `Can't return past another Go To. (Step ${i + 1} passes step ${
              j + 1
            }`
          );
        }
      }
    }
  }
};

/** Count backwards for performance [act, act, goto, act, goto] */
export const calculateRuntime = (actions: Action[]) => {
  let total = 0;
  let activeGoToNode = null;

  for (let index = actions.length - 1; index >= 0; index--) {
    const action = actions[index];

    if (action.type === ActionType.goTo) {
      activeGoToNode = action;
    } else {
      let multiplier = 1;
      if (activeGoToNode) {
        if (index < activeGoToNode.params.targetNode) {
          // We've gone past it
          activeGoToNode = null;
        } else {
          multiplier = activeGoToNode.params.times;
        }
      }
      total += action.params.time * multiplier;
    }
  }

  return total * 1000;
};

export const msToViewable = (duration: number) => {
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

  return portions.join('');
};

type SerializableAction = {
  /** type */
  t: number;
  /** params */
  p: {
    /** time or times */
    t: number;
    /** name or targetNode */
    n?: number | string;
    /** sound */
    s?: number;
  };
};

type SerializableTimer = {
  /** name */
  n: string;
  /** description */
  d?: string;
  /** flow */
  f: SerializableAction[];
};

const actionIndices = [
  ActionType.act,
  ActionType.goTo,
  ActionType.sound,
  ActionType.wait,
];

export const serialize = (timer: Timer): string => {
  const actions: SerializableAction[] = timer.flow.map((action) => {
    let p;
    switch (action.type) {
      case ActionType.act:
        p = { n: action.params.name, t: action.params.time };
        break;
      case ActionType.wait:
        p = { t: action.params.time };
        break;
      case ActionType.goTo:
        p = { t: action.params.times, n: action.params.targetNode };
        break;
      case ActionType.sound:
        p = { t: action.params.time, s: action.params.sound };
        break;
    }
    return {
      t: actionIndices.indexOf(action.type),
      p,
    };
  });

  const flow: SerializableTimer = {
    n: timer.name,
    d: timer.description,
    f: actions,
  };

  return JSON.stringify(flow);
};

export const deserialize = (
  serialized: string
): { name: string; description?: string; flow: Action[] } => {
  const object = JSON.parse(serialized);

  const name = object.n;
  const description = object.d;
  const flow: Action[] = object.f?.map(
    (serializedAction: SerializableAction, index: number) => {
      const type = actionIndices[serializedAction.t];
      const p = serializedAction.p;
      switch (type) {
        case ActionType.goTo:
          return { index, type, params: { times: p.t, targetNode: p.n } };
        case ActionType.act:
          return { index, type, params: { time: p.t, name: p.n } };
        case ActionType.sound:
          return { index, type, params: { time: p.t, sound: p.s } };
        case ActionType.wait:
          return { index, type, params: { time: p.t } };
      }
    }
  );
  return { name, description, flow };
};

export const makeURL = (serializedFlow: string): Promise<string> => {
  const encoded = encodeURIComponent(serializedFlow);
  return Promise.resolve(`https://flows.mrarich.com/flow?f=${encoded}`);
};

export const getShortenedURL = (serializedFlow: string): Promise<string> =>
  makeURL(serializedFlow).then((url) =>
    fetch(`https://mrarich.com/url/shorten?url=${url}`)
      .then((resp) => {
        if (!resp.ok) {
          console.log(resp.body);
          throw new Error(
            `Error shortening: ${resp.status}/${resp.statusText}`
          );
        }

        return resp.json();
      })
      .then((resp) => {
        if (!resp.success) {
          throw new Error(`Error shortening: ${resp.message}`);
        }

        return resp.url;
      })
  );
