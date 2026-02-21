-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url VARCHAR(255),
    theme VARCHAR(50) DEFAULT 'default',
    button_style VARCHAR(50) DEFAULT 'rounded-lg',
    plan ENUM('free', 'pro', 'business') DEFAULT 'free',
    role ENUM('user', 'admin') DEFAULT 'user',
    status ENUM('active', 'suspended') DEFAULT 'active',
    is_verified TINYINT(1) DEFAULT 0,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Links Table
CREATE TABLE IF NOT EXISTS links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    is_active TINYINT(1) DEFAULT 1,
    clicks INT DEFAULT 0,
    type VARCHAR(50) DEFAULT 'social',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_links (user_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Analytics / Views Table
CREATE TABLE IF NOT EXISTS analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL, -- Profile owner
    link_id INT NULL,     -- NULL for profile view, set for link click
    visitor_id VARCHAR(64), -- Hashed IP or session ID for uniqueness
    ip_address VARCHAR(45), -- Anonymized if needed
    user_agent VARCHAR(255),
    referrer VARCHAR(255),
    country_code VARCHAR(3),
    city VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_analytics_user (user_id, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Settings Table (Global Config)
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Settings
INSERT INTO settings (setting_key, setting_value) VALUES 
('site_name', 'Social2Tree'), 
('maintenance_mode', 'false'),
('free_link_limit', '5'),
('pro_price', '15.00')
ON DUPLICATE KEY UPDATE setting_value = setting_value;

-- ==========================================
-- MOCK/SEED DATA FOR TESTING
-- Remove these in production!
-- ==========================================

-- Sample Users (Password for all: 'password123')
-- Hash generated via: password_hash('password123', PASSWORD_BCRYPT)
INSERT INTO users (username, email, password_hash, display_name, bio, avatar_url, theme, button_style, plan, role, status) VALUES 
('johndoe', 'john@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John Doe', 'Digital creator and minimalist. Exploring the world of web development.', 'https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff', 'purple', 'rounded-lg', 'free', 'user', 'active'),
('janedoe', 'jane@demo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Jane Designer', 'UX Specialist & Coffee Lover ☕', 'https://ui-avatars.com/api/?name=Jane+Designer&background=10b981&color=fff', 'nature', 'rounded-full', 'pro', 'user', 'active'),
('admin', 'admin@social2tree.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'Social2Tree Administrator', 'https://ui-avatars.com/api/?name=Admin&background=0f172a&color=fff', 'default', 'rounded-lg', 'business', 'admin', 'active')
ON DUPLICATE KEY UPDATE username = username;

-- Sample Links for John Doe (user_id will be 1 if first insert)
INSERT INTO links (user_id, title, url, is_active, clicks, type, sort_order) VALUES 
(1, 'Follow me on Instagram', 'https://instagram.com/johndoe', 1, 450, 'social', 0),
(1, 'Check my Portfolio', 'https://johndoe.dev', 1, 230, 'website', 1),
(1, 'Buy me a Coffee', 'https://buymeacoffee.com/johndoe', 1, 88, 'support', 2),
(1, 'GitHub Projects', 'https://github.com/johndoe', 1, 156, 'social', 3)
ON DUPLICATE KEY UPDATE title = title;

-- Sample Links for Jane (user_id will be 2)
INSERT INTO links (user_id, title, url, is_active, clicks, type, sort_order) VALUES 
(2, 'Design Portfolio', 'https://janedoe.design', 1, 890, 'website', 0),
(2, 'LinkedIn', 'https://linkedin.com/in/janedoe', 1, 340, 'social', 1),
(2, 'Dribbble', 'https://dribbble.com/janedoe', 1, 520, 'social', 2)
ON DUPLICATE KEY UPDATE title = title;

-- Sample Analytics (Profile Views and Link Clicks)
INSERT INTO analytics (user_id, link_id, visitor_id, ip_address, user_agent, created_at) VALUES 
-- Profile views for John
(1, NULL, 'visitor_001', '192.168.1.1', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, NULL, 'visitor_002', '192.168.1.2', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, NULL, 'visitor_003', '192.168.1.3', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 3 DAY)),
-- Link clicks for John's Instagram
(1, 1, 'visitor_001', '192.168.1.1', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(1, 1, 'visitor_004', '192.168.1.4', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 DAY)),
-- Profile views for Jane
(2, NULL, 'visitor_005', '192.168.1.5', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, NULL, 'visitor_006', '192.168.1.6', 'Mozilla/5.0', DATE_SUB(NOW(), INTERVAL 2 DAY))
ON DUPLICATE KEY UPDATE id = id;
