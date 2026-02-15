import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { syncGoogleResources } from '@/lib/sync';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'User not authenticated.' }, { status: 401 });
  }

  syncGoogleResources(user.id);
  
  return NextResponse.json({ message: 'Sync initiated in background.' }, { status: 200 });
}

export const dynamic = 'force-dynamic';