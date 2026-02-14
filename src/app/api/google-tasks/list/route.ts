import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  // Retrieve Tokens from Profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('google_access_token, google_refresh_token')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    console.error('Supabase API - Error fetching profile for user:', user.id, profileError);
    return NextResponse.json({ error: 'Failed to retrieve Google tokens from profile.' }, { status: 401 });
  }

  let accessToken = profile.google_access_token;
  const refreshToken = profile.google_refresh_token;

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ error: 'No Google tokens found. Please sign in with Google.' }, { status: 401 });
  }

  // Google OAuth2 Client Setup
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });

  // Attempt Token Refresh and Update Profile
  try {
    const { credentials } = await auth.refreshAccessToken();

    if (credentials.access_token && credentials.access_token !== accessToken) {
      accessToken = credentials.access_token;
      console.log('Supabase API - Google Access Token refreshed successfully!');

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          google_access_token: accessToken,
          google_refresh_token: credentials.refresh_token || refreshToken,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' });

      if (updateError) {
        console.error('Supabase API - Error updating profile with new tokens:', updateError);
      }
    }
  } catch (refreshError: any) {
    console.error('Supabase API - Error refreshing Google Access Token:', refreshError);
    return NextResponse.json(
      { error: 'Failed to refresh Google Access Token. Please re-authenticate.' },
      { status: 401 }
    );
  }

  if (!accessToken) {
    return NextResponse.json({ error: 'No valid Google Access Token after refresh attempt.' }, { status: 401 });
  }

  // Make Google Tasks API Call
  const tasksApi = google.tasks({ version: 'v1', auth });

  try {
    const taskListsResponse = await tasksApi.tasklists.list();
    const taskLists = taskListsResponse.data.items || [];

    let allTasks: any[] = [];

    for (const taskList of taskLists) {
      if (taskList.id) {
        const tasksResponse = await tasksApi.tasks.list({
          tasklist: taskList.id
        });
        const tasks = tasksResponse.data.items || [];
        allTasks = allTasks.concat(tasks.map(task => ({ ...task, taskListTitle: taskList.title })));
      }
    }

    return NextResponse.json(allTasks);
  } catch (googleApiError: any) {
    console.error('Google Tasks API Error:', googleApiError);
    if (googleApiError.code === 401 || googleApiError.response?.status === 401) {
      return NextResponse.json(
        { error: 'Google API Unauthorized. Please re-authenticate with Google.' },
        { status: 401 }
      );
    }
    return NextResponse.json({ error: googleApiError.message || 'Failed to fetch Google Tasks' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';