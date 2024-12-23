import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEvents } from '../hooks/useEvents';
import { EventCard } from '../components/events/EventCard';
import { EventForm } from '../components/events/EventForm';
import { EventCalendar } from '../components/calendar/EventCalendar';
import { CreateEventData } from '../types/event';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageTransition } from '../components/animations/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';

export default function Events() {
  const [showForm, setShowForm] = useState(false);
  const { events, loading, error, createEvent, deleteEvent } = useEvents();

  const handleCreateEvent = async (data: CreateEventData) => {
    try {
      await createEvent(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative"
      >
        {error}
      </motion.div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <FadeIn>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Events</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your upcoming and past events
              </p>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Event
            </Button>
          </FadeIn>
        </div>

        <FadeIn delay={0.3}>
          <EventCalendar events={events} />
        </FadeIn>

        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Event</h2>
              <EventForm onSubmit={handleCreateEvent} onCancel={() => setShowForm(false)} />
            </Card>
          </motion.div>
        )}

        <motion.div 
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          layout
        >
          {events.map((event, index) => (
            <FadeIn key={event.id} delay={index * 0.1}>
              <EventCard
                event={event}
                onDelete={handleDeleteEvent}
              />
            </FadeIn>
          ))}
        </motion.div>

        {events.length === 0 && !showForm && (
          <FadeIn delay={0.3}>
            <Card className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No events yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new event.</p>
              <Button
                onClick={() => setShowForm(true)}
                className="mt-4"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create your first event
              </Button>
            </Card>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}