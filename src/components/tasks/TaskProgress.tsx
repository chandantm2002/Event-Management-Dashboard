import React from 'react';
import { motion } from 'framer-motion';
import { Task } from '../../types/task';

interface TaskProgressProps {
  tasks: Task[];
}

export function TaskProgress({ tasks }: TaskProgressProps) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold text-gray-900">Task Progress</h3>
        <span className="text-sm text-gray-500">
          {completedTasks} of {totalTasks} tasks completed
        </span>
      </div>
      <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-indigo-600"
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-600 text-right">
        {progressPercentage.toFixed(0)}% Complete
      </div>
    </div>
  );
}