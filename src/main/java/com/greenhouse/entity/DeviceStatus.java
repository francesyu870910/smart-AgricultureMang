package com.greenhouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 设备状态实体类
 * 对应数据库表: device_status
 */
@TableName("device_status")
public class DeviceStatus {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 设备ID
     */
    @TableField("device_id")
    private String deviceId;

    /**
     * 设备名称
     */
    @TableField("device_name")
    private String deviceName;

    /**
     * 设备类型
     */
    @TableField("device_type")
    private DeviceType deviceType;

    /**
     * 设备状态
     */
    @TableField("status")
    private DeviceStatusEnum status;

    /**
     * 是否运行中
     */
    @TableField("is_running")
    private Boolean isRunning;

    /**
     * 功率百分比
     */
    @TableField("power_level")
    private BigDecimal powerLevel;

    /**
     * 最后维护日期
     */
    @TableField("last_maintenance")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate lastMaintenance;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    // 设备类型枚举
    public enum DeviceType {
        heater("heater", "加热器"),
        cooler("cooler", "冷却器"),
        humidifier("humidifier", "加湿器"),
        dehumidifier("dehumidifier", "除湿器"),
        fan("fan", "风扇"),
        light("light", "补光灯"),
        irrigation("irrigation", "灌溉系统");

        private final String code;
        private final String description;

        DeviceType(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    // 设备状态枚举
    public enum DeviceStatusEnum {
        online("online", "在线"),
        offline("offline", "离线"),
        error("error", "故障");

        private final String code;
        private final String description;

        DeviceStatusEnum(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    // 构造函数
    public DeviceStatus() {}

    public DeviceStatus(String deviceId, String deviceName, DeviceType deviceType) {
        this.deviceId = deviceId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.status = DeviceStatusEnum.offline;
        this.isRunning = false;
        this.powerLevel = BigDecimal.ZERO;
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public DeviceStatusEnum getStatus() {
        return status;
    }

    public void setStatus(DeviceStatusEnum status) {
        this.status = status;
    }

    public Boolean getIsRunning() {
        return isRunning;
    }

    public void setIsRunning(Boolean isRunning) {
        this.isRunning = isRunning;
    }

    public BigDecimal getPowerLevel() {
        return powerLevel;
    }

    public void setPowerLevel(BigDecimal powerLevel) {
        this.powerLevel = powerLevel;
    }

    public LocalDate getLastMaintenance() {
        return lastMaintenance;
    }

    public void setLastMaintenance(LocalDate lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public String toString() {
        return "DeviceStatus{" +
                "id=" + id +
                ", deviceId='" + deviceId + '\'' +
                ", deviceName='" + deviceName + '\'' +
                ", deviceType=" + deviceType +
                ", status=" + status +
                ", isRunning=" + isRunning +
                ", powerLevel=" + powerLevel +
                ", lastMaintenance=" + lastMaintenance +
                ", createdAt=" + createdAt +
                ", updatedAt=" + updatedAt +
                '}';
    }
}