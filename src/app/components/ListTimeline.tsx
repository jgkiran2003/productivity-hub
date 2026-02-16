import React from 'react';
import { NexusEvent, NexusTask, NexusItem } from '@/types/nexus'; 
import TimelineRow from "./TimelineRow";

interface ListTimelineProps {
  events: NexusEvent[];
  tasks: NexusTask[];
}

const ListTimeline: React.FC<ListTimelineProps> = ({ events, tasks }) => {
  // Combine events and tasks and filter into scheduled and unscheduled
  const allItems: NexusItem[] = [...events, ...tasks];

  const scheduledItems = allItems
    .filter(item => {
      // Events are always considered scheduled
      if ('google_event_id' in item) {
        return true;
      }
      // Tasks are scheduled if they have a due_date with a time component
      if ('google_task_id' in item && item.due_date) {
        const dueDate = new Date(item.due_date);
        return dueDate.getHours() !== 0 || dueDate.getMinutes() !== 0;
      }
      return false;
    })
    .sort((a, b) => {
      let timeA: Date;
      let timeB: Date;

      if ('google_event_id' in a) {
        timeA = new Date(a.start_time!);
      } else {
        timeA = new Date(a.due_date!);
      }

      if ('google_event_id' in b) {
        timeB = new Date(b.start_time!);
      } else {
        timeB = new Date(b.due_date!);
      }

      return timeA.getTime() - timeB.getTime();
    });

  const unscheduledTasks = allItems.filter(item => {
    // Tasks are unscheduled if they have a due_date without a time component or no due_date
    if ('google_task_id' in item) {
      if (!item.due_date) return true;
      const dueDate = new Date(item.due_date);
      return dueDate.getHours() === 0 && dueDate.getMinutes() === 0;
    }
    return false;
  }) as NexusTask[];

  let lastDate: string | null = null;

  return (
    <div className="space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold">Your Timeline</h2>

      {/* Unscheduled Tasks Section */}
      {unscheduledTasks.length > 0 && (
        <div className="bg-white/5 border border-dashed border-white/20 p-4 rounded-lg space-y-3 mb-6">
          <h3 className="text-md font-semibold text-slate-300">Unscheduled Tasks</h3>
          <ul className="space-y-2">
            {unscheduledTasks.map(item => (
              <li key={item.id} className="text-sm text-slate-400">
                {item.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Scheduled Items Timeline */}
      <div className="relative border-l-2 ml-1 pl-4 space-y-8">
        {scheduledItems.length === 0 && unscheduledTasks.length === 0 ? (
          <p className="text-slate-400">No events or tasks to display.</p>
        ) : (
          scheduledItems.map((item) => {
            let defaultTime: Date | null = null;
            if ('google_event_id' in item) {
              defaultTime = item.start_time ? new Date(item.start_time) : null;
            } else if ('google_task_id' in item) {
              defaultTime = item.due_date ? new Date(item.due_date) : null;
            }
            
            const itemDate = new Date(defaultTime!);
            const currentDateString = itemDate.toLocaleDateString('en-GB');

            const showDateSeparator = lastDate !== currentDateString;
            if (showDateSeparator) {
              lastDate = currentDateString;
            }

            return (
              <TimelineRow
                key={item.id}
                item={item}
                showDateSeparator={showDateSeparator}
                dateString={currentDateString}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

export default ListTimeline;
