package com.greenhouse.service.impl;

import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.service.DeviceService;
import com.greenhouse.service.DeviceSimulationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 设备模拟服务实现类
 * 提供设备状态模拟和自动化控制逻辑
 */
@Service
public class DeviceSimulationServiceImpl implements DeviceSimulationService {

    private static final Logger logger = LoggerFactory.getLogger(DeviceSimulationServiceImpl.class);

    @Autowired
    private DeviceService deviceService;

    // 自动化控制运行状态
    private volatile boolean automaticControlRunning = false;

    // 控制阈值配置
    private final Map<String, ControlThreshold> controlThresholds = new HashMap<>();

    // 设备运行状态缓存
    private final Map<String, DeviceRunningState> deviceStates = new ConcurrentHashMap<>();

    // 随机数生成器
    private final Random random = new Random();

    /**
     * 控制阈值类
     */
    private static class ControlThreshold {
        double minThreshold;
        double maxThreshold;
        
        ControlThreshold(double minThreshold, double maxThreshold) {
            this.minThreshold = minThreshold;
            this.maxThreshold = maxThreshold;
        }
    }

    /**
     * 设备运行状态类
     */
    private static class DeviceRunningState {
        boolean isRunning;
        double currentPowerLevel;
        LocalDateTime lastUpdateTime;
        int continuousRunTime; // 连续运行时间（分钟）
        
        DeviceRunningState() {
            this.isRunning = false;
            this.currentPowerLevel = 0.0;
            this.lastUpdateTime = LocalDateTime.now();
            this.continuousRunTime = 0;
        }
    }

    public DeviceSimulationServiceImpl() {
        initializeControlThresholds();
    }

    /**
     * 初始化控制阈值
     */
    private void initializeControlThresholds() {
        // 温度控制阈值：18-28°C
        controlThresholds.put("temperature", new ControlThreshold(18.0, 28.0));
        
        // 湿度控制阈值：50-80%
        controlThresholds.put("humidity", new ControlThreshold(50.0, 80.0));
        
        // 光照控制阈值：10000-50000lux
        controlThresholds.put("lightIntensity", new ControlThreshold(10000.0, 50000.0));
        
        // 土壤湿度控制阈值：40-70%
        controlThresholds.put("soilHumidity", new ControlThreshold(40.0, 70.0));
        
        // CO2浓度控制阈值：400-1000ppm
        controlThresholds.put("co2Level", new ControlThreshold(400.0, 1000.0));
    }

    @Override
    public boolean initializeSimulatedDevices() {
        try {
            logger.info("Initializing simulated devices...");
            
            // 创建模拟设备列表
            List<DeviceStatus> simulatedDevices = createSimulatedDeviceList();
            
            // 保存设备到数据库
            for (DeviceStatus device : simulatedDevices) {
                try {
                    ((DeviceServiceImpl) deviceService).saveOrUpdateDevice(device);
                    // 初始化设备运行状态
                    deviceStates.put(device.getDeviceId(), new DeviceRunningState());
                    logger.debug("Initialized simulated device: {}", device.getDeviceId());
                } catch (Exception e) {
                    logger.error("Failed to initialize device {}: {}", device.getDeviceId(), e.getMessage());
                }
            }
            
            logger.info("Successfully initialized {} simulated devices", simulatedDevices.size());
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to initialize simulated devices: {}", e.getMessage(), e);
            return false;
        }
    }

    /**
     * 创建模拟设备列表
     */
    private List<DeviceStatus> createSimulatedDeviceList() {
        List<DeviceStatus> devices = new ArrayList<>();
        
        // 加热器
        devices.add(createDevice("HEATER_001", "主加热器", "heater"));
        devices.add(createDevice("HEATER_002", "辅助加热器", "heater"));
        
        // 冷却器
        devices.add(createDevice("COOLER_001", "主冷却器", "cooler"));
        
        // 加湿器
        devices.add(createDevice("HUMIDIFIER_001", "加湿器", "humidifier"));
        
        // 除湿器
        devices.add(createDevice("DEHUMIDIFIER_001", "除湿器", "dehumidifier"));
        
        // 风扇
        devices.add(createDevice("FAN_001", "排风扇1", "fan"));
        devices.add(createDevice("FAN_002", "排风扇2", "fan"));
        devices.add(createDevice("FAN_003", "循环风扇", "fan"));
        
        // 补光灯
        devices.add(createDevice("LIGHT_001", "LED补光灯1", "light"));
        devices.add(createDevice("LIGHT_002", "LED补光灯2", "light"));
        
        // 灌溉系统
        devices.add(createDevice("IRRIGATION_001", "滴灌系统", "irrigation"));
        devices.add(createDevice("IRRIGATION_002", "喷淋系统", "irrigation"));
        
        return devices;
    }

    /**
     * 创建设备对象
     */
    private DeviceStatus createDevice(String deviceId, String deviceName, String deviceType) {
        DeviceStatus device = new DeviceStatus();
        device.setDeviceId(deviceId);
        device.setDeviceName(deviceName);
        device.setDeviceType(DeviceStatus.DeviceType.valueOf(deviceType));
        device.setStatus(DeviceStatus.DeviceStatusEnum.online);
        device.setIsRunning(false);
        device.setPowerLevel(BigDecimal.ZERO);
        device.setLastMaintenance(LocalDate.now().minusDays(random.nextInt(30)));
        device.setCreatedAt(LocalDateTime.now());
        device.setUpdatedAt(LocalDateTime.now());
        
        return device;
    }

    @Override
    public boolean simulateDeviceStatusUpdate(String deviceId) {
        try {
            DeviceStatus device = deviceService.getDeviceById(deviceId);
            if (device == null) {
                logger.warn("Device not found: {}", deviceId);
                return false;
            }

            DeviceRunningState state = deviceStates.get(deviceId);
            if (state == null) {
                state = new DeviceRunningState();
                deviceStates.put(deviceId, state);
            }

            // 模拟设备状态变化
            simulateDeviceStateChange(device, state);
            
            // 更新设备状态到数据库
            ((DeviceServiceImpl) deviceService).saveOrUpdateDevice(device);
            
            logger.debug("Updated simulated device status: {} - running: {}, power: {}%", 
                    deviceId, device.getIsRunning(), device.getPowerLevel());
            
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to simulate device status update for {}: {}", deviceId, e.getMessage(), e);
            return false;
        }
    }

    /**
     * 模拟设备状态变化
     */
    private void simulateDeviceStateChange(DeviceStatus device, DeviceRunningState state) {
        // 更新连续运行时间
        if (state.isRunning) {
            state.continuousRunTime++;
        } else {
            state.continuousRunTime = 0;
        }

        // 模拟设备功率变化
        if (state.isRunning) {
            // 运行中的设备功率在80-100%之间波动
            double powerChange = (random.nextGaussian() * 5);
            state.currentPowerLevel = Math.max(80, Math.min(100, state.currentPowerLevel + powerChange));
        } else {
            state.currentPowerLevel = 0;
        }

        // 偶尔模拟设备故障
        if (random.nextDouble() < 0.001) { // 0.1%概率
            device.setStatus(DeviceStatus.DeviceStatusEnum.error);
            state.isRunning = false;
            state.currentPowerLevel = 0;
            logger.warn("Simulated device failure for: {}", device.getDeviceId());
        } else if (device.getStatus() == DeviceStatus.DeviceStatusEnum.error && random.nextDouble() < 0.1) {
            // 10%概率从故障中恢复
            device.setStatus(DeviceStatus.DeviceStatusEnum.online);
            logger.info("Simulated device recovery for: {}", device.getDeviceId());
        }

        // 更新设备对象
        device.setIsRunning(state.isRunning);
        device.setPowerLevel(BigDecimal.valueOf(state.currentPowerLevel).setScale(2, BigDecimal.ROUND_HALF_UP));
        device.setUpdatedAt(LocalDateTime.now());
        
        state.lastUpdateTime = LocalDateTime.now();
    }

    @Override
    public int simulateAllDevicesStatusUpdate() {
        try {
            List<DeviceStatus> allDevices = deviceService.getAllDevices();
            int updatedCount = 0;
            
            for (DeviceStatus device : allDevices) {
                if (simulateDeviceStatusUpdate(device.getDeviceId())) {
                    updatedCount++;
                }
            }
            
            logger.debug("Updated {} device statuses", updatedCount);
            return updatedCount;
            
        } catch (Exception e) {
            logger.error("Failed to simulate all devices status update: {}", e.getMessage(), e);
            return 0;
        }
    }

    @Override
    public Map<String, Object> autoControlDevicesBasedOnEnvironment(EnvironmentData environmentData) {
        Map<String, Object> controlResults = new HashMap<>();
        
        if (!automaticControlRunning) {
            controlResults.put("status", "automatic_control_disabled");
            return controlResults;
        }

        try {
            logger.debug("Auto controlling devices based on environment data: temp={}, humidity={}, light={}, soil={}, co2={}",
                    environmentData.getTemperature(), environmentData.getHumidity(), 
                    environmentData.getLightIntensity(), environmentData.getSoilHumidity(), 
                    environmentData.getCo2Level());

            // 温度控制
            controlResults.putAll(controlTemperature(environmentData.getTemperature()));
            
            // 湿度控制
            controlResults.putAll(controlHumidity(environmentData.getHumidity()));
            
            // 光照控制
            controlResults.putAll(controlLighting(environmentData.getLightIntensity()));
            
            // 土壤湿度控制
            controlResults.putAll(controlSoilHumidity(environmentData.getSoilHumidity()));
            
            // CO2浓度控制
            controlResults.putAll(controlCo2Level(environmentData.getCo2Level()));
            
            controlResults.put("status", "success");
            controlResults.put("timestamp", LocalDateTime.now());
            
        } catch (Exception e) {
            logger.error("Failed to auto control devices: {}", e.getMessage(), e);
            controlResults.put("status", "error");
            controlResults.put("error", e.getMessage());
        }
        
        return controlResults;
    }

    /**
     * 温度控制逻辑
     */
    private Map<String, Object> controlTemperature(BigDecimal temperature) {
        Map<String, Object> results = new HashMap<>();
        
        if (temperature == null) {
            return results;
        }
        
        double temp = temperature.doubleValue();
        ControlThreshold threshold = controlThresholds.get("temperature");
        
        try {
            if (temp < threshold.minThreshold) {
                // 温度过低，启动加热器
                controlDevicesByType("heater", true, 80 + random.nextInt(20));
                controlDevicesByType("cooler", false, 0);
                results.put("temperature_action", "heating_started");
                logger.info("Temperature too low ({}°C), started heating", temp);
                
            } else if (temp > threshold.maxThreshold) {
                // 温度过高，启动冷却器
                controlDevicesByType("cooler", true, 70 + random.nextInt(30));
                controlDevicesByType("heater", false, 0);
                results.put("temperature_action", "cooling_started");
                logger.info("Temperature too high ({}°C), started cooling", temp);
                
            } else {
                // 温度正常，关闭温控设备
                controlDevicesByType("heater", false, 0);
                controlDevicesByType("cooler", false, 0);
                results.put("temperature_action", "temperature_normal");
            }
        } catch (Exception e) {
            logger.error("Failed to control temperature: {}", e.getMessage());
            results.put("temperature_error", e.getMessage());
        }
        
        return results;
    }

    /**
     * 湿度控制逻辑
     */
    private Map<String, Object> controlHumidity(BigDecimal humidity) {
        Map<String, Object> results = new HashMap<>();
        
        if (humidity == null) {
            return results;
        }
        
        double hum = humidity.doubleValue();
        ControlThreshold threshold = controlThresholds.get("humidity");
        
        try {
            if (hum < threshold.minThreshold) {
                // 湿度过低，启动加湿器
                controlDevicesByType("humidifier", true, 70 + random.nextInt(30));
                controlDevicesByType("dehumidifier", false, 0);
                results.put("humidity_action", "humidifying_started");
                logger.info("Humidity too low ({}%), started humidifying", hum);
                
            } else if (hum > threshold.maxThreshold) {
                // 湿度过高，启动除湿器
                controlDevicesByType("dehumidifier", true, 60 + random.nextInt(40));
                controlDevicesByType("humidifier", false, 0);
                results.put("humidity_action", "dehumidifying_started");
                logger.info("Humidity too high ({}%), started dehumidifying", hum);
                
            } else {
                // 湿度正常
                controlDevicesByType("humidifier", false, 0);
                controlDevicesByType("dehumidifier", false, 0);
                results.put("humidity_action", "humidity_normal");
            }
        } catch (Exception e) {
            logger.error("Failed to control humidity: {}", e.getMessage());
            results.put("humidity_error", e.getMessage());
        }
        
        return results;
    }

    /**
     * 光照控制逻辑
     */
    private Map<String, Object> controlLighting(BigDecimal lightIntensity) {
        Map<String, Object> results = new HashMap<>();
        
        if (lightIntensity == null) {
            return results;
        }
        
        double light = lightIntensity.doubleValue();
        ControlThreshold threshold = controlThresholds.get("lightIntensity");
        
        try {
            int hour = LocalDateTime.now().getHour();
            
            // 白天时间（6-18点）需要检查光照是否充足
            if (hour >= 6 && hour <= 18) {
                if (light < threshold.minThreshold) {
                    // 光照不足，启动补光灯
                    int powerLevel = (int) (50 + (threshold.minThreshold - light) / threshold.minThreshold * 50);
                    controlDevicesByType("light", true, Math.min(100, powerLevel));
                    results.put("lighting_action", "supplemental_lighting_started");
                    logger.info("Light intensity too low ({} lux), started supplemental lighting", light);
                } else {
                    // 光照充足，关闭补光灯
                    controlDevicesByType("light", false, 0);
                    results.put("lighting_action", "natural_light_sufficient");
                }
            } else {
                // 夜间时间，关闭补光灯（除非特殊需要）
                controlDevicesByType("light", false, 0);
                results.put("lighting_action", "night_mode");
            }
        } catch (Exception e) {
            logger.error("Failed to control lighting: {}", e.getMessage());
            results.put("lighting_error", e.getMessage());
        }
        
        return results;
    }

    /**
     * 土壤湿度控制逻辑
     */
    private Map<String, Object> controlSoilHumidity(BigDecimal soilHumidity) {
        Map<String, Object> results = new HashMap<>();
        
        if (soilHumidity == null) {
            return results;
        }
        
        double soil = soilHumidity.doubleValue();
        ControlThreshold threshold = controlThresholds.get("soilHumidity");
        
        try {
            if (soil < threshold.minThreshold) {
                // 土壤湿度过低，启动灌溉系统
                int powerLevel = (int) (60 + (threshold.minThreshold - soil) / threshold.minThreshold * 40);
                controlDevicesByType("irrigation", true, Math.min(100, powerLevel));
                results.put("irrigation_action", "irrigation_started");
                logger.info("Soil humidity too low ({}%), started irrigation", soil);
                
            } else if (soil > threshold.maxThreshold) {
                // 土壤湿度过高，停止灌溉并启动排水风扇
                controlDevicesByType("irrigation", false, 0);
                controlDevicesByType("fan", true, 50 + random.nextInt(30));
                results.put("irrigation_action", "drainage_started");
                logger.info("Soil humidity too high ({}%), started drainage", soil);
                
            } else {
                // 土壤湿度正常
                controlDevicesByType("irrigation", false, 0);
                results.put("irrigation_action", "soil_humidity_normal");
            }
        } catch (Exception e) {
            logger.error("Failed to control soil humidity: {}", e.getMessage());
            results.put("irrigation_error", e.getMessage());
        }
        
        return results;
    }

    /**
     * CO2浓度控制逻辑
     */
    private Map<String, Object> controlCo2Level(BigDecimal co2Level) {
        Map<String, Object> results = new HashMap<>();
        
        if (co2Level == null) {
            return results;
        }
        
        double co2 = co2Level.doubleValue();
        ControlThreshold threshold = controlThresholds.get("co2Level");
        
        try {
            if (co2 > threshold.maxThreshold) {
                // CO2浓度过高，启动通风系统
                int powerLevel = (int) (70 + (co2 - threshold.maxThreshold) / threshold.maxThreshold * 30);
                controlDevicesByType("fan", true, Math.min(100, powerLevel));
                results.put("ventilation_action", "ventilation_started");
                logger.info("CO2 level too high ({} ppm), started ventilation", co2);
                
            } else if (co2 < threshold.minThreshold) {
                // CO2浓度过低，减少通风
                controlDevicesByType("fan", false, 0);
                results.put("ventilation_action", "ventilation_reduced");
                logger.info("CO2 level too low ({} ppm), reduced ventilation", co2);
                
            } else {
                // CO2浓度正常
                results.put("ventilation_action", "co2_level_normal");
            }
        } catch (Exception e) {
            logger.error("Failed to control CO2 level: {}", e.getMessage());
            results.put("ventilation_error", e.getMessage());
        }
        
        return results;
    }

    /**
     * 按设备类型控制设备
     */
    private void controlDevicesByType(String deviceType, boolean shouldRun, int powerLevel) {
        try {
            List<DeviceStatus> devices = ((DeviceServiceImpl) deviceService).getDevicesByType(deviceType);
            
            for (DeviceStatus device : devices) {
                if (device.getStatus() != DeviceStatus.DeviceStatusEnum.online) {
                    continue; // 跳过离线或故障设备
                }
                
                DeviceRunningState state = deviceStates.get(device.getDeviceId());
                if (state == null) {
                    state = new DeviceRunningState();
                    deviceStates.put(device.getDeviceId(), state);
                }
                
                // 更新设备运行状态
                state.isRunning = shouldRun;
                state.currentPowerLevel = shouldRun ? powerLevel : 0;
                
                // 更新设备对象
                device.setIsRunning(shouldRun);
                device.setPowerLevel(BigDecimal.valueOf(powerLevel));
                device.setUpdatedAt(LocalDateTime.now());
                
                // 保存到数据库
                ((DeviceServiceImpl) deviceService).saveOrUpdateDevice(device);
                
                logger.debug("Controlled device {}: running={}, power={}%", 
                        device.getDeviceId(), shouldRun, powerLevel);
            }
        } catch (Exception e) {
            logger.error("Failed to control devices of type {}: {}", deviceType, e.getMessage());
        }
    }

    @Override
    public boolean simulateDeviceFailure(String deviceId) {
        try {
            DeviceStatus device = deviceService.getDeviceById(deviceId);
            if (device == null) {
                logger.warn("Device not found for failure simulation: {}", deviceId);
                return false;
            }
            
            device.setStatus(DeviceStatus.DeviceStatusEnum.error);
            device.setIsRunning(false);
            device.setPowerLevel(BigDecimal.ZERO);
            device.setUpdatedAt(LocalDateTime.now());
            
            ((DeviceServiceImpl) deviceService).saveOrUpdateDevice(device);
            
            DeviceRunningState state = deviceStates.get(deviceId);
            if (state != null) {
                state.isRunning = false;
                state.currentPowerLevel = 0;
            }
            
            logger.info("Simulated device failure for: {}", deviceId);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to simulate device failure for {}: {}", deviceId, e.getMessage(), e);
            return false;
        }
    }

    @Override
    public boolean recoverDeviceFromFailure(String deviceId) {
        try {
            DeviceStatus device = deviceService.getDeviceById(deviceId);
            if (device == null) {
                logger.warn("Device not found for recovery: {}", deviceId);
                return false;
            }
            
            device.setStatus(DeviceStatus.DeviceStatusEnum.online);
            device.setUpdatedAt(LocalDateTime.now());
            
            ((DeviceServiceImpl) deviceService).saveOrUpdateDevice(device);
            
            logger.info("Recovered device from failure: {}", deviceId);
            return true;
            
        } catch (Exception e) {
            logger.error("Failed to recover device {}: {}", deviceId, e.getMessage(), e);
            return false;
        }
    }

    @Override
    public List<DeviceStatus> getAllSimulatedDevices() {
        try {
            return deviceService.getAllDevices();
        } catch (Exception e) {
            logger.error("Failed to get all simulated devices: {}", e.getMessage(), e);
            return new ArrayList<>();
        }
    }

    @Override
    public boolean startAutomaticControl() {
        automaticControlRunning = true;
        logger.info("Started automatic device control");
        return true;
    }

    @Override
    public boolean stopAutomaticControl() {
        automaticControlRunning = false;
        logger.info("Stopped automatic device control");
        return true;
    }

    @Override
    public boolean isAutomaticControlRunning() {
        return automaticControlRunning;
    }

    @Override
    public void setControlThreshold(String parameter, double minThreshold, double maxThreshold) {
        ControlThreshold threshold = controlThresholds.get(parameter);
        if (threshold != null) {
            threshold.minThreshold = minThreshold;
            threshold.maxThreshold = maxThreshold;
            logger.info("Updated control threshold for {}: [{}, {}]", parameter, minThreshold, maxThreshold);
        } else {
            logger.warn("Unknown control parameter: {}", parameter);
        }
    }

    @Override
    public void resetControlThresholds() {
        initializeControlThresholds();
        logger.info("Reset all control thresholds to default values");
    }
}