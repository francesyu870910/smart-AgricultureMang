-- 温室数字化监控系统完整数据库设置脚本
-- 包含数据库创建、表结构、索引和测试数据

-- 创建数据库
CREATE DATABASE IF NOT EXISTS greenhouse_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE greenhouse_db;

-- 执行表结构创建
SOURCE schema.sql;

-- 执行测试数据插入
SOURCE test-data.sql;

-- 显示创建结果
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as environment_data_count FROM environment_data;
SELECT COUNT(*) as device_status_count FROM device_status;
SELECT COUNT(*) as alert_records_count FROM alert_records;
SELECT COUNT(*) as control_logs_count FROM control_logs;
SELECT COUNT(*) as system_config_count FROM system_config;