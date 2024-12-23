/*
  # Fix Profile Security Policies
  
  1. Changes
    - Updates RLS policies for profiles table to allow proper creation and access
    - Ensures authenticated users can create and access their own profiles
*/

-- Drop existing policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;

-- Create new comprehensive policies
CREATE POLICY "Enable insert for authenticated users" 
ON profiles FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable select for users based on user_id" 
ON profiles FOR SELECT 
TO authenticated 
USING (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" 
ON profiles FOR UPDATE 
TO authenticated 
USING (auth.uid() = id) 
WITH CHECK (auth.uid() = id);

-- Allow the trigger function to bypass RLS
ALTER FUNCTION public.handle_new_user() SET search_path = public;
ALTER FUNCTION public.handle_new_user() SECURITY DEFINER;