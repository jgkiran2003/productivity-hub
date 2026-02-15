import { NexusTask, NexusEvent } from '@/types/nexus';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

export async function syncGoogleResources(userId: string) {
  const SYNC_COOLDOWN_MINUTES = 5;

  const supabase = await createClient();

  // 1. Fetch 'last_tasks_sync_at' and 'calendar_sync_token' from the 'profiles' table.
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('google_access_token, google_refresh_token, last_sync_time, calendar_sync_token')
    .eq('id', userId)
    .single();

  if (profileError || !profile) {
    console.error('Sync Engine - Error fetching profile for user:', userId, profileError);
    return; // Exit if profile cannot be fetched
  }

  let accessToken = profile.google_access_token;
  const refreshToken = profile.google_refresh_token;
  let lastSyncAt = profile.last_sync_time;
  let calendarSyncToken = profile.calendar_sync_token;

  if (!accessToken && !refreshToken) {
    console.warn('Sync Engine - No Google tokens found for user:', userId);
    return; // Cannot sync without tokens
  }

  // Google OAuth2 Client Setup and Token Refresh
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  try {
    const { credentials } = await auth.refreshAccessToken();

    if (credentials.access_token && credentials.access_token !== accessToken) {
      accessToken = credentials.access_token;
      console.log('Sync Engine - Google Access Token refreshed successfully for user:', userId);

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          google_access_token: accessToken,
          google_refresh_token: credentials.refresh_token || refreshToken,
          updated_at: new Date().toISOString(), // Update profile timestamp
        }, { onConflict: 'id' });

      if (updateError) {
        console.error('Sync Engine - Error updating profile with new tokens:', updateError);
      }
    }
  } catch (refreshError: any) {
    console.error('Sync Engine - Error refreshing Google Access Token for user:', userId, refreshError);
    // Potentially disable sync for this user or notify them to re-authenticate
    return;
  }

  if (!accessToken) {
    console.error('Sync Engine - No valid Google Access Token after refresh attempt for user:', userId);
    return;
  }

  // Helper to check if sync should be skipped
  const shouldSkipSync = (lastSyncTime: string | null) => {
    if (!lastSyncTime) return false;
    const lastSyncDate = new Date(lastSyncTime);
    const now = new Date();
    const minutesSinceLastSync = (now.getTime() - lastSyncDate.getTime()) / (1000 * 60);
    return minutesSinceLastSync < SYNC_COOLDOWN_MINUTES;
  };

  const currentTimestamp = new Date().toISOString();

  // --- Google Tasks Synchronization ---
  try {
    if (shouldSkipSync(lastSyncAt)) {
      console.log('Sync Engine - Skipping Google Tasks sync due to cooldown for user:', userId);
    } else {
      console.log('Sync Engine - Starting Google Tasks sync for user:', userId);
      const tasksApi = google.tasks({ version: 'v1', auth });
      let allTasks: any[] = [];

      const taskListsResponse = await tasksApi.tasklists.list();
      const taskLists = taskListsResponse.data.items || [];

      for (const taskList of taskLists) {
        if (taskList.id) {
          const tasksResponse = await tasksApi.tasks.list({
            tasklist: taskList.id,
            showCompleted: true,
            showDeleted: false,
            showHidden: true,
            updatedMin: lastSyncAt || undefined, // Incremental sync
          });
          const tasks = (tasksResponse.data.items || []);
          allTasks = allTasks.concat(tasks.map(task => ({ ...task, taskListTitle: taskList.title })));
        }
      }

      // Upsert tasks to Supabase
      if (allTasks.length > 0) {
        const { error: upsertError } = await supabase
          .from('tasks')
          .upsert(allTasks.map(task => ({
            user_id: userId,
            google_task_id: task.id, 
            title: task.title,
            notes: task.notes,
            status: task.status,
            due_date: task.due,
            updated_at: task.updated, 
            completed_at: task.completed, 
            // created_at
          })), { onConflict: 'google_task_id' }); // Conflict on google_task_id

        if (upsertError) {
          console.error('Sync Engine - Error upserting Google Tasks for user:', userId, upsertError);
        } else {
          console.log(`Sync Engine - Upserted ${allTasks.length} Google Tasks for user:`, userId);
        }
      }

      // Update last_tasks_sync_at in profiles table
      const { error: updateSyncTimeError } = await supabase
        .from('profiles')
        .upsert({ id: userId, last_sync_time: currentTimestamp }, { onConflict: 'id' });

      if (updateSyncTimeError) {
        console.error('Sync Engine - Error updating last_tasks_sync_at for user:', userId, updateSyncTimeError);
      } else {
        console.log('Sync Engine - Updated last_tasks_sync_at for user:', userId);
      }
    }
  } catch (tasksError: any) {
    console.error('Sync Engine - Google Tasks sync failed for user:', userId, tasksError);
  }

  // --- Google Calendar Synchronization ---
  try {
    if (shouldSkipSync(lastSyncAt)) {
      console.log('Sync Engine - Skipping Google Calendar sync due to cooldown for user:', userId);
    } else {
      console.log('Sync Engine - Starting Google Calendar sync for user:', userId);
      const calendarApi = google.calendar({ version: 'v3', auth });
      let allEvents: any[] = [];
      let newCalendarSyncToken = calendarSyncToken;

      const params: any = {
        calendarId: 'primary',
      };

      if (calendarSyncToken) {
        params.syncToken = calendarSyncToken;
      } else {
        // If no sync token, fetch events from a reasonable past, e.g., last month
        params.timeMin = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days ago
      }

      let pageToken: string | undefined = undefined;
      do {
        const response: any = await calendarApi.events.list({ ...params, pageToken });

        const events = (response.data.items || []);
        allEvents = allEvents.concat(events);

        if (response.data.nextSyncToken) {
          newCalendarSyncToken = response.data.nextSyncToken;
        }
        pageToken = response.data.nextPageToken;

      } while (pageToken);


      // Upsert events to Supabase
      if (allEvents.length > 0) {
        const { error: upsertError } = await supabase
          .from('calendar_events')
          .upsert(allEvents.map((event: any) => ({
            user_id: userId,
            google_event_id: event.id,
            summary: event.summary,
            description: event.description,
            status: event.status,
            start_time: event.start?.dateTime || event.start?.date, 
            end_time: event.end?.dateTime || event.end?.date, 
            is_all_day: !!event.start?.date, 
            nexus_data: event.extendedProperties?.private?.nexus_data,
            updated_at: event.updated, 
            created_at: event.created,
          })), { onConflict: 'google_event_id' }); // Conflict on google_event_id

        if (upsertError) {
          console.error('Sync Engine - Error upserting Google Calendar events for user:', userId, upsertError);
        } else {
          console.log(`Sync Engine - Upserted ${allEvents.length} Google Calendar events for user:`, userId);
        }
      }

      // Update calendar_sync_token and last_calendar_sync_at in profiles table
      const { error: updateSyncTokenError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          calendar_sync_token: newCalendarSyncToken,
          last_sync_time: currentTimestamp,
        }, { onConflict: 'id' });

      if (updateSyncTokenError) {
        console.error('Sync Engine - Error updating calendar_sync_token for user:', userId, updateSyncTokenError);
      } else {
        console.log('Sync Engine - Updated calendar_sync_token and last_calendar_sync_at for user:', userId);
      }
    }
  } catch (calendarError: any) {
    // Handle '410 GONE' status for sync token invalidation
    if (calendarError.code === 410) {
      console.warn('Sync Engine - Google Calendar sync token invalid for user:', userId, '. Performing full sync.');
      // Clear the sync token and re-run the sync (or set a flag to do so)
      await supabase.from('profiles').upsert({ id: userId, calendar_sync_token: null }, { onConflict: 'id' });
      // In a real application, you might want to retry the sync immediately without the syncToken
      // For this exercise, I'll just log and let the next run handle a full sync.
    } else {
      console.error('Sync Engine - Google Calendar sync failed for user:', userId, calendarError);
    }
  }
}
