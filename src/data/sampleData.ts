import { Event, Task } from "../types";

export const sampleEvents: Event[] = [
  { id: 'evt1', type: 'event', title: 'Team Meeting', start: new Date(2026, 0, 20, 10, 0).toISOString() },
  { id: 'evt2', type: 'event', title: 'Design Review', start: new Date(2026, 0, 20, 14, 30).toISOString() },
  { id: 'evt3', type: 'event', title: 'Client Demo', start: new Date(2026, 0, 21, 9, 0).toISOString() },
  { id: 'evt4', type: 'event', title: 'Project Sync', start: new Date(2026, 0, 21, 16, 0).toISOString() },
  { id: 'evt5', type: 'event', title: 'Follow-up Call', start: new Date(2026, 0, 22, 11, 0).toISOString() },
];

export const sampleTasks: Task[] = [
  { id: 'tsk1', type: 'task', title: 'Finish quarterly report', due: new Date(2026, 0, 20, 13, 0).toISOString() },
  { id: 'tsk2', type: 'task', title: 'Prepare for presentation', due: new Date(2026, 0, 20, 18, 0).toISOString() },
  { id: 'tsk3', type: 'task', title: 'Review PR #123', due: new Date(2026, 0, 21, 12, 0).toISOString() },
  { id: 'tsk4', type: 'task', title: 'Update documentation', due: new Date(2026, 0, 22, 10, 0).toISOString() },
  { id: 'tsk5', type: 'task', title: 'Plan next sprint', due: new Date(2026, 0, 23, 17, 0).toISOString() },
];
