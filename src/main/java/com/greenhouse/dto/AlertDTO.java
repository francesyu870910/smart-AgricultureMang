package com.greenhouse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.greenhouse.entity.AlertRecord;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 报警数据传输对象
 * 用于前后端数据交互
 */
public class AlertDTO {

    /**
     * 报警ID
     */
    private Integer id;

    /**
     * 报警类型
     */
    private AlertRecord.AlertType alertType;

    /**
     * 报警类型描述
     */
    private String alertTypeDesc;

    /**
     * 严重程度
     */
    private AlertRecord.Severity severity;

    /**
     * 严重程度描述
     */
    private String severityDesc;

    /**
     * 报警消息
     */
    private String message;

    /**
     * 参数值
     */
    private BigDecimal parameterValue;

    /**
     * 阈值
     */
    private BigDecimal thresholdValue;

    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 是否已解决
     */
    private Boolean isResolved;

    /**
     * 解决时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolvedAt;

    /**
     * 创建时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 持续时间（分钟）
     */
    private Long durationMinutes;

    // 构造函数
    public AlertDTO() {}

    public AlertDTO(AlertRecord alertRecord) {
        this.id = alertRecord.getId();
        this.alertType = alertRecord.getAlertType();
        this.alertTypeDesc = alertRecord.getAlertType() != null ? alertRecord.getAlertType().getDescription() : null;
        this.severity = alertRecord.getSeverity();
        this.severityDesc = alertRecord.getSeverity() != null ? alertRecord.getSeverity().getDescription() : null;
        this.message = alertRecord.getMessage();
        this.parameterValue = alertRecord.getParameterValue();
        this.thresholdValue = alertRecord.getThresholdValue();
        this.deviceId = alertRecord.getDeviceId();
        this.isResolved = alertRecord.getIsResolved();
        this.resolvedAt = alertRecord.getResolvedAt();
        this.createdAt = alertRecord.getCreatedAt();
        
        // 计算持续时间
        if (alertRecord.getCreatedAt() != null) {
            LocalDateTime endTime = alertRecord.getResolvedAt() != null ? 
                alertRecord.getResolvedAt() : LocalDateTime.now();
            this.durationMinutes = java.time.Duration.between(alertRecord.getCreatedAt(), endTime).toMinutes();
        }
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AlertRecord.AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(AlertRecord.AlertType alertType) {
        this.alertType = alertType;
        this.alertTypeDesc = alertType != null ? alertType.getDescription() : null;
    }

    public String getAlertTypeDesc() {
        return alertTypeDesc;
    }

    public void setAlertTypeDesc(String alertTypeDesc) {
        this.alertTypeDesc = alertTypeDesc;
    }

    public AlertRecord.Severity getSeverity() {
        return severity;
    }

    public void setSeverity(AlertRecord.Severity severity) {
        this.severity = severity;
        this.severityDesc = severity != null ? severity.getDescription() : null;
    }

    public String getSeverityDesc() {
        return severityDesc;
    }

    public void setSeverityDesc(String severityDesc) {
        this.severityDesc = severityDesc;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getParameterValue() {
        return parameterValue;
    }

    public void setParameterValue(BigDecimal parameterValue) {
        this.parameterValue = parameterValue;
    }

    public BigDecimal getThresholdValue() {
        return thresholdValue;
    }

    public void setThresholdValue(BigDecimal thresholdValue) {
        this.thresholdValue = thresholdValue;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Boolean getIsResolved() {
        return isResolved;
    }

    public void setIsResolved(Boolean isResolved) {
        this.isResolved = isResolved;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Long durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    @Override
    public String toString() {
        return "AlertDTO{" +
                "id=" + id +
                ", alertType=" + alertType +
                ", alertTypeDesc='" + alertTypeDesc + '\'' +
                ", severity=" + severity +
                ", severityDesc='" + severityDesc + '\'' +
                ", message='" + message + '\'' +
                ", parameterValue=" + parameterValue +
                ", thresholdValue=" + thresholdValue +
                ", deviceId='" + deviceId + '\'' +
                ", isResolved=" + isResolved +
                ", resolvedAt=" + resolvedAt +
                ", createdAt=" + createdAt +
                ", durationMinutes=" + durationMinutes +
                '}';
    }
}