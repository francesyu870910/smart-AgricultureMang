package com.greenhouse.controller;

import com.greenhouse.common.Result;
import com.greenhouse.service.ScheduledTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 定时任务控制器
 * 提供定时任务管理和手动触发功能的REST API
 */
@RestController
@RequestMapping("/api/scheduled-tasks")
@CrossOrigin(origins = "*")
public class ScheduledTaskController {

    private static final Logger logger = LoggerFactory.getLogger(ScheduledTaskController.class);

    @Autowired
    private ScheduledTaskService scheduledTaskService;

    /**
     * 启动所有定时任务
     */
    @PostMapping("/start")
    public Result<Boolean> startScheduledTasks() {
        try {
            logger.info("Request to start all scheduled tasks");
            
            boolean result = scheduledTaskService.startAllScheduledTasks();
            
            if (result) {
                logger.info("Successfully started all scheduled tasks");
                return Result.success("定时任务已启动", true);
            } else {
                logger.warn("Failed to start scheduled tasks");
                return Result.error("启动定时任务失败");
            }
            
        } catch (Exception e) {
            logger.error("Error starting scheduled tasks: {}", e.getMessage(), e);
            return Result.error("启动定时任务时发生错误：" + e.getMessage());
        }
    }

    /**
     * 停止所有定时任务
     */
    @PostMapping("/stop")
    public Result<Boolean> stopScheduledTasks() {
        try {
            logger.info("Request to stop all scheduled tasks");
            
            boolean result = scheduledTaskService.stopAllScheduledTasks();
            
            if (result) {
                logger.info("Successfully stopped all scheduled tasks");
                return Result.success("定时任务已停止", true);
            } else {
                logger.warn("Failed to stop scheduled tasks");
                return Result.error("停止定时任务失败");
            }
            
        } catch (Exception e) {
            logger.error("Error stopping scheduled tasks: {}", e.getMessage(), e);
            return Result.error("停止定时任务时发生错误：" + e.getMessage());
        }
    }

    /**
     * 获取定时任务运行状态
     */
    @GetMapping("/status")
    public Result<Boolean> getScheduledTasksStatus() {
        try {
            boolean isRunning = scheduledTaskService.isScheduledTasksRunning();
            
            logger.debug("Scheduled tasks status: {}", isRunning ? "running" : "stopped");
            
            return Result.success(isRunning ? "定时任务正在运行" : "定时任务已停止", isRunning);
            
        } catch (Exception e) {
            logger.error("Error getting scheduled tasks status: {}", e.getMessage(), e);
            return Result.error("获取定时任务状态时发生错误：" + e.getMessage());
        }
    }

    /**
     * 获取任务执行统计信息
     */
    @GetMapping("/statistics")
    public Result<Object> getTaskStatistics() {
        try {
            Object statistics = scheduledTaskService.getTaskExecutionStatistics();
            
            logger.debug("Retrieved task execution statistics");
            
            return Result.success("获取任务统计信息成功", statistics);
            
        } catch (Exception e) {
            logger.error("Error getting task statistics: {}", e.getMessage(), e);
            return Result.error("获取任务统计信息时发生错误：" + e.getMessage());
        }
    }

    /**
     * 手动触发环境数据生成
     */
    @PostMapping("/trigger/environment-data")
    public Result<Boolean> triggerEnvironmentDataGeneration() {
        try {
            logger.info("Manual trigger request for environment data generation");
            
            boolean result = scheduledTaskService.triggerEnvironmentDataGeneration();
            
            if (result) {
                logger.info("Successfully triggered environment data generation");
                return Result.success("环境数据生成任务已执行", true);
            } else {
                logger.warn("Failed to trigger environment data generation");
                return Result.error("触发环境数据生成失败");
            }
            
        } catch (Exception e) {
            logger.error("Error triggering environment data generation: {}", e.getMessage(), e);
            return Result.error("触发环境数据生成时发生错误：" + e.getMessage());
        }
    }

    /**
     * 手动触发设备状态更新
     */
    @PostMapping("/trigger/device-update")
    public Result<Boolean> triggerDeviceStatusUpdate() {
        try {
            logger.info("Manual trigger request for device status update");
            
            boolean result = scheduledTaskService.triggerDeviceStatusUpdate();
            
            if (result) {
                logger.info("Successfully triggered device status update");
                return Result.success("设备状态更新任务已执行", true);
            } else {
                logger.warn("Failed to trigger device status update");
                return Result.error("触发设备状态更新失败");
            }
            
        } catch (Exception e) {
            logger.error("Error triggering device status update: {}", e.getMessage(), e);
            return Result.error("触发设备状态更新时发生错误：" + e.getMessage());
        }
    }

    /**
     * 手动触发报警检测
     */
    @PostMapping("/trigger/alert-detection")
    public Result<Boolean> triggerAlertDetection() {
        try {
            logger.info("Manual trigger request for alert detection");
            
            boolean result = scheduledTaskService.triggerAlertDetection();
            
            if (result) {
                logger.info("Successfully triggered alert detection");
                return Result.success("报警检测任务已执行", true);
            } else {
                logger.warn("Failed to trigger alert detection");
                return Result.error("触发报警检测失败");
            }
            
        } catch (Exception e) {
            logger.error("Error triggering alert detection: {}", e.getMessage(), e);
            return Result.error("触发报警检测时发生错误：" + e.getMessage());
        }
    }

    /**
     * 手动触发自动化控制
     */
    @PostMapping("/trigger/automatic-control")
    public Result<Boolean> triggerAutomaticControl() {
        try {
            logger.info("Manual trigger request for automatic control");
            
            boolean result = scheduledTaskService.triggerAutomaticControl();
            
            if (result) {
                logger.info("Successfully triggered automatic control");
                return Result.success("自动化控制任务已执行", true);
            } else {
                logger.warn("Failed to trigger automatic control");
                return Result.error("触发自动化控制失败");
            }
            
        } catch (Exception e) {
            logger.error("Error triggering automatic control: {}", e.getMessage(), e);
            return Result.error("触发自动化控制时发生错误：" + e.getMessage());
        }
    }

    /**
     * 触发所有任务（用于测试）
     */
    @PostMapping("/trigger/all")
    public Result<Object> triggerAllTasks() {
        try {
            logger.info("Manual trigger request for all tasks");
            
            boolean envResult = scheduledTaskService.triggerEnvironmentDataGeneration();
            boolean deviceResult = scheduledTaskService.triggerDeviceStatusUpdate();
            boolean alertResult = scheduledTaskService.triggerAlertDetection();
            boolean controlResult = scheduledTaskService.triggerAutomaticControl();
            
            Object results = new Object() {
                public final boolean environmentDataGeneration = envResult;
                public final boolean deviceStatusUpdate = deviceResult;
                public final boolean alertDetection = alertResult;
                public final boolean automaticControl = controlResult;
                public final boolean allSuccessful = envResult && deviceResult && alertResult && controlResult;
            };
            
            logger.info("Triggered all tasks - env:{}, device:{}, alert:{}, control:{}", 
                    envResult, deviceResult, alertResult, controlResult);
            
            return Result.success("所有任务触发完成", results);
            
        } catch (Exception e) {
            logger.error("Error triggering all tasks: {}", e.getMessage(), e);
            return Result.error("触发所有任务时发生错误：" + e.getMessage());
        }
    }
}