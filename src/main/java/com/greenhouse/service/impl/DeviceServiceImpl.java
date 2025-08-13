package com.greenhouse.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.entity.ControlLog;
import com.greenhouse.mapper.DeviceMapper;
import com.greenhouse.mapper.ControlLogMapper;
import com.greenhouse.service.DeviceService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

/**
 * 设备控制服务实现类
 * 实现设备状态查询、设备控制、设备配置等功能
 */
@Service
@Transactional
public class DeviceServiceImpl implements DeviceService {

    private static final Logger logger = LoggerFactory.getLogger(DeviceServiceImpl.class);

    @Autowired
    private DeviceMapper deviceMapper;

    @Autowired
    private ControlLogMapper controlLogMapper;

    // ==================== 设备状态查询 ====================

    @Override
    public List<DeviceStatus> getAllDevices() {
        try {
            return deviceMapper.selectList(null);
        } catch (Exception e) {
            logger.error("获取所有设备列表失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public DeviceStatus getDeviceById(String deviceId) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            logger.warn("设备ID不能为空");
            return null;
        }
        try {
            return deviceMapper.selectByDeviceId(deviceId);
        } catch (Exception e) {
            logger.error("根据设备ID查询设备失败: {}", deviceId, e);
            return null;
        }
    }

    @Override
    public List<DeviceStatus> getDevicesByType(DeviceStatus.DeviceType deviceType) {
        if (deviceType == null) {
            logger.warn("设备类型不能为空");
            return new ArrayList<>();
        }
        try {
            return deviceMapper.selectByDeviceType(deviceType);
        } catch (Exception e) {
            logger.error("根据设备类型查询设备失败: {}", deviceType, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeviceStatus> getDevicesByStatus(DeviceStatus.DeviceStatusEnum status) {
        if (status == null) {
            logger.warn("设备状态不能为空");
            return new ArrayList<>();
        }
        try {
            return deviceMapper.selectByStatus(status);
        } catch (Exception e) {
            logger.error("根据设备状态查询设备失败: {}", status, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeviceStatus> getRunningDevices() {
        try {
            return deviceMapper.selectRunningDevices();
        } catch (Exception e) {
            logger.error("获取运行中设备列表失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeviceStatus> getOfflineDevices() {
        try {
            return deviceMapper.selectOfflineDevices();
        } catch (Exception e) {
            logger.error("获取离线设备列表失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeviceStatus> getErrorDevices() {
        try {
            return deviceMapper.selectErrorDevices();
        } catch (Exception e) {
            logger.error("获取故障设备列表失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public IPage<DeviceStatus> getDevicesPage(Page<DeviceStatus> page, DeviceStatus.DeviceType deviceType, DeviceStatus.DeviceStatusEnum status) {
        try {
            return deviceMapper.selectDevicePage(page, deviceType, status);
        } catch (Exception e) {
            logger.error("分页查询设备列表失败", e);
            return new Page<>();
        }
    }

    // ==================== 设备控制操作 ====================

    @Override
    public boolean startDevice(String deviceId, BigDecimal powerLevel, String operator, ControlLog.OperationSource operationSource) {
        if (!validateDeviceControl(deviceId, powerLevel, operator)) {
            return false;
        }

        try {
            DeviceStatus device = deviceMapper.selectByDeviceId(deviceId);
            if (device == null) {
                logger.warn("设备不存在: {}", deviceId);
                return false;
            }

            if (device.getStatus() != DeviceStatus.DeviceStatusEnum.online) {
                logger.warn("设备不在线，无法启动: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.start, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }

            // 更新设备运行状态
            int updateResult = deviceMapper.updateRunningStatus(deviceId, true, powerLevel);
            if (updateResult > 0) {
                logger.info("设备启动成功: {} -> 功率: {}%", deviceId, powerLevel);
                logControlOperation(deviceId, ControlLog.Action.start, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.success);
                return true;
            } else {
                logger.error("设备启动失败: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.start, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }
        } catch (Exception e) {
            logger.error("启动设备异常: {}", deviceId, e);
            logControlOperation(deviceId, ControlLog.Action.start, null, powerLevel, 
                              operator, operationSource, ControlLog.Result.failed);
            return false;
        }
    }

    @Override
    public boolean stopDevice(String deviceId, String operator, ControlLog.OperationSource operationSource) {
        if (!validateDeviceControl(deviceId, null, operator)) {
            return false;
        }

        try {
            DeviceStatus device = deviceMapper.selectByDeviceId(deviceId);
            if (device == null) {
                logger.warn("设备不存在: {}", deviceId);
                return false;
            }

            // 更新设备运行状态
            int updateResult = deviceMapper.updateRunningStatus(deviceId, false, BigDecimal.ZERO);
            if (updateResult > 0) {
                logger.info("设备停止成功: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.stop, device.getPowerLevel(), BigDecimal.ZERO, 
                                  operator, operationSource, ControlLog.Result.success);
                return true;
            } else {
                logger.error("设备停止失败: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.stop, device.getPowerLevel(), BigDecimal.ZERO, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }
        } catch (Exception e) {
            logger.error("停止设备异常: {}", deviceId, e);
            logControlOperation(deviceId, ControlLog.Action.stop, null, BigDecimal.ZERO, 
                              operator, operationSource, ControlLog.Result.failed);
            return false;
        }
    }

    @Override
    public boolean adjustDevicePower(String deviceId, BigDecimal powerLevel, String operator, ControlLog.OperationSource operationSource) {
        if (!validateDeviceControl(deviceId, powerLevel, operator)) {
            return false;
        }

        try {
            DeviceStatus device = deviceMapper.selectByDeviceId(deviceId);
            if (device == null) {
                logger.warn("设备不存在: {}", deviceId);
                return false;
            }

            if (device.getStatus() != DeviceStatus.DeviceStatusEnum.online) {
                logger.warn("设备不在线，无法调节功率: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.adjust, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }

            // 更新设备功率
            int updateResult = deviceMapper.updateRunningStatus(deviceId, device.getIsRunning(), powerLevel);
            if (updateResult > 0) {
                logger.info("设备功率调节成功: {} -> 功率: {}%", deviceId, powerLevel);
                logControlOperation(deviceId, ControlLog.Action.adjust, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.success);
                return true;
            } else {
                logger.error("设备功率调节失败: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.adjust, device.getPowerLevel(), powerLevel, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }
        } catch (Exception e) {
            logger.error("调节设备功率异常: {}", deviceId, e);
            logControlOperation(deviceId, ControlLog.Action.adjust, null, powerLevel, 
                              operator, operationSource, ControlLog.Result.failed);
            return false;
        }
    }

    @Override
    public boolean resetDevice(String deviceId, String operator, ControlLog.OperationSource operationSource) {
        if (!validateDeviceControl(deviceId, null, operator)) {
            return false;
        }

        try {
            DeviceStatus device = deviceMapper.selectByDeviceId(deviceId);
            if (device == null) {
                logger.warn("设备不存在: {}", deviceId);
                return false;
            }

            // 重置设备状态
            int updateResult = deviceMapper.updateRunningStatus(deviceId, false, BigDecimal.ZERO);
            if (updateResult > 0) {
                // 如果设备之前是故障状态，重置为在线状态
                if (device.getStatus() == DeviceStatus.DeviceStatusEnum.error) {
                    deviceMapper.updateDeviceStatus(deviceId, DeviceStatus.DeviceStatusEnum.online);
                }
                logger.info("设备重置成功: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.reset, device.getPowerLevel(), BigDecimal.ZERO, 
                                  operator, operationSource, ControlLog.Result.success);
                return true;
            } else {
                logger.error("设备重置失败: {}", deviceId);
                logControlOperation(deviceId, ControlLog.Action.reset, device.getPowerLevel(), BigDecimal.ZERO, 
                                  operator, operationSource, ControlLog.Result.failed);
                return false;
            }
        } catch (Exception e) {
            logger.error("重置设备异常: {}", deviceId, e);
            logControlOperation(deviceId, ControlLog.Action.reset, null, BigDecimal.ZERO, 
                              operator, operationSource, ControlLog.Result.failed);
            return false;
        }
    }

    @Override
    public int batchControlDevices(List<String> deviceIds, ControlLog.Action action, BigDecimal powerLevel, 
                                 String operator, ControlLog.OperationSource operationSource) {
        if (deviceIds == null || deviceIds.isEmpty()) {
            logger.warn("设备ID列表不能为空");
            return 0;
        }

        int successCount = 0;
        for (String deviceId : deviceIds) {
            boolean result = false;
            switch (action) {
                case start:
                    result = startDevice(deviceId, powerLevel != null ? powerLevel : BigDecimal.valueOf(50), operator, operationSource);
                    break;
                case stop:
                    result = stopDevice(deviceId, operator, operationSource);
                    break;
                case adjust:
                    if (powerLevel != null) {
                        result = adjustDevicePower(deviceId, powerLevel, operator, operationSource);
                    }
                    break;
                case reset:
                    result = resetDevice(deviceId, operator, operationSource);
                    break;
            }
            if (result) {
                successCount++;
            }
        }

        logger.info("批量控制设备完成: 总数={}, 成功={}, 操作={}", deviceIds.size(), successCount, action);
        return successCount;
    }

    // ==================== 设备配置管理 ====================

    @Override
    public boolean updateDeviceStatus(String deviceId, DeviceStatus.DeviceStatusEnum status) {
        if (deviceId == null || deviceId.trim().isEmpty() || status == null) {
            logger.warn("设备ID和状态不能为空");
            return false;
        }

        try {
            int updateResult = deviceMapper.updateDeviceStatus(deviceId, status);
            if (updateResult > 0) {
                logger.info("设备状态更新成功: {} -> {}", deviceId, status);
                return true;
            } else {
                logger.warn("设备状态更新失败，设备可能不存在: {}", deviceId);
                return false;
            }
        } catch (Exception e) {
            logger.error("更新设备状态异常: {}", deviceId, e);
            return false;
        }
    }

    @Override
    public boolean updateMaintenanceDate(String deviceId, LocalDate maintenanceDate) {
        if (deviceId == null || deviceId.trim().isEmpty() || maintenanceDate == null) {
            logger.warn("设备ID和维护日期不能为空");
            return false;
        }

        try {
            int updateResult = deviceMapper.updateMaintenanceDate(deviceId, maintenanceDate);
            if (updateResult > 0) {
                logger.info("设备维护时间更新成功: {} -> {}", deviceId, maintenanceDate);
                return true;
            } else {
                logger.warn("设备维护时间更新失败，设备可能不存在: {}", deviceId);
                return false;
            }
        } catch (Exception e) {
            logger.error("更新设备维护时间异常: {}", deviceId, e);
            return false;
        }
    }

    @Override
    public boolean addDevice(DeviceStatus deviceStatus) {
        if (deviceStatus == null || deviceStatus.getDeviceId() == null || deviceStatus.getDeviceId().trim().isEmpty()) {
            logger.warn("设备信息不能为空");
            return false;
        }

        try {
            // 检查设备是否已存在
            if (deviceExists(deviceStatus.getDeviceId())) {
                logger.warn("设备已存在: {}", deviceStatus.getDeviceId());
                return false;
            }

            int insertResult = deviceMapper.insert(deviceStatus);
            if (insertResult > 0) {
                logger.info("设备添加成功: {}", deviceStatus.getDeviceId());
                return true;
            } else {
                logger.error("设备添加失败: {}", deviceStatus.getDeviceId());
                return false;
            }
        } catch (Exception e) {
            logger.error("添加设备异常: {}", deviceStatus.getDeviceId(), e);
            return false;
        }
    }

    @Override
    public boolean removeDevice(String deviceId) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            logger.warn("设备ID不能为空");
            return false;
        }

        try {
            QueryWrapper<DeviceStatus> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("device_id", deviceId);
            int deleteResult = deviceMapper.delete(queryWrapper);
            if (deleteResult > 0) {
                logger.info("设备删除成功: {}", deviceId);
                return true;
            } else {
                logger.warn("设备删除失败，设备可能不存在: {}", deviceId);
                return false;
            }
        } catch (Exception e) {
            logger.error("删除设备异常: {}", deviceId, e);
            return false;
        }
    }

    // ==================== 设备监控和统计 ====================

    @Override
    public boolean deviceExists(String deviceId) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            return false;
        }
        try {
            return deviceMapper.existsByDeviceId(deviceId);
        } catch (Exception e) {
            logger.error("检查设备是否存在异常: {}", deviceId, e);
            return false;
        }
    }

    @Override
    public List<Map<String, Object>> getDeviceTypeStatistics() {
        try {
            return deviceMapper.selectDeviceTypeStatistics();
        } catch (Exception e) {
            logger.error("获取设备类型统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getDeviceStatusStatistics() {
        try {
            return deviceMapper.selectDeviceStatusStatistics();
        } catch (Exception e) {
            logger.error("获取设备状态统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<Map<String, Object>> getPowerUsageStatistics() {
        try {
            return deviceMapper.selectPowerUsageStatistics();
        } catch (Exception e) {
            logger.error("获取设备功率使用统计失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<DeviceStatus> getDevicesNeedMaintenance(int days) {
        try {
            return deviceMapper.selectDevicesNeedMaintenance(days);
        } catch (Exception e) {
            logger.error("获取需要维护的设备列表失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public long getTotalDeviceCount() {
        try {
            return deviceMapper.countAllDevices();
        } catch (Exception e) {
            logger.error("获取设备总数失败", e);
            return 0;
        }
    }

    @Override
    public long getOnlineDeviceCount() {
        try {
            return deviceMapper.countOnlineDevices();
        } catch (Exception e) {
            logger.error("获取在线设备数量失败", e);
            return 0;
        }
    }

    // ==================== 控制日志查询 ====================

    @Override
    public List<ControlLog> getDeviceControlLogs(String deviceId) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            logger.warn("设备ID不能为空");
            return new ArrayList<>();
        }
        try {
            return controlLogMapper.selectByDeviceId(deviceId);
        } catch (Exception e) {
            logger.error("获取设备控制日志失败: {}", deviceId, e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<ControlLog> getRecentControlLogs(int limit) {
        try {
            return controlLogMapper.selectRecentLogs(limit);
        } catch (Exception e) {
            logger.error("获取最近控制日志失败", e);
            return new ArrayList<>();
        }
    }

    @Override
    public List<ControlLog> getFailedOperations() {
        try {
            return controlLogMapper.selectFailedOperations();
        } catch (Exception e) {
            logger.error("获取失败操作列表失败", e);
            return new ArrayList<>();
        }
    }

    // ==================== 智能控制功能 ====================

    @Override
    public Map<String, Object> autoControlHumidityDevices(BigDecimal currentHumidity, BigDecimal targetHumidity, BigDecimal tolerance) {
        Map<String, Object> result = new HashMap<>();
        List<String> controlledDevices = new ArrayList<>();
        
        try {
            BigDecimal difference = currentHumidity.subtract(targetHumidity);
            
            if (difference.abs().compareTo(tolerance) <= 0) {
                result.put("success", true);
                result.put("message", "湿度在正常范围内，无需调节");
                result.put("controlledDevices", controlledDevices);
                return result;
            }

            if (difference.compareTo(BigDecimal.ZERO) > 0) {
                // 湿度过高，启动除湿器，停止加湿器
                List<DeviceStatus> dehumidifiers = getDevicesByType(DeviceStatus.DeviceType.dehumidifier);
                List<DeviceStatus> humidifiers = getDevicesByType(DeviceStatus.DeviceType.humidifier);
                
                for (DeviceStatus device : dehumidifiers) {
                    if (device.getStatus() == DeviceStatus.DeviceStatusEnum.online) {
                        BigDecimal powerLevel = calculateHumidityPowerLevel(difference, tolerance);
                        if (startDevice(device.getDeviceId(), powerLevel, "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
                
                for (DeviceStatus device : humidifiers) {
                    if (device.getIsRunning()) {
                        if (stopDevice(device.getDeviceId(), "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
            } else {
                // 湿度过低，启动加湿器，停止除湿器
                List<DeviceStatus> humidifiers = getDevicesByType(DeviceStatus.DeviceType.humidifier);
                List<DeviceStatus> dehumidifiers = getDevicesByType(DeviceStatus.DeviceType.dehumidifier);
                
                for (DeviceStatus device : humidifiers) {
                    if (device.getStatus() == DeviceStatus.DeviceStatusEnum.online) {
                        BigDecimal powerLevel = calculateHumidityPowerLevel(difference.abs(), tolerance);
                        if (startDevice(device.getDeviceId(), powerLevel, "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
                
                for (DeviceStatus device : dehumidifiers) {
                    if (device.getIsRunning()) {
                        if (stopDevice(device.getDeviceId(), "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
            }

            result.put("success", true);
            result.put("message", String.format("湿度自动控制完成，控制了%d个设备", controlledDevices.size()));
            result.put("controlledDevices", controlledDevices);
            
        } catch (Exception e) {
            logger.error("湿度自动控制异常", e);
            result.put("success", false);
            result.put("message", "湿度自动控制失败: " + e.getMessage());
            result.put("controlledDevices", controlledDevices);
        }
        
        return result;
    }

    @Override
    public Map<String, Object> autoControlLightDevices(BigDecimal currentLightIntensity, BigDecimal targetLightIntensity, BigDecimal tolerance) {
        Map<String, Object> result = new HashMap<>();
        List<String> controlledDevices = new ArrayList<>();
        
        try {
            BigDecimal difference = targetLightIntensity.subtract(currentLightIntensity);
            
            if (difference.abs().compareTo(tolerance) <= 0) {
                result.put("success", true);
                result.put("message", "光照强度在正常范围内，无需调节");
                result.put("controlledDevices", controlledDevices);
                return result;
            }

            List<DeviceStatus> lightDevices = getDevicesByType(DeviceStatus.DeviceType.light);
            
            if (difference.compareTo(BigDecimal.ZERO) > 0) {
                // 光照不足，启动补光灯
                for (DeviceStatus device : lightDevices) {
                    if (device.getStatus() == DeviceStatus.DeviceStatusEnum.online) {
                        BigDecimal powerLevel = calculateLightPowerLevel(difference, tolerance);
                        if (startDevice(device.getDeviceId(), powerLevel, "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
            } else {
                // 光照过强，关闭补光灯
                for (DeviceStatus device : lightDevices) {
                    if (device.getIsRunning()) {
                        if (stopDevice(device.getDeviceId(), "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
            }

            result.put("success", true);
            result.put("message", String.format("光照自动控制完成，控制了%d个设备", controlledDevices.size()));
            result.put("controlledDevices", controlledDevices);
            
        } catch (Exception e) {
            logger.error("光照自动控制异常", e);
            result.put("success", false);
            result.put("message", "光照自动控制失败: " + e.getMessage());
            result.put("controlledDevices", controlledDevices);
        }
        
        return result;
    }

    @Override
    public Map<String, Object> autoControlVentilationDevices(BigDecimal currentTemperature, BigDecimal currentCo2Level, 
                                                           BigDecimal maxTemperature, BigDecimal maxCo2Level) {
        Map<String, Object> result = new HashMap<>();
        List<String> controlledDevices = new ArrayList<>();
        
        try {
            boolean needVentilation = currentTemperature.compareTo(maxTemperature) > 0 || 
                                    currentCo2Level.compareTo(maxCo2Level) > 0;
            
            List<DeviceStatus> fanDevices = getDevicesByType(DeviceStatus.DeviceType.fan);
            
            if (needVentilation) {
                // 需要通风，启动风扇
                for (DeviceStatus device : fanDevices) {
                    if (device.getStatus() == DeviceStatus.DeviceStatusEnum.online && !device.getIsRunning()) {
                        BigDecimal powerLevel = calculateVentilationPowerLevel(currentTemperature, currentCo2Level, 
                                                                             maxTemperature, maxCo2Level);
                        if (startDevice(device.getDeviceId(), powerLevel, "system", ControlLog.OperationSource.auto)) {
                            controlledDevices.add(device.getDeviceId());
                        }
                    }
                }
            } else {
                // 不需要通风，可以关闭部分风扇
                for (DeviceStatus device : fanDevices) {
                    if (device.getIsRunning() && device.getPowerLevel().compareTo(BigDecimal.valueOf(30)) > 0) {
                        // 降低功率或停止
                        BigDecimal newPowerLevel = device.getPowerLevel().multiply(BigDecimal.valueOf(0.7));
                        if (newPowerLevel.compareTo(BigDecimal.valueOf(20)) < 0) {
                            if (stopDevice(device.getDeviceId(), "system", ControlLog.OperationSource.auto)) {
                                controlledDevices.add(device.getDeviceId());
                            }
                        } else {
                            if (adjustDevicePower(device.getDeviceId(), newPowerLevel, "system", ControlLog.OperationSource.auto)) {
                                controlledDevices.add(device.getDeviceId());
                            }
                        }
                    }
                }
            }

            result.put("success", true);
            result.put("message", String.format("通风自动控制完成，控制了%d个设备", controlledDevices.size()));
            result.put("controlledDevices", controlledDevices);
            
        } catch (Exception e) {
            logger.error("通风自动控制异常", e);
            result.put("success", false);
            result.put("message", "通风自动控制失败: " + e.getMessage());
            result.put("controlledDevices", controlledDevices);
        }
        
        return result;
    }

    // ==================== 私有辅助方法 ====================

    /**
     * 验证设备控制参数
     */
    private boolean validateDeviceControl(String deviceId, BigDecimal powerLevel, String operator) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            logger.warn("设备ID不能为空");
            return false;
        }
        if (operator == null || operator.trim().isEmpty()) {
            logger.warn("操作员不能为空");
            return false;
        }
        if (powerLevel != null && (powerLevel.compareTo(BigDecimal.ZERO) < 0 || powerLevel.compareTo(BigDecimal.valueOf(100)) > 0)) {
            logger.warn("功率级别必须在0-100之间: {}", powerLevel);
            return false;
        }
        return true;
    }

    /**
     * 记录控制操作日志
     */
    private void logControlOperation(String deviceId, ControlLog.Action action, BigDecimal oldValue, BigDecimal newValue,
                                   String operator, ControlLog.OperationSource operationSource, ControlLog.Result result) {
        try {
            ControlLog controlLog = new ControlLog(deviceId, action, operator, operationSource);
            controlLog.setOldValue(oldValue);
            controlLog.setNewValue(newValue);
            controlLog.setResult(result);
            controlLogMapper.insert(controlLog);
        } catch (Exception e) {
            logger.error("记录控制日志失败", e);
        }
    }

    /**
     * 计算湿度控制功率级别
     */
    private BigDecimal calculateHumidityPowerLevel(BigDecimal difference, BigDecimal tolerance) {
        BigDecimal ratio = difference.divide(tolerance, 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal powerLevel = ratio.multiply(BigDecimal.valueOf(50)).add(BigDecimal.valueOf(30));
        return powerLevel.min(BigDecimal.valueOf(100)).max(BigDecimal.valueOf(20));
    }

    /**
     * 计算光照控制功率级别
     */
    private BigDecimal calculateLightPowerLevel(BigDecimal difference, BigDecimal tolerance) {
        BigDecimal ratio = difference.divide(tolerance, 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal powerLevel = ratio.multiply(BigDecimal.valueOf(40)).add(BigDecimal.valueOf(40));
        return powerLevel.min(BigDecimal.valueOf(100)).max(BigDecimal.valueOf(30));
    }

    /**
     * 计算通风控制功率级别
     */
    private BigDecimal calculateVentilationPowerLevel(BigDecimal currentTemperature, BigDecimal currentCo2Level,
                                                    BigDecimal maxTemperature, BigDecimal maxCo2Level) {
        BigDecimal tempRatio = currentTemperature.subtract(maxTemperature).max(BigDecimal.ZERO)
                              .divide(BigDecimal.valueOf(10), 2, BigDecimal.ROUND_HALF_UP);
        BigDecimal co2Ratio = currentCo2Level.subtract(maxCo2Level).max(BigDecimal.ZERO)
                             .divide(BigDecimal.valueOf(500), 2, BigDecimal.ROUND_HALF_UP);
        
        BigDecimal maxRatio = tempRatio.max(co2Ratio);
        BigDecimal powerLevel = maxRatio.multiply(BigDecimal.valueOf(60)).add(BigDecimal.valueOf(40));
        return powerLevel.min(BigDecimal.valueOf(100)).max(BigDecimal.valueOf(30));
    }



    /**
     * 保存或更新设备（用于模拟服务）
     */
    public boolean saveOrUpdateDevice(DeviceStatus deviceStatus) {
        if (deviceStatus == null) {
            logger.warn("设备状态对象不能为空");
            return false;
        }

        try {
            if (deviceExists(deviceStatus.getDeviceId())) {
                // 更新现有设备
                int result = deviceMapper.updateById(deviceStatus);
                if (result > 0) {
                    logger.debug("设备更新成功: {}", deviceStatus.getDeviceId());
                    return true;
                } else {
                    logger.warn("设备更新失败: {}", deviceStatus.getDeviceId());
                    return false;
                }
            } else {
                // 添加新设备
                return addDevice(deviceStatus);
            }
        } catch (Exception e) {
            logger.error("保存或更新设备异常: {}", deviceStatus.getDeviceId(), e);
            return false;
        }
    }

    /**
     * 根据设备类型字符串获取设备列表（用于模拟服务）
     */
    public List<DeviceStatus> getDevicesByType(String deviceTypeStr) {
        if (deviceTypeStr == null || deviceTypeStr.trim().isEmpty()) {
            logger.warn("设备类型字符串不能为空");
            return new ArrayList<>();
        }

        try {
            DeviceStatus.DeviceType deviceType = DeviceStatus.DeviceType.valueOf(deviceTypeStr);
            return getDevicesByType(deviceType);
        } catch (IllegalArgumentException e) {
            logger.warn("无效的设备类型: {}", deviceTypeStr);
            return new ArrayList<>();
        } catch (Exception e) {
            logger.error("根据设备类型字符串查询设备失败: {}", deviceTypeStr, e);
            return new ArrayList<>();
        }
    }
}