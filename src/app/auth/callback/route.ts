import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Supabase Callback - Error exchanging code for session:', error);
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=${error.message}`);
    }
    
    const accessToken = data.session?.provider_token;
    const refreshToken = data.session?.provider_refresh_token;
    const userId = data.user?.id;

    if (userId && accessToken) {
      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          google_access_token: accessToken,
          google_refresh_token: refreshToken,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id' }); 

      if (upsertError) {
        console.error('Supabase Callback - Error upserting tokens:', upsertError);
        return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=Failed to save tokens: ${upsertError.message}`);
      }
      console.log('Supabase Callback - Google OAuth tokens upserted successfully for user:', userId);
    } else {
      console.warn('Supabase Callback - Missing userId or accessToken for upsert.');
      return NextResponse.redirect(`${requestUrl.origin}/auth/error?message=Missing user or access token after authentication.`);
    }
  }

  return NextResponse.redirect(requestUrl.origin);
}
