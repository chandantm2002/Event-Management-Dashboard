import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAttendees } from '../hooks/useAttendees';
import { AttendeeList } from '../components/attendees/AttendeeList';
import { AttendeeForm } from '../components/attendees/AttendeeForm';
import { CreateAttendeeData } from '../types/attendee';

function Attendees() {
  const [showForm, setShowForm] = useState(false);
  const { attendees, loading, error, createAttendee, deleteAttendee } = useAttendees();

  const handleCreateAttendee = async (data: CreateAttendeeData) => {
    try {
      await createAttendee(data);
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create attendee:', error);
    }
  };

  const handleDeleteAttendee = async (id: string) => {
    try {
      await deleteAttendee(id);
    } catch (error) {
      console.error('Failed to delete attendee:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading attendees...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendees</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Attendee
        </button>
      </div>

      {showForm ? (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Attendee</h2>
          <AttendeeForm onSubmit={handleCreateAttendee} onCancel={() => setShowForm(false)} />
        </div>
      ) : null}

      {attendees.length > 0 ? (
        <AttendeeList attendees={attendees} onDelete={handleDeleteAttendee} />
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">No attendees yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding a new attendee.</p>
        </div>
      )}
    </div>
  );
}

export default Attendees;