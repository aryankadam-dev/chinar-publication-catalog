-- Add image and metadata columns to the books table safely
ALTER TABLE books
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS pages integer,
ADD COLUMN IF NOT EXISTS language text DEFAULT 'Eng',
ADD COLUMN IF NOT EXISTS format text DEFAULT 'Paperback';

-- Create the Storage bucket for book covers
-- Note: Assuming the role creating this has permission to create buckets.
-- If running manually in Supabase SQL editor, this will work.
INSERT INTO storage.buckets (id, name, public) 
VALUES ('book-covers', 'book-covers', true)
ON CONFLICT (id) DO NOTHING;

-- Set up basic public access policies for the new bucket
-- 1. Allow public read access to all files in the bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'book-covers');

-- 2. Allow authenticated users (admin) to insert/upload files
CREATE POLICY "Authenticated users can upload covers" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'book-covers');

-- 3. Allow authenticated users to update files
CREATE POLICY "Authenticated users can update covers" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'book-covers');

-- 4. Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete covers" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'book-covers');
