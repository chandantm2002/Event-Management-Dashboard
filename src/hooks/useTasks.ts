import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Task, CreateTaskData, TaskStatus } from '../types/task';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('deadline');

      if (error) throw error;
      setTasks(data);
    } catch (error) {
      setError('Error loading tasks');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  }

  async function createTask(taskData: CreateTaskData) {
    try {
      const { error } = await supabase
        .from('tasks')
        .insert([{ ...taskData, status: 'pending' }]);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      throw new Error('Error creating task');
    }
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      throw new Error('Error updating task status');
    }
  }

  async function deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchTasks();
    } catch (error) {
      throw new Error('Error deleting task');
    }
  }

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTaskStatus,
    deleteTask,
    refreshTasks: fetchTasks,
  };
}