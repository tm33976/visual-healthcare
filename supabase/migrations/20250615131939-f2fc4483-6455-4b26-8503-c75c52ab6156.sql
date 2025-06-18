
-- 1. Create public.profiles table (if doesn't exist yet)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT NOT NULL UNIQUE
);

-- 2. Enforce that every row must have a username (NOT NULL, UNIQUE above already handles this)
-- 3. Enable Row Level Security so users can only access their own profile
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Allow users to select their own profile
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

-- 5. Allow users to insert their own profile
CREATE POLICY "Users can create their own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 6. Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
