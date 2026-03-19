-- Database schema for Royal Restaurant Admin Dashboard

USE Restaurant;

-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'manager') DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dishes Table (Expanded)
CREATE TABLE IF NOT EXISTS dishes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category_id INT,
    original_price DECIMAL(10, 2),
    selling_price DECIMAL(10, 2) NOT NULL,
    offer_price DECIMAL(10, 2),
    image_url VARCHAR(255),
    is_veg BOOLEAN DEFAULT TRUE,
    is_trending BOOLEAN DEFAULT FALSE,
    status ENUM('Available', 'Unavailable') DEFAULT 'Available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    type ENUM('fixed', 'percent') NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    expiry_date DATE,
    min_order_value DECIMAL(10, 2) DEFAULT 0.00,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Combos Table
CREATE TABLE IF NOT EXISTS combos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    items JSON, -- List of dish IDs: [1, 5, 12]
    original_price DECIMAL(10, 2),
    combo_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123)
-- Note: In a real app, uses password_hash()
INSERT IGNORE INTO admin_users (name, email, password, role) 
VALUES ('Super Admin', 'admin@royal300.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
