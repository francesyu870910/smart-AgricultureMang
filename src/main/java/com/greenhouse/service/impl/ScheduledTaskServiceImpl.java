package com.greenhouse.service.impl;

import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.entity.AlertRecord;
import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicLong;

/**
 * 定时任务服务实现类
 * 负责执行数据模拟、设备控制和报警检测的定时任务
 */
@Service
public class ScheduledTaskServiceImpl implements ScheduledTaskService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTaskServiceImpl.class);

    @Autowired
    private DataSimulationService dataSimulationService;

    @Autowired
    private DeviceSimulationService deviceSimulationService;

    @Autowired
    private EnvironmentService environmentService;

    @Autowired
    private AlertService alertService;

    // 任务运行状态控制
    private final AtomicBoolean scheduledTasksEnabled = new AtomicBoolean(true);

    // 任务执行统计
    private final AtomicLong dataGenerationCount = new AtomicLong(0);
    private final AtomicLong deviceUpdateCount = new AtomicLong(0);
    private final AtomicLong alertDetectionCount = new AtomicLong(0);
    private final AtomicLong automaticControlCount = new AtomicLong(0);

    // 最后执行时间记录
    private volatile LocalDateTime lastDataGenerationTime;
    private volatile LocalDateTime lastDeviceUpdateTime;
    private volatile LocalDateTime lastAlertDetectionTime;
    private volatile LocalDateTime lastAutomaticControlTime;

    // 默认温室ID
    private static final String DEFAULT_GREENHOUSE_ID = "GH001";

    /**
     * 环境数据生成定时任务
     * 每30秒执行一次，生成模拟的环境数据
     */
    @Scheduled(fixedRate = 30000) // 30秒
    public void generateEnvironmentDataTask() {
        if (!scheduledTasksEnabled.get()) {
            return;
        }

        try {
            logger.debug("Executing environment data generation task...");
            
            // 生成模拟环境数据
            EnvironmentData environmentData = dataSimulationService.generateSimulatedEnvironmentData(DEFAULT_GREENHOUSE_ID);
            
            if (environmentData != null) {
                // 保存环境数据到数据库
                environmentService.saveEnvironmentData(environmentData);
                
                dataGenerationCount.incrementAndGet();
                lastDataGenerationTime = LocalDateTime.now();
                
                logger.debug("Generated and saved environment data: temp={}, humidity={}, light={}, soil={}, co2={}",
                        environmentData.getTemperature(), environmentData.getHumidity(),
                        environmentData.getLightIntensity(), environmentData.getSoilHumidity(),
                        environmentData.getCo2Level());
            } else {
                logger.warn("Failed to generate environment data");
            }
            
        } catch (Exception e) {
            logger.error("Error in environment data generation task: {}", e.getMessage(), e);
        }
    }

    /**
     * 设备状态更新定时任务
     * 每1分钟执行一次，更新所有设备的状态
     */
    @Scheduled(fixedRate = 60000) // 1分钟
    public void updateDeviceStatusTask() {
        if (!scheduledTasksEnabled.get()) {
            return;
        }

        try {
            logger.debug("Executing device status update task...");
            
            // 更新所有设备状态
            int updatedDevices = deviceSimulationService.simulateAllDevicesStatusUpdate();
            
            deviceUpdateCount.incrementAndGet();
            lastDeviceUpdateTime = LocalDateTime.now();
            
            logger.debug("Updated {} device statuses", updatedDevices);
            
        } catch (Exception e) {
            logger.error("Error in device status update task: {}", e.getMessage(), e);
        }
    }

    /**
     * 自动化控制定时任务
     * 每2分钟执行一次，根据环境数据自动控制设备
     */
    @Scheduled(fixedRate = 120000) // 2分钟
    public void automaticControlTask() {
        if (!scheduledTasksEnabled.get()) {
            return;
        }

        try {
            logger.debug("Executing automatic control task...");
            
            // 获取最新的环境数据
            EnvironmentDTO latestDataDTO = environmentService.getCurrentEnvironmentData(DEFAULT_GREENHOUSE_ID);
            EnvironmentData latestData = convertDTOToEntity(latestDataDTO);
            
            if (latestData != null) {
                // 根据环境数据自动控制设备
                Map<String, Object> controlResults = deviceSimulationService.autoControlDevicesBasedOnEnvironment(latestData);
                
                automaticControlCount.incrementAndGet();
                lastAutomaticControlTime = LocalDateTime.now();
                
                logger.debug("Automatic control executed with results: {}", controlResults);
            } else {
                logger.warn("No environment data available for automatic control");
            }
            
        } catch (Exception e) {
            logger.error("Error in automatic control task: {}", e.getMessage(), e);
        }
    }

    /**
     * 报警检测定时任务
     * 每1分钟执行一次，检测环境参数是否超出阈值并触发报警
     */
    @Scheduled(fixedRate = 60000) // 1分钟
    public void alertDetectionTask() {
        if (!scheduledTasksEnabled.get()) {
            return;
        }

        try {
            logger.debug("Executing alert detection task...");
            
            // 获取最新的环境数据
            EnvironmentDTO latestDataDTO = environmentService.getCurrentEnvironmentData(DEFAULT_GREENHOUSE_ID);
            EnvironmentData latestData = convertDTOToEntity(latestDataDTO);
            
            if (latestData != null) {
                // 检测温度报警
                checkTemperatureAlert(latestData);
                
                // 检测湿度报警
                checkHumidityAlert(latestData);
                
                // 检测光照报警
                checkLightIntensityAlert(latestData);
                
                // 检测土壤湿度报警
                checkSoilHumidityAlert(latestData);
                
                // 检测CO2浓度报警
                checkCo2LevelAlert(latestData);
                
                alertDetectionCount.incrementAndGet();
                lastAlertDetectionTime = LocalDateTime.now();
                
            } else {
                logger.warn("No environment data available for alert detection");
            }
            
        } catch (Exception e) {
            logger.error("Error in alert detection task: {}", e.getMessage(), e);
        }
    }

    /**
     * 检测温度报警
     */
    private void checkTemperatureAlert(EnvironmentData data) {
        if (data.getTemperature() == null) return;
        
        double temperature = data.getTemperature().doubleValue();
        
        try {
            if (temperature < 10.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, 
                        BigDecimal.valueOf(temperature), BigDecimal.valueOf(10.0),
                        String.format("温度过低警报：当前温度%.1f°C，低于安全阈值10°C", temperature));
                logger.warn("Critical low temperature alert: {}°C", temperature);
                
            } else if (temperature > 35.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, 
                        BigDecimal.valueOf(temperature), BigDecimal.valueOf(35.0),
                        String.format("温度过高警报：当前温度%.1f°C，高于安全阈值35°C", temperature));
                logger.warn("Critical high temperature alert: {}°C", temperature);
                
            } else if (temperature < 15.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, 
                        BigDecimal.valueOf(temperature), BigDecimal.valueOf(15.0),
                        String.format("温度偏低警告：当前温度%.1f°C，低于推荐阈值15°C", temperature));
                logger.info("High temperature alert: {}°C", temperature);
                
            } else if (temperature > 30.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.TEMPERATURE, 
                        BigDecimal.valueOf(temperature), BigDecimal.valueOf(30.0),
                        String.format("温度偏高警告：当前温度%.1f°C，高于推荐阈值30°C", temperature));
                logger.info("High temperature alert: {}°C", temperature);
            }
        } catch (Exception e) {
            logger.error("Error checking temperature alert: {}", e.getMessage());
        }
    }

    /**
     * 检测湿度报警
     */
    private void checkHumidityAlert(EnvironmentData data) {
        if (data.getHumidity() == null) return;
        
        double humidity = data.getHumidity().doubleValue();
        
        try {
            if (humidity < 30.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, 
                        BigDecimal.valueOf(humidity), BigDecimal.valueOf(30.0),
                        String.format("湿度过低警告：当前湿度%.1f%%，低于推荐阈值30%%", humidity));
                logger.info("Low humidity alert: {}%", humidity);
                
            } else if (humidity > 90.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, 
                        BigDecimal.valueOf(humidity), BigDecimal.valueOf(90.0),
                        String.format("湿度过高警告：当前湿度%.1f%%，高于推荐阈值90%%", humidity));
                logger.info("High humidity alert: {}%", humidity);
            }
        } catch (Exception e) {
            logger.error("Error checking humidity alert: {}", e.getMessage());
        }
    }

    /**
     * 检测光照强度报警
     */
    private void checkLightIntensityAlert(EnvironmentData data) {
        if (data.getLightIntensity() == null) return;
        
        double lightIntensity = data.getLightIntensity().doubleValue();
        int hour = LocalDateTime.now().getHour();
        
        try {
            // 白天时间检测光照不足
            if (hour >= 8 && hour <= 16) {
                if (lightIntensity < 5000.0) {
                    alertService.triggerEnvironmentAlert(AlertRecord.AlertType.LIGHT, 
                            BigDecimal.valueOf(lightIntensity), BigDecimal.valueOf(5000.0),
                            String.format("白天光照不足警告：当前光照强度%.0f lux，低于推荐阈值5000 lux", lightIntensity));
                    logger.info("Low light intensity alert during daytime: {} lux", lightIntensity);
                }
            }
        } catch (Exception e) {
            logger.error("Error checking light intensity alert: {}", e.getMessage());
        }
    }

    /**
     * 检测土壤湿度报警
     */
    private void checkSoilHumidityAlert(EnvironmentData data) {
        if (data.getSoilHumidity() == null) return;
        
        double soilHumidity = data.getSoilHumidity().doubleValue();
        
        try {
            if (soilHumidity < 25.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, 
                        BigDecimal.valueOf(soilHumidity), BigDecimal.valueOf(25.0),
                        String.format("土壤湿度过低警告：当前土壤湿度%.1f%%，低于推荐阈值25%%", soilHumidity));
                logger.info("Low soil humidity alert: {}%", soilHumidity);
                
            } else if (soilHumidity > 85.0) {
                alertService.triggerEnvironmentAlert(AlertRecord.AlertType.HUMIDITY, 
                        BigDecimal.valueOf(soilHumidity), BigDecimal.valueOf(85.0),
                        String.format("土壤湿度过高警告：当前土壤湿度%.1f%%，高于推荐阈值85%%", soilHumidity));
                logger.info("High soil humidity alert: {}%", soilHumidity);
            }
        } catch (Exception e) {
            logger.error("Error checking soil humidity alert: {}", e.getMessage());
        }
    }

    /**
     * 检测CO2浓度报警
     */
    private void checkCo2LevelAlert(EnvironmentData data) {
        if (data.getCo2Level() == null) return;
        
        double co2Level = data.getCo2Level().doubleValue();
        
        try {
            if (co2Level > 1500.0) {
                alertService.triggerSystemAlert(
                        String.format("CO2浓度过高警告：当前CO2浓度%.0f ppm，高于推荐阈值1500 ppm", co2Level));
                logger.info("High CO2 level alert: {} ppm", co2Level);
                
            } else if (co2Level < 300.0) {
                alertService.triggerSystemAlert(
                        String.format("CO2浓度过低警告：当前CO2浓度%.0f ppm，低于推荐阈值300 ppm", co2Level));
                logger.info("Low CO2 level alert: {} ppm", co2Level);
            }
        } catch (Exception e) {
            logger.error("Error checking CO2 level alert: {}", e.getMessage());
        }
    }

    /**
     * 设备故障检测定时任务
     * 每5分钟执行一次，检测设备故障并生成报警
     */
    @Scheduled(fixedRate = 300000) // 5分钟
    public void deviceFailureDetectionTask() {
        if (!scheduledTasksEnabled.get()) {
            return;
        }

        try {
            logger.debug("Executing device failure detection task...");
            
            // 获取所有设备状态
            List<DeviceStatus> devices = deviceSimulationService.getAllSimulatedDevices();
            
            for (DeviceStatus device : devices) {
                if ("error".equals(device.getStatus())) {
                    // 为故障设备创建报警
                    alertService.triggerDeviceAlert(device.getDeviceId(),
                            String.format("设备故障报警：设备 %s (%s) 发生故障，请及时维修", 
                                    device.getDeviceName(), device.getDeviceId()));
                    
                    logger.warn("Device failure detected: {} ({})", device.getDeviceName(), device.getDeviceId());
                }
            }
            
        } catch (Exception e) {
            logger.error("Error in device failure detection task: {}", e.getMessage(), e);
        }
    }

    @Override
    public boolean startAllScheduledTasks() {
        scheduledTasksEnabled.set(true);
        
        // 启动设备自动化控制
        deviceSimulationService.startAutomaticControl();
        
        logger.info("All scheduled tasks started");
        return true;
    }

    @Override
    public boolean stopAllScheduledTasks() {
        scheduledTasksEnabled.set(false);
        
        // 停止设备自动化控制
        deviceSimulationService.stopAutomaticControl();
        
        logger.info("All scheduled tasks stopped");
        return true;
    }

    @Override
    public boolean isScheduledTasksRunning() {
        return scheduledTasksEnabled.get();
    }

    @Override
    public boolean triggerEnvironmentDataGeneration() {
        try {
            generateEnvironmentDataTask();
            logger.info("Manually triggered environment data generation");
            return true;
        } catch (Exception e) {
            logger.error("Failed to trigger environment data generation: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean triggerDeviceStatusUpdate() {
        try {
            updateDeviceStatusTask();
            logger.info("Manually triggered device status update");
            return true;
        } catch (Exception e) {
            logger.error("Failed to trigger device status update: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean triggerAlertDetection() {
        try {
            alertDetectionTask();
            logger.info("Manually triggered alert detection");
            return true;
        } catch (Exception e) {
            logger.error("Failed to trigger alert detection: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean triggerAutomaticControl() {
        try {
            automaticControlTask();
            logger.info("Manually triggered automatic control");
            return true;
        } catch (Exception e) {
            logger.error("Failed to trigger automatic control: {}", e.getMessage(), e);
            return false;
        }
    }

    @Override
    public Object getTaskExecutionStatistics() {
        Map<String, Object> statistics = new HashMap<>();
        
        statistics.put("scheduledTasksEnabled", scheduledTasksEnabled.get());
        statistics.put("automaticControlEnabled", deviceSimulationService.isAutomaticControlRunning());
        
        // 执行次数统计
        Map<String, Long> executionCounts = new HashMap<>();
        executionCounts.put("dataGeneration", dataGenerationCount.get());
        executionCounts.put("deviceUpdate", deviceUpdateCount.get());
        executionCounts.put("alertDetection", alertDetectionCount.get());
        executionCounts.put("automaticControl", automaticControlCount.get());
        statistics.put("executionCounts", executionCounts);
        
        // 最后执行时间
        Map<String, LocalDateTime> lastExecutionTimes = new HashMap<>();
        lastExecutionTimes.put("dataGeneration", lastDataGenerationTime);
        lastExecutionTimes.put("deviceUpdate", lastDeviceUpdateTime);
        lastExecutionTimes.put("alertDetection", lastAlertDetectionTime);
        lastExecutionTimes.put("automaticControl", lastAutomaticControlTime);
        statistics.put("lastExecutionTimes", lastExecutionTimes);
        
        statistics.put("currentTime", LocalDateTime.now());
        
        return statistics;
    }

    /**
     * 将EnvironmentDTO转换为EnvironmentData实体
     */
    private EnvironmentData convertDTOToEntity(EnvironmentDTO dto) {
        if (dto == null) {
            return null;
        }
        
        EnvironmentData entity = new EnvironmentData();
        entity.setId(dto.getId());
        entity.setGreenhouseId(dto.getGreenhouseId());
        entity.setTemperature(dto.getTemperature());
        entity.setHumidity(dto.getHumidity());
        entity.setLightIntensity(dto.getLightIntensity());
        entity.setSoilHumidity(dto.getSoilHumidity());
        entity.setCo2Level(dto.getCo2Level());
        entity.setRecordedAt(dto.getRecordedAt());
        
        return entity;
    }
}