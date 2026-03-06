-- Create books table for CHINAR PUBLICATION catalog
CREATE TABLE IF NOT EXISTS books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  isbn VARCHAR(20),
  published_year INTEGER,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  purchase_instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_books_title ON books USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_books_author ON books USING gin(to_tsvector('english', author));
CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
CREATE INDEX IF NOT EXISTS idx_books_available ON books(is_available);

-- Enable Row Level Security (RLS)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access (ONLY for available books per PRD)
CREATE POLICY "Allow public read access"
  ON books
  FOR SELECT
  TO anon
  USING (is_available = true);

-- Policy 2: Allow authenticated users full CRUD access (Admin dashboard PRD requirement)
CREATE POLICY "Allow authenticated full access"
  ON books
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Trigger Function: Auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Attach Trigger to the books table
DROP TRIGGER IF EXISTS update_books_updated_at ON books;
CREATE TRIGGER update_books_updated_at
  BEFORE UPDATE ON books
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert Sample Data for Testing (Safe to run multiple times, handles conflicts)
-- (All mock data removed per digital marketing platform requirements)

---
--- MIGRATION SCRIPT (SAFE TO RUN IF TABLE ALREADY EXISTS)
--- This ensures all PRD requirements are added safely without blowing up existing data
---
ALTER TABLE books ADD COLUMN IF NOT EXISTS is_available BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE books ADD COLUMN IF NOT EXISTS purchase_instructions TEXT;
ALTER TABLE books DROP COLUMN IF EXISTS price;

DROP POLICY IF EXISTS "Allow public read access" ON books;
CREATE POLICY "Allow public read access"
  ON books FOR SELECT TO anon
  USING (is_available = true);
