package com.greenhouse.service.impl;

import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.service.DataSimulationService;
import com.greenhouse.service.EnvironmentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

/**
 * 数据模拟服务实现类
 * 生成真实的环境数据用于系统测试和演示
 */
@Service
public class DataSimulationServiceImpl implements DataSimulationService {

    private static final Logger logger = LoggerFactory.getLogger(DataSimulationServiceImpl.class);

    @Autowired
    private EnvironmentService environmentService;

    // 存储正在运行的模拟任务
    private final Set<String> runningSimulations = ConcurrentHashMap.newKeySet();

    // 模拟参数范围配置
    private final Map<String, SimulationRange> simulationRanges = new HashMap<>();

    // 上一次的数据值，用于生成连续性数据
    private final Map<String, EnvironmentData> lastDataMap = new ConcurrentHashMap<>();

    // 随机数生成器
    private final Random random = new Random();

    /**
     * 模拟参数范围类
     */
    private static class SimulationRange {
        double minValue;
        double maxValue;
        double normalMin;
        double normalMax;

        SimulationRange(double minValue, double maxValue, double normalMin, double normalMax) {
            this.minValue = minValue;
            this.maxValue = maxValue;
            this.normalMin = normalMin;
            this.normalMax = normalMax;
        }
    }

    public DataSimulationServiceImpl() {
        initializeDefaultRanges();
    }

    /**
     * 初始化默认的模拟参数范围
     */
    private void initializeDefaultRanges() {
        // 温度范围：5-45°C，正常范围：18-28°C
        simulationRanges.put("temperature", new SimulationRange(5.0, 45.0, 18.0, 28.0));
        
        // 湿度范围：20-95%，正常范围：50-80%
        simulationRanges.put("humidity", new SimulationRange(20.0, 95.0, 50.0, 80.0));
        
        // 光照强度范围：0-100000lux，正常范围：10000-50000lux
        simulationRanges.put("lightIntensity", new SimulationRange(0.0, 100000.0, 10000.0, 50000.0));
        
        // 土壤湿度范围：10-90%，正常范围：40-70%
        simulationRanges.put("soilHumidity", new SimulationRange(10.0, 90.0, 40.0, 70.0));
        
        // CO2浓度范围：300-2000ppm，正常范围：400-1000ppm
        simulationRanges.put("co2Level", new SimulationRange(300.0, 2000.0, 400.0, 1000.0));
    }

    @Override
    public EnvironmentData generateSimulatedEnvironmentData(String greenhouseId) {
        try {
            EnvironmentData lastData = lastDataMap.get(greenhouseId);
            EnvironmentData newData = new EnvironmentData();
            
            newData.setGreenhouseId(greenhouseId);
            newData.setRecordedAt(LocalDateTime.now());

            // 生成温度数据（考虑时间因素和连续性）
            newData.setTemperature(generateTemperature(lastData));
            
            // 生成湿度数据
            newData.setHumidity(generateHumidity(lastData));
            
            // 生成光照强度数据（考虑时间因素）
            newData.setLightIntensity(generateLightIntensity(lastData));
            
            // 生成土壤湿度数据
            newData.setSoilHumidity(generateSoilHumidity(lastData));
            
            // 生成CO2浓度数据
            newData.setCo2Level(generateCo2Level(lastData));

            // 更新最后数据记录
            lastDataMap.put(greenhouseId, newData);

            logger.debug("Generated simulated data for greenhouse {}: temp={}, humidity={}, light={}, soil={}, co2={}",
                    greenhouseId, newData.getTemperature(), newData.getHumidity(), 
                    newData.getLightIntensity(), newData.getSoilHumidity(), newData.getCo2Level());

            return newData;
            
        } catch (Exception e) {
            logger.error("Error generating simulated environment data for greenhouse {}: {}", 
                    greenhouseId, e.getMessage(), e);
            return null;
        }
    }

    /**
     * 生成温度数据
     */
    private BigDecimal generateTemperature(EnvironmentData lastData) {
        SimulationRange range = simulationRanges.get("temperature");
        double baseValue;
        
        if (lastData != null && lastData.getTemperature() != null) {
            // 基于上次数据生成连续性数据
            baseValue = lastData.getTemperature().doubleValue();
            // 添加小幅随机变化 (-2 到 +2 度)
            baseValue += (random.nextGaussian() * 1.0);
        } else {
            // 根据当前时间生成基础温度
            int hour = LocalDateTime.now().getHour();
            if (hour >= 6 && hour <= 18) {
                // 白天温度较高
                baseValue = range.normalMin + (range.normalMax - range.normalMin) * 0.7 + random.nextGaussian() * 2;
            } else {
                // 夜间温度较低
                baseValue = range.normalMin + (range.normalMax - range.normalMin) * 0.3 + random.nextGaussian() * 2;
            }
        }

        // 偶尔生成异常值用于测试报警系统
        if (random.nextDouble() < 0.05) { // 5%概率生成异常值
            if (random.nextBoolean()) {
                baseValue = range.minValue + random.nextDouble() * 5; // 低温异常
            } else {
                baseValue = range.maxValue - random.nextDouble() * 5; // 高温异常
            }
        }

        // 确保值在合理范围内
        baseValue = Math.max(range.minValue, Math.min(range.maxValue, baseValue));
        
        return BigDecimal.valueOf(baseValue).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 生成湿度数据
     */
    private BigDecimal generateHumidity(EnvironmentData lastData) {
        SimulationRange range = simulationRanges.get("humidity");
        double baseValue;
        
        if (lastData != null && lastData.getHumidity() != null) {
            baseValue = lastData.getHumidity().doubleValue();
            // 湿度变化相对缓慢
            baseValue += (random.nextGaussian() * 3.0);
        } else {
            // 生成正常范围内的湿度
            baseValue = range.normalMin + random.nextDouble() * (range.normalMax - range.normalMin);
        }

        // 偶尔生成异常值
        if (random.nextDouble() < 0.03) { // 3%概率
            if (random.nextBoolean()) {
                baseValue = range.minValue + random.nextDouble() * 10; // 低湿度
            } else {
                baseValue = range.maxValue - random.nextDouble() * 10; // 高湿度
            }
        }

        baseValue = Math.max(range.minValue, Math.min(range.maxValue, baseValue));
        return BigDecimal.valueOf(baseValue).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 生成光照强度数据
     */
    private BigDecimal generateLightIntensity(EnvironmentData lastData) {
        SimulationRange range = simulationRanges.get("lightIntensity");
        double baseValue;
        
        int hour = LocalDateTime.now().getHour();
        
        if (hour >= 6 && hour <= 18) {
            // 白天有自然光照
            double lightFactor = Math.sin(Math.PI * (hour - 6) / 12.0); // 模拟太阳光照曲线
            baseValue = range.normalMin + (range.normalMax - range.normalMin) * lightFactor;
            
            // 添加随机变化（云层遮挡等）
            baseValue += random.nextGaussian() * 5000;
        } else {
            // 夜间主要是人工补光
            baseValue = random.nextDouble() * 5000; // 低光照
        }

        // 偶尔生成异常值
        if (random.nextDouble() < 0.02) { // 2%概率
            baseValue = range.maxValue * random.nextDouble(); // 强光照异常
        }

        baseValue = Math.max(range.minValue, Math.min(range.maxValue, baseValue));
        return BigDecimal.valueOf(baseValue).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 生成土壤湿度数据
     */
    private BigDecimal generateSoilHumidity(EnvironmentData lastData) {
        SimulationRange range = simulationRanges.get("soilHumidity");
        double baseValue;
        
        if (lastData != null && lastData.getSoilHumidity() != null) {
            baseValue = lastData.getSoilHumidity().doubleValue();
            // 土壤湿度变化较慢
            baseValue += (random.nextGaussian() * 2.0);
        } else {
            baseValue = range.normalMin + random.nextDouble() * (range.normalMax - range.normalMin);
        }

        // 偶尔模拟灌溉后的湿度上升
        if (random.nextDouble() < 0.01) { // 1%概率
            baseValue = range.normalMax + random.nextDouble() * 10;
        }

        baseValue = Math.max(range.minValue, Math.min(range.maxValue, baseValue));
        return BigDecimal.valueOf(baseValue).setScale(2, RoundingMode.HALF_UP);
    }

    /**
     * 生成CO2浓度数据
     */
    private BigDecimal generateCo2Level(EnvironmentData lastData) {
        SimulationRange range = simulationRanges.get("co2Level");
        double baseValue;
        
        if (lastData != null && lastData.getCo2Level() != null) {
            baseValue = lastData.getCo2Level().doubleValue();
            baseValue += (random.nextGaussian() * 50.0);
        } else {
            baseValue = range.normalMin + random.nextDouble() * (range.normalMax - range.normalMin);
        }

        // 白天植物光合作用会消耗CO2
        int hour = LocalDateTime.now().getHour();
        if (hour >= 8 && hour <= 16) {
            baseValue *= 0.9; // 白天CO2浓度相对较低
        }

        // 偶尔生成高CO2浓度异常
        if (random.nextDouble() < 0.04) { // 4%概率
            baseValue = range.maxValue - random.nextDouble() * 200;
        }

        baseValue = Math.max(range.minValue, Math.min(range.maxValue, baseValue));
        return BigDecimal.valueOf(baseValue).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public List<EnvironmentData> generateBatchSimulatedData(String greenhouseId, int count) {
        List<EnvironmentData> dataList = new ArrayList<>();
        
        for (int i = 0; i < count; i++) {
            EnvironmentData data = generateSimulatedEnvironmentData(greenhouseId);
            if (data != null) {
                dataList.add(data);
            }
        }
        
        logger.info("Generated {} simulated environment data records for greenhouse {}", 
                dataList.size(), greenhouseId);
        
        return dataList;
    }

    @Override
    public boolean startDataSimulation(String greenhouseId) {
        if (runningSimulations.contains(greenhouseId)) {
            logger.warn("Data simulation for greenhouse {} is already running", greenhouseId);
            return false;
        }
        
        runningSimulations.add(greenhouseId);
        logger.info("Started data simulation for greenhouse {}", greenhouseId);
        return true;
    }

    @Override
    public boolean stopDataSimulation(String greenhouseId) {
        boolean removed = runningSimulations.remove(greenhouseId);
        if (removed) {
            logger.info("Stopped data simulation for greenhouse {}", greenhouseId);
        } else {
            logger.warn("Data simulation for greenhouse {} was not running", greenhouseId);
        }
        return removed;
    }

    @Override
    public boolean isSimulationRunning(String greenhouseId) {
        return runningSimulations.contains(greenhouseId);
    }

    @Override
    public void setSimulationRange(String parameter, double minValue, double maxValue) {
        SimulationRange currentRange = simulationRanges.get(parameter);
        if (currentRange != null) {
            currentRange.minValue = minValue;
            currentRange.maxValue = maxValue;
            logger.info("Updated simulation range for {}: [{}, {}]", parameter, minValue, maxValue);
        } else {
            logger.warn("Unknown simulation parameter: {}", parameter);
        }
    }

    @Override
    public void resetSimulationParameters() {
        initializeDefaultRanges();
        logger.info("Reset all simulation parameters to default values");
    }
}