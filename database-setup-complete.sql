-- 智能温室环境监控系统完整数据库设置脚本
-- 执行此脚本前请确保MySQL服务已启动
-- 使用方法: mysql -u root -p < database-setup-complete.sql

-- 创建数据库
CREATE DATABASE IF NOT EXISTS greenhouse_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE greenhouse_db;

-- 1. 环境数据表 (environment_data)
-- 存储温室环境传感器采集的实时数据
CREATE TABLE IF NOT EXISTS environment_data (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    greenhouse_id VARCHAR(50) NOT NULL COMMENT '温室编号',
    temperature DECIMAL(5,2) NOT NULL COMMENT '温度(°C)',
    humidity DECIMAL(5,2) NOT NULL COMMENT '空气湿度(%)',
    light_intensity DECIMAL(8,2) NOT NULL COMMENT '光照强度(lux)',
    soil_humidity DECIMAL(5,2) NOT NULL COMMENT '土壤湿度(%)',
    co2_level DECIMAL(8,2) DEFAULT NULL COMMENT 'CO2浓度(ppm)',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '记录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='环境数据表';

-- 2. 设备状态表 (device_status)
-- 存储温室内各种设备的状态信息
CREATE TABLE IF NOT EXISTS device_status (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    device_id VARCHAR(50) NOT NULL UNIQUE COMMENT '设备唯一标识',
    device_name VARCHAR(100) NOT NULL COMMENT '设备名称',
    device_type ENUM('heater', 'cooler', 'humidifier', 'dehumidifier', 'fan', 'light', 'irrigation') NOT NULL COMMENT '设备类型',
    status ENUM('online', 'offline', 'error') DEFAULT 'offline' COMMENT '设备状态',
    is_running BOOLEAN DEFAULT FALSE COMMENT '是否运行中',
    power_level DECIMAL(5,2) DEFAULT 0 COMMENT '功率百分比(0-100)',
    last_maintenance DATE DEFAULT NULL COMMENT '上次维护日期',
    location VARCHAR(100) DEFAULT NULL COMMENT '设备位置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='设备状态表';

-- 3. 报警记录表 (alert_records)
-- 存储系统产生的各种报警信息
CREATE TABLE IF NOT EXISTS alert_records (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    alert_type ENUM('temperature', 'humidity', 'light', 'device_error', 'system_error') NOT NULL COMMENT '报警类型',
    severity ENUM('low', 'medium', 'high', 'critical') NOT NULL COMMENT '严重程度',
    message TEXT NOT NULL COMMENT '报警消息',
    parameter_value DECIMAL(10,2) DEFAULT NULL COMMENT '参数当前值',
    threshold_value DECIMAL(10,2) DEFAULT NULL COMMENT '阈值',
    device_id VARCHAR(50) DEFAULT NULL COMMENT '相关设备ID',
    greenhouse_id VARCHAR(50) DEFAULT NULL COMMENT '温室编号',
    is_resolved BOOLEAN DEFAULT FALSE COMMENT '是否已解决',
    resolved_at TIMESTAMP NULL COMMENT '解决时间',
    resolved_by VARCHAR(50) DEFAULT NULL COMMENT '解决人',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='报警记录表';

-- 4. 控制日志表 (control_logs)
-- 记录所有设备控制操作的历史
CREATE TABLE IF NOT EXISTS control_logs (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    device_id VARCHAR(50) NOT NULL COMMENT '设备ID',
    action ENUM('start', 'stop', 'adjust', 'reset') NOT NULL COMMENT '操作类型',
    old_value DECIMAL(10,2) DEFAULT NULL COMMENT '操作前数值',
    new_value DECIMAL(10,2) DEFAULT NULL COMMENT '操作后数值',
    operator VARCHAR(50) DEFAULT 'system' COMMENT '操作者',
    operation_source ENUM('manual', 'auto', 'remote') DEFAULT 'manual' COMMENT '操作来源',
    result ENUM('success', 'failed', 'timeout') DEFAULT 'success' COMMENT '操作结果',
    error_message TEXT DEFAULT NULL COMMENT '错误信息',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='控制日志表';

-- 5. 系统配置表 (system_config)
-- 存储系统的各种配置参数
CREATE TABLE IF NOT EXISTS system_config (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '主键ID',
    config_key VARCHAR(100) NOT NULL UNIQUE COMMENT '配置键',
    config_value TEXT NOT NULL COMMENT '配置值',
    config_type ENUM('string', 'number', 'boolean', 'json') DEFAULT 'string' COMMENT '配置类型',
    description VARCHAR(255) DEFAULT NULL COMMENT '配置描述',
    is_system BOOLEAN DEFAULT FALSE COMMENT '是否系统配置',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统配置表';

-- 创建索引优化查询性能

-- 环境数据表索引
CREATE INDEX idx_environment_greenhouse_time ON environment_data (greenhouse_id, recorded_at);
CREATE INDEX idx_environment_recorded_at ON environment_data (recorded_at);
CREATE INDEX idx_environment_temperature ON environment_data (temperature);
CREATE INDEX idx_environment_humidity ON environment_data (humidity);

-- 设备状态表索引
CREATE INDEX idx_device_type ON device_status (device_type);
CREATE INDEX idx_device_status ON device_status (status);
CREATE INDEX idx_device_running ON device_status (is_running);

-- 报警记录表索引
CREATE INDEX idx_alert_type ON alert_records (alert_type);
CREATE INDEX idx_alert_severity ON alert_records (severity);
CREATE INDEX idx_alert_created_at ON alert_records (created_at);
CREATE INDEX idx_alert_resolved ON alert_records (is_resolved);
CREATE INDEX idx_alert_device_id ON alert_records (device_id);

-- 控制日志表索引
CREATE INDEX idx_control_device_id ON control_logs (device_id);
CREATE INDEX idx_control_created_at ON control_logs (created_at);
CREATE INDEX idx_control_operator ON control_logs (operator);
CREATE INDEX idx_control_source ON control_logs (operation_source);

-- 系统配置表索引
CREATE INDEX idx_config_type ON system_config (config_type);
CREATE INDEX idx_config_system ON system_config (is_system);

-- 插入设备状态测试数据
INSERT INTO device_status (device_id, device_name, device_type, status, is_running, power_level, location) VALUES
('HEATER_001', '加热器1号', 'heater', 'online', FALSE, 0, '温室A区-北侧'),
('COOLER_001', '冷却器1号', 'cooler', 'online', FALSE, 0, '温室A区-南侧'),
('HUMIDIFIER_001', '加湿器1号', 'humidifier', 'online', TRUE, 45.5, '温室A区-中央'),
('DEHUMIDIFIER_001', '除湿器1号', 'dehumidifier', 'online', FALSE, 0, '温室A区-东侧'),
('FAN_001', '通风扇1号', 'fan', 'online', TRUE, 60.0, '温室A区-顶部'),
('FAN_002', '通风扇2号', 'fan', 'online', TRUE, 55.0, '温室A区-西侧'),
('LIGHT_001', '补光灯1号', 'light', 'online', TRUE, 80.0, '温室A区-顶部LED'),
('LIGHT_002', '补光灯2号', 'light', 'online', TRUE, 75.0, '温室A区-侧面LED'),
('IRRIGATION_001', '灌溉系统1号', 'irrigation', 'online', FALSE, 0, '温室A区-滴灌系统');

-- 插入环境数据测试数据（最近24小时的模拟数据）
INSERT INTO environment_data (greenhouse_id, temperature, humidity, light_intensity, soil_humidity, co2_level, recorded_at) VALUES
-- 当前时间的数据
('GH_A001', 24.5, 65.2, 15000.0, 72.8, 420.5, NOW()),
('GH_A001', 24.3, 64.8, 14800.0, 72.5, 418.2, DATE_SUB(NOW(), INTERVAL 5 MINUTE)),
('GH_A001', 24.7, 65.5, 15200.0, 73.1, 422.8, DATE_SUB(NOW(), INTERVAL 10 MINUTE)),
('GH_A001', 24.2, 64.2, 14500.0, 72.2, 415.6, DATE_SUB(NOW(), INTERVAL 15 MINUTE)),
('GH_A001', 24.8, 66.1, 15500.0, 73.5, 425.3, DATE_SUB(NOW(), INTERVAL 20 MINUTE)),

-- 1小时前的数据
('GH_A001', 23.8, 63.5, 13800.0, 71.8, 412.4, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('GH_A001', 23.6, 63.2, 13500.0, 71.5, 410.8, DATE_SUB(NOW(), INTERVAL 90 MINUTE)),
('GH_A001', 23.9, 63.8, 14000.0, 72.0, 414.2, DATE_SUB(NOW(), INTERVAL 2 HOUR)),

-- 6小时前的数据（白天高峰期）
('GH_A001', 26.2, 68.5, 25000.0, 75.2, 380.5, DATE_SUB(NOW(), INTERVAL 6 HOUR)),
('GH_A001', 26.8, 69.2, 26500.0, 76.1, 375.8, DATE_SUB(NOW(), INTERVAL 390 MINUTE)),
('GH_A001', 27.1, 70.1, 27200.0, 76.8, 372.3, DATE_SUB(NOW(), INTERVAL 7 HOUR)),

-- 12小时前的数据（夜间）
('GH_A001', 20.5, 58.2, 2000.0, 68.5, 450.2, DATE_SUB(NOW(), INTERVAL 12 HOUR)),
('GH_A001', 20.2, 57.8, 1800.0, 68.1, 452.8, DATE_SUB(NOW(), INTERVAL 750 MINUTE)),
('GH_A001', 19.8, 57.2, 1500.0, 67.8, 455.6, DATE_SUB(NOW(), INTERVAL 13 HOUR)),

-- 18小时前的数据（早晨）
('GH_A001', 22.1, 61.5, 8000.0, 70.2, 435.8, DATE_SUB(NOW(), INTERVAL 18 HOUR)),
('GH_A001', 22.8, 62.3, 10500.0, 71.1, 428.5, DATE_SUB(NOW(), INTERVAL 1110 MINUTE)),
('GH_A001', 23.2, 62.8, 12000.0, 71.5, 425.2, DATE_SUB(NOW(), INTERVAL 19 HOUR)),

-- 24小时前的数据
('GH_A001', 24.1, 64.5, 14200.0, 72.3, 420.8, DATE_SUB(NOW(), INTERVAL 24 HOUR));

-- 插入报警记录测试数据
INSERT INTO alert_records (alert_type, severity, message, parameter_value, threshold_value, device_id, greenhouse_id, is_resolved, resolved_at) VALUES
('temperature', 'medium', '温度超出正常范围', 28.5, 27.0, NULL, 'GH_A001', TRUE, DATE_SUB(NOW(), INTERVAL 2 HOUR)),
('humidity', 'low', '湿度偏低，需要关注', 45.2, 50.0, 'HUMIDIFIER_001', 'GH_A001', TRUE, DATE_SUB(NOW(), INTERVAL 1 HOUR)),
('device_error', 'high', '设备通信异常', NULL, NULL, 'FAN_002', 'GH_A001', FALSE, NULL),
('light', 'medium', '光照强度不足', 8500.0, 12000.0, 'LIGHT_001', 'GH_A001', TRUE, DATE_SUB(NOW(), INTERVAL 30 MINUTE)),
('temperature', 'critical', '温度过高，紧急处理', 32.1, 30.0, 'COOLER_001', 'GH_A001', TRUE, DATE_SUB(NOW(), INTERVAL 4 HOUR)),
('system_error', 'medium', '数据采集延迟', NULL, NULL, NULL, 'GH_A001', FALSE, NULL);

-- 插入控制日志测试数据
INSERT INTO control_logs (device_id, action, old_value, new_value, operator, operation_source, result) VALUES
('HEATER_001', 'start', 0, 60.0, 'admin', 'manual', 'success'),
('HEATER_001', 'adjust', 60.0, 45.0, 'system', 'auto', 'success'),
('HEATER_001', 'stop', 45.0, 0, 'admin', 'remote', 'success'),
('HUMIDIFIER_001', 'start', 0, 50.0, 'system', 'auto', 'success'),
('HUMIDIFIER_001', 'adjust', 50.0, 45.5, 'system', 'auto', 'success'),
('FAN_001', 'start', 0, 70.0, 'admin', 'manual', 'success'),
('FAN_001', 'adjust', 70.0, 60.0, 'system', 'auto', 'success'),
('LIGHT_001', 'start', 0, 100.0, 'system', 'auto', 'success'),
('LIGHT_001', 'adjust', 100.0, 80.0, 'admin', 'remote', 'success'),
('COOLER_001', 'start', 0, 80.0, 'system', 'auto', 'success'),
('COOLER_001', 'stop', 80.0, 0, 'system', 'auto', 'success'),
('IRRIGATION_001', 'start', 0, 100.0, 'admin', 'manual', 'success'),
('IRRIGATION_001', 'stop', 100.0, 0, 'admin', 'manual', 'success'),
('FAN_002', 'start', 0, 65.0, 'system', 'auto', 'failed');

-- 插入系统配置测试数据
INSERT INTO system_config (config_key, config_value, config_type, description, is_system) VALUES
-- 温度相关配置
('temperature.min.threshold', '18.0', 'number', '最低温度阈值(°C)', TRUE),
('temperature.max.threshold', '30.0', 'number', '最高温度阈值(°C)', TRUE),
('temperature.optimal.min', '22.0', 'number', '最适温度下限(°C)', FALSE),
('temperature.optimal.max', '26.0', 'number', '最适温度上限(°C)', FALSE),

-- 湿度相关配置
('humidity.min.threshold', '50.0', 'number', '最低湿度阈值(%)', TRUE),
('humidity.max.threshold', '80.0', 'number', '最高湿度阈值(%)', TRUE),
('soil.humidity.min.threshold', '60.0', 'number', '土壤湿度最低阈值(%)', FALSE),
('soil.humidity.max.threshold', '85.0', 'number', '土壤湿度最高阈值(%)', FALSE),

-- 光照相关配置
('light.min.threshold', '10000.0', 'number', '最低光照强度阈值(lux)', TRUE),
('light.max.threshold', '30000.0', 'number', '最高光照强度阈值(lux)', TRUE),
('light.daily.duration', '14', 'number', '每日光照时长(小时)', FALSE),

-- CO2相关配置
('co2.min.threshold', '300.0', 'number', '最低CO2浓度阈值(ppm)', TRUE),
('co2.max.threshold', '500.0', 'number', '最高CO2浓度阈值(ppm)', TRUE),

-- 系统配置
('system.data.retention.days', '365', 'number', '数据保留天数', TRUE),
('system.alert.email.enabled', 'true', 'boolean', '邮件报警开关', FALSE),
('system.alert.sms.enabled', 'false', 'boolean', '短信报警开关', FALSE),
('system.auto.control.enabled', 'true', 'boolean', '自动控制开关', FALSE),
('system.data.collection.interval', '60', 'number', '数据采集间隔(秒)', TRUE),

-- 设备配置
('device.heater.max.power', '100.0', 'number', '加热器最大功率(%)', TRUE),
('device.cooler.max.power', '100.0', 'number', '冷却器最大功率(%)', TRUE),
('device.fan.max.speed', '100.0', 'number', '风扇最大转速(%)', TRUE),
('device.light.max.intensity', '100.0', 'number', '补光灯最大强度(%)', TRUE),

-- 报警配置
('alert.temperature.critical.threshold', '35.0', 'number', '温度紧急报警阈值(°C)', TRUE),
('alert.humidity.critical.threshold', '90.0', 'number', '湿度紧急报警阈值(%)', TRUE),
('alert.repeat.interval.minutes', '5', 'number', '报警重复间隔(分钟)', TRUE),

-- 界面配置
('ui.refresh.interval', '30', 'number', '界面刷新间隔(秒)', FALSE),
('ui.chart.data.points', '24', 'number', '图表显示数据点数', FALSE),
('ui.theme.color', '#2E7D32', 'string', '主题颜色', FALSE);

-- 显示创建结果
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as environment_data_count FROM environment_data;
SELECT COUNT(*) as device_status_count FROM device_status;
SELECT COUNT(*) as alert_records_count FROM alert_records;
SELECT COUNT(*) as control_logs_count FROM control_logs;
SELECT COUNT(*) as system_config_count FROM system_config;