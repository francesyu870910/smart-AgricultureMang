package com.greenhouse.service;

import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.entity.ControlLog;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 设备控制服务测试类
 * 测试设备状态查询、设备控制、设备配置等功能
 */
@SpringBootTest
@ActiveProfiles("test")
public class DeviceServiceTest {

    @Autowired
    private DeviceService deviceService;

    @Test
    public void testGetAllDevices() {
        System.out.println("=== 测试获取所有设备列表 ===");
        List<DeviceStatus> devices = deviceService.getAllDevices();
        assertNotNull(devices);
        System.out.println("设备总数: " + devices.size());
        
        for (DeviceStatus device : devices) {
            System.out.println("设备: " + device.getDeviceId() + " - " + device.getDeviceName() + 
                             " (" + device.getDeviceType() + ") - " + device.getStatus());
        }
    }

    @Test
    public void testGetDeviceById() {
        System.out.println("=== 测试根据设备ID查询设备 ===");
        
        // 测试存在的设备
        DeviceStatus device = deviceService.getDeviceById("TEMP_SENSOR_01");
        if (device != null) {
            System.out.println("找到设备: " + device.getDeviceName());
            assertEquals("TEMP_SENSOR_01", device.getDeviceId());
        } else {
            System.out.println("设备 TEMP_SENSOR_01 不存在");
        }

        // 测试不存在的设备
        DeviceStatus nonExistentDevice = deviceService.getDeviceById("NON_EXISTENT");
        assertNull(nonExistentDevice);
        System.out.println("不存在的设备返回null: " + (nonExistentDevice == null));
    }

    @Test
    public void testGetDevicesByType() {
        System.out.println("=== 测试根据设备类型查询设备 ===");
        
        for (DeviceStatus.DeviceType type : DeviceStatus.DeviceType.values()) {
            List<DeviceStatus> devices = deviceService.getDevicesByType(type);
            System.out.println(type + " 类型设备数量: " + devices.size());
            
            for (DeviceStatus device : devices) {
                assertEquals(type, device.getDeviceType());
                System.out.println("  - " + device.getDeviceId() + ": " + device.getDeviceName());
            }
        }
    }

    @Test
    public void testGetDevicesByStatus() {
        System.out.println("=== 测试根据设备状态查询设备 ===");
        
        for (DeviceStatus.DeviceStatusEnum status : DeviceStatus.DeviceStatusEnum.values()) {
            List<DeviceStatus> devices = deviceService.getDevicesByStatus(status);
            System.out.println(status + " 状态设备数量: " + devices.size());
            
            for (DeviceStatus device : devices) {
                assertEquals(status, device.getStatus());
                System.out.println("  - " + device.getDeviceId() + ": " + device.getDeviceName());
            }
        }
    }

    @Test
    public void testDeviceControl() {
        System.out.println("=== 测试设备控制功能 ===");
        
        // 获取一个在线设备进行测试
        List<DeviceStatus> onlineDevices = deviceService.getDevicesByStatus(DeviceStatus.DeviceStatusEnum.online);
        if (!onlineDevices.isEmpty()) {
            DeviceStatus testDevice = onlineDevices.get(0);
            String deviceId = testDevice.getDeviceId();
            System.out.println("测试设备: " + deviceId);

            // 测试启动设备
            boolean startResult = deviceService.startDevice(deviceId, BigDecimal.valueOf(50), 
                                                          "test_user", ControlLog.OperationSource.manual);
            System.out.println("启动设备结果: " + startResult);

            // 测试调节功率
            boolean adjustResult = deviceService.adjustDevicePower(deviceId, BigDecimal.valueOf(75), 
                                                                 "test_user", ControlLog.OperationSource.manual);
            System.out.println("调节功率结果: " + adjustResult);

            // 测试停止设备
            boolean stopResult = deviceService.stopDevice(deviceId, "test_user", ControlLog.OperationSource.manual);
            System.out.println("停止设备结果: " + stopResult);

            // 测试重置设备
            boolean resetResult = deviceService.resetDevice(deviceId, "test_user", ControlLog.OperationSource.manual);
            System.out.println("重置设备结果: " + resetResult);
        } else {
            System.out.println("没有在线设备可供测试");
        }
    }

    @Test
    public void testBatchControlDevices() {
        System.out.println("=== 测试批量控制设备 ===");
        
        List<DeviceStatus> fanDevices = deviceService.getDevicesByType(DeviceStatus.DeviceType.fan);
        if (!fanDevices.isEmpty()) {
            List<String> deviceIds = Arrays.asList(fanDevices.get(0).getDeviceId());
            
            int successCount = deviceService.batchControlDevices(deviceIds, ControlLog.Action.start, 
                                                               BigDecimal.valueOf(60), "test_user", 
                                                               ControlLog.OperationSource.manual);
            System.out.println("批量启动设备成功数量: " + successCount);
            
            successCount = deviceService.batchControlDevices(deviceIds, ControlLog.Action.stop, 
                                                           null, "test_user", ControlLog.OperationSource.manual);
            System.out.println("批量停止设备成功数量: " + successCount);
        } else {
            System.out.println("没有风扇设备可供测试");
        }
    }

    @Test
    public void testDeviceStatistics() {
        System.out.println("=== 测试设备统计功能 ===");
        
        // 设备类型统计
        List<Map<String, Object>> typeStats = deviceService.getDeviceTypeStatistics();
        System.out.println("设备类型统计:");
        for (Map<String, Object> stat : typeStats) {
            System.out.println("  " + stat);
        }

        // 设备状态统计
        List<Map<String, Object>> statusStats = deviceService.getDeviceStatusStatistics();
        System.out.println("设备状态统计:");
        for (Map<String, Object> stat : statusStats) {
            System.out.println("  " + stat);
        }

        // 功率使用统计
        List<Map<String, Object>> powerStats = deviceService.getPowerUsageStatistics();
        System.out.println("功率使用统计:");
        for (Map<String, Object> stat : powerStats) {
            System.out.println("  " + stat);
        }

        // 设备计数
        long totalCount = deviceService.getTotalDeviceCount();
        long onlineCount = deviceService.getOnlineDeviceCount();
        System.out.println("设备总数: " + totalCount);
        System.out.println("在线设备数: " + onlineCount);
    }

    @Test
    public void testAutoControlHumidity() {
        System.out.println("=== 测试湿度自动控制 ===");
        
        // 测试湿度过高的情况
        Map<String, Object> result = deviceService.autoControlHumidityDevices(
            BigDecimal.valueOf(80), // 当前湿度
            BigDecimal.valueOf(60), // 目标湿度
            BigDecimal.valueOf(5)   // 容差
        );
        
        System.out.println("湿度自动控制结果: " + result);
        assertTrue((Boolean) result.get("success"));
    }

    @Test
    public void testAutoControlLight() {
        System.out.println("=== 测试光照自动控制 ===");
        
        // 测试光照不足的情况
        Map<String, Object> result = deviceService.autoControlLightDevices(
            BigDecimal.valueOf(20000), // 当前光照强度
            BigDecimal.valueOf(30000), // 目标光照强度
            BigDecimal.valueOf(2000)   // 容差
        );
        
        System.out.println("光照自动控制结果: " + result);
        assertTrue((Boolean) result.get("success"));
    }

    @Test
    public void testAutoControlVentilation() {
        System.out.println("=== 测试通风自动控制 ===");
        
        // 测试需要通风的情况
        Map<String, Object> result = deviceService.autoControlVentilationDevices(
            BigDecimal.valueOf(35),   // 当前温度
            BigDecimal.valueOf(1200), // 当前CO2浓度
            BigDecimal.valueOf(30),   // 最高温度阈值
            BigDecimal.valueOf(1000)  // 最高CO2浓度阈值
        );
        
        System.out.println("通风自动控制结果: " + result);
        assertTrue((Boolean) result.get("success"));
    }

    @Test
    public void testControlLogs() {
        System.out.println("=== 测试控制日志查询 ===");
        
        // 获取最近的控制日志
        List<ControlLog> recentLogs = deviceService.getRecentControlLogs(10);
        System.out.println("最近10条控制日志数量: " + recentLogs.size());
        
        for (ControlLog log : recentLogs) {
            System.out.println("  " + log.getCreatedAt() + " - " + log.getDeviceId() + 
                             " - " + log.getAction() + " - " + log.getResult());
        }

        // 获取失败的操作
        List<ControlLog> failedOps = deviceService.getFailedOperations();
        System.out.println("失败操作数量: " + failedOps.size());
    }

    @Test
    public void testDeviceExists() {
        System.out.println("=== 测试设备存在性检查 ===");
        
        // 测试存在的设备
        boolean exists = deviceService.deviceExists("TEMP_SENSOR_01");
        System.out.println("TEMP_SENSOR_01 存在: " + exists);
        
        // 测试不存在的设备
        boolean notExists = deviceService.deviceExists("NON_EXISTENT_DEVICE");
        System.out.println("NON_EXISTENT_DEVICE 存在: " + notExists);
        assertFalse(notExists);
    }

    @Test
    public void testUpdateDeviceStatus() {
        System.out.println("=== 测试更新设备状态 ===");
        
        List<DeviceStatus> devices = deviceService.getAllDevices();
        if (!devices.isEmpty()) {
            DeviceStatus testDevice = devices.get(0);
            String deviceId = testDevice.getDeviceId();
            DeviceStatus.DeviceStatusEnum originalStatus = testDevice.getStatus();
            
            // 更新为不同的状态
            DeviceStatus.DeviceStatusEnum newStatus = originalStatus == DeviceStatus.DeviceStatusEnum.online ? 
                DeviceStatus.DeviceStatusEnum.offline : DeviceStatus.DeviceStatusEnum.online;
            
            boolean updateResult = deviceService.updateDeviceStatus(deviceId, newStatus);
            System.out.println("更新设备状态结果: " + updateResult);
            assertTrue(updateResult);
            
            // 恢复原状态
            deviceService.updateDeviceStatus(deviceId, originalStatus);
        }
    }

    @Test
    public void testUpdateMaintenanceDate() {
        System.out.println("=== 测试更新维护日期 ===");
        
        List<DeviceStatus> devices = deviceService.getAllDevices();
        if (!devices.isEmpty()) {
            DeviceStatus testDevice = devices.get(0);
            String deviceId = testDevice.getDeviceId();
            
            boolean updateResult = deviceService.updateMaintenanceDate(deviceId, LocalDate.now());
            System.out.println("更新维护日期结果: " + updateResult);
            assertTrue(updateResult);
        }
    }
}