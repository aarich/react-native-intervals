import { Action, ActionType } from '../types';

export const wait = (time: number) => ({
  type: ActionType.wait,
  params: { time },
});
export const act = (time: number, name: string) => ({
  type: ActionType.act,
  params: { time, name },
});
export const sound = (time: number, sound: number) => ({
  type: ActionType.sound,
  params: { time, sound },
});
export const goto = (times: number, targetNode: number) => ({
  type: ActionType.goTo,
  params: { times, targetNode },
});

export const FlowTemplateLibrary: {
  title: string;
  description: string;
  nodes: Action[];
}[] = [
  {
    title: 'HIIT',
    description: 'High-Intensity Interval Training (HIIT) flow',
    nodes: [
      act(20, 'High Knee Running'),
      sound(5, 0),
      wait(15),
      act(20, 'Diagonal Jump-ups'),
      sound(5, 0),
      wait(15),
      act(20, 'Burpees'),
      sound(5, 0),
      wait(55),
      goto(5, 0),

      act(20, 'Ankle Touches'),
      sound(5, 0),
      wait(15),
      act(20, 'Squat Jumps'),
      sound(5, 0),
      wait(15),
      act(20, 'Push-Ups'),
      sound(5, 0),
      wait(55),
      goto(5, 10),
      sound(20, 1),
    ],
  },
  {
    title: 'LIIT',
    description: 'Why do high-intensity when you can do low?',
    nodes: [wait(60), wait(300), sound(20, 1)],
  },
  {
    title: 'Productivity',
    description: 'Manage your workload for a few hours',
    nodes: [
      act(1800, 'Homework'),
      sound(10, 6),
      act(300, 'Watch Cat Videos'),
      sound(10, 5),
      goto(2, 0),
    ],
  },
  {
    title: 'Cooking',
    description: 'Just a dash of salt to make this your own',
    nodes: [
      act(1200, 'Cook at 350'),
      sound(20, 2),
      act(1, "Don't forget to remove the foil"),
      act(600, 'Cook at 300'),
      sound(20, 2),
    ],
  },
].map(({ title, description, nodes }) => ({
  title,
  description,
  nodes: nodes.map((n, index) => ({ ...n, index } as Action)),
}));
