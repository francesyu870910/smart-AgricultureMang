package com.greenhouse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 历史数据查询传输对象
 * 用于历史数据查询条件和分页参数
 */
public class HistoryQueryDTO {

    /**
     * 温室ID
     */
    private String greenhouseId;

    /**
     * 开始时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;

    /**
     * 参数类型过滤 (temperature, humidity, light_intensity, soil_humidity, co2_level)
     */
    private String parameterType;

    /**
     * 最小值过滤
     */
    private BigDecimal minValue;

    /**
     * 最大值过滤
     */
    private BigDecimal maxValue;

    /**
     * 页码 (从1开始)
     */
    private Integer pageNum = 1;

    /**
     * 每页大小
     */
    private Integer pageSize = 20;

    /**
     * 排序字段 (recorded_at, temperature, humidity等)
     */
    private String sortField = "recorded_at";

    /**
     * 排序方向 (ASC, DESC)
     */
    private String sortOrder = "DESC";

    // 构造函数
    public HistoryQueryDTO() {}

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

    public String getParameterType() {
        return parameterType;
    }

    public void setParameterType(String parameterType) {
        this.parameterType = parameterType;
    }

    public BigDecimal getMinValue() {
        return minValue;
    }

    public void setMinValue(BigDecimal minValue) {
        this.minValue = minValue;
    }

    public BigDecimal getMaxValue() {
        return maxValue;
    }

    public void setMaxValue(BigDecimal maxValue) {
        this.maxValue = maxValue;
    }

    public Integer getPageNum() {
        return pageNum;
    }

    public void setPageNum(Integer pageNum) {
        this.pageNum = pageNum;
    }

    public Integer getPageSize() {
        return pageSize;
    }

    public void setPageSize(Integer pageSize) {
        this.pageSize = pageSize;
    }

    public String getSortField() {
        return sortField;
    }

    public void setSortField(String sortField) {
        this.sortField = sortField;
    }

    public String getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(String sortOrder) {
        this.sortOrder = sortOrder;
    }

    @Override
    public String toString() {
        return "HistoryQueryDTO{" +
                "greenhouseId='" + greenhouseId + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", parameterType='" + parameterType + '\'' +
                ", minValue=" + minValue +
                ", maxValue=" + maxValue +
                ", pageNum=" + pageNum +
                ", pageSize=" + pageSize +
                ", sortField='" + sortField + '\'' +
                ", sortOrder='" + sortOrder + '\'' +
                '}';
    }
}