import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { NexusItem, NexusEvent, NexusTask } from "@/types/nexus";

interface TimelineRowProps {
  item: NexusItem;
  showDateSeparator: boolean;
  dateString: string;
}

export default function TimelineRow({ item, showDateSeparator, dateString }: TimelineRowProps) {
  let itemDateTime: Date;
  let title: string;

  if ('google_event_id' in item) { 
    const eventItem = item as NexusEvent;
    itemDateTime = new Date(eventItem.start_time);
    title = eventItem.summary || eventItem.description || 'Untitled Event';
  } else { 
    const taskItem = item as NexusTask;
    itemDateTime = taskItem.due_date ? new Date(taskItem.due_date) : new Date();
    title = taskItem.title || 'Untitled Task';
  }

  return (
  <>
    {showDateSeparator && (
      <div className="flex items-center my-5">
        <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
          {dateString}
        </span>
        <div className="absolute w-full h-px bg-slate-700"></div> 
      </div>
    )}
    <div key={item.id} className="relative">
      <div className="flex flex-col">
        <span className="text-xs font-mono text-slate-400">
          {itemDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
        </span>
        <div className="flex items-center gap-2">
          {'google_event_id' in item ? <CalendarIcon size={14}/> : <CheckCircle2 size={14}/>}
          <span className="font-semibold text-slate-100">{title}</span>
        </div>
      </div>
    </div>
  </>
  );
};
