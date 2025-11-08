DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('IN_STORE', 'DELIVERY', 'CURBSIDE')),
    delivery_address TEXT,
    delivery_time TIMESTAMP NOT NULL,
    pickup_location VARCHAR(255),
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Seed user (password: password123)
-- Password hash generated with bcrypt rounds=10
INSERT INTO users (email, password) VALUES 
('test@example.com', '$2a$10$rKZvVLYm4jXVQE7qVZ3zD.J0Q7Z8YqH3uqYXF.7xKZvVLYm4jXVQO')
ON CONFLICT (email) DO NOTHING;