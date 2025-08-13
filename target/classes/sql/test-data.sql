-- 温室数字化监控系统测试数据
-- 插入初始化测试数据用于系统演示

-- 使用数据库
USE greenhouse_db;

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