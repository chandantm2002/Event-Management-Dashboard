import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Event } from '../../types/event';
import { motion } from 'framer-motion';

interface EventCalendarProps {
  events: Event[];
}

export function EventCalendar({ events }: EventCalendarProps) {
  const today = new Date();
  const startDate = startOfWeek(today);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Calendar</h3>
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => (
          <motion.div
            key={day.toISOString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border rounded-lg p-2"
          >
            <div className="text-sm font-medium text-gray-500 mb-2">
              {format(day, 'EEE')}
            </div>
            <div className="text-lg font-semibold mb-2">
              {format(day, 'd')}
            </div>
            <div className="space-y-1">
              {getEventsForDay(day).map(event => (
                <motion.div
                  key={event.id}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="text-xs p-1 bg-indigo-100 text-indigo-700 rounded truncate"
                  title={event.name}
                >
                  {event.name}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}