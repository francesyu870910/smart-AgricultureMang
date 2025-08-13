package com.greenhouse.service.impl;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.EnvironmentStatisticsDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import com.greenhouse.service.EnvironmentService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 环境数据服务实现类
 * 实现环境数据的业务逻辑处理
 */
@Service
@Transactional(rollbackFor = Exception.class)
public class EnvironmentServiceImpl implements EnvironmentService {

    @Autowired
    private EnvironmentMapper environmentMapper;

    // 环境参数阈值配置（实际项目中应该从配置表读取）
    private static final BigDecimal MIN_TEMPERATURE = new BigDecimal("15.0");
    private static final BigDecimal MAX_TEMPERATURE = new BigDecimal("35.0");
    private static final BigDecimal MIN_HUMIDITY = new BigDecimal("40.0");
    private static final BigDecimal MAX_HUMIDITY = new BigDecimal("80.0");
    private static final BigDecimal MIN_LIGHT_INTENSITY = new BigDecimal("10000.0");
    private static final BigDecimal MAX_LIGHT_INTENSITY = new BigDecimal("50000.0");
    private static final BigDecimal MIN_SOIL_HUMIDITY = new BigDecimal("30.0");
    private static final BigDecimal MAX_SOIL_HUMIDITY = new BigDecimal("70.0");
    private static final BigDecimal MIN_CO2_LEVEL = new BigDecimal("300.0");
    private static final BigDecimal MAX_CO2_LEVEL = new BigDecimal("1000.0");

    @Override
    public EnvironmentDTO getCurrentEnvironmentData(String greenhouseId) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }

        EnvironmentData environmentData = environmentMapper.selectLatestByGreenhouseId(greenhouseId);
        if (environmentData == null) {
            return null;
        }

        return convertToDTO(environmentData);
    }

    @Override
    public List<EnvironmentDTO> getHistoryEnvironmentData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }
        if (startTime.isAfter(endTime)) {
            throw new IllegalArgumentException("开始时间不能晚于结束时间");
        }

        List<EnvironmentData> environmentDataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
        return environmentDataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public IPage<EnvironmentDTO> getHistoryEnvironmentDataPage(String greenhouseId, LocalDateTime startTime, 
                                                             LocalDateTime endTime, int pageNum, int pageSize) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }
        if (pageNum < 1 || pageSize < 1) {
            throw new IllegalArgumentException("页码和页大小必须大于0");
        }

        Page<EnvironmentData> page = new Page<>(pageNum, pageSize);
        IPage<EnvironmentData> dataPage = environmentMapper.selectHistoryPage(page, greenhouseId, startTime, endTime);
        
        // 转换为DTO分页结果
        Page<EnvironmentDTO> dtoPage = new Page<>(pageNum, pageSize);
        dtoPage.setTotal(dataPage.getTotal());
        dtoPage.setPages(dataPage.getPages());
        
        List<EnvironmentDTO> dtoList = dataPage.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        dtoPage.setRecords(dtoList);
        
        return dtoPage;
    }

    @Override
    public EnvironmentStatisticsDTO getEnvironmentStatistics(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        Map<String, Object> statisticsMap = environmentMapper.selectStatisticsByTimeRange(greenhouseId, startTime, endTime);
        if (statisticsMap == null || statisticsMap.isEmpty()) {
            return null;
        }

        EnvironmentStatisticsDTO statisticsDTO = new EnvironmentStatisticsDTO();
        statisticsDTO.setGreenhouseId(greenhouseId);
        statisticsDTO.setStartTime(startTime);
        statisticsDTO.setEndTime(endTime);
        
        // 设置统计数据
        statisticsDTO.setTotalRecords(getLongValue(statisticsMap, "total_records"));
        
        // 温度统计
        statisticsDTO.setAvgTemperature(getBigDecimalValue(statisticsMap, "avg_temperature"));
        statisticsDTO.setMinTemperature(getBigDecimalValue(statisticsMap, "min_temperature"));
        statisticsDTO.setMaxTemperature(getBigDecimalValue(statisticsMap, "max_temperature"));
        
        // 湿度统计
        statisticsDTO.setAvgHumidity(getBigDecimalValue(statisticsMap, "avg_humidity"));
        statisticsDTO.setMinHumidity(getBigDecimalValue(statisticsMap, "min_humidity"));
        statisticsDTO.setMaxHumidity(getBigDecimalValue(statisticsMap, "max_humidity"));
        
        // 光照强度统计
        statisticsDTO.setAvgLightIntensity(getBigDecimalValue(statisticsMap, "avg_light_intensity"));
        statisticsDTO.setMinLightIntensity(getBigDecimalValue(statisticsMap, "min_light_intensity"));
        statisticsDTO.setMaxLightIntensity(getBigDecimalValue(statisticsMap, "max_light_intensity"));
        
        // 土壤湿度统计
        statisticsDTO.setAvgSoilHumidity(getBigDecimalValue(statisticsMap, "avg_soil_humidity"));
        statisticsDTO.setMinSoilHumidity(getBigDecimalValue(statisticsMap, "min_soil_humidity"));
        statisticsDTO.setMaxSoilHumidity(getBigDecimalValue(statisticsMap, "max_soil_humidity"));
        
        // CO2浓度统计
        statisticsDTO.setAvgCo2Level(getBigDecimalValue(statisticsMap, "avg_co2_level"));
        statisticsDTO.setMinCo2Level(getBigDecimalValue(statisticsMap, "min_co2_level"));
        statisticsDTO.setMaxCo2Level(getBigDecimalValue(statisticsMap, "max_co2_level"));

        return statisticsDTO;
    }

    @Override
    public List<Map<String, Object>> getHourlyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        return environmentMapper.selectHourlyAverage(greenhouseId, startTime, endTime);
    }

    @Override
    public List<Map<String, Object>> getDailyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        return environmentMapper.selectDailyAverage(greenhouseId, startTime, endTime);
    }

    @Override
    public List<EnvironmentDTO> getTemperatureAbnormalData(String greenhouseId, BigDecimal minTemp, BigDecimal maxTemp,
                                                          LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (minTemp == null || maxTemp == null) {
            throw new IllegalArgumentException("温度阈值不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        List<EnvironmentData> abnormalDataList = environmentMapper.selectTemperatureAbnormal(
                greenhouseId, minTemp, maxTemp, startTime, endTime);
        
        return abnormalDataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnvironmentDTO> getHumidityAbnormalData(String greenhouseId, BigDecimal minHumidity, BigDecimal maxHumidity,
                                                       LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (minHumidity == null || maxHumidity == null) {
            throw new IllegalArgumentException("湿度阈值不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        List<EnvironmentData> abnormalDataList = environmentMapper.selectHumidityAbnormal(
                greenhouseId, minHumidity, maxHumidity, startTime, endTime);
        
        return abnormalDataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnvironmentDTO> getLightAbnormalData(String greenhouseId, BigDecimal minLight, BigDecimal maxLight,
                                                    LocalDateTime startTime, LocalDateTime endTime) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        if (minLight == null || maxLight == null) {
            throw new IllegalArgumentException("光照强度阈值不能为空");
        }
        if (startTime == null || endTime == null) {
            throw new IllegalArgumentException("开始时间和结束时间不能为空");
        }

        List<EnvironmentData> abnormalDataList = environmentMapper.selectLightAbnormal(
                greenhouseId, minLight, maxLight, startTime, endTime);
        
        return abnormalDataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public boolean saveEnvironmentData(EnvironmentData environmentData) {
        if (environmentData == null) {
            throw new IllegalArgumentException("环境数据不能为空");
        }
        
        if (!validateEnvironmentData(environmentData)) {
            throw new IllegalArgumentException("环境数据验证失败");
        }

        // 设置记录时间
        if (environmentData.getRecordedAt() == null) {
            environmentData.setRecordedAt(LocalDateTime.now());
        }

        return environmentMapper.insert(environmentData) > 0;
    }

    @Override
    public boolean batchSaveEnvironmentData(List<EnvironmentData> environmentDataList) {
        if (environmentDataList == null || environmentDataList.isEmpty()) {
            throw new IllegalArgumentException("环境数据列表不能为空");
        }

        // 验证所有数据
        for (EnvironmentData data : environmentDataList) {
            if (!validateEnvironmentData(data)) {
                throw new IllegalArgumentException("环境数据验证失败: " + data.toString());
            }
            // 设置记录时间
            if (data.getRecordedAt() == null) {
                data.setRecordedAt(LocalDateTime.now());
            }
        }

        // 批量插入（这里简化处理，实际项目中可以使用MyBatis-Plus的批量插入）
        int successCount = 0;
        for (EnvironmentData data : environmentDataList) {
            if (environmentMapper.insert(data) > 0) {
                successCount++;
            }
        }

        return successCount == environmentDataList.size();
    }

    @Override
    public boolean validateEnvironmentData(EnvironmentData environmentData) {
        if (environmentData == null) {
            return false;
        }

        // 验证温室ID
        if (!StringUtils.hasText(environmentData.getGreenhouseId())) {
            return false;
        }

        // 验证温度范围
        if (environmentData.getTemperature() == null || 
            environmentData.getTemperature().compareTo(new BigDecimal("-50")) < 0 ||
            environmentData.getTemperature().compareTo(new BigDecimal("60")) > 0) {
            return false;
        }

        // 验证湿度范围
        if (environmentData.getHumidity() == null || 
            environmentData.getHumidity().compareTo(BigDecimal.ZERO) < 0 ||
            environmentData.getHumidity().compareTo(new BigDecimal("100")) > 0) {
            return false;
        }

        // 验证光照强度范围
        if (environmentData.getLightIntensity() == null || 
            environmentData.getLightIntensity().compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }

        // 验证土壤湿度范围
        if (environmentData.getSoilHumidity() == null || 
            environmentData.getSoilHumidity().compareTo(BigDecimal.ZERO) < 0 ||
            environmentData.getSoilHumidity().compareTo(new BigDecimal("100")) > 0) {
            return false;
        }

        // 验证CO2浓度范围（可选字段）
        if (environmentData.getCo2Level() != null && 
            environmentData.getCo2Level().compareTo(BigDecimal.ZERO) < 0) {
            return false;
        }

        return true;
    }

    @Override
    public Map<String, String> checkEnvironmentStatus(EnvironmentData environmentData) {
        Map<String, String> statusMap = new HashMap<>();
        
        if (environmentData == null) {
            return statusMap;
        }

        // 检查温度状态
        if (environmentData.getTemperature() != null) {
            if (environmentData.getTemperature().compareTo(MIN_TEMPERATURE) < 0) {
                statusMap.put("temperatureStatus", "low");
            } else if (environmentData.getTemperature().compareTo(MAX_TEMPERATURE) > 0) {
                statusMap.put("temperatureStatus", "high");
            } else {
                statusMap.put("temperatureStatus", "normal");
            }
        }

        // 检查湿度状态
        if (environmentData.getHumidity() != null) {
            if (environmentData.getHumidity().compareTo(MIN_HUMIDITY) < 0) {
                statusMap.put("humidityStatus", "low");
            } else if (environmentData.getHumidity().compareTo(MAX_HUMIDITY) > 0) {
                statusMap.put("humidityStatus", "high");
            } else {
                statusMap.put("humidityStatus", "normal");
            }
        }

        // 检查光照状态
        if (environmentData.getLightIntensity() != null) {
            if (environmentData.getLightIntensity().compareTo(MIN_LIGHT_INTENSITY) < 0) {
                statusMap.put("lightStatus", "low");
            } else if (environmentData.getLightIntensity().compareTo(MAX_LIGHT_INTENSITY) > 0) {
                statusMap.put("lightStatus", "high");
            } else {
                statusMap.put("lightStatus", "normal");
            }
        }

        return statusMap;
    }

    @Override
    public long getDataCount(String greenhouseId) {
        if (!StringUtils.hasText(greenhouseId)) {
            throw new IllegalArgumentException("温室ID不能为空");
        }
        
        return environmentMapper.countByGreenhouseId(greenhouseId);
    }

    @Override
    public int cleanHistoryData(LocalDateTime beforeTime) {
        if (beforeTime == null) {
            throw new IllegalArgumentException("清理时间不能为空");
        }
        
        return environmentMapper.deleteBeforeTime(beforeTime);
    }

    /**
     * 将EnvironmentData实体转换为EnvironmentDTO
     */
    private EnvironmentDTO convertToDTO(EnvironmentData environmentData) {
        if (environmentData == null) {
            return null;
        }

        EnvironmentDTO dto = new EnvironmentDTO();
        BeanUtils.copyProperties(environmentData, dto);
        
        // 设置状态信息
        Map<String, String> statusMap = checkEnvironmentStatus(environmentData);
        dto.setTemperatureStatus(statusMap.get("temperatureStatus"));
        dto.setHumidityStatus(statusMap.get("humidityStatus"));
        dto.setLightStatus(statusMap.get("lightStatus"));
        
        return dto;
    }

    /**
     * 从Map中获取BigDecimal值
     */
    private BigDecimal getBigDecimalValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal) {
            return (BigDecimal) value;
        }
        if (value instanceof Number) {
            return new BigDecimal(value.toString());
        }
        return new BigDecimal(value.toString());
    }

    /**
     * 从Map中获取Long值
     */
    private Long getLongValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        if (value == null) {
            return null;
        }
        if (value instanceof Long) {
            return (Long) value;
        }
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return Long.parseLong(value.toString());
    }
}