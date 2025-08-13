package com.greenhouse.service;

import com.greenhouse.dto.AlertDTO;
import com.greenhouse.entity.AlertRecord;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.service.impl.AlertServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 报警服务测试类
 */
@SpringBootTest
@ActiveProfiles("test")
public class AlertServiceTest {

    @Resource
    private AlertService alertService;

    @Test
    public void testTriggerEnvironmentAlert() {
        // 测试触发环境报警
        AlertDTO alert = alertService.triggerEnvironmentAlert(
                AlertRecord.AlertType.TEMPERATURE,
                new BigDecimal("45.0"),
                new BigDecimal("35.0"),
                "温度过高测试"
        );
        
        System.out.println("触发的报警: " + alert);
        assert alert != null;
        assert alert.getAlertType() == AlertRecord.AlertType.TEMPERATURE;
    }

    @Test
    public void testTriggerDeviceAlert() {
        // 测试触发设备报警
        AlertDTO alert = alertService.triggerDeviceAlert("DEVICE_001", "设备故障测试");
        
        System.out.println("设备报警: " + alert);
        assert alert != null;
        assert alert.getDeviceId().equals("DEVICE_001");
    }

    @Test
    public void testCheckEnvironmentData() {
        // 测试环境数据检查
        EnvironmentData environmentData = new EnvironmentData();
        environmentData.setGreenhouseId("GH001");
        environmentData.setTemperature(new BigDecimal("50.0")); // 超过阈值
        environmentData.setHumidity(new BigDecimal("20.0")); // 低于阈值
        environmentData.setLightIntensity(new BigDecimal("500.0")); // 低于阈值
        environmentData.setSoilHumidity(new BigDecimal("25.0")); // 低于阈值
        environmentData.setCo2Level(new BigDecimal("2500.0")); // 超过阈值
        
        List<AlertDTO> alerts = alertService.checkAndTriggerEnvironmentAlerts(environmentData);
        
        System.out.println("触发的报警数量: " + alerts.size());
        for (AlertDTO alert : alerts) {
            System.out.println("报警: " + alert.getMessage());
        }
        
        assert alerts.size() > 0;
    }

    @Test
    public void testDetermineSeverity() {
        // 测试报警级别判断
        AlertRecord.Severity severity1 = alertService.determineSeverity(
                AlertRecord.AlertType.TEMPERATURE,
                new BigDecimal("50.0"),
                new BigDecimal("35.0")
        );
        
        AlertRecord.Severity severity2 = alertService.determineSeverity(
                AlertRecord.AlertType.TEMPERATURE,
                new BigDecimal("2.0"),
                new BigDecimal("10.0")
        );
        
        System.out.println("高温报警级别: " + severity1);
        System.out.println("低温报警级别: " + severity2);
        
        assert severity1 != null;
        assert severity2 != null;
    }

    @Test
    public void testGetUnresolvedAlerts() {
        // 测试获取未解决报警
        List<AlertDTO> unresolvedAlerts = alertService.getUnresolvedAlerts();
        
        System.out.println("未解决报警数量: " + unresolvedAlerts.size());
        for (AlertDTO alert : unresolvedAlerts) {
            System.out.println("未解决报警: " + alert.getMessage());
        }
    }

    @Test
    public void testGetAlertStatistics() {
        // 测试获取报警统计
        LocalDateTime startTime = LocalDateTime.now().minusDays(7);
        LocalDateTime endTime = LocalDateTime.now();
        
        Map<String, Object> statistics = alertService.getAlertStatistics(startTime, endTime);
        
        System.out.println("报警统计信息:");
        statistics.forEach((key, value) -> {
            System.out.println(key + ": " + value);
        });
    }

    @Test
    public void testValidateAlertData() {
        // 测试报警数据验证
        AlertRecord validAlert = new AlertRecord();
        validAlert.setAlertType(AlertRecord.AlertType.TEMPERATURE);
        validAlert.setSeverity(AlertRecord.Severity.HIGH);
        validAlert.setMessage("测试报警");
        validAlert.setParameterValue(new BigDecimal("45.0"));
        
        AlertRecord invalidAlert = new AlertRecord();
        // 缺少必填字段
        
        boolean isValid1 = alertService.validateAlertData(validAlert);
        boolean isValid2 = alertService.validateAlertData(invalidAlert);
        
        System.out.println("有效报警验证结果: " + isValid1);
        System.out.println("无效报警验证结果: " + isValid2);
        
        assert isValid1 == true;
        assert isValid2 == false;
    }
}