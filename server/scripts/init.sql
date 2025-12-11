-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS blog_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE blog_db;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(500),
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_username (username),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(500),
  cover_image VARCHAR(500),
  author_id INT NOT NULL,
  status ENUM('draft', 'published', 'deleted') DEFAULT 'draft',
  view_count INT DEFAULT 0,
  like_count INT DEFAULT 0,
  published_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_author (author_id),
  INDEX idx_status (status),
  INDEX idx_published_at (published_at),
  FULLTEXT idx_title_content (title, content)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 标签表
CREATE TABLE IF NOT EXISTS tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  color VARCHAR(20) DEFAULT '#1890ff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 文章标签关联表
CREATE TABLE IF NOT EXISTS article_tags (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  tag_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE KEY uk_article_tag (article_id, tag_id),
  INDEX idx_article (article_id),
  INDEX idx_tag (tag_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 评论表
CREATE TABLE IF NOT EXISTS comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  article_id INT NOT NULL,
  user_id INT NOT NULL,
  parent_id INT NULL,
  content TEXT NOT NULL,
  status ENUM('approved', 'pending', 'deleted') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,
  INDEX idx_article (article_id),
  INDEX idx_user (user_id),
  INDEX idx_parent (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入管理员账户（密码：admin123）
INSERT INTO users (username, email, password, role) VALUES
('admin', 'admin@blog.com', '$2b$10$0NXtJPLnwRJ4m0AVP45ZNeIHD6yhj.edSQKuTOUC4b4gqqZXmgFge', 'admin');

-- 动漫表
CREATE TABLE IF NOT EXISTS anime (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uid VARCHAR(50) UNIQUE NOT NULL,
  cn_name VARCHAR(200) NOT NULL,
  original_title VARCHAR(200),
  aliases TEXT,
  cover_url VARCHAR(500),
  plot TEXT,
  tags VARCHAR(500),
  studio VARCHAR(200),
  source VARCHAR(100),
  original_author VARCHAR(200),
  writer VARCHAR(200),
  director VARCHAR(200),
  anime_class ENUM('TV', 'FILM', 'OVA', 'ONA') NOT NULL,
  country VARCHAR(50),
  air_date VARCHAR(50),
  episodes VARCHAR(50),
  rating DECIMAL(3, 1),
  my_rating DECIMAL(3, 1),
  watch_date DATE,
  website VARCHAR(500),
  cast TEXT,
  media_source ENUM('bangumi') DEFAULT 'bangumi',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_uid (uid),
  INDEX idx_cn_name (cn_name),
  INDEX idx_anime_class (anime_class),
  INDEX idx_country (country),
  INDEX idx_air_date (air_date),
  INDEX idx_rating (rating),
  INDEX idx_my_rating (my_rating),
  FULLTEXT idx_search (cn_name, original_title, aliases)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 插入示例标签
INSERT INTO tags (name, color) VALUES
('JavaScript', '#f7df1e'),
('TypeScript', '#3178c6'),
('React', '#61dafb'),
('Node.js', '#339933'),
('Database', '#336791'),
('Tutorial', '#1890ff');
