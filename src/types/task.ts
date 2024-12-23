export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  name: string;
  deadline: string;
  status: TaskStatus;
  event_id: string;
  attendee_id: string | null;
  created_at: string;
}

export interface CreateTaskData {
  name: string;
  deadline: string;
  event_id: string;
  attendee_id?: string;
}