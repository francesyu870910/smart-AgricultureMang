package com.greenhouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 报警记录实体类
 * 对应数据库表: alert_records
 */
@TableName("alert_records")
public class AlertRecord {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 报警类型
     */
    @TableField("alert_type")
    private AlertType alertType;

    /**
     * 严重程度
     */
    @TableField("severity")
    private Severity severity;

    /**
     * 报警消息
     */
    @TableField("message")
    private String message;

    /**
     * 参数值
     */
    @TableField("parameter_value")
    private BigDecimal parameterValue;

    /**
     * 阈值
     */
    @TableField("threshold_value")
    private BigDecimal thresholdValue;

    /**
     * 设备ID
     */
    @TableField("device_id")
    private String deviceId;

    /**
     * 是否已解决
     */
    @TableField("is_resolved")
    private Boolean isResolved;

    /**
     * 解决时间
     */
    @TableField("resolved_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime resolvedAt;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 报警类型枚举
    public enum AlertType {
        TEMPERATURE("temperature", "温度报警"),
        HUMIDITY("humidity", "湿度报警"),
        LIGHT("light", "光照报警"),
        DEVICE_ERROR("device_error", "设备故障"),
        SYSTEM_ERROR("system_error", "系统错误");

        private final String code;
        private final String description;

        AlertType(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }

        // 根据code获取枚举值
        public static AlertType fromCode(String code) {
            for (AlertType type : AlertType.values()) {
                if (type.code.equals(code)) {
                    return type;
                }
            }
            throw new IllegalArgumentException("Unknown AlertType code: " + code);
        }
    }

    // 严重程度枚举
    public enum Severity {
        LOW("low", "低"),
        MEDIUM("medium", "中"),
        HIGH("high", "高"),
        CRITICAL("critical", "紧急");

        private final String code;
        private final String description;

        Severity(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }

        // 根据code获取枚举值
        public static Severity fromCode(String code) {
            for (Severity severity : Severity.values()) {
                if (severity.code.equals(code)) {
                    return severity;
                }
            }
            throw new IllegalArgumentException("Unknown Severity code: " + code);
        }
    }

    // 构造函数
    public AlertRecord() {}

    public AlertRecord(AlertType alertType, Severity severity, String message) {
        this.alertType = alertType;
        this.severity = severity;
        this.message = message;
        this.isResolved = false;
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public AlertType getAlertType() {
        return alertType;
    }

    public void setAlertType(AlertType alertType) {
        this.alertType = alertType;
    }

    public Severity getSeverity() {
        return severity;
    }

    public void setSeverity(Severity severity) {
        this.severity = severity;
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

    @Override
    public String toString() {
        return "AlertRecord{" +
                "id=" + id +
                ", alertType=" + alertType +
                ", severity=" + severity +
                ", message='" + message + '\'' +
                ", parameterValue=" + parameterValue +
                ", thresholdValue=" + thresholdValue +
                ", deviceId='" + deviceId + '\'' +
                ", isResolved=" + isResolved +
                ", resolvedAt=" + resolvedAt +
                ", createdAt=" + createdAt +
                '}';
    }
}