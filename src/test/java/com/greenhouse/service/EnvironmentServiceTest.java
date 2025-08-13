package com.greenhouse.service;

import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.service.impl.EnvironmentServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 环境数据服务测试类
 */
public class EnvironmentServiceTest {

    private EnvironmentServiceImpl environmentService;

    @BeforeEach
    public void setUp() {
        environmentService = new EnvironmentServiceImpl();
    }

    @Test
    public void testValidateEnvironmentData() {
        // 测试有效数据
        EnvironmentData validData = new EnvironmentData();
        validData.setGreenhouseId("GH001");
        validData.setTemperature(new BigDecimal("25.5"));
        validData.setHumidity(new BigDecimal("60.0"));
        validData.setLightIntensity(new BigDecimal("30000.0"));
        validData.setSoilHumidity(new BigDecimal("50.0"));
        validData.setCo2Level(new BigDecimal("400.0"));
        
        assertTrue(environmentService.validateEnvironmentData(validData));
        
        // 测试无效数据 - 空温室ID
        EnvironmentData invalidData1 = new EnvironmentData();
        invalidData1.setGreenhouseId("");
        assertFalse(environmentService.validateEnvironmentData(invalidData1));
        
        // 测试无效数据 - 温度超出范围
        EnvironmentData invalidData2 = new EnvironmentData();
        invalidData2.setGreenhouseId("GH001");
        invalidData2.setTemperature(new BigDecimal("100.0")); // 超出范围
        invalidData2.setHumidity(new BigDecimal("60.0"));
        invalidData2.setLightIntensity(new BigDecimal("30000.0"));
        invalidData2.setSoilHumidity(new BigDecimal("50.0"));
        assertFalse(environmentService.validateEnvironmentData(invalidData2));
        
        // 测试无效数据 - 湿度超出范围
        EnvironmentData invalidData3 = new EnvironmentData();
        invalidData3.setGreenhouseId("GH001");
        invalidData3.setTemperature(new BigDecimal("25.0"));
        invalidData3.setHumidity(new BigDecimal("150.0")); // 超出范围
        invalidData3.setLightIntensity(new BigDecimal("30000.0"));
        invalidData3.setSoilHumidity(new BigDecimal("50.0"));
        assertFalse(environmentService.validateEnvironmentData(invalidData3));
    }

    @Test
    public void testCheckEnvironmentStatus() {
        // 测试低温、低湿度、低光照
        EnvironmentData lowData = new EnvironmentData();
        lowData.setTemperature(new BigDecimal("10.0")); // 低温
        lowData.setHumidity(new BigDecimal("30.0")); // 低湿度
        lowData.setLightIntensity(new BigDecimal("5000.0")); // 低光照
        
        Map<String, String> lowStatus = environmentService.checkEnvironmentStatus(lowData);
        
        assertEquals("low", lowStatus.get("temperatureStatus"));
        assertEquals("low", lowStatus.get("humidityStatus"));
        assertEquals("low", lowStatus.get("lightStatus"));
        
        // 测试高温、高湿度、高光照
        EnvironmentData highData = new EnvironmentData();
        highData.setTemperature(new BigDecimal("40.0")); // 高温
        highData.setHumidity(new BigDecimal("90.0")); // 高湿度
        highData.setLightIntensity(new BigDecimal("60000.0")); // 高光照
        
        Map<String, String> highStatus = environmentService.checkEnvironmentStatus(highData);
        
        assertEquals("high", highStatus.get("temperatureStatus"));
        assertEquals("high", highStatus.get("humidityStatus"));
        assertEquals("high", highStatus.get("lightStatus"));
        
        // 测试正常范围
        EnvironmentData normalData = new EnvironmentData();
        normalData.setTemperature(new BigDecimal("25.0")); // 正常温度
        normalData.setHumidity(new BigDecimal("60.0")); // 正常湿度
        normalData.setLightIntensity(new BigDecimal("30000.0")); // 正常光照
        
        Map<String, String> normalStatus = environmentService.checkEnvironmentStatus(normalData);
        
        assertEquals("normal", normalStatus.get("temperatureStatus"));
        assertEquals("normal", normalStatus.get("humidityStatus"));
        assertEquals("normal", normalStatus.get("lightStatus"));
    }
}