-- 创建数据库
CREATE DATABASE IF NOT EXISTS greenhouse_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE greenhouse_db;

-- 创建测试表，验证数据库连接
CREATE TABLE IF NOT EXISTS connection_test (
    id INT PRIMARY KEY AUTO_INCREMENT,
    test_message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入测试数据
INSERT INTO connection_test (test_message) VALUES 
('数据库连接测试成功'),
('MyBatis-Plus配置正常');