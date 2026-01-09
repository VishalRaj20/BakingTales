-- Add is_featured column to products table
ALTER TABLE products 
ADD COLUMN is_featured BOOLEAN DEFAULT false;

-- Index it for faster querying on home page
CREATE INDEX idx_products_is_featured ON products(is_featured);
