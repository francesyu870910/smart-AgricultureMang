-- 验证数据库设置是否成功
-- 使用方法: mysql -u root -p greenhouse_db < verify-setup.sql

USE greenhouse_db;

-- 检查所有表是否存在
SELECT 'Checking tables...' as status;
SHOW TABLES;

-- 检查表结构
SELECT 'Checking table structures...' as status;
DESCRIBE environment_data;
DESCRIBE device_status;
DESCRIBE alert_records;
DESCRIBE control_logs;
DESCRIBE system_config;

-- 检查索引
SELECT 'Checking indexes...' as status;
SHOW INDEX FROM environment_data;
SHOW INDEX FROM device_status;
SHOW INDEX FROM alert_records;
SHOW INDEX FROM control_logs;
SHOW INDEX FROM system_config;

-- 检查数据记录数
SELECT 'Checking data counts...' as status;
SELECT 'environment_data' as table_name, COUNT(*) as record_count FROM environment_data
UNION ALL
SELECT 'device_status' as table_name, COUNT(*) as record_count FROM device_status
UNION ALL
SELECT 'alert_records' as table_name, COUNT(*) as record_count FROM alert_records
UNION ALL
SELECT 'control_logs' as table_name, COUNT(*) as record_count FROM control_logs
UNION ALL
SELECT 'system_config' as table_name, COUNT(*) as record_count FROM system_config;

-- 检查最新的环境数据
SELECT 'Latest environment data:' as status;
SELECT * FROM environment_data ORDER BY recorded_at DESC LIMIT 5;

-- 检查在线设备
SELECT 'Online devices:' as status;
SELECT device_id, device_name, device_type, status, is_running, power_level 
FROM device_status 
WHERE status = 'online';

-- 检查未解决的报警
SELECT 'Unresolved alerts:' as status;
SELECT alert_type, severity, message, created_at 
FROM alert_records 
WHERE is_resolved = FALSE;

-- 检查系统配置
SELECT 'System configurations:' as status;
SELECT config_key, config_value, description 
FROM system_config 
WHERE is_system = TRUE 
ORDER BY config_key;

SELECT 'Database verification completed!' as final_status;