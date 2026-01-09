-- Add tags column to products table if it doesn't exist
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';

-- Create an index for faster searching on tags
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN (tags);

-- Update RLS policies (optional, but good practice if needed)
-- (Existing policies for 'select' should cover it as long as the column is in the table)
