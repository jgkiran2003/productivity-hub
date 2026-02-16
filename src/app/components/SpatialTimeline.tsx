'use client';

import { NexusEvent, NexusTask, NexusItem } from '@/types/nexus';
import { TimelineData } from '@/utils/timeline-utils';

interface SpatialTimelineProps {
  unifiedData: { item: NexusItem; data: TimelineData }[]; 
}

const HOUR_HEIGHT_PX = 120; // 1 hour = 120 pixels

export default function SpatialTimeline({ unifiedData }: SpatialTimelineProps) { 
  const allItems: NexusItem[] = unifiedData.map(itemData => itemData.item) || [];

  // Filter tasks into pending (no specific time) and timed (with due_date having a time)
  const pendingTasks = allItems.filter(item => {
    if ('google_task_id' in item) {
      // Check if due_date has a time component or if it's just a date
      return !item.due_date || (item.due_date && !item.due_date.includes('T'));
    }
    return false;
  }) as NexusTask[];

  const timedItems = allItems.filter(item => {
    if ('google_event_id' in item) {
      return true; // Events are always timed
    }
    if ('google_task_id' in item) {
      return item.due_date && item.due_date.includes('T'); // Tasks are timed if due_date has time
    }
    return false;
  });

  // Group events and timed tasks by day for easier rendering
  const itemsByDay: { [key: string]: Array<NexusEvent | NexusTask> } = {};

  timedItems.forEach(item => {
    let dateKey: string;
    if ('start_time' in item) { // NexusEvent
      dateKey = new Date(item.start_time).toISOString().split('T')[0];
    } else { // NexusTask
      dateKey = new Date(item.due_date!).toISOString().split('T')[0];
    }

    if (!itemsByDay[dateKey]) {
      itemsByDay[dateKey] = [];
    }
    itemsByDay[dateKey].push(item);
  });

  // Sort days
  const sortedDays = Object.keys(itemsByDay).sort();

  // Helper to calculate top and height for an item
  const calculatePosition = (startTime: string, endTime?: string) => {
    const start = new Date(startTime);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const top = (startMinutes / 60) * HOUR_HEIGHT_PX;

    let height = HOUR_HEIGHT_PX; // Default to 1 hour if no end time or duration for tasks
    if (endTime) {
      const end = new Date(endTime);
      const durationMinutes = (end.getTime() - start.getTime()) / (1000 * 60);
      height = (durationMinutes / 60) * HOUR_HEIGHT_PX;
    }
    return { top, height };
  };

  return (
    <div className="flex bg-white/5 rounded-lg shadow-inner min-h-screen">
      {/* Pending Tasks Sidebar */}
      {pendingTasks.length > 0 && (
        <div className="w-1/4 p-4 border-r border-white/10 flex flex-col">
          <h3 className="text-lg font-bold mb-4 text-slate-300">Pending Tasks</h3>
          <ul className="space-y-2 text-sm text-slate-400">
            {pendingTasks.map(task => (
              <li key={task.google_task_id} className="p-2 bg-white/5 rounded-md">
                {task.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Timeline Area */}
      <div className="flex-grow p-4 overflow-x-auto flex">
        {sortedDays.length === 0 && pendingTasks.length === 0 ? (
          <p className="text-slate-400">No events or tasks to display in Spatial view.</p>
        ) : (
          sortedDays.map(day => (
            <div key={day} className="relative border-r border-white/10 pr-4 mr-4 w-[200px] flex-shrink-0">
              <h4 className="sticky top-0 bg-gradient-to-b from-slate-900 to-transparent pt-2 pb-4 text-md font-semibold text-slate-200 z-10">{day}</h4>
              
              {/* Hourly Grid (Optional - for visual guidance) */}
              {[...Array(24)].map((_, hour) => (
                <div key={hour} className="absolute w-full border-t border-white/5 text-xs text-slate-600" style={{ top: hour * HOUR_HEIGHT_PX, height: HOUR_HEIGHT_PX }}>
                  {hour}:00
                </div>
              ))}

              {itemsByDay[day].map(item => {
                const isEvent = 'start_time' in item;
                const startTime = isEvent ? item.start_time : item.due_date!;
                const endTime = isEvent ? item.end_time : undefined; // Tasks might not have end time

                const { top, height } = calculatePosition(startTime, endTime);

                return (
                  <div
                    key={isEvent ? item.google_event_id : item.google_task_id}
                    className={`absolute w-[calc(100%-10px)] left-[5px] rounded-md p-1 text-xs overflow-hidden ${
                      isEvent ? 'bg-blue-700/70' : 'bg-green-700/70'
                    }`}
                    style={{ top, height }}
                    title={(item as NexusEvent).summary}
                  >
                    <p className="font-semibold">{(item as NexusEvent).summary}</p>
                    {isEvent && <p className="text-[10px]">{new Date(item.start_time).toLocaleTimeString()} - {new Date(item.end_time).toLocaleTimeString()}</p>}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
