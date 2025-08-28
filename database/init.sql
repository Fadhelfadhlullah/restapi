-- Database initialization script for Day 25 API

-- Create database if not exists
CREATE DATABASE day25_api;

-- Connect to the database
\c day25_api;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(12, 2) NOT NULL CHECK (price >= 0),
    category VARCHAR(50) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_name ON items(name);
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_items_updated_at 
    BEFORE UPDATE ON items 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data
INSERT INTO items (name, description, price, category, stock) VALUES
('Laptop Gaming', 'High-performance gaming laptop with RTX graphics', 15000000.00, 'electronics', 5),
('Wireless Mouse', 'Ergonomic wireless mouse with RGB lighting', 250000.00, 'accessories', 20),
('Mechanical Keyboard', 'RGB mechanical keyboard with blue switches', 800000.00, 'accessories', 15),
('Gaming Monitor', '27-inch 144Hz gaming monitor with G-Sync', 3500000.00, 'electronics', 8),
('USB-C Hub', 'Multi-port USB-C hub with HDMI and ethernet', 450000.00, 'accessories', 25),
('Webcam HD', '1080p webcam with auto-focus and noise cancellation', 750000.00, 'electronics', 12),
('Desk Lamp', 'LED desk lamp with adjustable brightness', 200000.00, 'furniture', 30),
('Ergonomic Chair', 'Office chair with lumbar support and adjustable height', 2500000.00, 'furniture', 6),
('Bluetooth Speaker', 'Portable Bluetooth speaker with 20W output', 350000.00, 'electronics', 18),
('Phone Stand', 'Adjustable phone stand for desk use', 75000.00, 'accessories', 50);

-- Create users table for future authentication
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create trigger for users table
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create categories table for better data structure
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('electronics', 'Electronic devices and gadgets'),
('accessories', 'Computer and tech accessories'),
('furniture', 'Office and desk furniture'),
('software', 'Software and digital products');

-- Add foreign key constraint to items table (optional, for future use)
-- ALTER TABLE items ADD COLUMN category_id INTEGER REFERENCES categories(id);

-- Grant permissions
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO api_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO api_user;
