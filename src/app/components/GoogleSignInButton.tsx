'use client';

import { supabase } from '@/lib/supabase/client';

export default function GoogleSignInButton() {
  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: 'https://www.googleapis.com/auth/tasks https://www.googleapis.com/auth/calendar.readonly',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error('Error signing in with Google:', error);
      alert('Error signing in with Google. Check console for details.');
    } else {
      console.log('Google sign-in initiated:', data);
    }
  };

  return (
    <button
      onClick={handleSignIn}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      Google Sign In
    </button>
  );
}
