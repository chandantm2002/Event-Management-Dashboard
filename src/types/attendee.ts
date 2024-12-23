export interface Attendee {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface CreateAttendeeData {
  name: string;
  email: string;
}