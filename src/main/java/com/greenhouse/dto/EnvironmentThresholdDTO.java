package com.greenhouse.dto;

import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.NotBlank;
import java.math.BigDecimal;

/**
 * 环境阈值设置传输对象
 * 用于设置和获取环境参数的阈值
 */
public class EnvironmentThresholdDTO {

    /**
     * 温室ID
     */
    @NotBlank(message = "温室ID不能为空")
    private String greenhouseId;

    /**
     * 温度最小阈值(°C)
     */
    private BigDecimal minTemperature;

    /**
     * 温度最大阈值(°C)
     */
    private BigDecimal maxTemperature;

    /**
     * 湿度最小阈值(%)
     */
    @DecimalMin(value = "0.0", message = "湿度最小阈值不能小于0")
    @DecimalMax(value = "100.0", message = "湿度最小阈值不能大于100")
    private BigDecimal minHumidity;

    /**
     * 湿度最大阈值(%)
     */
    @DecimalMin(value = "0.0", message = "湿度最大阈值不能小于0")
    @DecimalMax(value = "100.0", message = "湿度最大阈值不能大于100")
    private BigDecimal maxHumidity;

    /**
     * 光照强度最小阈值(lux)
     */
    @DecimalMin(value = "0.0", message = "光照强度最小阈值不能小于0")
    private BigDecimal minLightIntensity;

    /**
     * 光照强度最大阈值(lux)
     */
    @DecimalMin(value = "0.0", message = "光照强度最大阈值不能小于0")
    private BigDecimal maxLightIntensity;

    /**
     * 土壤湿度最小阈值(%)
     */
    @DecimalMin(value = "0.0", message = "土壤湿度最小阈值不能小于0")
    @DecimalMax(value = "100.0", message = "土壤湿度最小阈值不能大于100")
    private BigDecimal minSoilHumidity;

    /**
     * 土壤湿度最大阈值(%)
     */
    @DecimalMin(value = "0.0", message = "土壤湿度最大阈值不能小于0")
    @DecimalMax(value = "100.0", message = "土壤湿度最大阈值不能大于100")
    private BigDecimal maxSoilHumidity;

    /**
     * CO2浓度最小阈值(ppm)
     */
    @DecimalMin(value = "0.0", message = "CO2浓度最小阈值不能小于0")
    private BigDecimal minCo2Level;

    /**
     * CO2浓度最大阈值(ppm)
     */
    @DecimalMin(value = "0.0", message = "CO2浓度最大阈值不能小于0")
    private BigDecimal maxCo2Level;

    // 构造函数
    public EnvironmentThresholdDTO() {}

    // Getter和Setter方法
    public String getGreenhouseId() {
        return greenhouseId;
    }

    public void setGreenhouseId(String greenhouseId) {
        this.greenhouseId = greenhouseId;
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
        return "EnvironmentThresholdDTO{" +
                "greenhouseId='" + greenhouseId + '\'' +
                ", minTemperature=" + minTemperature +
                ", maxTemperature=" + maxTemperature +
                ", minHumidity=" + minHumidity +
                ", maxHumidity=" + maxHumidity +
                ", minLightIntensity=" + minLightIntensity +
                ", maxLightIntensity=" + maxLightIntensity +
                ", minSoilHumidity=" + minSoilHumidity +
                ", maxSoilHumidity=" + maxSoilHumidity +
                ", minCo2Level=" + minCo2Level +
                ", maxCo2Level=" + maxCo2Level +
                '}';
    }
}