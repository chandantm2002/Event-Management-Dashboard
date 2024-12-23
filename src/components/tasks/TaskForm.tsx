import React, { useState } from 'react';
import { format } from 'date-fns';
import { CreateTaskData } from '../../types/task';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData) => Promise<void>;
  onCancel: () => void;
  events: Array<{ id: string; name: string }>;
  attendees: Array<{ id: string; name: string }>;
}

export function TaskForm({ onSubmit, onCancel, events, attendees }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    name: '',
    deadline: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    event_id: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Task Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="event" className="block text-sm font-medium text-gray-700">
          Event
        </label>
        <select
          id="event"
          required
          value={formData.event_id}
          onChange={(e) => setFormData({ ...formData, event_id: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Select an event</option>
          {events.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="attendee" className="block text-sm font-medium text-gray-700">
          Assigned To
        </label>
        <select
          id="attendee"
          value={formData.attendee_id || ''}
          onChange={(e) => setFormData({ ...formData, attendee_id: e.target.value || undefined })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          <option value="">Unassigned</option>
          {attendees.map((attendee) => (
            <option key={attendee.id} value={attendee.id}>
              {attendee.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-gray-700">
          Deadline
        </label>
        <input
          type="datetime-local"
          id="deadline"
          required
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Task
        </button>
      </div>
    </form>
  );
}