import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Attendee, CreateAttendeeData } from '../types/attendee';

export function useAttendees() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttendees();
  }, []);

  async function fetchAttendees() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('name');

      if (error) throw error;
      setAttendees(data);
    } catch (error) {
      setError('Error loading attendees');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createAttendee(attendeeData: CreateAttendeeData) {
    try {
      const { error } = await supabase
        .from('attendees')
        .insert([attendeeData]);

      if (error) throw error;
      await fetchAttendees();
    } catch (error) {
      throw new Error('Error creating attendee');
    }
  }

  async function deleteAttendee(id: string) {
    try {
      const { error } = await supabase
        .from('attendees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAttendees();
    } catch (error) {
      throw new Error('Error deleting attendee');
    }
  }

  return {
    attendees,
    loading,
    error,
    createAttendee,
    deleteAttendee,
    refreshAttendees: fetchAttendees,
  };
}