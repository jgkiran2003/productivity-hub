// components/UnifiedTimeline.tsx
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { Event, Task, TimelineItem } from "../../types"; // Import Event, Task, and TimelineItem interfaces

interface UnifiedTimelineProps {
  events: Event[];
  tasks: Task[];
}

// Helper function to get the correct date property from a TimelineItem
const getItemDate = (item: TimelineItem): string => {
  if (item.type === 'event') {
    return item.start;
  }
  return item.due;
};

export default function UnifiedTimeline({ events, tasks }: UnifiedTimelineProps) {
  // Logic to merge and sort both arrays by date
  const mergedData: TimelineItem[] = [...events, ...tasks].sort((a, b) =>
    new Date(getItemDate(a)).getTime() - new Date(getItemDate(b)).getTime()
  );

  return (
    <div className="space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold text-pickleball-yellow">Your Timeline</h2>
      <div className="relative border-l-2 border-pickleball-green/30 ml-3 pl-6 space-y-8">
        {mergedData.map((item: TimelineItem) => ( // Explicitly type item
          <div key={item.id} className="relative">
            {/* The Timeline Dot */}
            <div className={cn(
              "absolute -left-[31px] mt-1.5 w-4 h-4 rounded-full border-2 bg-slate-900",
              item.type === 'event' ? "border-pickleball-green" : "border-pickleball-yellow"
            )} />
            
            <div className="flex flex-col">
              <span className="text-xs font-mono text-slate-400">
                {new Date(getItemDate(item)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <div className="flex items-center gap-2">
                {item.type === 'event' ? <CalendarIcon size={14}/> : <CheckCircle2 size={14}/>}
                <span className="font-semibold text-slate-100">{item.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}