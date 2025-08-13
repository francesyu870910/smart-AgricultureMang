package com.greenhouse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 环境数据统计传输对象
 * 用于展示环境数据的统计信息
 */
public class EnvironmentStatisticsDTO {

    /**
     * 温室ID
     */
    private String greenhouseId;

    /**
     * 统计开始时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 统计结束时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    /**
     * 数据记录总数
     */
    private Long totalRecords;

    // 温度统计
    private BigDecimal avgTemperature;
    private BigDecimal minTemperature;
    private BigDecimal maxTemperature;

    // 湿度统计
    private BigDecimal avgHumidity;
    private BigDecimal minHumidity;
    private BigDecimal maxHumidity;

    // 光照强度统计
    private BigDecimal avgLightIntensity;
    private BigDecimal minLightIntensity;
    private BigDecimal maxLightIntensity;

    // 土壤湿度统计
    private BigDecimal avgSoilHumidity;
    private BigDecimal minSoilHumidity;
    private BigDecimal maxSoilHumidity;

    // CO2浓度统计
    private BigDecimal avgCo2Level;
    private BigDecimal minCo2Level;
    private BigDecimal maxCo2Level;

    // 构造函数
    public EnvironmentStatisticsDTO() {}

    // Getter和Setter方法
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

    public Long getTotalRecords() {
        return totalRecords;
    }

    public void setTotalRecords(Long totalRecords) {
        this.totalRecords = totalRecords;
    }

    public BigDecimal getAvgTemperature() {
        return avgTemperature;
    }

    public void setAvgTemperature(BigDecimal avgTemperature) {
        this.avgTemperature = avgTemperature;
    }

    public BigDecimal getMinTemperature() {
        return minTemperature;
    }

    public void setMinTemperature(BigDecimal minTemperature) {
        this.minTemperature = minTemperature;
    }

    public BigDecimal getMaxTemperature() {
        return maxTemperature;
    }

    public void setMaxTemperature(BigDecimal maxTemperature) {
        this.maxTemperature = maxTemperature;
    }

    public BigDecimal getAvgHumidity() {
        return avgHumidity;
    }

    public void setAvgHumidity(BigDecimal avgHumidity) {
        this.avgHumidity = avgHumidity;
    }

    public BigDecimal getMinHumidity() {
        return minHumidity;
    }

    public void setMinHumidity(BigDecimal minHumidity) {
        this.minHumidity = minHumidity;
    }

    public BigDecimal getMaxHumidity() {
        return maxHumidity;
    }

    public void setMaxHumidity(BigDecimal maxHumidity) {
        this.maxHumidity = maxHumidity;
    }

    public BigDecimal getAvgLightIntensity() {
        return avgLightIntensity;
    }

    public void setAvgLightIntensity(BigDecimal avgLightIntensity) {
        this.avgLightIntensity = avgLightIntensity;
    }

    public BigDecimal getMinLightIntensity() {
        return minLightIntensity;
    }

    public void setMinLightIntensity(BigDecimal minLightIntensity) {
        this.minLightIntensity = minLightIntensity;
    }

    public BigDecimal getMaxLightIntensity() {
        return maxLightIntensity;
    }

    public void setMaxLightIntensity(BigDecimal maxLightIntensity) {
        this.maxLightIntensity = maxLightIntensity;
    }

    public BigDecimal getAvgSoilHumidity() {
        return avgSoilHumidity;
    }

    public void setAvgSoilHumidity(BigDecimal avgSoilHumidity) {
        this.avgSoilHumidity = avgSoilHumidity;
    }

    public BigDecimal getMinSoilHumidity() {
        return minSoilHumidity;
    }

    public void setMinSoilHumidity(BigDecimal minSoilHumidity) {
        this.minSoilHumidity = minSoilHumidity;
    }

    public BigDecimal getMaxSoilHumidity() {
        return maxSoilHumidity;
    }

    public void setMaxSoilHumidity(BigDecimal maxSoilHumidity) {
        this.maxSoilHumidity = maxSoilHumidity;
    }

    public BigDecimal getAvgCo2Level() {
        return avgCo2Level;
    }

    public void setAvgCo2Level(BigDecimal avgCo2Level) {
        this.avgCo2Level = avgCo2Level;
    }

    public BigDecimal getMinCo2Level() {
        return minCo2Level;
    }

    public void setMinCo2Level(BigDecimal minCo2Level) {
        this.minCo2Level = minCo2Level;
    }

    public BigDecimal getMaxCo2Level() {
        return maxCo2Level;
    }

    public void setMaxCo2Level(BigDecimal maxCo2Level) {
        this.maxCo2Level = maxCo2Level;
    }

    @Override
    public String toString() {
        return "EnvironmentStatisticsDTO{" +
                "greenhouseId='" + greenhouseId + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", totalRecords=" + totalRecords +
                ", avgTemperature=" + avgTemperature +
                ", minTemperature=" + minTemperature +
                ", maxTemperature=" + maxTemperature +
                ", avgHumidity=" + avgHumidity +
                ", minHumidity=" + minHumidity +
                ", maxHumidity=" + maxHumidity +
                ", avgLightIntensity=" + avgLightIntensity +
                ", minLightIntensity=" + minLightIntensity +
                ", maxLightIntensity=" + maxLightIntensity +
                ", avgSoilHumidity=" + avgSoilHumidity +
                ", minSoilHumidity=" + minSoilHumidity +
                ", maxSoilHumidity=" + maxSoilHumidity +
                ", avgCo2Level=" + avgCo2Level +
                ", minCo2Level=" + minCo2Level +
                ", maxCo2Level=" + maxCo2Level +
                '}';
    }
}