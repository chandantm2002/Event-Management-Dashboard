import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Event, CreateEventData } from '../types/event';
import { useAuth } from '../contexts/AuthContext';

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data);
    } catch (error) {
      setError('Error loading events');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createEvent(eventData: CreateEventData) {
    try {
      const { error } = await supabase
        .from('events')
        .insert([{ ...eventData, created_by: user?.id }]);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      throw new Error('Error creating event');
    }
  }

  async function deleteEvent(id: string) {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchEvents();
    } catch (error) {
      throw new Error('Error deleting event');
    }
  }

  return {
    events,
    loading,
    error,
    createEvent,
    deleteEvent,
    refreshEvents: fetchEvents,
  };
}