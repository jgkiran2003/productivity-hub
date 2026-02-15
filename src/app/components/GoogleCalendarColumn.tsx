'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { NexusEvent } from '@/types/nexus';

export default function GoogleCalendarColumn() {
  const [events, setEvents] = useState<NexusEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNexusEvents() {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError('User not authenticated.');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('calendar_events')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: true });

        if (error) {
          throw new Error(error.message);
        }

        setEvents(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchNexusEvents();
  }, []);

  if (loading) {
    return (
      <div className="h-full">
        <h2 className="text-xl font-bold mb-4">Google Calendar</h2>
        <p>Loading events...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full text-red-500">
        <h2 className="text-xl font-bold mb-4">Google Calendar</h2>
        <p>Error: {error}</p>
        <p className="text-sm">Please ensure you are signed in with Google and have granted Calendar API permissions.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold">Google Calendar</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <ul className="space-y-3">
          {events.map((event) => (
            <li key={event.google_event_id} className="p-3 bg-white/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-lg text-white mb-1">{event.summary}</h3>
              {event.start_time && (
                <p className="text-xs text-gray-400 mb-1">
                  Start: {new Date(event.start_time).toLocaleString()}
                </p>
              )}
              {event.end_time && (
                <p className="text-xs text-gray-400 mb-1">
                  End: {new Date(event.end_time).toLocaleString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
