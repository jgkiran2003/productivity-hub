// Specific fields to watch in Google Tasks Response
export interface GoogleTaskResource {
  id: string;
  title: string;
  notes?: string;
  status: 'needsAction' | 'completed';
  due?: string;
  updated: string; // RFC 3339 timestamp
  links?: Array<{
    type: string; // "email"
    description: string;
    link: string; // URL to the Gmail thread
  }>;
  webViewLink: string; // URL to the Google Tasks
}

// Specific fields to watch in Google Calendar Response
export interface GoogleEventResource {
  id: string;
  summary: string;
  description?: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  status: 'confirmed' | 'tentative' | 'cancelled';
  extendedProperties?: {
    private?: {
      nexus_priority?: string; // Hidden Nexus data stored in Google
    };
  };
}