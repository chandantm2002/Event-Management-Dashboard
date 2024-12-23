import React, { useState } from 'react';
import { format } from 'date-fns';
import { MapPin, Calendar as CalendarIcon, Trash2, Users } from 'lucide-react';
import { Event } from '../../types/event';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface EventCardProps {
  event: Event;
  onDelete: (id: string) => Promise<void>;
  attendeeCount?: number;
}

export function EventCard({ event, onDelete, attendeeCount = 0 }: EventCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onDelete(event.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const isUpcoming = new Date(event.date) > new Date();

  return (
    <Card className="relative group">
      {isUpcoming && (
        <span className="absolute top-4 right-4 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
          Upcoming
        </span>
      )}
      
      <div className="flex flex-col h-full">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
          {event.name}
        </h3>
        
        <p className="mt-2 text-sm text-gray-600 flex-grow">{event.description}</p>
        
        <div className="mt-4 space-y-2">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
            {event.location}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
            {format(new Date(event.date), 'PPp')}
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Users className="h-4 w-4 mr-2 text-gray-400" />
            {attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            isLoading={isDeleting}
            className="w-full"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Event
          </Button>
        </div>
      </div>
    </Card>
  );
}