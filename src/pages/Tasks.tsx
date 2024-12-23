import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../hooks/useTasks';
import { useEvents } from '../hooks/useEvents';
import { useAttendees } from '../hooks/useAttendees';
import { TaskList } from '../components/tasks/TaskList';
import { TaskForm } from '../components/tasks/TaskForm';
import { TaskProgress } from '../components/tasks/TaskProgress';
import { CreateTaskData, TaskStatus } from '../types/task';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';
import { PageTransition } from '../components/animations/PageTransition';
import { FadeIn } from '../components/animations/FadeIn';

function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const { tasks, loading: tasksLoading, error: tasksError, createTask, updateTaskStatus, deleteTask, refreshTasks } = useTasks();
  const { events } = useEvents();
  const { attendees } = useAttendees();

  // Set up real-time updates
  useRealTimeUpdates(refreshTasks);

  const handleCreateTask = async (data: CreateTaskData) => {
    try {
      await createTask(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    try {
      await updateTaskStatus(id, status);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id);
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const getEventName = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    return event?.name || 'Unknown Event';
  };

  const getAttendeeName = (attendeeId: string | null) => {
    if (!attendeeId) return 'Unassigned';
    const attendee = attendees.find(a => a.id === attendeeId);
    return attendee?.name || 'Unknown Attendee';
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading tasks...</div>
      </div>
    );
  }

  if (tasksError) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {tasksError}
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <FadeIn>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <TaskProgress tasks={tasks} />
        </FadeIn>

        {showForm && (
          <FadeIn delay={0.2}>
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h2>
              <TaskForm
                onSubmit={handleCreateTask}
                onCancel={() => setShowForm(false)}
                events={events}
                attendees={attendees}
              />
            </div>
          </FadeIn>
        )}

        {tasks.length > 0 ? (
          <FadeIn delay={0.3}>
            <TaskList
              tasks={tasks}
              onUpdateStatus={handleUpdateStatus}
              onDelete={handleDeleteTask}
              getEventName={getEventName}
              getAttendeeName={getAttendeeName}
            />
          </FadeIn>
        ) : (
          <FadeIn delay={0.3}>
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900">No tasks yet</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by creating a new task.</p>
            </div>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}

export default Tasks;