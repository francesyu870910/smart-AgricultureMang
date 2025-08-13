package com.greenhouse.service;

import com.greenhouse.entity.EnvironmentData;

import java.util.List;

/**
 * 数据模拟服务接口
 * 提供环境数据模拟功能，用于系统测试和演示
 */
public interface DataSimulationService {

    /**
     * 生成单条模拟环境数据
     * @param greenhouseId 温室ID
     * @return 模拟的环境数据
     */
    EnvironmentData generateSimulatedEnvironmentData(String greenhouseId);

    /**
     * 生成批量模拟环境数据
     * @param greenhouseId 温室ID
     * @param count 生成数量
     * @return 模拟的环境数据列表
     */
    List<EnvironmentData> generateBatchSimulatedData(String greenhouseId, int count);

    /**
     * 启动环境数据模拟
     * @param greenhouseId 温室ID
     * @return 启动结果
     */
    boolean startDataSimulation(String greenhouseId);

    /**
     * 停止环境数据模拟
     * @param greenhouseId 温室ID
     * @return 停止结果
     */
    boolean stopDataSimulation(String greenhouseId);

    /**
     * 检查数据模拟是否正在运行
     * @param greenhouseId 温室ID
     * @return 是否正在运行
     */
    boolean isSimulationRunning(String greenhouseId);

    /**
     * 设置模拟参数范围
     * @param parameter 参数名称
     * @param minValue 最小值
     * @param maxValue 最大值
     */
    void setSimulationRange(String parameter, double minValue, double maxValue);

    /**
     * 重置模拟参数为默认值
     */
    void resetSimulationParameters();
}