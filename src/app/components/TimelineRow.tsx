import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { TimelineItem } from "../../types";

interface TimelineRowProps {
  item: TimelineItem;
  showDateSeparator: boolean;
  dateString: string;
}

export default function TimelineRow({ item, showDateSeparator, dateString }: TimelineRowProps) {
  const itemDate = new Date(item.type === 'event' ? item.start : item.due);

  return (
  <>
    {showDateSeparator && (
      <div className="flex items-center my-5">
        <span className="bg-slate-800 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md z-10">
          {dateString}
        </span>
        <div className="absolute w-full h-px bg-slate-700"></div> {/* Line divider */}
      </div>
    )}
    <div key={item.id} className="relative">
      <div className="flex flex-col">
        <span className="text-xs font-mono text-slate-400">
          {itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false})}
        </span>
        <div className="flex items-center gap-2">
          {item.type === 'event' ? <CalendarIcon size={14}/> : <CheckCircle2 size={14}/>}
          <span className="font-semibold text-slate-100">{item.title}</span>
        </div>
      </div>
    </div>
  </>
  );
};
