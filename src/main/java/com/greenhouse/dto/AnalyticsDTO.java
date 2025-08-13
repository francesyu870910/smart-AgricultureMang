package com.greenhouse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 数据分析传输对象
 * 用于数据分析结果的传输和展示
 */
public class AnalyticsDTO {

    /**
     * 分析类型 (summary, trend, anomaly, correlation)
     */
    private String analysisType;

    /**
     * 温室ID
     */
    private String greenhouseId;

    /**
     * 分析时间范围开始
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 分析时间范围结束
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    /**
     * 统计摘要数据
     */
    private StatisticsSummary statisticsSummary;

    /**
     * 趋势分析数据
     */
    private List<TrendData> trendData;

    /**
     * 异常检测结果
     */
    private List<AnomalyData> anomalies;

    /**
     * 相关性分析结果
     */
    private Map<String, BigDecimal> correlations;

    /**
     * 分析生成时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime generatedAt;

    // 构造函数
    public AnalyticsDTO() {
        this.generatedAt = LocalDateTime.now();
    }

    // 内部类：统计摘要
    public static class StatisticsSummary {
        private ParameterStats temperature;
        private ParameterStats humidity;
        private ParameterStats lightIntensity;
        private ParameterStats soilHumidity;
        private ParameterStats co2Level;
        private long totalRecords;

        // 构造函数
        public StatisticsSummary() {}

        // Getter和Setter方法
        public ParameterStats getTemperature() {
            return temperature;
        }

        public void setTemperature(ParameterStats temperature) {
            this.temperature = temperature;
        }

        public ParameterStats getHumidity() {
            return humidity;
        }

        public void setHumidity(ParameterStats humidity) {
            this.humidity = humidity;
        }

        public ParameterStats getLightIntensity() {
            return lightIntensity;
        }

        public void setLightIntensity(ParameterStats lightIntensity) {
            this.lightIntensity = lightIntensity;
        }

        public ParameterStats getSoilHumidity() {
            return soilHumidity;
        }

        public void setSoilHumidity(ParameterStats soilHumidity) {
            this.soilHumidity = soilHumidity;
        }

        public ParameterStats getCo2Level() {
            return co2Level;
        }

        public void setCo2Level(ParameterStats co2Level) {
            this.co2Level = co2Level;
        }

        public long getTotalRecords() {
            return totalRecords;
        }

        public void setTotalRecords(long totalRecords) {
            this.totalRecords = totalRecords;
        }
    }

    // 内部类：参数统计
    public static class ParameterStats {
        private BigDecimal min;
        private BigDecimal max;
        private BigDecimal avg;
        private BigDecimal stdDev;
        private BigDecimal median;

        // 构造函数
        public ParameterStats() {}

        public ParameterStats(BigDecimal min, BigDecimal max, BigDecimal avg, BigDecimal stdDev, BigDecimal median) {
            this.min = min;
            this.max = max;
            this.avg = avg;
            this.stdDev = stdDev;
            this.median = median;
        }

        // Getter和Setter方法
        public BigDecimal getMin() {
            return min;
        }

        public void setMin(BigDecimal min) {
            this.min = min;
        }

        public BigDecimal getMax() {
            return max;
        }

        public void setMax(BigDecimal max) {
            this.max = max;
        }

        public BigDecimal getAvg() {
            return avg;
        }

        public void setAvg(BigDecimal avg) {
            this.avg = avg;
        }

        public BigDecimal getStdDev() {
            return stdDev;
        }

        public void setStdDev(BigDecimal stdDev) {
            this.stdDev = stdDev;
        }

        public BigDecimal getMedian() {
            return median;
        }

        public void setMedian(BigDecimal median) {
            this.median = median;
        }
    }

    // 内部类：趋势数据
    public static class TrendData {
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime time;
        private BigDecimal temperature;
        private BigDecimal humidity;
        private BigDecimal lightIntensity;
        private BigDecimal soilHumidity;
        private BigDecimal co2Level;
        private String trendDirection; // up, down, stable

        // 构造函数
        public TrendData() {}

        // Getter和Setter方法
        public LocalDateTime getTime() {
            return time;
        }

        public void setTime(LocalDateTime time) {
            this.time = time;
        }

        public BigDecimal getTemperature() {
            return temperature;
        }

        public void setTemperature(BigDecimal temperature) {
            this.temperature = temperature;
        }

        public BigDecimal getHumidity() {
            return humidity;
        }

        public void setHumidity(BigDecimal humidity) {
            this.humidity = humidity;
        }

        public BigDecimal getLightIntensity() {
            return lightIntensity;
        }

        public void setLightIntensity(BigDecimal lightIntensity) {
            this.lightIntensity = lightIntensity;
        }

        public BigDecimal getSoilHumidity() {
            return soilHumidity;
        }

        public void setSoilHumidity(BigDecimal soilHumidity) {
            this.soilHumidity = soilHumidity;
        }

        public BigDecimal getCo2Level() {
            return co2Level;
        }

        public void setCo2Level(BigDecimal co2Level) {
            this.co2Level = co2Level;
        }

        public String getTrendDirection() {
            return trendDirection;
        }

        public void setTrendDirection(String trendDirection) {
            this.trendDirection = trendDirection;
        }
    }

    // 内部类：异常数据
    public static class AnomalyData {
        @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
        private LocalDateTime time;
        private String parameter; // temperature, humidity, light_intensity, soil_humidity, co2_level
        private BigDecimal value;
        private BigDecimal expectedValue;
        private BigDecimal deviation;
        private String severity; // low, medium, high, critical
        private String description;

        // 构造函数
        public AnomalyData() {}

        public AnomalyData(LocalDateTime time, String parameter, BigDecimal value, 
                          BigDecimal expectedValue, String severity, String description) {
            this.time = time;
            this.parameter = parameter;
            this.value = value;
            this.expectedValue = expectedValue;
            this.deviation = value.subtract(expectedValue).abs();
            this.severity = severity;
            this.description = description;
        }

        // Getter和Setter方法
        public LocalDateTime getTime() {
            return time;
        }

        public void setTime(LocalDateTime time) {
            this.time = time;
        }

        public String getParameter() {
            return parameter;
        }

        public void setParameter(String parameter) {
            this.parameter = parameter;
        }

        public BigDecimal getValue() {
            return value;
        }

        public void setValue(BigDecimal value) {
            this.value = value;
        }

        public BigDecimal getExpectedValue() {
            return expectedValue;
        }

        public void setExpectedValue(BigDecimal expectedValue) {
            this.expectedValue = expectedValue;
        }

        public BigDecimal getDeviation() {
            return deviation;
        }

        public void setDeviation(BigDecimal deviation) {
            this.deviation = deviation;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }
    }

    // Getter和Setter方法
    public String getAnalysisType() {
        return analysisType;
    }

    public void setAnalysisType(String analysisType) {
        this.analysisType = analysisType;
    }

    public String getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(String greenhouseId) {
        this.greenhouseId = greenhouseId;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public StatisticsSummary getStatisticsSummary() {
        return statisticsSummary;
    }

    public void setStatisticsSummary(StatisticsSummary statisticsSummary) {
        this.statisticsSummary = statisticsSummary;
    }

    public List<TrendData> getTrendData() {
        return trendData;
    }

    public void setTrendData(List<TrendData> trendData) {
        this.trendData = trendData;
    }

    public List<AnomalyData> getAnomalies() {
        return anomalies;
    }

    public void setAnomalies(List<AnomalyData> anomalies) {
        this.anomalies = anomalies;
    }

    public Map<String, BigDecimal> getCorrelations() {
        return correlations;
    }

    public void setCorrelations(Map<String, BigDecimal> correlations) {
        this.correlations = correlations;
    }

    public LocalDateTime getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(LocalDateTime generatedAt) {
        this.generatedAt = generatedAt;
    }

    @Override
    public String toString() {
        return "AnalyticsDTO{" +
                "analysisType='" + analysisType + '\'' +
                ", greenhouseId='" + greenhouseId + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", generatedAt=" + generatedAt +
                '}';
    }
}