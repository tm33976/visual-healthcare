
-- Create the diary_entries table
create table public.diary_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  content text,
  image_url text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Index for efficient user-specific lookups
create index on public.diary_entries (user_id);

-- Enable Row Level Security
alter table public.diary_entries enable row level security;

-- Allow users to view their own diary entries
create policy "Users can view their own diary entries"
  on public.diary_entries
  for select
  using (auth.uid() = user_id);

-- Allow users to insert their own diary entries
create policy "Users can insert their own diary entries"
  on public.diary_entries
  for insert
  with check (auth.uid() = user_id);

-- Allow users to update their own diary entries
create policy "Users can update their own diary entries"
  on public.diary_entries
  for update
  using (auth.uid() = user_id);

-- Allow users to delete their own diary entries
create policy "Users can delete their own diary entries"
  on public.diary_entries
  for delete
  using (auth.uid() = user_id);
