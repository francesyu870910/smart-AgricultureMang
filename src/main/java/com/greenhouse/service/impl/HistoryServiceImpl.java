package com.greenhouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.HistoryPageDTO;
import com.greenhouse.dto.HistoryQueryDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import com.greenhouse.service.HistoryService;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 历史数据服务实现类
 * 实现历史数据查询、导出、清理等功能
 */
@Service
public class HistoryServiceImpl implements HistoryService {

    @Autowired
    private EnvironmentMapper environmentMapper;

    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    public HistoryPageDTO<EnvironmentDTO> queryHistoryData(HistoryQueryDTO queryDTO) {
        // 创建分页对象
        Page<EnvironmentData> page = new Page<>(queryDTO.getPageNum(), queryDTO.getPageSize());
        
        // 构建查询条件
        QueryWrapper<EnvironmentData> queryWrapper = buildQueryWrapper(queryDTO);
        
        // 执行分页查询
        IPage<EnvironmentData> result = environmentMapper.selectPage(page, queryWrapper);
        
        // 转换为DTO
        List<EnvironmentDTO> dtoList = result.getRecords().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return new HistoryPageDTO<>(dtoList, result.getTotal(), result.getCurrent(), result.getSize());
    }

    @Override
    public List<EnvironmentDTO> queryHistoryByTimeRange(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
        return dataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public String exportHistoryDataToCsv(HistoryQueryDTO queryDTO) {
        // 查询所有符合条件的数据（不分页）
        QueryWrapper<EnvironmentData> queryWrapper = buildQueryWrapper(queryDTO);
        List<EnvironmentData> dataList = environmentMapper.selectList(queryWrapper);
        
        StringBuilder csvBuilder = new StringBuilder();
        
        // CSV头部
        csvBuilder.append("ID,温室ID,温度(°C),湿度(%),光照强度(lux),土壤湿度(%),CO2浓度(ppm),记录时间\n");
        
        // CSV数据行
        for (EnvironmentData data : dataList) {
            csvBuilder.append(data.getId()).append(",")
                    .append(data.getGreenhouseId()).append(",")
                    .append(data.getTemperature()).append(",")
                    .append(data.getHumidity()).append(",")
                    .append(data.getLightIntensity()).append(",")
                    .append(data.getSoilHumidity()).append(",")
                    .append(data.getCo2Level()).append(",")
                    .append(data.getRecordedAt().format(DATE_TIME_FORMATTER))
                    .append("\n");
        }
        
        return csvBuilder.toString();
    }

    @Override
    public byte[] exportHistoryDataToExcel(HistoryQueryDTO queryDTO) {
        // 简化实现：返回CSV格式的字节数组
        // 在实际项目中，可以使用Apache POI库生成真正的Excel文件
        String csvData = exportHistoryDataToCsv(queryDTO);
        return csvData.getBytes();
    }

    @Override
    public Map<String, Object> getHistoryStatistics(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        return environmentMapper.selectStatisticsByTimeRange(greenhouseId, startTime, endTime);
    }

    @Override
    public List<Map<String, Object>> getHourlyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        return environmentMapper.selectHourlyAverage(greenhouseId, startTime, endTime);
    }

    @Override
    public List<Map<String, Object>> getDailyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        return environmentMapper.selectDailyAverage(greenhouseId, startTime, endTime);
    }

    @Override
    public int cleanHistoryDataBefore(LocalDateTime beforeTime) {
        return environmentMapper.deleteBeforeTime(beforeTime);
    }

    @Override
    public long getHistoryDataCount(String greenhouseId) {
        return environmentMapper.countByGreenhouseId(greenhouseId);
    }

    @Override
    public int compressHistoryData(LocalDateTime beforeTime) {
        // 简化实现：直接删除旧数据
        // 在实际项目中，应该先将数据聚合为小时/日平均数据，然后删除原始数据
        return cleanHistoryDataBefore(beforeTime);
    }

    @Override
    public List<EnvironmentDTO> queryAbnormalHistoryData(String greenhouseId, String parameterType, 
                                                        Double minValue, Double maxValue, 
                                                        LocalDateTime startTime, LocalDateTime endTime) {
        List<EnvironmentData> dataList = new ArrayList<>();
        BigDecimal minVal = minValue != null ? BigDecimal.valueOf(minValue) : null;
        BigDecimal maxVal = maxValue != null ? BigDecimal.valueOf(maxValue) : null;
        
        switch (parameterType.toLowerCase()) {
            case "temperature":
                dataList = environmentMapper.selectTemperatureAbnormal(greenhouseId, minVal, maxVal, startTime, endTime);
                break;
            case "humidity":
                dataList = environmentMapper.selectHumidityAbnormal(greenhouseId, minVal, maxVal, startTime, endTime);
                break;
            case "light_intensity":
                dataList = environmentMapper.selectLightAbnormal(greenhouseId, minVal, maxVal, startTime, endTime);
                break;
            default:
                // 如果参数类型不匹配，返回空列表
                break;
        }
        
        return dataList.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * 构建查询条件
     */
    private QueryWrapper<EnvironmentData> buildQueryWrapper(HistoryQueryDTO queryDTO) {
        QueryWrapper<EnvironmentData> queryWrapper = new QueryWrapper<>();
        
        // 温室ID条件
        if (StringUtils.hasText(queryDTO.getGreenhouseId())) {
            queryWrapper.eq("greenhouse_id", queryDTO.getGreenhouseId());
        }
        
        // 时间范围条件
        if (queryDTO.getStartTime() != null) {
            queryWrapper.ge("recorded_at", queryDTO.getStartTime());
        }
        if (queryDTO.getEndTime() != null) {
            queryWrapper.le("recorded_at", queryDTO.getEndTime());
        }
        
        // 参数值范围条件
        if (StringUtils.hasText(queryDTO.getParameterType())) {
            String paramType = queryDTO.getParameterType().toLowerCase();
            if (queryDTO.getMinValue() != null) {
                queryWrapper.ge(paramType, queryDTO.getMinValue());
            }
            if (queryDTO.getMaxValue() != null) {
                queryWrapper.le(paramType, queryDTO.getMaxValue());
            }
        }
        
        // 排序条件
        String sortField = StringUtils.hasText(queryDTO.getSortField()) ? queryDTO.getSortField() : "recorded_at";
        boolean isAsc = "ASC".equalsIgnoreCase(queryDTO.getSortOrder());
        
        if (isAsc) {
            queryWrapper.orderByAsc(sortField);
        } else {
            queryWrapper.orderByDesc(sortField);
        }
        
        return queryWrapper;
    }

    /**
     * 将实体对象转换为DTO对象
     */
    private EnvironmentDTO convertToDTO(EnvironmentData data) {
        EnvironmentDTO dto = new EnvironmentDTO();
        BeanUtils.copyProperties(data, dto);
        
        // 设置状态信息（简化实现）
        dto.setTemperatureStatus(getParameterStatus(data.getTemperature(), 18.0, 28.0));
        dto.setHumidityStatus(getParameterStatus(data.getHumidity(), 40.0, 80.0));
        dto.setLightStatus(getParameterStatus(data.getLightIntensity(), 10000.0, 50000.0));
        
        return dto;
    }

    /**
     * 获取参数状态
     */
    private String getParameterStatus(BigDecimal value, Double minNormal, Double maxNormal) {
        if (value == null) {
            return "unknown";
        }
        
        double val = value.doubleValue();
        if (val < minNormal) {
            return "low";
        } else if (val > maxNormal) {
            return "high";
        } else {
            return "normal";
        }
    }
}