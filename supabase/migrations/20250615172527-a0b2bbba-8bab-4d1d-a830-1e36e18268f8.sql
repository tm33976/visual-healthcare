
-- Create the public diary_images storage bucket for diary entry images
insert into storage.buckets (id, name, public)
values ('diary_images', 'diary_images', true)
on conflict (id) do nothing;

-- Allow all users to read images from the bucket for rendering
create policy "Anyone can read diary images"
  on storage.objects
  for select
  using (bucket_id = 'diary_images');

-- Allow users to upload/update/delete ONLY their own images inside diary_images bucket (by file path prefix)
create policy "Users can manage their own diary images"
  on storage.objects
  for all
  using (
    bucket_id = 'diary_images'
    and (
      auth.uid()::text = left(name, 36) -- assuming UUID is used as prefix for each user's images
      or auth.role() = 'service_role'
    )
  );
