'use client';

import React, { useEffect, useState } from 'react';

interface GoogleTask {
  id: string;
  title: string;
  notes?: string;
  status: string;
  due?: string;
  taskListTitle: string;
}

export default function GoogleTasksColumn() {
  const [tasks, setTasks] = useState<GoogleTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGoogleTasks() {
      try {
        const response = await fetch('/api/google-tasks/list');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch tasks');
        }
        const data: GoogleTask[] = await response.json();
        setTasks(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchGoogleTasks();
  }, []);

  if (loading) {
    return (
      <div className="h-full">
        <h2 className="text-xl font-bold mb-4">Google Tasks</h2>
        <p>Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full text-red-500">
        <h2 className="text-xl font-bold mb-4">Google Tasks</h2>
        <p>Error: {error}</p>
        <p className="text-sm">Please ensure you are signed in with Google and have granted Tasks API permissions.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
      <h2 className="text-xl font-bold">Google Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="relative p-3 bg-white/10 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
              {task.status === 'completed' && (
                <div className="absolute top-0 left-0 w-full h-full bg-green-500/10 rounded-lg flex items-center justify-center pointer-events-none">
                  <span className="text-green-500 text-lg font-bold">✓ COMPLETED</span>
                </div>
              )}
              <h3 className="font-semibold text-lg text-white mb-1">{task.title}</h3>
              {task.notes && <p className="text-sm text-gray-300 truncate mb-1">{task.notes}</p>}
              {task.due && (
                <p className="text-xs text-gray-400 mb-1">
                  Due: {new Date(task.due).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
