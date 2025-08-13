package com.greenhouse.service.impl;

import com.greenhouse.dto.AnalyticsDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import com.greenhouse.service.AnalyticsService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 数据分析服务实现类
 * 实现环境数据的统计分析、趋势分析、异常检测等功能
 */
@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    private static final Logger logger = LoggerFactory.getLogger(AnalyticsServiceImpl.class);

    @Autowired
    private EnvironmentMapper environmentMapper;

    // 异常检测的标准差倍数阈值
    private static final Map<String, Double> SENSITIVITY_THRESHOLDS = Map.of(
        "low", 3.0,
        "medium", 2.0,
        "high", 1.5
    );

    @Override
    public AnalyticsDTO getStatisticsSummary(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("获取统计摘要数据 - 温室ID: {}, 时间范围: {} 到 {}", greenhouseId, startTime, endTime);
        
        try {
            // 获取时间范围内的环境数据
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                logger.warn("指定时间范围内没有找到环境数据");
                return createEmptyAnalyticsDTO("summary", greenhouseId, startTime, endTime);
            }

            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("summary");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime);

            // 计算统计摘要
            AnalyticsDTO.StatisticsSummary summary = calculateStatisticsSummary(dataList);
            result.setStatisticsSummary(summary);

            logger.info("统计摘要数据计算完成，共处理 {} 条记录", dataList.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取统计摘要数据时发生错误", e);
            throw new RuntimeException("获取统计摘要数据失败: " + e.getMessage());
        }
    }

    @Override
    public AnalyticsDTO getTrendAnalysis(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String interval) {
        logger.info("获取趋势分析数据 - 温室ID: {}, 时间范围: {} 到 {}, 间隔: {}", greenhouseId, startTime, endTime, interval);
        
        try {
            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("trend");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime);

            List<AnalyticsDTO.TrendData> trendData;
            
            if ("hour".equals(interval)) {
                // 获取每小时平均数据
                List<Map<String, Object>> hourlyData = environmentMapper.selectHourlyAverage(greenhouseId, startTime, endTime);
                trendData = convertToTrendData(hourlyData);
            } else if ("day".equals(interval)) {
                // 获取每日平均数据
                List<Map<String, Object>> dailyData = environmentMapper.selectDailyAverage(greenhouseId, startTime, endTime);
                trendData = convertToTrendData(dailyData);
            } else {
                // 默认使用原始数据
                List<EnvironmentData> rawData = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
                trendData = convertEnvironmentDataToTrendData(rawData);
            }

            // 计算趋势方向
            calculateTrendDirections(trendData);
            result.setTrendData(trendData);

            logger.info("趋势分析数据计算完成，共 {} 个数据点", trendData.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取趋势分析数据时发生错误", e);
            throw new RuntimeException("获取趋势分析数据失败: " + e.getMessage());
        }
    }

    @Override
    public AnalyticsDTO detectAnomalies(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String sensitivity) {
        logger.info("检测环境数据异常 - 温室ID: {}, 时间范围: {} 到 {}, 敏感度: {}", greenhouseId, startTime, endTime, sensitivity);
        
        try {
            // 获取环境数据
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                logger.warn("指定时间范围内没有找到环境数据");
                return createEmptyAnalyticsDTO("anomaly", greenhouseId, startTime, endTime);
            }

            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("anomaly");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime);

            // 检测异常数据
            List<AnalyticsDTO.AnomalyData> anomalies = detectAnomaliesInData(dataList, sensitivity);
            result.setAnomalies(anomalies);

            logger.info("异常检测完成，发现 {} 个异常数据点", anomalies.size());
            return result;
            
        } catch (Exception e) {
            logger.error("检测环境数据异常时发生错误", e);
            throw new RuntimeException("检测环境数据异常失败: " + e.getMessage());
        }
    }

    @Override
    public AnalyticsDTO getCorrelationAnalysis(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("获取相关性分析数据 - 温室ID: {}, 时间范围: {} 到 {}", greenhouseId, startTime, endTime);
        
        try {
            // 获取环境数据
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                logger.warn("指定时间范围内没有找到环境数据");
                return createEmptyAnalyticsDTO("correlation", greenhouseId, startTime, endTime);
            }

            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("correlation");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime);

            // 计算相关性
            Map<String, BigDecimal> correlations = calculateCorrelations(dataList);
            result.setCorrelations(correlations);

            logger.info("相关性分析完成，计算了 {} 个相关系数", correlations.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取相关性分析数据时发生错误", e);
            throw new RuntimeException("获取相关性分析数据失败: " + e.getMessage());
        }
    }

    @Override
    public AnalyticsDTO getComprehensiveReport(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("获取综合分析报告 - 温室ID: {}, 时间范围: {} 到 {}", greenhouseId, startTime, endTime);
        
        try {
            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("comprehensive");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime);

            // 获取环境数据
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                logger.warn("指定时间范围内没有找到环境数据");
                return result;
            }

            // 统计摘要
            AnalyticsDTO.StatisticsSummary summary = calculateStatisticsSummary(dataList);
            result.setStatisticsSummary(summary);

            // 趋势分析（使用小时间隔）
            List<Map<String, Object>> hourlyData = environmentMapper.selectHourlyAverage(greenhouseId, startTime, endTime);
            List<AnalyticsDTO.TrendData> trendData = convertToTrendData(hourlyData);
            calculateTrendDirections(trendData);
            result.setTrendData(trendData);

            // 异常检测（使用中等敏感度）
            List<AnalyticsDTO.AnomalyData> anomalies = detectAnomaliesInData(dataList, "medium");
            result.setAnomalies(anomalies);

            // 相关性分析
            Map<String, BigDecimal> correlations = calculateCorrelations(dataList);
            result.setCorrelations(correlations);

            logger.info("综合分析报告生成完成");
            return result;
            
        } catch (Exception e) {
            logger.error("获取综合分析报告时发生错误", e);
            throw new RuntimeException("获取综合分析报告失败: " + e.getMessage());
        }
    }

    @Override
    public AnalyticsDTO getPrediction(String greenhouseId, int hours) {
        logger.info("获取环境参数预测 - 温室ID: {}, 预测小时数: {}", greenhouseId, hours);
        
        try {
            // 获取最近24小时的数据用于预测
            LocalDateTime endTime = LocalDateTime.now();
            LocalDateTime startTime = endTime.minusHours(24);
            
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.size() < 10) {
                logger.warn("历史数据不足，无法进行预测");
                throw new RuntimeException("历史数据不足，无法进行预测");
            }

            AnalyticsDTO result = new AnalyticsDTO();
            result.setAnalysisType("prediction");
            result.setGreenhouseId(greenhouseId);
            result.setStartTime(startTime);
            result.setEndTime(endTime.plusHours(hours));

            // 简单的线性预测
            List<AnalyticsDTO.TrendData> predictions = generatePredictions(dataList, hours);
            result.setTrendData(predictions);

            logger.info("环境参数预测完成，生成 {} 小时的预测数据", hours);
            return result;
            
        } catch (Exception e) {
            logger.error("获取环境参数预测时发生错误", e);
            throw new RuntimeException("获取环境参数预测失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getEnvironmentQualityScore(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("获取环境质量评分 - 温室ID: {}, 时间范围: {} 到 {}", greenhouseId, startTime, endTime);
        
        try {
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                logger.warn("指定时间范围内没有找到环境数据");
                return Map.of("score", 0, "grade", "无数据", "details", "指定时间范围内没有环境数据");
            }

            // 计算各参数的质量评分
            Map<String, Object> result = new HashMap<>();
            
            // 理想范围定义
            Map<String, double[]> idealRanges = Map.of(
                "temperature", new double[]{20.0, 28.0},
                "humidity", new double[]{60.0, 80.0},
                "lightIntensity", new double[]{20000.0, 50000.0},
                "soilHumidity", new double[]{40.0, 70.0},
                "co2Level", new double[]{800.0, 1200.0}
            );

            double totalScore = 0.0;
            Map<String, Double> parameterScores = new HashMap<>();

            for (Map.Entry<String, double[]> entry : idealRanges.entrySet()) {
                String param = entry.getKey();
                double[] range = entry.getValue();
                double score = calculateParameterScore(dataList, param, range[0], range[1]);
                parameterScores.put(param, score);
                totalScore += score;
            }

            double averageScore = totalScore / idealRanges.size();
            String grade = getQualityGrade(averageScore);

            result.put("score", Math.round(averageScore * 100) / 100.0);
            result.put("grade", grade);
            result.put("parameterScores", parameterScores);
            result.put("totalRecords", dataList.size());
            result.put("evaluationPeriod", Map.of("start", startTime, "end", endTime));

            logger.info("环境质量评分计算完成，总分: {}, 等级: {}", averageScore, grade);
            return result;
            
        } catch (Exception e) {
            logger.error("获取环境质量评分时发生错误", e);
            throw new RuntimeException("获取环境质量评分失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getDataIntegrityReport(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        logger.info("获取数据完整性报告 - 温室ID: {}, 时间范围: {} 到 {}", greenhouseId, startTime, endTime);
        
        try {
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            Map<String, Object> result = new HashMap<>();
            
            // 计算期望的数据点数量（假设每分钟一条记录）
            long expectedRecords = java.time.Duration.between(startTime, endTime).toMinutes();
            long actualRecords = dataList.size();
            double completeness = expectedRecords > 0 ? (double) actualRecords / expectedRecords * 100 : 0;

            // 检查数据缺失
            Map<String, Integer> missingData = new HashMap<>();
            for (EnvironmentData data : dataList) {
                if (data.getTemperature() == null) missingData.merge("temperature", 1, Integer::sum);
                if (data.getHumidity() == null) missingData.merge("humidity", 1, Integer::sum);
                if (data.getLightIntensity() == null) missingData.merge("lightIntensity", 1, Integer::sum);
                if (data.getSoilHumidity() == null) missingData.merge("soilHumidity", 1, Integer::sum);
                if (data.getCo2Level() == null) missingData.merge("co2Level", 1, Integer::sum);
            }

            result.put("expectedRecords", expectedRecords);
            result.put("actualRecords", actualRecords);
            result.put("completeness", Math.round(completeness * 100) / 100.0);
            result.put("missingData", missingData);
            result.put("dataQuality", completeness >= 90 ? "优秀" : completeness >= 70 ? "良好" : completeness >= 50 ? "一般" : "较差");

            logger.info("数据完整性报告生成完成，完整性: {}%", completeness);
            return result;
            
        } catch (Exception e) {
            logger.error("获取数据完整性报告时发生错误", e);
            throw new RuntimeException("获取数据完整性报告失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getParameterDistribution(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String parameter) {
        logger.info("获取参数分布分析 - 温室ID: {}, 参数: {}, 时间范围: {} 到 {}", greenhouseId, parameter, startTime, endTime);
        
        try {
            List<EnvironmentData> dataList = environmentMapper.selectByTimeRange(greenhouseId, startTime, endTime);
            
            if (dataList.isEmpty()) {
                return Map.of("parameter", parameter, "distribution", Collections.emptyList(), "statistics", Collections.emptyMap());
            }

            // 提取指定参数的值
            List<BigDecimal> values = extractParameterValues(dataList, parameter);
            
            if (values.isEmpty()) {
                return Map.of("parameter", parameter, "distribution", Collections.emptyList(), "statistics", Collections.emptyMap());
            }

            // 计算分布统计
            Map<String, Object> statistics = calculateDistributionStatistics(values);
            
            // 计算分布区间
            List<Map<String, Object>> distribution = calculateDistribution(values, 10); // 10个区间

            Map<String, Object> result = new HashMap<>();
            result.put("parameter", parameter);
            result.put("statistics", statistics);
            result.put("distribution", distribution);
            result.put("totalSamples", values.size());

            logger.info("参数分布分析完成，参数: {}, 样本数: {}", parameter, values.size());
            return result;
            
        } catch (Exception e) {
            logger.error("获取参数分布分析时发生错误", e);
            throw new RuntimeException("获取参数分布分析失败: " + e.getMessage());
        }
    }

    @Override
    public Map<String, Object> getComparativeAnalysis(String greenhouseId, 
                                                    LocalDateTime period1Start, LocalDateTime period1End,
                                                    LocalDateTime period2Start, LocalDateTime period2End) {
        logger.info("获取时间段对比分析 - 温室ID: {}", greenhouseId);
        
        try {
            // 获取两个时间段的数据
            List<EnvironmentData> period1Data = environmentMapper.selectByTimeRange(greenhouseId, period1Start, period1End);
            List<EnvironmentData> period2Data = environmentMapper.selectByTimeRange(greenhouseId, period2Start, period2End);

            Map<String, Object> result = new HashMap<>();
            
            // 计算两个时间段的统计摘要
            AnalyticsDTO.StatisticsSummary summary1 = calculateStatisticsSummary(period1Data);
            AnalyticsDTO.StatisticsSummary summary2 = calculateStatisticsSummary(period2Data);

            // 计算差异
            Map<String, Object> differences = calculatePeriodDifferences(summary1, summary2);

            result.put("period1", Map.of(
                "start", period1Start,
                "end", period1End,
                "recordCount", period1Data.size(),
                "statistics", summary1
            ));
            
            result.put("period2", Map.of(
                "start", period2Start,
                "end", period2End,
                "recordCount", period2Data.size(),
                "statistics", summary2
            ));
            
            result.put("differences", differences);
            result.put("comparison", generateComparisonSummary(differences));

            logger.info("时间段对比分析完成");
            return result;
            
        } catch (Exception e) {
            logger.error("获取时间段对比分析时发生错误", e);
            throw new RuntimeException("获取时间段对比分析失败: " + e.getMessage());
        }
    }

    // 私有辅助方法

    private AnalyticsDTO createEmptyAnalyticsDTO(String analysisType, String greenhouseId, LocalDateTime startTime, LocalDateTime endTime) {
        AnalyticsDTO result = new AnalyticsDTO();
        result.setAnalysisType(analysisType);
        result.setGreenhouseId(greenhouseId);
        result.setStartTime(startTime);
        result.setEndTime(endTime);
        return result;
    }

    private AnalyticsDTO.StatisticsSummary calculateStatisticsSummary(List<EnvironmentData> dataList) {
        AnalyticsDTO.StatisticsSummary summary = new AnalyticsDTO.StatisticsSummary();
        summary.setTotalRecords(dataList.size());

        // 计算各参数的统计信息
        summary.setTemperature(calculateParameterStats(dataList, "temperature"));
        summary.setHumidity(calculateParameterStats(dataList, "humidity"));
        summary.setLightIntensity(calculateParameterStats(dataList, "lightIntensity"));
        summary.setSoilHumidity(calculateParameterStats(dataList, "soilHumidity"));
        summary.setCo2Level(calculateParameterStats(dataList, "co2Level"));

        return summary;
    }

    private AnalyticsDTO.ParameterStats calculateParameterStats(List<EnvironmentData> dataList, String parameter) {
        List<BigDecimal> values = extractParameterValues(dataList, parameter);
        
        if (values.isEmpty()) {
            return new AnalyticsDTO.ParameterStats(BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO);
        }

        Collections.sort(values);
        
        BigDecimal min = values.get(0);
        BigDecimal max = values.get(values.size() - 1);
        BigDecimal sum = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avg = sum.divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
        
        // 计算标准差
        BigDecimal variance = values.stream()
            .map(v -> v.subtract(avg).pow(2))
            .reduce(BigDecimal.ZERO, BigDecimal::add)
            .divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
        BigDecimal stdDev = BigDecimal.valueOf(Math.sqrt(variance.doubleValue())).setScale(2, RoundingMode.HALF_UP);
        
        // 计算中位数
        BigDecimal median;
        int size = values.size();
        if (size % 2 == 0) {
            median = values.get(size / 2 - 1).add(values.get(size / 2)).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP);
        } else {
            median = values.get(size / 2);
        }

        return new AnalyticsDTO.ParameterStats(min, max, avg, stdDev, median);
    }

    private List<BigDecimal> extractParameterValues(List<EnvironmentData> dataList, String parameter) {
        return dataList.stream()
            .map(data -> {
                switch (parameter) {
                    case "temperature": return data.getTemperature();
                    case "humidity": return data.getHumidity();
                    case "lightIntensity": return data.getLightIntensity();
                    case "soilHumidity": return data.getSoilHumidity();
                    case "co2Level": return data.getCo2Level();
                    default: return null;
                }
            })
            .filter(Objects::nonNull)
            .collect(Collectors.toList());
    }

    private List<AnalyticsDTO.TrendData> convertToTrendData(List<Map<String, Object>> mapData) {
        return mapData.stream().map(map -> {
            AnalyticsDTO.TrendData trend = new AnalyticsDTO.TrendData();
            
            // 处理时间字段转换
            Object timeObj = map.get("time");
            if (timeObj instanceof String) {
                try {
                    trend.setTime(LocalDateTime.parse((String) timeObj, 
                        java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
                } catch (Exception e) {
                    logger.warn("时间格式转换失败: {}", timeObj);
                    trend.setTime(LocalDateTime.now());
                }
            } else if (timeObj instanceof LocalDateTime) {
                trend.setTime((LocalDateTime) timeObj);
            } else {
                trend.setTime(LocalDateTime.now());
            }
            
            trend.setTemperature(convertToBigDecimal(map.get("avg_temperature")));
            trend.setHumidity(convertToBigDecimal(map.get("avg_humidity")));
            trend.setLightIntensity(convertToBigDecimal(map.get("avg_light_intensity")));
            trend.setSoilHumidity(convertToBigDecimal(map.get("avg_soil_humidity")));
            trend.setCo2Level(convertToBigDecimal(map.get("avg_co2_level")));
            return trend;
        }).collect(Collectors.toList());
    }

    private List<AnalyticsDTO.TrendData> convertEnvironmentDataToTrendData(List<EnvironmentData> dataList) {
        return dataList.stream().map(data -> {
            AnalyticsDTO.TrendData trend = new AnalyticsDTO.TrendData();
            trend.setTime(data.getRecordedAt());
            trend.setTemperature(data.getTemperature());
            trend.setHumidity(data.getHumidity());
            trend.setLightIntensity(data.getLightIntensity());
            trend.setSoilHumidity(data.getSoilHumidity());
            trend.setCo2Level(data.getCo2Level());
            return trend;
        }).collect(Collectors.toList());
    }

    private void calculateTrendDirections(List<AnalyticsDTO.TrendData> trendData) {
        for (int i = 0; i < trendData.size(); i++) {
            if (i == 0) {
                trendData.get(i).setTrendDirection("stable");
                continue;
            }
            
            AnalyticsDTO.TrendData current = trendData.get(i);
            AnalyticsDTO.TrendData previous = trendData.get(i - 1);
            
            // 基于温度变化判断趋势方向
            if (current.getTemperature() != null && previous.getTemperature() != null) {
                BigDecimal diff = current.getTemperature().subtract(previous.getTemperature());
                if (diff.compareTo(BigDecimal.valueOf(0.5)) > 0) {
                    current.setTrendDirection("up");
                } else if (diff.compareTo(BigDecimal.valueOf(-0.5)) < 0) {
                    current.setTrendDirection("down");
                } else {
                    current.setTrendDirection("stable");
                }
            } else {
                current.setTrendDirection("stable");
            }
        }
    }

    private List<AnalyticsDTO.AnomalyData> detectAnomaliesInData(List<EnvironmentData> dataList, String sensitivity) {
        List<AnalyticsDTO.AnomalyData> anomalies = new ArrayList<>();
        double threshold = SENSITIVITY_THRESHOLDS.getOrDefault(sensitivity, 2.0);

        // 为每个参数检测异常
        String[] parameters = {"temperature", "humidity", "lightIntensity", "soilHumidity", "co2Level"};
        
        for (String parameter : parameters) {
            List<BigDecimal> values = extractParameterValues(dataList, parameter);
            if (values.size() < 10) continue; // 数据太少无法检测异常

            AnalyticsDTO.ParameterStats stats = calculateParameterStats(dataList, parameter);
            
            for (EnvironmentData data : dataList) {
                BigDecimal value = extractParameterValue(data, parameter);
                if (value == null) continue;

                BigDecimal deviation = value.subtract(stats.getAvg()).abs();
                BigDecimal thresholdValue = stats.getStdDev().multiply(BigDecimal.valueOf(threshold));

                if (deviation.compareTo(thresholdValue) > 0) {
                    String severity = determineSeverity(deviation, stats.getStdDev());
                    String description = String.format("%s异常: 实际值%.2f，期望值%.2f，偏差%.2f", 
                        getParameterDisplayName(parameter), value, stats.getAvg(), deviation);
                    
                    AnalyticsDTO.AnomalyData anomaly = new AnalyticsDTO.AnomalyData(
                        data.getRecordedAt(), parameter, value, stats.getAvg(), severity, description);
                    anomalies.add(anomaly);
                }
            }
        }

        // 按时间排序
        anomalies.sort(Comparator.comparing(AnalyticsDTO.AnomalyData::getTime));
        return anomalies;
    }

    private BigDecimal extractParameterValue(EnvironmentData data, String parameter) {
        switch (parameter) {
            case "temperature": return data.getTemperature();
            case "humidity": return data.getHumidity();
            case "lightIntensity": return data.getLightIntensity();
            case "soilHumidity": return data.getSoilHumidity();
            case "co2Level": return data.getCo2Level();
            default: return null;
        }
    }

    private String determineSeverity(BigDecimal deviation, BigDecimal stdDev) {
        double ratio = deviation.divide(stdDev, 2, RoundingMode.HALF_UP).doubleValue();
        if (ratio >= 3.0) return "critical";
        if (ratio >= 2.5) return "high";
        if (ratio >= 2.0) return "medium";
        return "low";
    }

    private String getParameterDisplayName(String parameter) {
        switch (parameter) {
            case "temperature": return "温度";
            case "humidity": return "湿度";
            case "lightIntensity": return "光照强度";
            case "soilHumidity": return "土壤湿度";
            case "co2Level": return "CO2浓度";
            default: return parameter;
        }
    }

    private Map<String, BigDecimal> calculateCorrelations(List<EnvironmentData> dataList) {
        Map<String, BigDecimal> correlations = new HashMap<>();
        
        // 提取所有参数的值
        List<BigDecimal> temperature = extractParameterValues(dataList, "temperature");
        List<BigDecimal> humidity = extractParameterValues(dataList, "humidity");
        List<BigDecimal> lightIntensity = extractParameterValues(dataList, "lightIntensity");
        List<BigDecimal> soilHumidity = extractParameterValues(dataList, "soilHumidity");
        List<BigDecimal> co2Level = extractParameterValues(dataList, "co2Level");

        // 计算相关系数
        correlations.put("temperature_humidity", calculateCorrelation(temperature, humidity));
        correlations.put("temperature_light", calculateCorrelation(temperature, lightIntensity));
        correlations.put("temperature_soil", calculateCorrelation(temperature, soilHumidity));
        correlations.put("temperature_co2", calculateCorrelation(temperature, co2Level));
        correlations.put("humidity_light", calculateCorrelation(humidity, lightIntensity));
        correlations.put("humidity_soil", calculateCorrelation(humidity, soilHumidity));
        correlations.put("humidity_co2", calculateCorrelation(humidity, co2Level));
        correlations.put("light_soil", calculateCorrelation(lightIntensity, soilHumidity));
        correlations.put("light_co2", calculateCorrelation(lightIntensity, co2Level));
        correlations.put("soil_co2", calculateCorrelation(soilHumidity, co2Level));

        return correlations;
    }

    private BigDecimal calculateCorrelation(List<BigDecimal> x, List<BigDecimal> y) {
        if (x.size() != y.size() || x.size() < 2) {
            return BigDecimal.ZERO;
        }

        int n = x.size();
        BigDecimal sumX = x.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal sumY = y.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avgX = sumX.divide(BigDecimal.valueOf(n), 4, RoundingMode.HALF_UP);
        BigDecimal avgY = sumY.divide(BigDecimal.valueOf(n), 4, RoundingMode.HALF_UP);

        BigDecimal numerator = BigDecimal.ZERO;
        BigDecimal sumXSquared = BigDecimal.ZERO;
        BigDecimal sumYSquared = BigDecimal.ZERO;

        for (int i = 0; i < n; i++) {
            BigDecimal diffX = x.get(i).subtract(avgX);
            BigDecimal diffY = y.get(i).subtract(avgY);
            
            numerator = numerator.add(diffX.multiply(diffY));
            sumXSquared = sumXSquared.add(diffX.pow(2));
            sumYSquared = sumYSquared.add(diffY.pow(2));
        }

        BigDecimal denominator = BigDecimal.valueOf(Math.sqrt(sumXSquared.multiply(sumYSquared).doubleValue()));
        
        if (denominator.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }

        return numerator.divide(denominator, 4, RoundingMode.HALF_UP);
    }

    private List<AnalyticsDTO.TrendData> generatePredictions(List<EnvironmentData> dataList, int hours) {
        List<AnalyticsDTO.TrendData> predictions = new ArrayList<>();
        
        if (dataList.size() < 2) {
            return predictions;
        }

        // 简单的线性预测：基于最近的趋势
        EnvironmentData latest = dataList.get(dataList.size() - 1);
        EnvironmentData previous = dataList.get(dataList.size() - 2);
        
        // 计算变化率
        BigDecimal tempRate = calculateRate(previous.getTemperature(), latest.getTemperature());
        BigDecimal humidityRate = calculateRate(previous.getHumidity(), latest.getHumidity());
        BigDecimal lightRate = calculateRate(previous.getLightIntensity(), latest.getLightIntensity());
        BigDecimal soilRate = calculateRate(previous.getSoilHumidity(), latest.getSoilHumidity());
        BigDecimal co2Rate = calculateRate(previous.getCo2Level(), latest.getCo2Level());

        LocalDateTime currentTime = latest.getRecordedAt();
        
        for (int i = 1; i <= hours; i++) {
            AnalyticsDTO.TrendData prediction = new AnalyticsDTO.TrendData();
            prediction.setTime(currentTime.plusHours(i));
            
            // 基于变化率预测
            prediction.setTemperature(latest.getTemperature().add(tempRate.multiply(BigDecimal.valueOf(i))));
            prediction.setHumidity(latest.getHumidity().add(humidityRate.multiply(BigDecimal.valueOf(i))));
            prediction.setLightIntensity(latest.getLightIntensity().add(lightRate.multiply(BigDecimal.valueOf(i))));
            prediction.setSoilHumidity(latest.getSoilHumidity().add(soilRate.multiply(BigDecimal.valueOf(i))));
            prediction.setCo2Level(latest.getCo2Level().add(co2Rate.multiply(BigDecimal.valueOf(i))));
            
            prediction.setTrendDirection("predicted");
            predictions.add(prediction);
        }

        return predictions;
    }

    private BigDecimal calculateRate(BigDecimal previous, BigDecimal current) {
        if (previous == null || current == null) {
            return BigDecimal.ZERO;
        }
        return current.subtract(previous);
    }

    private double calculateParameterScore(List<EnvironmentData> dataList, String parameter, double minIdeal, double maxIdeal) {
        List<BigDecimal> values = extractParameterValues(dataList, parameter);
        
        if (values.isEmpty()) {
            return 0.0;
        }

        long inRangeCount = values.stream()
            .mapToLong(value -> {
                double val = value.doubleValue();
                return (val >= minIdeal && val <= maxIdeal) ? 1 : 0;
            })
            .sum();

        return (double) inRangeCount / values.size() * 100;
    }

    private String getQualityGrade(double score) {
        if (score >= 90) return "优秀";
        if (score >= 80) return "良好";
        if (score >= 70) return "中等";
        if (score >= 60) return "及格";
        return "较差";
    }

    private Map<String, Object> calculateDistributionStatistics(List<BigDecimal> values) {
        Collections.sort(values);
        
        BigDecimal min = values.get(0);
        BigDecimal max = values.get(values.size() - 1);
        BigDecimal sum = values.stream().reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal avg = sum.divide(BigDecimal.valueOf(values.size()), 2, RoundingMode.HALF_UP);
        
        // 计算四分位数
        int size = values.size();
        BigDecimal q1 = values.get(size / 4);
        BigDecimal q2 = size % 2 == 0 ? 
            values.get(size / 2 - 1).add(values.get(size / 2)).divide(BigDecimal.valueOf(2), 2, RoundingMode.HALF_UP) :
            values.get(size / 2);
        BigDecimal q3 = values.get(size * 3 / 4);

        Map<String, Object> stats = new HashMap<>();
        stats.put("min", min);
        stats.put("max", max);
        stats.put("mean", avg);
        stats.put("median", q2);
        stats.put("q1", q1);
        stats.put("q3", q3);
        stats.put("range", max.subtract(min));

        return stats;
    }

    private List<Map<String, Object>> calculateDistribution(List<BigDecimal> values, int bins) {
        Collections.sort(values);
        
        BigDecimal min = values.get(0);
        BigDecimal max = values.get(values.size() - 1);
        BigDecimal range = max.subtract(min);
        BigDecimal binWidth = range.divide(BigDecimal.valueOf(bins), 2, RoundingMode.HALF_UP);

        List<Map<String, Object>> distribution = new ArrayList<>();
        
        for (int i = 0; i < bins; i++) {
            BigDecimal binStart = min.add(binWidth.multiply(BigDecimal.valueOf(i)));
            BigDecimal binEnd = i == bins - 1 ? max : binStart.add(binWidth);
            
            long count = values.stream()
                .mapToLong(value -> (value.compareTo(binStart) >= 0 && value.compareTo(binEnd) <= 0) ? 1 : 0)
                .sum();

            Map<String, Object> bin = new HashMap<>();
            bin.put("start", binStart);
            bin.put("end", binEnd);
            bin.put("count", count);
            bin.put("percentage", (double) count / values.size() * 100);
            
            distribution.add(bin);
        }

        return distribution;
    }

    private Map<String, Object> calculatePeriodDifferences(AnalyticsDTO.StatisticsSummary summary1, AnalyticsDTO.StatisticsSummary summary2) {
        Map<String, Object> differences = new HashMap<>();
        
        differences.put("temperature", calculateParameterDifference(summary1.getTemperature(), summary2.getTemperature()));
        differences.put("humidity", calculateParameterDifference(summary1.getHumidity(), summary2.getHumidity()));
        differences.put("lightIntensity", calculateParameterDifference(summary1.getLightIntensity(), summary2.getLightIntensity()));
        differences.put("soilHumidity", calculateParameterDifference(summary1.getSoilHumidity(), summary2.getSoilHumidity()));
        differences.put("co2Level", calculateParameterDifference(summary1.getCo2Level(), summary2.getCo2Level()));

        return differences;
    }

    private Map<String, Object> calculateParameterDifference(AnalyticsDTO.ParameterStats stats1, AnalyticsDTO.ParameterStats stats2) {
        Map<String, Object> diff = new HashMap<>();
        
        if (stats1 != null && stats2 != null) {
            diff.put("avgDifference", stats2.getAvg().subtract(stats1.getAvg()));
            diff.put("minDifference", stats2.getMin().subtract(stats1.getMin()));
            diff.put("maxDifference", stats2.getMax().subtract(stats1.getMax()));
            diff.put("stdDevDifference", stats2.getStdDev().subtract(stats1.getStdDev()));
        }

        return diff;
    }

    private String generateComparisonSummary(Map<String, Object> differences) {
        // 简单的对比总结生成
        StringBuilder summary = new StringBuilder();
        summary.append("时间段对比分析：");
        
        // 这里可以根据差异数据生成更详细的总结
        summary.append("第二个时间段相比第一个时间段的主要变化已计算完成。");
        
        return summary.toString();
    }

    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) return null;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return null;
    }
}