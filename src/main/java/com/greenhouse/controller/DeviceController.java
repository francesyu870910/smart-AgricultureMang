package com.greenhouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.common.Result;
import com.greenhouse.dto.DeviceControlDTO;
import com.greenhouse.entity.ControlLog;
import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.service.DeviceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 设备控制控制器
 * 提供设备列表查询、设备控制、设备状态更新等API接口
 * 
 * 支持的需求：
 * - 需求4（通风系统）：控制风扇、通风设备
 * - 需求7（远程控制）：远程设备控制功能
 */
@RestController
@RequestMapping("/api/devices")
@CrossOrigin(origins = "*")
public class DeviceController {

    private static final Logger logger = LoggerFactory.getLogger(DeviceController.class);

    @Autowired
    private DeviceService deviceService;

    // ==================== 设备列表查询接口 ====================

    /**
     * 获取所有设备列表
     * GET /api/devices
     */
    @GetMapping
    public Result<List<DeviceStatus>> getAllDevices() {
        try {
            logger.info("获取所有设备列表");
            List<DeviceStatus> devices = deviceService.getAllDevices();
            logger.info("成功获取设备列表，共{}个设备", devices.size());
            return Result.success("获取设备列表成功", devices);
        } catch (Exception e) {
            logger.error("获取设备列表失败", e);
            return Result.error("获取设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 根据设备ID获取设备详情
     * GET /api/devices/{deviceId}
     */
    @GetMapping("/{deviceId}")
    public Result<DeviceStatus> getDeviceById(@PathVariable String deviceId) {
        try {
            logger.info("获取设备详情，设备ID：{}", deviceId);
            
            // 参数验证
            if (deviceId == null || deviceId.trim().isEmpty()) {
                return Result.error(400, "设备ID不能为空");
            }
            
            DeviceStatus device = deviceService.getDeviceById(deviceId);
            if (device == null) {
                logger.warn("设备不存在，设备ID：{}", deviceId);
                return Result.error(404, "设备不存在");
            }
            
            logger.info("成功获取设备详情：{}", device.getDeviceName());
            return Result.success("获取设备详情成功", device);
        } catch (Exception e) {
            logger.error("获取设备详情失败，设备ID：{}", deviceId, e);
            return Result.error("获取设备详情失败：" + e.getMessage());
        }
    }

    /**
     * 根据设备类型获取设备列表
     * GET /api/devices/type/{deviceType}
     */
    @GetMapping("/type/{deviceType}")
    public Result<List<DeviceStatus>> getDevicesByType(@PathVariable String deviceType) {
        try {
            logger.info("根据设备类型获取设备列表，类型：{}", deviceType);
            
            // 参数验证
            DeviceStatus.DeviceType type;
            try {
                type = DeviceStatus.DeviceType.valueOf(deviceType);
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的设备类型：" + deviceType);
            }
            
            List<DeviceStatus> devices = deviceService.getDevicesByType(type);
            logger.info("成功获取{}类型设备列表，共{}个设备", deviceType, devices.size());
            return Result.success("获取设备列表成功", devices);
        } catch (Exception e) {
            logger.error("根据设备类型获取设备列表失败，类型：{}", deviceType, e);
            return Result.error("获取设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 根据设备状态获取设备列表
     * GET /api/devices/status/{status}
     */
    @GetMapping("/status/{status}")
    public Result<List<DeviceStatus>> getDevicesByStatus(@PathVariable String status) {
        try {
            logger.info("根据设备状态获取设备列表，状态：{}", status);
            
            // 参数验证
            DeviceStatus.DeviceStatusEnum statusEnum;
            try {
                statusEnum = DeviceStatus.DeviceStatusEnum.valueOf(status);
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的设备状态：" + status);
            }
            
            List<DeviceStatus> devices = deviceService.getDevicesByStatus(statusEnum);
            logger.info("成功获取{}状态设备列表，共{}个设备", status, devices.size());
            return Result.success("获取设备列表成功", devices);
        } catch (Exception e) {
            logger.error("根据设备状态获取设备列表失败，状态：{}", status, e);
            return Result.error("获取设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 获取正在运行的设备列表
     * GET /api/devices/running
     */
    @GetMapping("/running")
    public Result<List<DeviceStatus>> getRunningDevices() {
        try {
            logger.info("获取正在运行的设备列表");
            List<DeviceStatus> devices = deviceService.getRunningDevices();
            logger.info("成功获取运行中设备列表，共{}个设备", devices.size());
            return Result.success("获取运行中设备列表成功", devices);
        } catch (Exception e) {
            logger.error("获取运行中设备列表失败", e);
            return Result.error("获取运行中设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 获取离线设备列表
     * GET /api/devices/offline
     */
    @GetMapping("/offline")
    public Result<List<DeviceStatus>> getOfflineDevices() {
        try {
            logger.info("获取离线设备列表");
            List<DeviceStatus> devices = deviceService.getOfflineDevices();
            logger.info("成功获取离线设备列表，共{}个设备", devices.size());
            return Result.success("获取离线设备列表成功", devices);
        } catch (Exception e) {
            logger.error("获取离线设备列表失败", e);
            return Result.error("获取离线设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 获取故障设备列表
     * GET /api/devices/error
     */
    @GetMapping("/error")
    public Result<List<DeviceStatus>> getErrorDevices() {
        try {
            logger.info("获取故障设备列表");
            List<DeviceStatus> devices = deviceService.getErrorDevices();
            logger.info("成功获取故障设备列表，共{}个设备", devices.size());
            return Result.success("获取故障设备列表成功", devices);
        } catch (Exception e) {
            logger.error("获取故障设备列表失败", e);
            return Result.error("获取故障设备列表失败：" + e.getMessage());
        }
    }

    /**
     * 分页查询设备列表
     * GET /api/devices/page?current=1&size=10&deviceType=fan&status=online
     */
    @GetMapping("/page")
    public Result<IPage<DeviceStatus>> getDevicesPage(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String deviceType,
            @RequestParam(required = false) String status) {
        try {
            logger.info("分页查询设备列表，页码：{}，大小：{}，类型：{}，状态：{}", current, size, deviceType, status);
            
            // 参数验证
            if (current < 1) current = 1;
            if (size < 1 || size > 100) size = 10;
            
            Page<DeviceStatus> page = new Page<>(current, size);
            
            DeviceStatus.DeviceType typeEnum = null;
            if (deviceType != null && !deviceType.trim().isEmpty()) {
                try {
                    typeEnum = DeviceStatus.DeviceType.valueOf(deviceType);
                } catch (IllegalArgumentException e) {
                    return Result.error(400, "无效的设备类型：" + deviceType);
                }
            }
            
            DeviceStatus.DeviceStatusEnum statusEnum = null;
            if (status != null && !status.trim().isEmpty()) {
                try {
                    statusEnum = DeviceStatus.DeviceStatusEnum.valueOf(status);
                } catch (IllegalArgumentException e) {
                    return Result.error(400, "无效的设备状态：" + status);
                }
            }
            
            IPage<DeviceStatus> result = deviceService.getDevicesPage(page, typeEnum, statusEnum);
            logger.info("成功分页查询设备列表，总数：{}，当前页：{}", result.getTotal(), result.getCurrent());
            return Result.success("分页查询设备列表成功", result);
        } catch (Exception e) {
            logger.error("分页查询设备列表失败", e);
            return Result.error("分页查询设备列表失败：" + e.getMessage());
        }
    }

    // ==================== 设备控制接口 ====================

    /**
     * 启动设备
     * POST /api/devices/{deviceId}/start
     */
    @PostMapping("/{deviceId}/start")
    public Result<DeviceControlDTO> startDevice(
            @PathVariable String deviceId,
            @RequestParam(defaultValue = "100") BigDecimal powerLevel,
            @RequestParam(defaultValue = "system") String operator,
            @RequestParam(defaultValue = "manual") String operationSource) {
        try {
            logger.info("启动设备，设备ID：{}，功率：{}，操作员：{}，操作来源：{}", deviceId, powerLevel, operator, operationSource);
            
            // 参数验证
            if (!validateDeviceControlParams(deviceId, powerLevel, operator, operationSource)) {
                return Result.error(400, "参数验证失败");
            }
            
            // 权限验证
            if (!validateControlPermission(deviceId, operator, ControlLog.Action.start)) {
                return Result.error(403, "无权限执行此操作");
            }
            
            ControlLog.OperationSource sourceEnum = ControlLog.OperationSource.valueOf(operationSource);
            boolean success = deviceService.startDevice(deviceId, powerLevel, operator, sourceEnum);
            
            DeviceControlDTO result = new DeviceControlDTO(deviceId, ControlLog.Action.start, operator, sourceEnum);
            result.setPowerLevel(powerLevel);
            result.setResult(success ? ControlLog.Result.success : ControlLog.Result.failed);
            result.setMessage(success ? "设备启动成功" : "设备启动失败");
            
            if (success) {
                logger.info("设备启动成功，设备ID：{}", deviceId);
                return Result.success("设备启动成功", result);
            } else {
                logger.warn("设备启动失败，设备ID：{}", deviceId);
                return Result.error("设备启动失败");
            }
        } catch (Exception e) {
            logger.error("启动设备失败，设备ID：{}", deviceId, e);
            return Result.error("启动设备失败：" + e.getMessage());
        }
    }

    /**
     * 停止设备
     * POST /api/devices/{deviceId}/stop
     */
    @PostMapping("/{deviceId}/stop")
    public Result<DeviceControlDTO> stopDevice(
            @PathVariable String deviceId,
            @RequestParam(defaultValue = "system") String operator,
            @RequestParam(defaultValue = "manual") String operationSource) {
        try {
            logger.info("停止设备，设备ID：{}，操作员：{}，操作来源：{}", deviceId, operator, operationSource);
            
            // 参数验证
            if (!validateDeviceControlParams(deviceId, null, operator, operationSource)) {
                return Result.error(400, "参数验证失败");
            }
            
            // 权限验证
            if (!validateControlPermission(deviceId, operator, ControlLog.Action.stop)) {
                return Result.error(403, "无权限执行此操作");
            }
            
            ControlLog.OperationSource sourceEnum = ControlLog.OperationSource.valueOf(operationSource);
            boolean success = deviceService.stopDevice(deviceId, operator, sourceEnum);
            
            DeviceControlDTO result = new DeviceControlDTO(deviceId, ControlLog.Action.stop, operator, sourceEnum);
            result.setResult(success ? ControlLog.Result.success : ControlLog.Result.failed);
            result.setMessage(success ? "设备停止成功" : "设备停止失败");
            
            if (success) {
                logger.info("设备停止成功，设备ID：{}", deviceId);
                return Result.success("设备停止成功", result);
            } else {
                logger.warn("设备停止失败，设备ID：{}", deviceId);
                return Result.error("设备停止失败");
            }
        } catch (Exception e) {
            logger.error("停止设备失败，设备ID：{}", deviceId, e);
            return Result.error("停止设备失败：" + e.getMessage());
        }
    }

    /**
     * 调节设备功率
     * POST /api/devices/{deviceId}/adjust
     */
    @PostMapping("/{deviceId}/adjust")
    public Result<DeviceControlDTO> adjustDevicePower(
            @PathVariable String deviceId,
            @RequestParam BigDecimal powerLevel,
            @RequestParam(defaultValue = "system") String operator,
            @RequestParam(defaultValue = "manual") String operationSource) {
        try {
            logger.info("调节设备功率，设备ID：{}，功率：{}，操作员：{}，操作来源：{}", deviceId, powerLevel, operator, operationSource);
            
            // 参数验证
            if (!validateDeviceControlParams(deviceId, powerLevel, operator, operationSource)) {
                return Result.error(400, "参数验证失败");
            }
            
            // 权限验证
            if (!validateControlPermission(deviceId, operator, ControlLog.Action.adjust)) {
                return Result.error(403, "无权限执行此操作");
            }
            
            ControlLog.OperationSource sourceEnum = ControlLog.OperationSource.valueOf(operationSource);
            boolean success = deviceService.adjustDevicePower(deviceId, powerLevel, operator, sourceEnum);
            
            DeviceControlDTO result = new DeviceControlDTO(deviceId, ControlLog.Action.adjust, operator, sourceEnum);
            result.setPowerLevel(powerLevel);
            result.setResult(success ? ControlLog.Result.success : ControlLog.Result.failed);
            result.setMessage(success ? "设备功率调节成功" : "设备功率调节失败");
            
            if (success) {
                logger.info("设备功率调节成功，设备ID：{}，新功率：{}", deviceId, powerLevel);
                return Result.success("设备功率调节成功", result);
            } else {
                logger.warn("设备功率调节失败，设备ID：{}", deviceId);
                return Result.error("设备功率调节失败");
            }
        } catch (Exception e) {
            logger.error("调节设备功率失败，设备ID：{}", deviceId, e);
            return Result.error("调节设备功率失败：" + e.getMessage());
        }
    }

    /**
     * 重置设备
     * POST /api/devices/{deviceId}/reset
     */
    @PostMapping("/{deviceId}/reset")
    public Result<DeviceControlDTO> resetDevice(
            @PathVariable String deviceId,
            @RequestParam(defaultValue = "system") String operator,
            @RequestParam(defaultValue = "manual") String operationSource) {
        try {
            logger.info("重置设备，设备ID：{}，操作员：{}，操作来源：{}", deviceId, operator, operationSource);
            
            // 参数验证
            if (!validateDeviceControlParams(deviceId, null, operator, operationSource)) {
                return Result.error(400, "参数验证失败");
            }
            
            // 权限验证
            if (!validateControlPermission(deviceId, operator, ControlLog.Action.reset)) {
                return Result.error(403, "无权限执行此操作");
            }
            
            ControlLog.OperationSource sourceEnum = ControlLog.OperationSource.valueOf(operationSource);
            boolean success = deviceService.resetDevice(deviceId, operator, sourceEnum);
            
            DeviceControlDTO result = new DeviceControlDTO(deviceId, ControlLog.Action.reset, operator, sourceEnum);
            result.setResult(success ? ControlLog.Result.success : ControlLog.Result.failed);
            result.setMessage(success ? "设备重置成功" : "设备重置失败");
            
            if (success) {
                logger.info("设备重置成功，设备ID：{}", deviceId);
                return Result.success("设备重置成功", result);
            } else {
                logger.warn("设备重置失败，设备ID：{}", deviceId);
                return Result.error("设备重置失败");
            }
        } catch (Exception e) {
            logger.error("重置设备失败，设备ID：{}", deviceId, e);
            return Result.error("重置设备失败：" + e.getMessage());
        }
    }

    /**
     * 批量控制设备
     * POST /api/devices/batch-control
     */
    @PostMapping("/batch-control")
    public Result<Map<String, Object>> batchControlDevices(@RequestBody DeviceControlDTO.BatchControlRequest request) {
        try {
            logger.info("批量控制设备，设备数量：{}，操作：{}，操作员：{}", 
                    request.getDeviceIds().size(), request.getAction(), request.getOperator());
            
            // 参数验证
            if (request.getDeviceIds() == null || request.getDeviceIds().isEmpty()) {
                return Result.error(400, "设备ID列表不能为空");
            }
            if (request.getAction() == null) {
                return Result.error(400, "操作动作不能为空");
            }
            if (request.getOperator() == null || request.getOperator().trim().isEmpty()) {
                return Result.error(400, "操作员不能为空");
            }
            
            // 权限验证
            for (String deviceId : request.getDeviceIds()) {
                if (!validateControlPermission(deviceId, request.getOperator(), request.getAction())) {
                    return Result.error(403, "无权限控制设备：" + deviceId);
                }
            }
            
            int successCount = deviceService.batchControlDevices(
                    request.getDeviceIds(), 
                    request.getAction(), 
                    request.getPowerLevel(),
                    request.getOperator(), 
                    request.getOperationSource()
            );
            
            Map<String, Object> result = Map.of(
                    "totalCount", request.getDeviceIds().size(),
                    "successCount", successCount,
                    "failedCount", request.getDeviceIds().size() - successCount
            );
            
            logger.info("批量控制设备完成，成功：{}，失败：{}", successCount, request.getDeviceIds().size() - successCount);
            return Result.success("批量控制设备完成", result);
        } catch (Exception e) {
            logger.error("批量控制设备失败", e);
            return Result.error("批量控制设备失败：" + e.getMessage());
        }
    }    
// ==================== 设备状态更新接口 ====================

    /**
     * 更新设备状态
     * PUT /api/devices/{deviceId}/status
     */
    @PutMapping("/{deviceId}/status")
    public Result<DeviceStatus> updateDeviceStatus(
            @PathVariable String deviceId,
            @RequestParam String status) {
        try {
            logger.info("更新设备状态，设备ID：{}，新状态：{}", deviceId, status);
            
            // 参数验证
            if (deviceId == null || deviceId.trim().isEmpty()) {
                return Result.error(400, "设备ID不能为空");
            }
            
            DeviceStatus.DeviceStatusEnum statusEnum;
            try {
                statusEnum = DeviceStatus.DeviceStatusEnum.valueOf(status);
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的设备状态：" + status);
            }
            
            // 检查设备是否存在
            if (!deviceService.deviceExists(deviceId)) {
                return Result.error(404, "设备不存在");
            }
            
            boolean success = deviceService.updateDeviceStatus(deviceId, statusEnum);
            if (success) {
                DeviceStatus updatedDevice = deviceService.getDeviceById(deviceId);
                logger.info("设备状态更新成功，设备ID：{}，新状态：{}", deviceId, status);
                return Result.success("设备状态更新成功", updatedDevice);
            } else {
                logger.warn("设备状态更新失败，设备ID：{}", deviceId);
                return Result.error("设备状态更新失败");
            }
        } catch (Exception e) {
            logger.error("更新设备状态失败，设备ID：{}", deviceId, e);
            return Result.error("更新设备状态失败：" + e.getMessage());
        }
    }

    /**
     * 更新设备维护时间
     * PUT /api/devices/{deviceId}/maintenance
     */
    @PutMapping("/{deviceId}/maintenance")
    public Result<DeviceStatus> updateMaintenanceDate(
            @PathVariable String deviceId,
            @RequestParam String maintenanceDate) {
        try {
            logger.info("更新设备维护时间，设备ID：{}，维护日期：{}", deviceId, maintenanceDate);
            
            // 参数验证
            if (deviceId == null || deviceId.trim().isEmpty()) {
                return Result.error(400, "设备ID不能为空");
            }
            
            LocalDate date;
            try {
                date = LocalDate.parse(maintenanceDate);
            } catch (Exception e) {
                return Result.error(400, "无效的日期格式，请使用yyyy-MM-dd格式");
            }
            
            // 检查设备是否存在
            if (!deviceService.deviceExists(deviceId)) {
                return Result.error(404, "设备不存在");
            }
            
            boolean success = deviceService.updateMaintenanceDate(deviceId, date);
            if (success) {
                DeviceStatus updatedDevice = deviceService.getDeviceById(deviceId);
                logger.info("设备维护时间更新成功，设备ID：{}", deviceId);
                return Result.success("设备维护时间更新成功", updatedDevice);
            } else {
                logger.warn("设备维护时间更新失败，设备ID：{}", deviceId);
                return Result.error("设备维护时间更新失败");
            }
        } catch (Exception e) {
            logger.error("更新设备维护时间失败，设备ID：{}", deviceId, e);
            return Result.error("更新设备维护时间失败：" + e.getMessage());
        }
    }

    // ==================== 设备统计和监控接口 ====================

    /**
     * 获取设备统计信息
     * GET /api/devices/statistics
     */
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getDeviceStatistics() {
        try {
            logger.info("获取设备统计信息");
            
            Map<String, Object> statistics = Map.of(
                    "totalCount", deviceService.getTotalDeviceCount(),
                    "onlineCount", deviceService.getOnlineDeviceCount(),
                    "typeStatistics", deviceService.getDeviceTypeStatistics(),
                    "statusStatistics", deviceService.getDeviceStatusStatistics(),
                    "powerUsageStatistics", deviceService.getPowerUsageStatistics()
            );
            
            logger.info("成功获取设备统计信息");
            return Result.success("获取设备统计信息成功", statistics);
        } catch (Exception e) {
            logger.error("获取设备统计信息失败", e);
            return Result.error("获取设备统计信息失败：" + e.getMessage());
        }
    }

    /**
     * 获取需要维护的设备列表
     * GET /api/devices/maintenance-needed?days=30
     */
    @GetMapping("/maintenance-needed")
    public Result<List<DeviceStatus>> getDevicesNeedMaintenance(@RequestParam(defaultValue = "30") int days) {
        try {
            logger.info("获取需要维护的设备列表，超过{}天未维护", days);
            
            if (days < 1) {
                return Result.error(400, "天数必须大于0");
            }
            
            List<DeviceStatus> devices = deviceService.getDevicesNeedMaintenance(days);
            logger.info("成功获取需要维护的设备列表，共{}个设备", devices.size());
            return Result.success("获取需要维护的设备列表成功", devices);
        } catch (Exception e) {
            logger.error("获取需要维护的设备列表失败", e);
            return Result.error("获取需要维护的设备列表失败：" + e.getMessage());
        }
    }

    // ==================== 控制日志查询接口 ====================

    /**
     * 获取设备控制日志
     * GET /api/devices/{deviceId}/logs
     */
    @GetMapping("/{deviceId}/logs")
    public Result<List<ControlLog>> getDeviceControlLogs(@PathVariable String deviceId) {
        try {
            logger.info("获取设备控制日志，设备ID：{}", deviceId);
            
            // 参数验证
            if (deviceId == null || deviceId.trim().isEmpty()) {
                return Result.error(400, "设备ID不能为空");
            }
            
            List<ControlLog> logs = deviceService.getDeviceControlLogs(deviceId);
            logger.info("成功获取设备控制日志，设备ID：{}，日志数量：{}", deviceId, logs.size());
            return Result.success("获取设备控制日志成功", logs);
        } catch (Exception e) {
            logger.error("获取设备控制日志失败，设备ID：{}", deviceId, e);
            return Result.error("获取设备控制日志失败：" + e.getMessage());
        }
    }

    /**
     * 获取最近的控制日志
     * GET /api/devices/logs/recent?limit=50
     */
    @GetMapping("/logs/recent")
    public Result<List<ControlLog>> getRecentControlLogs(@RequestParam(defaultValue = "50") int limit) {
        try {
            logger.info("获取最近的控制日志，限制数量：{}", limit);
            
            if (limit < 1 || limit > 1000) {
                return Result.error(400, "限制数量必须在1-1000之间");
            }
            
            List<ControlLog> logs = deviceService.getRecentControlLogs(limit);
            logger.info("成功获取最近的控制日志，数量：{}", logs.size());
            return Result.success("获取最近的控制日志成功", logs);
        } catch (Exception e) {
            logger.error("获取最近的控制日志失败", e);
            return Result.error("获取最近的控制日志失败：" + e.getMessage());
        }
    }

    /**
     * 获取失败的控制操作
     * GET /api/devices/logs/failed
     */
    @GetMapping("/logs/failed")
    public Result<List<ControlLog>> getFailedOperations() {
        try {
            logger.info("获取失败的控制操作");
            List<ControlLog> logs = deviceService.getFailedOperations();
            logger.info("成功获取失败的控制操作，数量：{}", logs.size());
            return Result.success("获取失败的控制操作成功", logs);
        } catch (Exception e) {
            logger.error("获取失败的控制操作失败", e);
            return Result.error("获取失败的控制操作失败：" + e.getMessage());
        }
    }

    // ==================== 智能控制接口 ====================

    /**
     * 自动控制湿度设备
     * POST /api/devices/auto-control/humidity
     */
    @PostMapping("/auto-control/humidity")
    public Result<Map<String, Object>> autoControlHumidityDevices(
            @RequestParam BigDecimal currentHumidity,
            @RequestParam BigDecimal targetHumidity,
            @RequestParam(defaultValue = "5.0") BigDecimal tolerance) {
        try {
            logger.info("自动控制湿度设备，当前湿度：{}，目标湿度：{}，容差：{}", currentHumidity, targetHumidity, tolerance);
            
            // 参数验证
            if (currentHumidity == null || targetHumidity == null || tolerance == null) {
                return Result.error(400, "参数不能为空");
            }
            if (currentHumidity.compareTo(BigDecimal.ZERO) < 0 || currentHumidity.compareTo(new BigDecimal("100")) > 0) {
                return Result.error(400, "当前湿度必须在0-100之间");
            }
            if (targetHumidity.compareTo(BigDecimal.ZERO) < 0 || targetHumidity.compareTo(new BigDecimal("100")) > 0) {
                return Result.error(400, "目标湿度必须在0-100之间");
            }
            
            Map<String, Object> result = deviceService.autoControlHumidityDevices(currentHumidity, targetHumidity, tolerance);
            logger.info("自动控制湿度设备完成");
            return Result.success("自动控制湿度设备完成", result);
        } catch (Exception e) {
            logger.error("自动控制湿度设备失败", e);
            return Result.error("自动控制湿度设备失败：" + e.getMessage());
        }
    }

    /**
     * 自动控制光照设备
     * POST /api/devices/auto-control/light
     */
    @PostMapping("/auto-control/light")
    public Result<Map<String, Object>> autoControlLightDevices(
            @RequestParam BigDecimal currentLightIntensity,
            @RequestParam BigDecimal targetLightIntensity,
            @RequestParam(defaultValue = "1000.0") BigDecimal tolerance) {
        try {
            logger.info("自动控制光照设备，当前光照：{}，目标光照：{}，容差：{}", currentLightIntensity, targetLightIntensity, tolerance);
            
            // 参数验证
            if (currentLightIntensity == null || targetLightIntensity == null || tolerance == null) {
                return Result.error(400, "参数不能为空");
            }
            if (currentLightIntensity.compareTo(BigDecimal.ZERO) < 0) {
                return Result.error(400, "当前光照强度不能为负数");
            }
            if (targetLightIntensity.compareTo(BigDecimal.ZERO) < 0) {
                return Result.error(400, "目标光照强度不能为负数");
            }
            
            Map<String, Object> result = deviceService.autoControlLightDevices(currentLightIntensity, targetLightIntensity, tolerance);
            logger.info("自动控制光照设备完成");
            return Result.success("自动控制光照设备完成", result);
        } catch (Exception e) {
            logger.error("自动控制光照设备失败", e);
            return Result.error("自动控制光照设备失败：" + e.getMessage());
        }
    }

    /**
     * 自动控制通风设备
     * POST /api/devices/auto-control/ventilation
     */
    @PostMapping("/auto-control/ventilation")
    public Result<Map<String, Object>> autoControlVentilationDevices(
            @RequestParam BigDecimal currentTemperature,
            @RequestParam BigDecimal currentCo2Level,
            @RequestParam(defaultValue = "30.0") BigDecimal maxTemperature,
            @RequestParam(defaultValue = "1000.0") BigDecimal maxCo2Level) {
        try {
            logger.info("自动控制通风设备，当前温度：{}，当前CO2：{}，最高温度：{}，最高CO2：{}", 
                    currentTemperature, currentCo2Level, maxTemperature, maxCo2Level);
            
            // 参数验证
            if (currentTemperature == null || currentCo2Level == null || maxTemperature == null || maxCo2Level == null) {
                return Result.error(400, "参数不能为空");
            }
            if (currentCo2Level.compareTo(BigDecimal.ZERO) < 0) {
                return Result.error(400, "CO2浓度不能为负数");
            }
            
            Map<String, Object> result = deviceService.autoControlVentilationDevices(
                    currentTemperature, currentCo2Level, maxTemperature, maxCo2Level);
            logger.info("自动控制通风设备完成");
            return Result.success("自动控制通风设备完成", result);
        } catch (Exception e) {
            logger.error("自动控制通风设备失败", e);
            return Result.error("自动控制通风设备失败：" + e.getMessage());
        }
    }

    // ==================== 私有辅助方法 ====================

    /**
     * 验证设备控制参数
     */
    private boolean validateDeviceControlParams(String deviceId, BigDecimal powerLevel, String operator, String operationSource) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            logger.warn("设备ID不能为空");
            return false;
        }
        
        if (powerLevel != null && (powerLevel.compareTo(BigDecimal.ZERO) < 0 || powerLevel.compareTo(new BigDecimal("100")) > 0)) {
            logger.warn("功率级别必须在0-100之间，当前值：{}", powerLevel);
            return false;
        }
        
        if (operator == null || operator.trim().isEmpty()) {
            logger.warn("操作员不能为空");
            return false;
        }
        
        try {
            ControlLog.OperationSource.valueOf(operationSource);
        } catch (IllegalArgumentException e) {
            logger.warn("无效的操作来源：{}", operationSource);
            return false;
        }
        
        return true;
    }

    /**
     * 验证设备控制权限
     * 简单的权限验证逻辑，实际项目中应该根据具体需求实现更复杂的权限控制
     */
    private boolean validateControlPermission(String deviceId, String operator, ControlLog.Action action) {
        try {
            // 检查设备是否存在
            if (!deviceService.deviceExists(deviceId)) {
                logger.warn("设备不存在，无法执行控制操作，设备ID：{}", deviceId);
                return false;
            }
            
            // 检查设备状态
            DeviceStatus device = deviceService.getDeviceById(deviceId);
            if (device == null) {
                logger.warn("无法获取设备信息，设备ID：{}", deviceId);
                return false;
            }
            
            // 如果设备处于故障状态，只允许重置操作
            if (device.getStatus() == DeviceStatus.DeviceStatusEnum.error && action != ControlLog.Action.reset) {
                logger.warn("设备处于故障状态，只允许重置操作，设备ID：{}，当前操作：{}", deviceId, action);
                return false;
            }
            
            // 如果设备离线，不允许任何控制操作
            if (device.getStatus() == DeviceStatus.DeviceStatusEnum.offline) {
                logger.warn("设备离线，不允许控制操作，设备ID：{}", deviceId);
                return false;
            }
            
            // 系统操作员拥有所有权限
            if ("system".equals(operator)) {
                return true;
            }
            
            // 其他权限验证逻辑可以在这里添加
            // 例如：检查操作员角色、检查设备类型权限等
            
            logger.debug("权限验证通过，设备ID：{}，操作员：{}，操作：{}", deviceId, operator, action);
            return true;
        } catch (Exception e) {
            logger.error("权限验证失败，设备ID：{}，操作员：{}，操作：{}", deviceId, operator, action, e);
            return false;
        }
    }
}