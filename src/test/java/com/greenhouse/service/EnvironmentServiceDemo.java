package com.greenhouse.service;

import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.service.impl.EnvironmentServiceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

/**
 * 环境数据服务功能演示
 */
public class EnvironmentServiceDemo {

    public static void main(String[] args) {
        EnvironmentServiceImpl environmentService = new EnvironmentServiceImpl();
        
        System.out.println("=== 温室数字化监控系统 - 环境数据服务演示 ===\n");
        
        // 创建测试环境数据
        EnvironmentData testData = new EnvironmentData();
        testData.setGreenhouseId("GH001");
        testData.setTemperature(new BigDecimal("28.5"));
        testData.setHumidity(new BigDecimal("65.0"));
        testData.setLightIntensity(new BigDecimal("25000.0"));
        testData.setSoilHumidity(new BigDecimal("55.0"));
        testData.setCo2Level(new BigDecimal("450.0"));
        testData.setRecordedAt(LocalDateTime.now());
        
        System.out.println("1. 环境数据验证功能演示:");
        System.out.println("测试数据: " + testData);
        boolean isValid = environmentService.validateEnvironmentData(testData);
        System.out.println("数据验证结果: " + (isValid ? "有效" : "无效"));
        System.out.println();
        
        System.out.println("2. 环境状态检查功能演示:");
        Map<String, String> status = environmentService.checkEnvironmentStatus(testData);
        System.out.println("温度状态: " + status.get("temperatureStatus"));
        System.out.println("湿度状态: " + status.get("humidityStatus"));
        System.out.println("光照状态: " + status.get("lightStatus"));
        System.out.println();
        
        // 测试异常数据
        System.out.println("3. 异常数据检测演示:");
        EnvironmentData abnormalData = new EnvironmentData();
        abnormalData.setGreenhouseId("GH001");
        abnormalData.setTemperature(new BigDecimal("45.0")); // 高温
        abnormalData.setHumidity(new BigDecimal("20.0")); // 低湿度
        abnormalData.setLightIntensity(new BigDecimal("5000.0")); // 低光照
        abnormalData.setSoilHumidity(new BigDecimal("15.0")); // 低土壤湿度
        abnormalData.setCo2Level(new BigDecimal("1200.0")); // 高CO2
        
        System.out.println("异常数据: " + abnormalData);
        Map<String, String> abnormalStatus = environmentService.checkEnvironmentStatus(abnormalData);
        System.out.println("温度状态: " + abnormalStatus.get("temperatureStatus") + " (阈值: 15-35°C)");
        System.out.println("湿度状态: " + abnormalStatus.get("humidityStatus") + " (阈值: 40-80%)");
        System.out.println("光照状态: " + abnormalStatus.get("lightStatus") + " (阈值: 10000-50000 lux)");
        System.out.println();
        
        System.out.println("4. 数据验证边界测试:");
        // 测试边界值
        EnvironmentData boundaryData = new EnvironmentData();
        boundaryData.setGreenhouseId("GH001");
        boundaryData.setTemperature(new BigDecimal("15.0")); // 最低阈值
        boundaryData.setHumidity(new BigDecimal("40.0")); // 最低阈值
        boundaryData.setLightIntensity(new BigDecimal("10000.0")); // 最低阈值
        boundaryData.setSoilHumidity(new BigDecimal("30.0")); // 最低阈值
        boundaryData.setCo2Level(new BigDecimal("300.0")); // 最低阈值
        
        boolean boundaryValid = environmentService.validateEnvironmentData(boundaryData);
        Map<String, String> boundaryStatus = environmentService.checkEnvironmentStatus(boundaryData);
        
        System.out.println("边界数据验证: " + (boundaryValid ? "有效" : "无效"));
        System.out.println("边界数据状态: 温度=" + boundaryStatus.get("temperatureStatus") + 
                         ", 湿度=" + boundaryStatus.get("humidityStatus") + 
                         ", 光照=" + boundaryStatus.get("lightStatus"));
        
        System.out.println("\n=== 环境数据服务功能演示完成 ===");
    }
}