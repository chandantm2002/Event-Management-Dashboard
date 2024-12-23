import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task } from '../types/task';

export function useRealTimeUpdates(onTaskUpdate: () => void) {
  useEffect(() => {
    const tasksSubscription = supabase
      .channel('tasks-channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
        },
        () => {
          onTaskUpdate();
        }
      )
      .subscribe();

    return () => {
      tasksSubscription.unsubscribe();
    };
  }, [onTaskUpdate]);
}