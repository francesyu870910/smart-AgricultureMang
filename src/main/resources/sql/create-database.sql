-- 创建温室数字化监控系统数据库
-- 此脚本需要在MySQL根连接下执行

-- 创建数据库
CREATE DATABASE IF NOT EXISTS greenhouse_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 创建用户（可选，如果使用root用户可跳过）
-- CREATE USER 'greenhouse'@'localhost' IDENTIFIED BY '123456';
-- GRANT ALL PRIVILEGES ON greenhouse_db.* TO 'greenhouse'@'localhost';
-- FLUSH PRIVILEGES;

-- 显示创建结果
SHOW DATABASES LIKE 'greenhouse_db';
SELECT 'Database greenhouse_db created successfully!' as status;