package com.greenhouse.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.dto.AlertDTO;
import com.greenhouse.entity.AlertRecord;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.entity.SystemConfig;
import com.greenhouse.mapper.AlertMapper;
import com.greenhouse.mapper.SystemConfigMapper;
import com.greenhouse.service.AlertService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 报警管理服务实现类
 * 实现报警触发、处理、统计等功能
 */
@Service
@Transactional
public class AlertServiceImpl implements AlertService {

    private static final Logger logger = LoggerFactory.getLogger(AlertServiceImpl.class);

    @Autowired
    private AlertMapper alertMapper;

    @Autowired
    private SystemConfigMapper systemConfigMapper;

    // 默认阈值配置
    private static final Map<String, BigDecimal> DEFAULT_THRESHOLDS = new HashMap<>();
    static {
        // 温度阈值 (°C)
        DEFAULT_THRESHOLDS.put("temperature.min", new BigDecimal("10"));
        DEFAULT_THRESHOLDS.put("temperature.max", new BigDecimal("35"));
        DEFAULT_THRESHOLDS.put("temperature.critical.min", new BigDecimal("5"));
        DEFAULT_THRESHOLDS.put("temperature.critical.max", new BigDecimal("40"));
        
        // 湿度阈值 (%)
        DEFAULT_THRESHOLDS.put("humidity.min", new BigDecimal("30"));
        DEFAULT_THRESHOLDS.put("humidity.max", new BigDecimal("80"));
        DEFAULT_THRESHOLDS.put("humidity.critical.min", new BigDecimal("20"));
        DEFAULT_THRESHOLDS.put("humidity.critical.max", new BigDecimal("90"));
        
        // 光照强度阈值 (lux)
        DEFAULT_THRESHOLDS.put("light.min", new BigDecimal("1000"));
        DEFAULT_THRESHOLDS.put("light.max", new BigDecimal("50000"));
        DEFAULT_THRESHOLDS.put("light.critical.min", new BigDecimal("500"));
        DEFAULT_THRESHOLDS.put("light.critical.max", new BigDecimal("80000"));
        
        // 土壤湿度阈值 (%)
        DEFAULT_THRESHOLDS.put("soil_humidity.min", new BigDecimal("40"));
        DEFAULT_THRESHOLDS.put("soil_humidity.max", new BigDecimal("70"));
        DEFAULT_THRESHOLDS.put("soil_humidity.critical.min", new BigDecimal("30"));
        DEFAULT_THRESHOLDS.put("soil_humidity.critical.max", new BigDecimal("80"));
        
        // CO2浓度阈值 (ppm)
        DEFAULT_THRESHOLDS.put("co2.min", new BigDecimal("300"));
        DEFAULT_THRESHOLDS.put("co2.max", new BigDecimal("1500"));
        DEFAULT_THRESHOLDS.put("co2.critical.min", new BigDecimal("200"));
        DEFAULT_THRESHOLDS.put("co2.critical.max", new BigDecimal("2000"));
    }

    @Override
    public AlertDTO triggerEnvironmentAlert(AlertRecord.AlertType alertType, BigDecimal parameterValue, 
                                          BigDecimal thresholdValue, String message) {
        try {
            AlertRecord alertRecord = new AlertRecord();
            alertRecord.setAlertType(alertType);
            alertRecord.setMessage(message);
            alertRecord.setParameterValue(parameterValue);
            alertRecord.setThresholdValue(thresholdValue);
            alertRecord.setIsResolved(false);
            
            // 判断报警级别
            AlertRecord.Severity severity = determineSeverity(alertType, parameterValue, thresholdValue);
            alertRecord.setSeverity(severity);
            
            // 保存报警记录
            int result = alertMapper.insert(alertRecord);
            if (result > 0) {
                logger.info("触发环境报警: 类型={}, 参数值={}, 阈值={}, 级别={}", 
                    alertType, parameterValue, thresholdValue, severity);
                return new AlertDTO(alertRecord);
            }
        } catch (Exception e) {
            logger.error("触发环境报警失败", e);
        }
        return null;
    }

    @Override
    public AlertDTO triggerDeviceAlert(String deviceId, String message) {
        try {
            AlertRecord alertRecord = new AlertRecord();
            alertRecord.setAlertType(AlertRecord.AlertType.DEVICE_ERROR);
            alertRecord.setSeverity(AlertRecord.Severity.HIGH);
            alertRecord.setMessage(message);
            alertRecord.setDeviceId(deviceId);
            alertRecord.setIsResolved(false);
            
            int result = alertMapper.insert(alertRecord);
            if (result > 0) {
                logger.info("触发设备报警: 设备ID={}, 消息={}", deviceId, message);
                return new AlertDTO(alertRecord);
            }
        } catch (Exception e) {
            logger.error("触发设备报警失败", e);
        }
        return null;
    }

    @Override
    public AlertDTO triggerSystemAlert(String message) {
        try {
            AlertRecord alertRecord = new AlertRecord();
            alertRecord.setAlertType(AlertRecord.AlertType.SYSTEM_ERROR);
            alertRecord.setSeverity(AlertRecord.Severity.CRITICAL);
            alertRecord.setMessage(message);
            alertRecord.setIsResolved(false);
            
            int result = alertMapper.insert(alertRecord);
            if (result > 0) {
                logger.info("触发系统报警: 消息={}", message);
                return new AlertDTO(alertRecord);
            }
        } catch (Exception e) {
            logger.error("触发系统报警失败", e);
        }
        return null;
    }

    @Override
    public List<AlertDTO> checkAndTriggerEnvironmentAlerts(EnvironmentData environmentData) {
        List<AlertDTO> triggeredAlerts = new ArrayList<>();
        
        try {
            // 检查温度
            AlertDTO tempAlert = checkTemperature(environmentData.getTemperature());
            if (tempAlert != null) {
                triggeredAlerts.add(tempAlert);
            }
            
            // 检查湿度
            AlertDTO humidityAlert = checkHumidity(environmentData.getHumidity());
            if (humidityAlert != null) {
                triggeredAlerts.add(humidityAlert);
            }
            
            // 检查光照强度
            AlertDTO lightAlert = checkLightIntensity(environmentData.getLightIntensity());
            if (lightAlert != null) {
                triggeredAlerts.add(lightAlert);
            }
            
            // 检查土壤湿度
            AlertDTO soilHumidityAlert = checkSoilHumidity(environmentData.getSoilHumidity());
            if (soilHumidityAlert != null) {
                triggeredAlerts.add(soilHumidityAlert);
            }
            
            // 检查CO2浓度
            if (environmentData.getCo2Level() != null) {
                AlertDTO co2Alert = checkCo2Level(environmentData.getCo2Level());
                if (co2Alert != null) {
                    triggeredAlerts.add(co2Alert);
                }
            }
            
        } catch (Exception e) {
            logger.error("检查环境数据报警失败", e);
        }
        
        return triggeredAlerts;
    }

    @Override
    public boolean resolveAlert(Integer alertId) {
        try {
            int result = alertMapper.markAsResolved(alertId);
            if (result > 0) {
                logger.info("报警已解决: ID={}", alertId);
                return true;
            }
        } catch (Exception e) {
            logger.error("解决报警失败: ID={}", alertId, e);
        }
        return false;
    }

    @Override
    public boolean batchResolveAlerts(List<Integer> alertIds) {
        try {
            int result = alertMapper.batchMarkAsResolved(alertIds);
            if (result > 0) {
                logger.info("批量解决报警成功: 数量={}", result);
                return true;
            }
        } catch (Exception e) {
            logger.error("批量解决报警失败", e);
        }
        return false;
    }

    @Override
    public List<AlertDTO> getUnresolvedAlerts() {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectUnresolvedAlerts();
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("获取未解决报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AlertDTO> getHighPriorityUnresolvedAlerts() {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectHighPriorityUnresolved();
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("获取高优先级未解决报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public IPage<AlertDTO> getAlertPage(int pageNum, int pageSize, AlertRecord.AlertType alertType,
                                      AlertRecord.Severity severity, Boolean isResolved,
                                      LocalDateTime startTime, LocalDateTime endTime) {
        try {
            Page<AlertRecord> page = new Page<>(pageNum, pageSize);
            IPage<AlertRecord> alertPage = alertMapper.selectAlertPage(page, alertType, severity, 
                    isResolved, startTime, endTime);
            
            // 转换为DTO
            IPage<AlertDTO> dtoPage = new Page<>(pageNum, pageSize, alertPage.getTotal());
            List<AlertDTO> dtoList = alertPage.getRecords().stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
            dtoPage.setRecords(dtoList);
            
            return dtoPage;
        } catch (Exception e) {
            logger.error("分页查询报警失败", e);
            return new Page<>();
        }
    }

    @Override
    public List<AlertDTO> getAlertsByType(AlertRecord.AlertType alertType) {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectByAlertType(alertType);
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("根据类型查询报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AlertDTO> getAlertsBySeverity(AlertRecord.Severity severity) {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectBySeverity(severity);
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("根据严重程度查询报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AlertDTO> getAlertsByDeviceId(String deviceId) {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectByDeviceId(deviceId);
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("根据设备ID查询报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AlertDTO> getAlertsByTimeRange(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectByTimeRange(startTime, endTime);
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("根据时间范围查询报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<AlertDTO> getRecentAlerts(int limit) {
        try {
            List<AlertRecord> alertRecords = alertMapper.selectRecentAlerts(limit);
            return alertRecords.stream()
                    .map(AlertDTO::new)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            logger.error("获取最近报警失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public Map<String, Object> getAlertStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        Map<String, Object> statistics = new HashMap<>();
        
        try {
            // 总报警数量
            List<AlertRecord> allAlerts = alertMapper.selectByTimeRange(startTime, endTime);
            statistics.put("totalCount", allAlerts.size());
            
            // 未解决报警数量
            long unresolvedCount = allAlerts.stream()
                    .filter(alert -> !alert.getIsResolved())
                    .count();
            statistics.put("unresolvedCount", unresolvedCount);
            
            // 已解决报警数量
            statistics.put("resolvedCount", allAlerts.size() - unresolvedCount);
            
            // 各级别报警数量
            Map<String, Long> severityCount = allAlerts.stream()
                    .collect(Collectors.groupingBy(
                            alert -> alert.getSeverity().getCode(),
                            Collectors.counting()
                    ));
            statistics.put("severityCount", severityCount);
            
            // 各类型报警数量
            Map<String, Long> typeCount = allAlerts.stream()
                    .collect(Collectors.groupingBy(
                            alert -> alert.getAlertType().getCode(),
                            Collectors.counting()
                    ));
            statistics.put("typeCount", typeCount);
            
            // 平均解决时间（分钟）
            OptionalDouble avgResolutionTime = allAlerts.stream()
                    .filter(alert -> alert.getIsResolved() && alert.getResolvedAt() != null)
                    .mapToLong(alert -> ChronoUnit.MINUTES.between(alert.getCreatedAt(), alert.getResolvedAt()))
                    .average();
            statistics.put("avgResolutionTimeMinutes", avgResolutionTime.orElse(0.0));
            
        } catch (Exception e) {
            logger.error("获取报警统计失败", e);
        }
        
        return statistics;
    }

    @Override
    public List<Map<String, Object>> getAlertTypeStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return alertMapper.selectAlertTypeStatistics(startTime, endTime);
        } catch (Exception e) {
            logger.error("获取报警类型统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getSeverityStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return alertMapper.selectSeverityStatistics(startTime, endTime);
        } catch (Exception e) {
            logger.error("获取严重程度统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getDailyAlertStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return alertMapper.selectDailyAlertStatistics(startTime, endTime);
        } catch (Exception e) {
            logger.error("获取每日报警统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getDeviceAlertStatistics(LocalDateTime startTime, LocalDateTime endTime) {
        try {
            return alertMapper.selectDeviceAlertStatistics(startTime, endTime);
        } catch (Exception e) {
            logger.error("获取设备报警统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public AlertRecord.Severity determineSeverity(AlertRecord.AlertType alertType, BigDecimal parameterValue, 
                                                BigDecimal thresholdValue) {
        try {
            String parameterName = getParameterName(alertType);
            if (parameterName == null) {
                return AlertRecord.Severity.MEDIUM;
            }
            
            // 获取临界阈值
            BigDecimal criticalMin = getThreshold(parameterName + ".critical.min");
            BigDecimal criticalMax = getThreshold(parameterName + ".critical.max");
            BigDecimal normalMin = getThreshold(parameterName + ".min");
            BigDecimal normalMax = getThreshold(parameterName + ".max");
            
            // 判断严重程度
            if (parameterValue.compareTo(criticalMin) < 0 || parameterValue.compareTo(criticalMax) > 0) {
                return AlertRecord.Severity.CRITICAL;
            } else if (parameterValue.compareTo(normalMin) < 0 || parameterValue.compareTo(normalMax) > 0) {
                return AlertRecord.Severity.HIGH;
            } else {
                // 接近阈值的情况
                BigDecimal range = normalMax.subtract(normalMin);
                BigDecimal tolerance = range.multiply(new BigDecimal("0.1")); // 10%容差
                
                if (parameterValue.compareTo(normalMin.add(tolerance)) < 0 || 
                    parameterValue.compareTo(normalMax.subtract(tolerance)) > 0) {
                    return AlertRecord.Severity.MEDIUM;
                } else {
                    return AlertRecord.Severity.LOW;
                }
            }
        } catch (Exception e) {
            logger.error("判断报警级别失败", e);
            return AlertRecord.Severity.MEDIUM;
        }
    }

    @Override
    public boolean shouldEscalateAlert(Integer alertId) {
        try {
            AlertRecord alertRecord = alertMapper.selectById(alertId);
            if (alertRecord == null || alertRecord.getIsResolved()) {
                return false;
            }
            
            // 检查报警持续时间
            long minutesSinceCreated = ChronoUnit.MINUTES.between(alertRecord.getCreatedAt(), LocalDateTime.now());
            
            // 根据当前级别决定升级时间
            switch (alertRecord.getSeverity()) {
                case LOW:
                    return minutesSinceCreated > 60; // 1小时后升级
                case MEDIUM:
                    return minutesSinceCreated > 30; // 30分钟后升级
                case HIGH:
                    return minutesSinceCreated > 15; // 15分钟后升级
                case CRITICAL:
                    return false; // 已经是最高级别
                default:
                    return false;
            }
        } catch (Exception e) {
            logger.error("检查报警升级失败", e);
            return false;
        }
    }

    @Override
    public boolean escalateAlert(Integer alertId) {
        try {
            AlertRecord alertRecord = alertMapper.selectById(alertId);
            if (alertRecord == null || alertRecord.getIsResolved()) {
                return false;
            }
            
            // 升级严重程度
            AlertRecord.Severity newSeverity = getNextSeverityLevel(alertRecord.getSeverity());
            if (newSeverity != alertRecord.getSeverity()) {
                alertRecord.setSeverity(newSeverity);
                alertRecord.setMessage(alertRecord.getMessage() + " [已升级]");
                
                int result = alertMapper.updateById(alertRecord);
                if (result > 0) {
                    logger.info("报警已升级: ID={}, 新级别={}", alertId, newSeverity);
                    return true;
                }
            }
        } catch (Exception e) {
            logger.error("升级报警失败", e);
        }
        return false;
    }

    @Override
    public long getUnresolvedAlertCount() {
        try {
            return alertMapper.countUnresolvedAlerts();
        } catch (Exception e) {
            logger.error("获取未解决报警数量失败", e);
            return 0;
        }
    }

    @Override
    public long getUnresolvedAlertCountBySeverity(AlertRecord.Severity severity) {
        try {
            return alertMapper.countUnresolvedBySeverity(severity);
        } catch (Exception e) {
            logger.error("获取指定级别未解决报警数量失败", e);
            return 0;
        }
    }

    @Override
    public long getTodayAlertCount() {
        try {
            return alertMapper.countTodayAlerts();
        } catch (Exception e) {
            logger.error("获取今日报警数量失败", e);
            return 0;
        }
    }

    @Override
    public int cleanResolvedAlerts(LocalDateTime beforeTime) {
        try {
            int result = alertMapper.deleteResolvedBeforeTime(beforeTime);
            logger.info("清理历史报警记录: 数量={}", result);
            return result;
        } catch (Exception e) {
            logger.error("清理历史报警记录失败", e);
            return 0;
        }
    }

    @Override
    public boolean validateAlertData(AlertRecord alertRecord) {
        if (alertRecord == null) {
            return false;
        }
        
        // 检查必填字段
        if (alertRecord.getAlertType() == null || 
            alertRecord.getSeverity() == null || 
            alertRecord.getMessage() == null || 
            alertRecord.getMessage().trim().isEmpty()) {
            return false;
        }
        
        // 检查参数值的合理性
        if (alertRecord.getParameterValue() != null && alertRecord.getParameterValue().compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }
        
        return true;
    }

    // 私有辅助方法
    
    private AlertDTO checkTemperature(BigDecimal temperature) {
        BigDecimal minTemp = getThreshold("temperature.min");
        BigDecimal maxTemp = getThreshold("temperature.max");
        
        if (temperature.compareTo(minTemp) < 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, temperature, minTemp,
                    String.format("温度过低: %.1f°C (最低阈值: %.1f°C)", temperature, minTemp));
        } else if (temperature.compareTo(maxTemp) > 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, temperature, maxTemp,
                    String.format("温度过高: %.1f°C (最高阈值: %.1f°C)", temperature, maxTemp));
        }
        return null;
    }
    
    private AlertDTO checkHumidity(BigDecimal humidity) {
        BigDecimal minHumidity = getThreshold("humidity.min");
        BigDecimal maxHumidity = getThreshold("humidity.max");
        
        if (humidity.compareTo(minHumidity) < 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, humidity, minHumidity,
                    String.format("湿度过低: %.1f%% (最低阈值: %.1f%%)", humidity, minHumidity));
        } else if (humidity.compareTo(maxHumidity) > 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, humidity, maxHumidity,
                    String.format("湿度过高: %.1f%% (最高阈值: %.1f%%)", humidity, maxHumidity));
        }
        return null;
    }
    
    private AlertDTO checkLightIntensity(BigDecimal lightIntensity) {
        BigDecimal minLight = getThreshold("light.min");
        BigDecimal maxLight = getThreshold("light.max");
        
        if (lightIntensity.compareTo(minLight) < 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.LIGHT, lightIntensity, minLight,
                    String.format("光照不足: %.0f lux (最低阈值: %.0f lux)", lightIntensity, minLight));
        } else if (lightIntensity.compareTo(maxLight) > 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.LIGHT, lightIntensity, maxLight,
                    String.format("光照过强: %.0f lux (最高阈值: %.0f lux)", lightIntensity, maxLight));
        }
        return null;
    }
    
    private AlertDTO checkSoilHumidity(BigDecimal soilHumidity) {
        BigDecimal minSoilHumidity = getThreshold("soil_humidity.min");
        BigDecimal maxSoilHumidity = getThreshold("soil_humidity.max");
        
        if (soilHumidity.compareTo(minSoilHumidity) < 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, soilHumidity, minSoilHumidity,
                    String.format("土壤湿度过低: %.1f%% (最低阈值: %.1f%%)", soilHumidity, minSoilHumidity));
        } else if (soilHumidity.compareTo(maxSoilHumidity) > 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, soilHumidity, maxSoilHumidity,
                    String.format("土壤湿度过高: %.1f%% (最高阈值: %.1f%%)", soilHumidity, maxSoilHumidity));
        }
        return null;
    }
    
    private AlertDTO checkCo2Level(BigDecimal co2Level) {
        BigDecimal minCo2 = getThreshold("co2.min");
        BigDecimal maxCo2 = getThreshold("co2.max");
        
        if (co2Level.compareTo(minCo2) < 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.SYSTEM_ERROR, co2Level, minCo2,
                    String.format("CO2浓度过低: %.0f ppm (最低阈值: %.0f ppm)", co2Level, minCo2));
        } else if (co2Level.compareTo(maxCo2) > 0) {
            return triggerEnvironmentAlert(AlertRecord.AlertType.SYSTEM_ERROR, co2Level, maxCo2,
                    String.format("CO2浓度过高: %.0f ppm (最高阈值: %.0f ppm)", co2Level, maxCo2));
        }
        return null;
    }
    
    private BigDecimal getThreshold(String key) {
        try {
            String value = systemConfigMapper.selectValueByKey(key);
            if (value != null) {
                return new BigDecimal(value);
            }
        } catch (Exception e) {
            logger.warn("获取阈值配置失败: {}", key, e);
        }
        
        // 返回默认值
        return DEFAULT_THRESHOLDS.getOrDefault(key, BigDecimal.ZERO);
    }
    
    private String getParameterName(AlertRecord.AlertType alertType) {
        switch (alertType) {
            case TEMPERATURE:
                return "temperature";
            case HUMIDITY:
                return "humidity";
            case LIGHT:
                return "light";
            default:
                return null;
        }
    }
    
    private AlertRecord.Severity getNextSeverityLevel(AlertRecord.Severity currentSeverity) {
        switch (currentSeverity) {
            case LOW:
                return AlertRecord.Severity.MEDIUM;
            case MEDIUM:
                return AlertRecord.Severity.HIGH;
            case HIGH:
                return AlertRecord.Severity.CRITICAL;
            case CRITICAL:
            default:
                return currentSeverity;
        }
    }
}