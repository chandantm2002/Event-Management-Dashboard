import React, { useState } from 'react';
import { format } from 'date-fns';
import { CheckSquare, Clock, Trash2, User } from 'lucide-react';
import { clsx } from 'clsx';
import { Task, TaskStatus } from '../../types/task';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: string, status: TaskStatus) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  getEventName: (eventId: string) => string;
  getAttendeeName: (attendeeId: string | null) => string;
}

export function TaskList({ tasks, onUpdateStatus, onDelete, getEventName, getAttendeeName }: TaskListProps) {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleStatusUpdate = async (id: string, status: TaskStatus) => {
    setLoadingStates(prev => ({ ...prev, [id]: true }));
    try {
      await onUpdateStatus(id, status);
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleDelete = async (id: string) => {
    setLoadingStates(prev => ({ ...prev, [`delete-${id}`]: true }));
    try {
      await onDelete(id);
    } finally {
      setLoadingStates(prev => ({ ...prev, [`delete-${id}`]: false }));
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <Card key={task.id} hover={false} className={clsx(
          'transition-all duration-200',
          task.status === 'completed' && 'bg-gray-50'
        )}>
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-3">
                <Button
                  variant={task.status === 'completed' ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => handleStatusUpdate(task.id, task.status === 'pending' ? 'completed' : 'pending')}
                  isLoading={loadingStates[task.id]}
                  className="flex-shrink-0"
                >
                  <CheckSquare className="h-4 w-4" />
                </Button>
                <div>
                  <p className={clsx(
                    'text-sm font-medium',
                    task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-900'
                  )}>
                    {task.name}
                  </p>
                  <p className="text-sm text-gray-500">{getEventName(task.event_id)}</p>
                </div>
              </div>
              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-1 text-gray-400" />
                  {format(new Date(task.deadline), 'PPp')}
                </div>
                {task.attendee_id && (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-gray-400" />
                    {getAttendeeName(task.attendee_id)}
                  </div>
                )}
              </div>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => handleDelete(task.id)}
              isLoading={loadingStates[`delete-${task.id}`]}
              className="ml-4"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}