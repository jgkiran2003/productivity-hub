'use client';

import React, { useEffect, useState } from 'react';
import { GoogleCalendarEvent } from '@/data/googleCalendarSchema';

export default function GoogleCalendarColumn() {
  const [events, setEvents] = useState<GoogleCalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGoogleCalendarEvents() {
      try {
        const response = await fetch('/api/google-calendar/list');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch calendar events');
        }
        const data: GoogleCalendarEvent[] = await response.json();
        setEvents(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGoogleCalendarEvents();
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
            <li key={event.id} className="p-3 bg-white/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              <h3 className="font-semibold text-lg text-white mb-1">{event.summary}</h3>
              {event.start && (event.start.dateTime || event.start.date) && (
                <p className="text-xs text-gray-400 mb-1">
                  Start: {new Date(event.start.dateTime || event.start.date!).toLocaleString()}
                </p>
              )}
              {event.end && (event.end.dateTime || event.end.date) && (
                <p className="text-xs text-gray-400 mb-1">
                  End: {new Date(event.end.dateTime || event.end.date!).toLocaleString()}
                </p>
              )}
              {event.htmlLink && (
                <a
                  href={event.htmlLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  View Event
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
