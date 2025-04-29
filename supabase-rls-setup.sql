-- Enable Row Level Security on the thoughts table
ALTER TABLE thoughts ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read their own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can insert their own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can update their own thoughts" ON thoughts;
DROP POLICY IF EXISTS "Users can delete their own thoughts" ON thoughts;

-- Create policy to allow users to read only their own thoughts
CREATE POLICY "Users can read their own thoughts" 
ON thoughts FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert only their own thoughts
CREATE POLICY "Users can insert their own thoughts" 
ON thoughts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update only their own thoughts
CREATE POLICY "Users can update their own thoughts" 
ON thoughts FOR UPDATE 
USING (auth.uid() = user_id);

-- Create policy to allow users to delete only their own thoughts
CREATE POLICY "Users can delete their own thoughts" 
ON thoughts FOR DELETE 
USING (auth.uid() = user_id);

-- Make sure the thoughts table has the correct foreign key to the auth.users table
ALTER TABLE thoughts 
DROP CONSTRAINT IF EXISTS thoughts_user_id_fkey,
ADD CONSTRAINT thoughts_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id);

-- Verify the structure of the thoughts table
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM 
  information_schema.columns
WHERE 
  table_name = 'thoughts';

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'thoughts'; 