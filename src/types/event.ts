export interface Event {
  id: string;
  name: string;
  description: string | null;
  location: string;
  date: string;
  created_by: string;
  created_at: string;
}

export interface CreateEventData {
  name: string;
  description: string;
  location: string;
  date: string;
}