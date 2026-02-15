// Unified Type for any item in Nexus timeline
export type NexusItem = NexusTask | NexusEvent;

export interface NexusTask {
  id: string; // Supabase UUID
  user_id: string;
  google_task_id: string;
  title: string;
  status: 'needsAction' | 'completed';
  notes?: string;
  due_date?: string; 
  updated_at?: string;
  completed_at?: string;
  created_at?: string;
}

export interface NexusEvent {
  id: string; // Supabase UUID
  user_id: string;
  google_event_id: string;
  summary: string;
  description?: string;
  status: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  nexus_data?: string;
  updated_at?: string;
  created_at?: string;
}