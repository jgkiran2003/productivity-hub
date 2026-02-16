import { NexusItem, NexusTask, NexusEvent } from '@/types/nexus';

export interface TimelineData {
  startTime: Date | null;
  endTime: Date | null;
  defaultTime: Date;
  isAllDay: boolean;
  type: 'task' | 'event';
}

export const getTimelineData = (item: NexusItem): TimelineData => {
  if ('google_task_id' in item) { // Task logic
    const deadline = item.due_date ? new Date(item.due_date) : new Date();
    return {
      startTime: null,
      endTime: deadline,
      defaultTime: deadline,
      isAllDay: true,
      type: 'task'
    };
  }

  // Event logic
  const start = (item as NexusEvent).start_time ? new Date((item as NexusEvent).start_time) : new Date();
  return {
    startTime: start,
    endTime: (item as NexusEvent).end_time ? new Date((item as NexusEvent).end_time) : null,
    defaultTime: start,
    isAllDay: (item as NexusEvent).is_all_day || false,
    type: 'event'
  };
};