package com.greenhouse.service;

import com.greenhouse.entity.DeviceStatus;
import com.greenhouse.entity.EnvironmentData;

import java.util.List;
import java.util.Map;

/**
 * 设备模拟服务接口
 * 提供设备状态模拟和自动化控制逻辑
 */
public interface DeviceSimulationService {

    /**
     * 初始化模拟设备
     * @return 初始化结果
     */
    boolean initializeSimulatedDevices();

    /**
     * 模拟设备状态更新
     * @param deviceId 设备ID
     * @return 更新结果
     */
    boolean simulateDeviceStatusUpdate(String deviceId);

    /**
     * 批量模拟设备状态更新
     * @return 更新的设备数量
     */
    int simulateAllDevicesStatusUpdate();

    /**
     * 根据环境数据自动控制设备
     * @param environmentData 环境数据
     * @return 控制操作结果
     */
    Map<String, Object> autoControlDevicesBasedOnEnvironment(EnvironmentData environmentData);

    /**
     * 模拟设备故障
     * @param deviceId 设备ID
     * @return 模拟结果
     */
    boolean simulateDeviceFailure(String deviceId);

    /**
     * 恢复设备正常状态
     * @param deviceId 设备ID
     * @return 恢复结果
     */
    boolean recoverDeviceFromFailure(String deviceId);

    /**
     * 获取所有模拟设备列表
     * @return 模拟设备列表
     */
    List<DeviceStatus> getAllSimulatedDevices();

    /**
     * 启动设备自动化控制
     * @return 启动结果
     */
    boolean startAutomaticControl();

    /**
     * 停止设备自动化控制
     * @return 停止结果
     */
    boolean stopAutomaticControl();

    /**
     * 检查自动化控制是否正在运行
     * @return 是否正在运行
     */
    boolean isAutomaticControlRunning();

    /**
     * 设置设备控制阈值
     * @param parameter 参数名称
     * @param minThreshold 最小阈值
     * @param maxThreshold 最大阈值
     */
    void setControlThreshold(String parameter, double minThreshold, double maxThreshold);

    /**
     * 重置所有控制阈值为默认值
     */
    void resetControlThresholds();
}