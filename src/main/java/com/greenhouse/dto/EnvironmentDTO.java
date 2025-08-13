package com.greenhouse.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 环境数据传输对象
 * 用于前端展示和数据传输
 */
public class EnvironmentDTO {

    /**
     * 主键ID
     */
    private Integer id;

    /**
     * 温室ID
     */
    private String greenhouseId;

    /**
     * 温度(°C)
     */
    private BigDecimal temperature;

    /**
     * 湿度(%)
     */
    private BigDecimal humidity;

    /**
     * 光照强度(lux)
     */
    private BigDecimal lightIntensity;

    /**
     * 土壤湿度(%)
     */
    private BigDecimal soilHumidity;

    /**
     * CO2浓度(ppm)
     */
    private BigDecimal co2Level;

    /**
     * 记录时间
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime recordedAt;

    /**
     * 温度状态 (normal, high, low)
     */
    private String temperatureStatus;

    /**
     * 湿度状态 (normal, high, low)
     */
    private String humidityStatus;

    /**
     * 光照状态 (normal, high, low)
     */
    private String lightStatus;

    // 构造函数
    public EnvironmentDTO() {}

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

    public String getTemperatureStatus() {
        return temperatureStatus;
    }

    public void setTemperatureStatus(String temperatureStatus) {
        this.temperatureStatus = temperatureStatus;
    }

    public String getHumidityStatus() {
        return humidityStatus;
    }

    public void setHumidityStatus(String humidityStatus) {
        this.humidityStatus = humidityStatus;
    }

    public String getLightStatus() {
        return lightStatus;
    }

    public void setLightStatus(String lightStatus) {
        this.lightStatus = lightStatus;
    }

    @Override
    public String toString() {
        return "EnvironmentDTO{" +
                "id=" + id +
                ", greenhouseId='" + greenhouseId + '\'' +
                ", temperature=" + temperature +
                ", humidity=" + humidity +
                ", lightIntensity=" + lightIntensity +
                ", soilHumidity=" + soilHumidity +
                ", co2Level=" + co2Level +
                ", recordedAt=" + recordedAt +
                ", temperatureStatus='" + temperatureStatus + '\'' +
                ", humidityStatus='" + humidityStatus + '\'' +
                ", lightStatus='" + lightStatus + '\'' +
                '}';
    }
}