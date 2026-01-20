export interface Event {
  id: string;
  type: 'event';
  title: string;
  start: string; // ISO date string
}

export interface Task {
  id: string;
  type: 'task';
  title: string;
  due: string; // ISO date string
}

export type TimelineItem = Event | Task;
