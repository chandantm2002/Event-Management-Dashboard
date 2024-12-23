import React from 'react';
import { Mail, Trash2 } from 'lucide-react';
import { Attendee } from '../../types/attendee';

interface AttendeeListProps {
  attendees: Attendee[];
  onDelete: (id: string) => Promise<void>;
}

export function AttendeeList({ attendees, onDelete }: AttendeeListProps) {
  return (
    <div className="overflow-hidden bg-white shadow-sm rounded-lg">
      <ul className="divide-y divide-gray-200">
        {attendees.map((attendee) => (
          <li key={attendee.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {attendee.name}
                </p>
                <div className="flex items-center mt-1">
                  <Mail className="h-4 w-4 text-gray-400 mr-1" />
                  <p className="text-sm text-gray-500 truncate">{attendee.email}</p>
                </div>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  onClick={() => onDelete(attendee.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}