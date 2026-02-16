import { NexusItem, NexusEvent, NexusTask } from '@/types/nexus';
import { TimelineData } from '@/utils/timeline-utils';
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { useWorkspaceStore } from '@/store/workspaceStore';

interface SimpleEventTaskListProps {
  unifiedData: { item: NexusItem; data: TimelineData }[];
}

export default function SimpleEventTaskList({ unifiedData }: SimpleEventTaskListProps) {
  const { selectedItemId, setSelectedItemId } = useWorkspaceStore();

  return (
    <div className="space-y-2">
      {unifiedData.length === 0 ? (
        <p className="text-slate-400">No events or tasks to display.</p>
      ) : (
        unifiedData.map(({ item }) => {
          let title: string;
          let icon: React.ReactNode;
          let itemDateTime: Date | null = null;

          if ('google_event_id' in item) {
            const eventItem = item as NexusEvent;
            title = eventItem.summary || eventItem.description || 'Untitled Event';
            icon = <CalendarIcon size={14}/>;
            itemDateTime = new Date(eventItem.start_time);
          } else {
            const taskItem = item as NexusTask;
            title = taskItem.title || 'Untitled Task';
            icon = <CheckCircle2 size={14}/>;
            itemDateTime = taskItem.due_date ? new Date(taskItem.due_date) : null;
          }

          const isSelected = selectedItemId === item.id;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedItemId(item.id)}
              className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                isSelected ? 'bg-blue-700/50' : 'hover:bg-white/10'
              }`}
            >
              <div className={`mt-0.5 shrink-0 ${selectedItemId === item.id ? 'text-blue-400' : 'text-slate-500'}`}>
                {icon}
              </div>
              <span className="font-semibold text-slate-100">{title}</span>
              {itemDateTime && (
                <span className="text-xs text-slate-400 ml-auto">
                  {itemDateTime.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  {' '}
                  {itemDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                </span>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
