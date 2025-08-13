-- 温室数字化监控系统数据库表结构
-- 基于设计文档创建完整的数据库架构

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