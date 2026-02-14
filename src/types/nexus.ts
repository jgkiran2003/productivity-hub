// Unified Type for any item in Nexus timeline
export type NexusItem = NexusTask | NexusEvent;

export interface NexusTask {
  id: string; // Supabase UUID
  user_id: string;
  google_task_id: string;
  title: string;
  notes?: string;
  due_date?: string; // ISO String
  status: 'needsAction' | 'completed';
  completed_at?: string;
  
  // Nexus Specifics
  source: 'google_tasks' | 'gmail' | 'manual';
  nexus_priority: number; // 1-10 priority
  category: 'NUS' | 'Pickleball' | 'Finance' | 'General';
  related_email_id?: string; // Links to "5 flagged emails"
}

export interface NexusEvent {
  id: string;
  user_id: string;
  google_event_id: string;
  summary: string;
  description?: string;
  location?: string;
  start_time: string;
  end_time: string;
  is_all_day: boolean;
  
  // Nexus Specifics
  nexus_context?: string; // AI summary
  is_nus_deadline: boolean; // Flag for academic tracking
  color_code?: string;
}