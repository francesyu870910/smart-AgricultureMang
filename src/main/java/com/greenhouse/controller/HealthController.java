package com.greenhouse.controller;

import com.greenhouse.common.LogUtils;
import com.greenhouse.common.Result;
import com.greenhouse.common.ResultCode;
import com.greenhouse.common.exception.BusinessException;
import com.greenhouse.common.exception.DeviceException;
import org.slf4j.Logger;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * 健康检查控制器
 * 用于系统状态检查和异常处理测试
 */
@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger logger = LogUtils.getLogger(HealthController.class);

    /**
     * 系统健康检查
     */
    @GetMapping
    public Result<Map<String, Object>> health() {
        LogUtils.logBusinessOperation(logger, "健康检查", "系统状态正常");
        
        Map<String, Object> healthInfo = new HashMap<>();
        healthInfo.put("status", "UP");
        healthInfo.put("timestamp", LocalDateTime.now());
        healthInfo.put("version", "1.0.0");
        healthInfo.put("service", "温室数字化监控系统");
        
        return Result.success("系统运行正常", healthInfo);
    }

    /**
     * 测试业务异常处理
     */
    @GetMapping("/test-business-exception")
    public Result<String> testBusinessException() {
        LogUtils.logBusinessOperation(logger, "测试业务异常", "模拟业务异常场景");
        throw new BusinessException(ResultCode.DEVICE_NOT_FOUND, "这是一个测试业务异常");
    }

    /**
     * 测试设备异常处理
     */
    @GetMapping("/test-device-exception")
    public Result<String> testDeviceException() {
        LogUtils.logBusinessOperation(logger, "测试设备异常", "模拟设备异常场景");
        throw new DeviceException("TEST_DEVICE_001", ResultCode.DEVICE_OFFLINE, "测试设备离线异常");
    }

    /**
     * 测试参数验证异常
     */
    @PostMapping("/test-validation")
    public Result<String> testValidation(@RequestParam String deviceId, 
                                       @RequestParam Integer value) {
        if (deviceId == null || deviceId.trim().isEmpty()) {
            throw new IllegalArgumentException("设备ID不能为空");
        }
        
        if (value < 0 || value > 100) {
            throw new IllegalArgumentException("参数值必须在0-100之间");
        }
        
        LogUtils.logBusinessOperation(logger, "参数验证测试", 
                String.format("设备ID: %s, 值: %d", deviceId, value));
        
        return Result.<String>success("参数验证通过", null);
    }

    /**
     * 测试运行时异常
     */
    @GetMapping("/test-runtime-exception")
    public Result<String> testRuntimeException() {
        LogUtils.logBusinessOperation(logger, "测试运行时异常", "模拟运行时异常场景");
        throw new RuntimeException("这是一个测试运行时异常");
    }

    /**
     * 测试空指针异常
     */
    @GetMapping("/test-null-pointer")
    public Result<String> testNullPointerException() {
        LogUtils.logBusinessOperation(logger, "测试空指针异常", "模拟空指针异常场景");
        String nullString = null;
        return Result.<String>success("成功", nullString.length() + ""); // 这会抛出空指针异常
    }

    /**
     * 获取系统错误码列表
     */
    @GetMapping("/error-codes")
    public Result<Map<String, Object>> getErrorCodes() {
        LogUtils.logBusinessOperation(logger, "获取错误码列表", "返回系统所有错误码");
        
        Map<String, Object> errorCodes = new HashMap<>();
        for (ResultCode code : ResultCode.values()) {
            Map<String, Object> codeInfo = new HashMap<>();
            codeInfo.put("code", code.getCode());
            codeInfo.put("message", code.getMessage());
            errorCodes.put(code.name(), codeInfo);
        }
        
        return Result.success("错误码列表", errorCodes);
    }
}