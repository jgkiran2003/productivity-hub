import React, { useRef, useEffect } from 'react'; // Import useRef and useEffect
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { NexusEvent, NexusItem, NexusTask } from '@/types/nexus';
import { TimelineData } from '@/utils/timeline-utils';
import { useWorkspaceStore } from '@/store/workspaceStore'; // Import the workspace store

interface FullCalendarViewProps {
  unifiedData: { item: NexusItem; data: TimelineData }[];
}

export default function FullCalendarView({ unifiedData }: FullCalendarViewProps) {
  const { selectedItemId, setSelectedItemId } = useWorkspaceStore(); // Get selectedItemId and setter
  const calendarRef = useRef<FullCalendar>(null); // Create a ref for the calendar

  const events = unifiedData.map(({ item }) => {
    if ('google_event_id' in item) {
      const eventItem = item as NexusEvent;
      return {
        id: eventItem.id,
        title: eventItem.summary || eventItem.description || 'Untitled Event',
        start: eventItem.start_time,
        end: eventItem.end_time,
        allDay: eventItem.is_all_day,
        color: selectedItemId === eventItem.id ? '#FFD700' : '#3B82F6', // Highlight if selected
        extendedProps: {
          nexusItemType: 'event',
        }
      };
    } else {
      const taskItem = item as NexusTask;
      return {
        id: taskItem.id,
        title: taskItem.title || 'Untitled Task',
        start: taskItem.due_date,
        allDay: true,
        color: selectedItemId === taskItem.id ? '#FFD700' : '#10B981', // Highlight if selected
        extendedProps: {
          nexusItemType: 'task',
        }
      };
    }
  });

  useEffect(() => {
    if (selectedItemId && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const selectedEvent = calendarApi.getEventById(selectedItemId);
      if (selectedEvent) {
        calendarApi.gotoDate(selectedEvent.start || selectedEvent.end || new Date()); // Go to the event's date
        // Note: FullCalendar does not have a direct "scroll to event" method.
        // Highlighting is done via conditional coloring of events.
        // To visually "scroll", we typically navigate to the day/week/month containing the event.
      }
    }
  }, [selectedItemId]);

  const handleEventClick = (clickInfo: any) => {
    setSelectedItemId(clickInfo.event.id); 
  };

  return (
    <div className="w-full h-full overflow-hidden bg-slate-950 p-4">
      <FullCalendar
        ref={calendarRef} 
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        height="100%"
        handleWindowResize={true}
        expandRows={true}
        headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek,dayGridDay'
        }}
        eventClick={handleEventClick} // Add event click handler
      />
    </div>
  );
}