import { Event, Task, TimelineItem } from "../../types";
import TimelineRow from "./TimelineRow";

interface UnifiedTimelineProps {
  events: Event[];
  tasks: Task[];
}

const getItemDate = (item: TimelineItem): string => {
  if (item.type === 'event') {
    return item.start;
  }
  return item.due;
};

export default function UnifiedTimeline({ events, tasks }: UnifiedTimelineProps) {
  const mergedData: TimelineItem[] = [...events, ...tasks].sort((a, b) =>
    new Date(getItemDate(a)).getTime() - new Date(getItemDate(b)).getTime()
  );

  let lastDate: string | null = null; // To keep track of the last rendered date

  return (
    <div className="space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold">Your Timeline</h2>
      <div className="relative border-l-2 ml-1 pl-4 space-y-8">
        {mergedData.map((item: TimelineItem) => {
          const itemDate = new Date(getItemDate(item));
          const currentDateString = itemDate.toLocaleDateString();

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
        })}
      </div>
    </div>
  );
}