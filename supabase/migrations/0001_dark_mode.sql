/*
  # Initial Schema Setup for Event Management System

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key) - References auth.users
      - `email` (text)
      - `full_name` (text)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `location` (text)
      - `date` (timestamp)
      - `created_by` (uuid) - References profiles
      - `created_at` (timestamp)
    
    - `attendees`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text)
      - `created_at` (timestamp)
    
    - `event_attendees`
      - `id` (uuid, primary key)
      - `event_id` (uuid) - References events
      - `attendee_id` (uuid) - References attendees
      - `created_at` (timestamp)
    
    - `tasks`
      - `id` (uuid, primary key)
      - `name` (text)
      - `deadline` (timestamp)
      - `status` (text)
      - `event_id` (uuid) - References events
      - `attendee_id` (uuid) - References attendees
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  location text NOT NULL,
  date timestamptz NOT NULL,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- Create attendees table
CREATE TABLE attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create event_attendees junction table
CREATE TABLE event_attendees (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  attendee_id uuid REFERENCES attendees(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(event_id, attendee_id)
);

-- Create tasks table
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  deadline timestamptz NOT NULL,
  status text NOT NULL CHECK (status IN ('pending', 'completed')),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  attendee_id uuid REFERENCES attendees(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can view all events"
  ON events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update their own events"
  ON events FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own events"
  ON events FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

CREATE POLICY "Users can view all attendees"
  ON attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage attendees"
  ON attendees FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all event attendees"
  ON event_attendees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage event attendees"
  ON event_attendees FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Users can view all tasks"
  ON tasks FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage tasks"
  ON tasks FOR ALL
  TO authenticated
  USING (true);