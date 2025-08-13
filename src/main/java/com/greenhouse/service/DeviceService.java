package com.greenhouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.entity.ControlLog;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 设备控制服务接口
 * 提供设备状态查询、设备控制、设备配置等功能
 * 
 * 支持的需求：
 * - 需求2（湿度控制）：控制加湿器、除湿器
 * - 需求3（光照管理）：控制补光灯
 * - 需求4（通风系统）：控制风扇、通风设备
 * - 需求7（远程控制）：远程设备控制功能
 */
public interface DeviceService {

    // ==================== 设备状态查询 ====================

    /**
     * 获取所有设备列表
     * @return 设备状态列表
     */
    List<DeviceStatus> getAllDevices();

    /**
     * 根据设备ID查询设备状态
     * @param deviceId 设备ID
     * @return 设备状态，如果不存在返回null
     */
    DeviceStatus getDeviceById(String deviceId);

    /**
     * 根据设备类型查询设备列表
     * @param deviceType 设备类型
     * @return 指定类型的设备列表
     */
    List<DeviceStatus> getDevicesByType(DeviceStatus.DeviceType deviceType);

    /**
     * 根据设备状态查询设备列表
     * @param status 设备状态
     * @return 指定状态的设备列表
     */
    List<DeviceStatus> getDevicesByStatus(DeviceStatus.DeviceStatusEnum status);

    /**
     * 获取正在运行的设备列表
     * @return 运行中的设备列表
     */
    List<DeviceStatus> getRunningDevices();

    /**
     * 获取离线设备列表
     * @return 离线设备列表
     */
    List<DeviceStatus> getOfflineDevices();

    /**
     * 获取故障设备列表
     * @return 故障设备列表
     */
    List<DeviceStatus> getErrorDevices();

    /**
     * 分页查询设备列表
     * @param page 分页参数
     * @param deviceType 设备类型（可选）
     * @param status 设备状态（可选）
     * @return 分页结果
     */
    IPage<DeviceStatus> getDevicesPage(Page<DeviceStatus> page, 
                                     DeviceStatus.DeviceType deviceType, 
                                     DeviceStatus.DeviceStatusEnum status);

    // ==================== 设备控制操作 ====================

    /**
     * 启动设备
     * @param deviceId 设备ID
     * @param powerLevel 功率级别（0-100）
     * @param operator 操作员
     * @param operationSource 操作来源
     * @return 操作是否成功
     */
    boolean startDevice(String deviceId, BigDecimal powerLevel, String operator, ControlLog.OperationSource operationSource);

    /**
     * 停止设备
     * @param deviceId 设备ID
     * @param operator 操作员
     * @param operationSource 操作来源
     * @return 操作是否成功
     */
    boolean stopDevice(String deviceId, String operator, ControlLog.OperationSource operationSource);

    /**
     * 调节设备功率
     * @param deviceId 设备ID
     * @param powerLevel 新的功率级别（0-100）
     * @param operator 操作员
     * @param operationSource 操作来源
     * @return 操作是否成功
     */
    boolean adjustDevicePower(String deviceId, BigDecimal powerLevel, String operator, ControlLog.OperationSource operationSource);

    /**
     * 重置设备
     * @param deviceId 设备ID
     * @param operator 操作员
     * @param operationSource 操作来源
     * @return 操作是否成功
     */
    boolean resetDevice(String deviceId, String operator, ControlLog.OperationSource operationSource);

    /**
     * 批量控制设备
     * @param deviceIds 设备ID列表
     * @param action 操作动作
     * @param powerLevel 功率级别（仅对启动和调节操作有效）
     * @param operator 操作员
     * @param operationSource 操作来源
     * @return 成功操作的设备数量
     */
    int batchControlDevices(List<String> deviceIds, ControlLog.Action action, BigDecimal powerLevel, 
                           String operator, ControlLog.OperationSource operationSource);

    // ==================== 设备配置管理 ====================

    /**
     * 更新设备状态
     * @param deviceId 设备ID
     * @param status 新状态
     * @return 更新是否成功
     */
    boolean updateDeviceStatus(String deviceId, DeviceStatus.DeviceStatusEnum status);

    /**
     * 更新设备维护时间
     * @param deviceId 设备ID
     * @param maintenanceDate 维护日期
     * @return 更新是否成功
     */
    boolean updateMaintenanceDate(String deviceId, LocalDate maintenanceDate);

    /**
     * 添加新设备
     * @param deviceStatus 设备状态对象
     * @return 添加是否成功
     */
    boolean addDevice(DeviceStatus deviceStatus);

    /**
     * 删除设备
     * @param deviceId 设备ID
     * @return 删除是否成功
     */
    boolean removeDevice(String deviceId);

    // ==================== 设备监控和统计 ====================

    /**
     * 检查设备是否存在
     * @param deviceId 设备ID
     * @return 是否存在
     */
    boolean deviceExists(String deviceId);

    /**
     * 获取设备类型统计
     * @return 设备类型统计信息
     */
    List<Map<String, Object>> getDeviceTypeStatistics();

    /**
     * 获取设备状态统计
     * @return 设备状态统计信息
     */
    List<Map<String, Object>> getDeviceStatusStatistics();

    /**
     * 获取设备功率使用统计
     * @return 设备功率使用统计信息
     */
    List<Map<String, Object>> getPowerUsageStatistics();

    /**
     * 获取需要维护的设备列表
     * @param days 超过多少天未维护
     * @return 需要维护的设备列表
     */
    List<DeviceStatus> getDevicesNeedMaintenance(int days);

    /**
     * 获取设备总数
     * @return 设备总数
     */
    long getTotalDeviceCount();

    /**
     * 获取在线设备数量
     * @return 在线设备数量
     */
    long getOnlineDeviceCount();

    // ==================== 控制日志查询 ====================

    /**
     * 获取设备控制日志
     * @param deviceId 设备ID
     * @return 控制日志列表
     */
    List<ControlLog> getDeviceControlLogs(String deviceId);

    /**
     * 获取最近的控制日志
     * @param limit 限制数量
     * @return 最近的控制日志列表
     */
    List<ControlLog> getRecentControlLogs(int limit);

    /**
     * 获取失败的控制操作
     * @return 失败的控制日志列表
     */
    List<ControlLog> getFailedOperations();

    // ==================== 智能控制功能 ====================

    /**
     * 根据环境参数自动控制湿度设备
     * @param currentHumidity 当前湿度
     * @param targetHumidity 目标湿度
     * @param tolerance 容差范围
     * @return 控制操作结果
     */
    Map<String, Object> autoControlHumidityDevices(BigDecimal currentHumidity, BigDecimal targetHumidity, BigDecimal tolerance);

    /**
     * 根据光照强度自动控制补光设备
     * @param currentLightIntensity 当前光照强度
     * @param targetLightIntensity 目标光照强度
     * @param tolerance 容差范围
     * @return 控制操作结果
     */
    Map<String, Object> autoControlLightDevices(BigDecimal currentLightIntensity, BigDecimal targetLightIntensity, BigDecimal tolerance);

    /**
     * 根据温度和CO2浓度自动控制通风设备
     * @param currentTemperature 当前温度
     * @param currentCo2Level 当前CO2浓度
     * @param maxTemperature 最高温度阈值
     * @param maxCo2Level 最高CO2浓度阈值
     * @return 控制操作结果
     */
    Map<String, Object> autoControlVentilationDevices(BigDecimal currentTemperature, BigDecimal currentCo2Level, 
                                                     BigDecimal maxTemperature, BigDecimal maxCo2Level);
}