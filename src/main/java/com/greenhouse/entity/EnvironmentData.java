package com.greenhouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 环境数据实体类
 * 对应数据库表: environment_data
 */
@TableName("environment_data")
public class EnvironmentData {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 温室ID
     */
    @TableField("greenhouse_id")
    private String greenhouseId;

    /**
     * 温度(°C)
     */
    @TableField("temperature")
    private BigDecimal temperature;

    /**
     * 湿度(%)
     */
    @TableField("humidity")
    private BigDecimal humidity;

    /**
     * 光照强度(lux)
     */
    @TableField("light_intensity")
    private BigDecimal lightIntensity;

    /**
     * 土壤湿度(%)
     */
    @TableField("soil_humidity")
    private BigDecimal soilHumidity;

    /**
     * CO2浓度(ppm)
     */
    @TableField("co2_level")
    private BigDecimal co2Level;

    /**
     * 记录时间
     */
    @TableField("recorded_at")
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime recordedAt;

    // 构造函数
    public EnvironmentData() {}

    public EnvironmentData(String greenhouseId, BigDecimal temperature, BigDecimal humidity, 
                          BigDecimal lightIntensity, BigDecimal soilHumidity, BigDecimal co2Level) {
        this.greenhouseId = greenhouseId;
        this.temperature = temperature;
        this.humidity = humidity;
        this.lightIntensity = lightIntensity;
        this.soilHumidity = soilHumidity;
        this.co2Level = co2Level;
        this.recordedAt = LocalDateTime.now();
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(String greenhouseId) {
        this.greenhouseId = greenhouseId;
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

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }

    @Override
    public String toString() {
        return "EnvironmentData{" +
                "id=" + id +
                ", greenhouseId='" + greenhouseId + '\'' +
                ", temperature=" + temperature +
                ", humidity=" + humidity +
                ", lightIntensity=" + lightIntensity +
                ", soilHumidity=" + soilHumidity +
                ", co2Level=" + co2Level +
                ", recordedAt=" + recordedAt +
                '}';
    }
}