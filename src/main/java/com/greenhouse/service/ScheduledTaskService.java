package com.greenhouse.service;

/**
 * 定时任务服务接口
 * 提供数据模拟、设备控制和报警检测的定时任务功能
 */
public interface ScheduledTaskService {

    /**
     * 启动所有定时任务
     * @return 启动结果
     */
    boolean startAllScheduledTasks();

    /**
     * 停止所有定时任务
     * @return 停止结果
     */
    boolean stopAllScheduledTasks();

    /**
     * 检查定时任务是否正在运行
     * @return 是否正在运行
     */
    boolean isScheduledTasksRunning();

    /**
     * 手动触发环境数据生成
     * @return 生成结果
     */
    boolean triggerEnvironmentDataGeneration();

    /**
     * 手动触发设备状态更新
     * @return 更新结果
     */
    boolean triggerDeviceStatusUpdate();

    /**
     * 手动触发报警检测
     * @return 检测结果
     */
    boolean triggerAlertDetection();

    /**
     * 手动触发自动化控制
     * @return 控制结果
     */
    boolean triggerAutomaticControl();

    /**
     * 获取任务执行统计信息
     * @return 统计信息
     */
    Object getTaskExecutionStatistics();
}