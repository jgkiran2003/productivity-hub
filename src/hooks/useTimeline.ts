import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { getTimelineData } from '@/utils/timeline-utils';

export function useTimeline() {
  return useQuery({
    queryKey: ['nexus-timeline'],
    queryFn: async () => {
      // Parallel fetch from Supabase
      const [eventsRes, tasksRes] = await Promise.all([
        supabase.from('calendar_events').select('*'),
        supabase.from('tasks').select('*')
      ]);

      if (eventsRes.error) throw eventsRes.error;
      if (tasksRes.error) throw tasksRes.error;

      return {
        events: eventsRes.data,
        tasks: tasksRes.data
      };
    },
    // Transform raw DB rows into unified objects
    select: (data) => {
      const unified = [...data.events, ...data.tasks].map(item => ({
        item,
        data: getTimelineData(item)
      }));

      return unified.sort((a, b) => 
        a.data.defaultTime.getTime() - b.data.defaultTime.getTime()
      );
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
}