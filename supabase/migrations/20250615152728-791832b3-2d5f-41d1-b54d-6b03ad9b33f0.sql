
-- Create table for appointments (covers future and history)
CREATE TABLE public.appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  doctor text NOT NULL,
  specialty text NOT NULL,
  date date NOT NULL,
  time text NOT NULL,
  status text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Only the authenticated user can fetch their own appointments
CREATE POLICY "Users can view their own appointments"
  ON public.appointments
  FOR SELECT
  USING (user_id = auth.uid());

-- Only the authenticated user can insert their own appointment
CREATE POLICY "Users can insert their own appointments"
  ON public.appointments
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Only the authenticated user can update their own appointments
CREATE POLICY "Users can update their own appointments"
  ON public.appointments
  FOR UPDATE
  USING (user_id = auth.uid());

-- Only the authenticated user can delete their own appointments
CREATE POLICY "Users can delete their own appointments"
  ON public.appointments
  FOR DELETE
  USING (user_id = auth.uid());
