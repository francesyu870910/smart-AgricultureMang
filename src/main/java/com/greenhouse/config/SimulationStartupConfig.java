package com.greenhouse.config;

import com.greenhouse.service.DeviceSimulationService;
import com.greenhouse.service.ScheduledTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * 模拟系统启动配置
 * 在应用启动时初始化模拟设备和启动定时任务
 */
@Component
public class SimulationStartupConfig implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(SimulationStartupConfig.class);

    @Autowired
    private DeviceSimulationService deviceSimulationService;

    @Autowired
    private ScheduledTaskService scheduledTaskService;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        logger.info("Starting simulation system initialization...");
        
        try {
            // 初始化模拟设备
            initializeSimulatedDevices();
            
            // 启动定时任务
            startScheduledTasks();
            
            logger.info("Simulation system initialization completed successfully");
            
        } catch (Exception e) {
            logger.error("Failed to initialize simulation system: {}", e.getMessage(), e);
            // 不抛出异常，允许应用继续启动
        }
    }

    /**
     * 初始化模拟设备
     */
    private void initializeSimulatedDevices() {
        try {
            logger.info("Initializing simulated devices...");
            
            boolean result = deviceSimulationService.initializeSimulatedDevices();
            
            if (result) {
                logger.info("Successfully initialized simulated devices");
            } else {
                logger.warn("Failed to initialize some simulated devices");
            }
            
        } catch (Exception e) {
            logger.error("Error initializing simulated devices: {}", e.getMessage(), e);
        }
    }

    /**
     * 启动定时任务
     */
    private void startScheduledTasks() {
        try {
            logger.info("Starting scheduled tasks...");
            
            boolean result = scheduledTaskService.startAllScheduledTasks();
            
            if (result) {
                logger.info("Successfully started scheduled tasks");
            } else {
                logger.warn("Failed to start scheduled tasks");
            }
            
        } catch (Exception e) {
            logger.error("Error starting scheduled tasks: {}", e.getMessage(), e);
        }
    }
}