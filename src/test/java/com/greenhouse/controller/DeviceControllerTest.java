package com.greenhouse.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.greenhouse.dto.DeviceControlDTO;
import com.greenhouse.entity.ControlLog;
import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.service.DeviceService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 设备控制控制器测试类
 */
@ExtendWith(MockitoExtension.class)
public class DeviceControllerTest {

    private MockMvc mockMvc;

    @Mock
    private DeviceService deviceService;

    @InjectMocks
    private DeviceController deviceController;

    private ObjectMapper objectMapper;

    private DeviceStatus testDevice;
    private List<DeviceStatus> testDevices;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        mockMvc = MockMvcBuilders.standaloneSetup(deviceController).build();
        
        // 创建测试设备
        testDevice = new DeviceStatus();
        testDevice.setId(1);
        testDevice.setDeviceId("FAN001");
        testDevice.setDeviceName("温室风扇1号");
        testDevice.setDeviceType(DeviceStatus.DeviceType.fan);
        testDevice.setStatus(DeviceStatus.DeviceStatusEnum.online);
        testDevice.setIsRunning(false);
        testDevice.setPowerLevel(BigDecimal.ZERO);
        testDevice.setLastMaintenance(LocalDate.now().minusDays(10));
        testDevice.setCreatedAt(LocalDateTime.now().minusDays(30));
        testDevice.setUpdatedAt(LocalDateTime.now());

        DeviceStatus testDevice2 = new DeviceStatus();
        testDevice2.setId(2);
        testDevice2.setDeviceId("LIGHT001");
        testDevice2.setDeviceName("补光灯1号");
        testDevice2.setDeviceType(DeviceStatus.DeviceType.light);
        testDevice2.setStatus(DeviceStatus.DeviceStatusEnum.online);
        testDevice2.setIsRunning(true);
        testDevice2.setPowerLevel(new BigDecimal("80"));
        testDevice2.setLastMaintenance(LocalDate.now().minusDays(5));
        testDevice2.setCreatedAt(LocalDateTime.now().minusDays(20));
        testDevice2.setUpdatedAt(LocalDateTime.now());

        testDevices = Arrays.asList(testDevice, testDevice2);
    }

    // ==================== 设备列表查询接口测试 ====================

    @Test
    void testGetAllDevices() throws Exception {
        when(deviceService.getAllDevices()).thenReturn(testDevices);

        mockMvc.perform(get("/api/devices"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("获取设备列表成功"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].deviceId").value("FAN001"))
                .andExpect(jsonPath("$.data[1].deviceId").value("LIGHT001"));
    }

    @Test
    void testGetDeviceById() throws Exception {
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);

        mockMvc.perform(get("/api/devices/FAN001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("获取设备详情成功"))
                .andExpect(jsonPath("$.data.deviceId").value("FAN001"))
                .andExpect(jsonPath("$.data.deviceName").value("温室风扇1号"))
                .andExpect(jsonPath("$.data.deviceType").value("fan"));
    }

    @Test
    void testGetDeviceByIdNotFound() throws Exception {
        when(deviceService.getDeviceById("NONEXISTENT")).thenReturn(null);

        mockMvc.perform(get("/api/devices/NONEXISTENT"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(404))
                .andExpect(jsonPath("$.message").value("设备不存在"));
    }

    @Test
    void testGetDevicesByType() throws Exception {
        List<DeviceStatus> fanDevices = Arrays.asList(testDevice);
        when(deviceService.getDevicesByType(DeviceStatus.DeviceType.fan)).thenReturn(fanDevices);

        mockMvc.perform(get("/api/devices/type/fan"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("获取设备列表成功"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].deviceType").value("fan"));
    }

    @Test
    void testGetDevicesByTypeInvalid() throws Exception {
        mockMvc.perform(get("/api/devices/type/invalid"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("无效的设备类型：invalid"));
    }

    @Test
    void testGetDevicesByStatus() throws Exception {
        when(deviceService.getDevicesByStatus(DeviceStatus.DeviceStatusEnum.online)).thenReturn(testDevices);

        mockMvc.perform(get("/api/devices/status/online"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2));
    }

    @Test
    void testGetRunningDevices() throws Exception {
        List<DeviceStatus> runningDevices = Arrays.asList(testDevices.get(1)); // 只有LIGHT001在运行
        when(deviceService.getRunningDevices()).thenReturn(runningDevices);

        mockMvc.perform(get("/api/devices/running"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].isRunning").value(true));
    }

    // ==================== 设备控制接口测试 ====================

    @Test
    void testStartDevice() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);
        when(deviceService.startDevice(eq("FAN001"), any(BigDecimal.class), eq("admin"), any(ControlLog.OperationSource.class)))
                .thenReturn(true);

        mockMvc.perform(post("/api/devices/FAN001/start")
                        .param("powerLevel", "80")
                        .param("operator", "admin")
                        .param("operationSource", "manual"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备启动成功"))
                .andExpect(jsonPath("$.data.deviceId").value("FAN001"))
                .andExpect(jsonPath("$.data.action").value("start"))
                .andExpect(jsonPath("$.data.powerLevel").value(80))
                .andExpect(jsonPath("$.data.result").value("success"));
    }

    @Test
    void testStartDeviceInvalidPowerLevel() throws Exception {
        mockMvc.perform(post("/api/devices/FAN001/start")
                        .param("powerLevel", "150")
                        .param("operator", "admin")
                        .param("operationSource", "manual"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("参数验证失败"));
    }

    @Test
    void testStopDevice() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);
        when(deviceService.stopDevice(eq("FAN001"), eq("admin"), any(ControlLog.OperationSource.class)))
                .thenReturn(true);

        mockMvc.perform(post("/api/devices/FAN001/stop")
                        .param("operator", "admin")
                        .param("operationSource", "manual"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备停止成功"))
                .andExpect(jsonPath("$.data.action").value("stop"))
                .andExpect(jsonPath("$.data.result").value("success"));
    }

    @Test
    void testAdjustDevicePower() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);
        when(deviceService.adjustDevicePower(eq("FAN001"), any(BigDecimal.class), eq("admin"), any(ControlLog.OperationSource.class)))
                .thenReturn(true);

        mockMvc.perform(post("/api/devices/FAN001/adjust")
                        .param("powerLevel", "60")
                        .param("operator", "admin")
                        .param("operationSource", "manual"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备功率调节成功"))
                .andExpect(jsonPath("$.data.action").value("adjust"))
                .andExpect(jsonPath("$.data.powerLevel").value(60));
    }

    @Test
    void testResetDevice() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);
        when(deviceService.resetDevice(eq("FAN001"), eq("admin"), any(ControlLog.OperationSource.class)))
                .thenReturn(true);

        mockMvc.perform(post("/api/devices/FAN001/reset")
                        .param("operator", "admin")
                        .param("operationSource", "manual"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备重置成功"))
                .andExpect(jsonPath("$.data.action").value("reset"));
    }

    @Test
    void testBatchControlDevices() throws Exception {
        DeviceControlDTO.BatchControlRequest request = new DeviceControlDTO.BatchControlRequest();
        request.setDeviceIds(Arrays.asList("FAN001", "LIGHT001"));
        request.setAction(ControlLog.Action.start);
        request.setPowerLevel(new BigDecimal("70"));
        request.setOperator("admin");
        request.setOperationSource(ControlLog.OperationSource.manual);

        when(deviceService.deviceExists(anyString())).thenReturn(true);
        when(deviceService.getDeviceById(anyString())).thenReturn(testDevice);
        when(deviceService.batchControlDevices(anyList(), any(ControlLog.Action.class), any(BigDecimal.class), 
                anyString(), any(ControlLog.OperationSource.class))).thenReturn(2);

        mockMvc.perform(post("/api/devices/batch-control")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("批量控制设备完成"))
                .andExpect(jsonPath("$.data.totalCount").value(2))
                .andExpect(jsonPath("$.data.successCount").value(2))
                .andExpect(jsonPath("$.data.failedCount").value(0));
    }

    // ==================== 设备状态更新接口测试 ====================

    @Test
    void testUpdateDeviceStatus() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.updateDeviceStatus("FAN001", DeviceStatus.DeviceStatusEnum.offline)).thenReturn(true);
        
        DeviceStatus updatedDevice = new DeviceStatus();
        updatedDevice.setDeviceId("FAN001");
        updatedDevice.setStatus(DeviceStatus.DeviceStatusEnum.offline);
        when(deviceService.getDeviceById("FAN001")).thenReturn(updatedDevice);

        mockMvc.perform(put("/api/devices/FAN001/status")
                        .param("status", "offline"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备状态更新成功"))
                .andExpect(jsonPath("$.data.status").value("offline"));
    }

    @Test
    void testUpdateMaintenanceDate() throws Exception {
        when(deviceService.deviceExists("FAN001")).thenReturn(true);
        when(deviceService.updateMaintenanceDate(eq("FAN001"), any(LocalDate.class))).thenReturn(true);
        when(deviceService.getDeviceById("FAN001")).thenReturn(testDevice);

        mockMvc.perform(put("/api/devices/FAN001/maintenance")
                        .param("maintenanceDate", "2024-01-15"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("设备维护时间更新成功"));
    }

    // ==================== 设备统计和监控接口测试 ====================

    @Test
    void testGetDeviceStatistics() throws Exception {
        when(deviceService.getTotalDeviceCount()).thenReturn(10L);
        when(deviceService.getOnlineDeviceCount()).thenReturn(8L);
        when(deviceService.getDeviceTypeStatistics()).thenReturn(Arrays.asList(
                Map.of("deviceType", "fan", "count", 3),
                Map.of("deviceType", "light", "count", 2)
        ));
        when(deviceService.getDeviceStatusStatistics()).thenReturn(Arrays.asList(
                Map.of("status", "online", "count", 8),
                Map.of("status", "offline", "count", 2)
        ));
        when(deviceService.getPowerUsageStatistics()).thenReturn(Arrays.asList(
                Map.of("deviceType", "fan", "avgPower", 65.5),
                Map.of("deviceType", "light", "avgPower", 80.0)
        ));

        mockMvc.perform(get("/api/devices/statistics"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalCount").value(10))
                .andExpect(jsonPath("$.data.onlineCount").value(8))
                .andExpect(jsonPath("$.data.typeStatistics").isArray())
                .andExpect(jsonPath("$.data.statusStatistics").isArray())
                .andExpect(jsonPath("$.data.powerUsageStatistics").isArray());
    }

    // ==================== 智能控制接口测试 ====================

    @Test
    void testAutoControlHumidityDevices() throws Exception {
        Map<String, Object> controlResult = Map.of(
                "success", true,
                "controlledDeviceCount", 2,
                "message", "湿度控制完成"
        );
        when(deviceService.autoControlHumidityDevices(any(BigDecimal.class), any(BigDecimal.class), any(BigDecimal.class)))
                .thenReturn(controlResult);

        mockMvc.perform(post("/api/devices/auto-control/humidity")
                        .param("currentHumidity", "45.5")
                        .param("targetHumidity", "60.0")
                        .param("tolerance", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.success").value(true))
                .andExpect(jsonPath("$.data.controlledDeviceCount").value(2));
    }

    @Test
    void testAutoControlHumidityDevicesInvalidParams() throws Exception {
        mockMvc.perform(post("/api/devices/auto-control/humidity")
                        .param("currentHumidity", "150")  // 无效值
                        .param("targetHumidity", "60.0")
                        .param("tolerance", "5.0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value(400))
                .andExpect(jsonPath("$.message").value("当前湿度必须在0-100之间"));
    }
}