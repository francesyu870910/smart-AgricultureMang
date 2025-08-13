package com.greenhouse.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.greenhouse.common.Result;
import com.greenhouse.dto.AlertDTO;
import com.greenhouse.entity.AlertRecord;
import com.greenhouse.service.AlertService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 报警管理控制器
 * 提供报警列表查询、报警处理、报警统计等API接口
 * 
 * 支持的需求：
 * - 需求5（报警通知）：报警触发、处理、统计功能
 */
@RestController
@RequestMapping("/api/alerts")
@CrossOrigin(origins = "*")
public class AlertController {

    private static final Logger logger = LoggerFactory.getLogger(AlertController.class);

    @Autowired
    private AlertService alertService;

    // ==================== 报警列表查询接口 ====================

    /**
     * 获取所有未解决的报警列表
     * GET /api/alerts/unresolved
     */
    @GetMapping("/unresolved")
    public Result<List<AlertDTO>> getUnresolvedAlerts() {
        try {
            logger.info("获取未解决的报警列表");
            List<AlertDTO> alerts = alertService.getUnresolvedAlerts();
            logger.info("成功获取未解决的报警列表，共{}条报警", alerts.size());
            return Result.success("获取未解决报警列表成功", alerts);
        } catch (Exception e) {
            logger.error("获取未解决报警列表失败", e);
            return Result.error("获取未解决报警列表失败：" + e.getMessage());
        }
    }

    /**
     * 获取高优先级未解决报警
     * GET /api/alerts/high-priority
     */
    @GetMapping("/high-priority")
    public Result<List<AlertDTO>> getHighPriorityUnresolvedAlerts() {
        try {
            logger.info("获取高优先级未解决报警");
            List<AlertDTO> alerts = alertService.getHighPriorityUnresolvedAlerts();
            logger.info("成功获取高优先级未解决报警，共{}条报警", alerts.size());
            return Result.success("获取高优先级报警成功", alerts);
        } catch (Exception e) {
            logger.error("获取高优先级报警失败", e);
            return Result.error("获取高优先级报警失败：" + e.getMessage());
        }
    }

    /**
     * 获取最近的报警记录
     * GET /api/alerts/recent?limit=50
     */
    @GetMapping("/recent")
    public Result<List<AlertDTO>> getRecentAlerts(@RequestParam(defaultValue = "50") int limit) {
        try {
            logger.info("获取最近的报警记录，限制数量：{}", limit);
            
            // 参数验证
            if (limit < 1 || limit > 1000) {
                return Result.error(400, "限制数量必须在1-1000之间");
            }
            
            List<AlertDTO> alerts = alertService.getRecentAlerts(limit);
            logger.info("成功获取最近的报警记录，数量：{}", alerts.size());
            return Result.success("获取最近报警记录成功", alerts);
        } catch (Exception e) {
            logger.error("获取最近报警记录失败", e);
            return Result.error("获取最近报警记录失败：" + e.getMessage());
        }
    }

    /**
     * 分页查询报警记录
     * GET /api/alerts/page?current=1&size=10&alertType=temperature&severity=high&isResolved=false
     */
    @GetMapping("/page")
    public Result<IPage<AlertDTO>> getAlertsPage(
            @RequestParam(defaultValue = "1") int current,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String alertType,
            @RequestParam(required = false) String severity,
            @RequestParam(required = false) Boolean isResolved,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("分页查询报警记录，页码：{}，大小：{}，类型：{}，严重程度：{}，是否已解决：{}，开始时间：{}，结束时间：{}", 
                    current, size, alertType, severity, isResolved, startTime, endTime);
            
            // 参数验证
            if (current < 1) current = 1;
            if (size < 1 || size > 100) size = 10;
            
            AlertRecord.AlertType alertTypeEnum = null;
            if (alertType != null && !alertType.trim().isEmpty()) {
                try {
                    alertTypeEnum = AlertRecord.AlertType.valueOf(alertType.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return Result.error(400, "无效的报警类型：" + alertType);
                }
            }
            
            AlertRecord.Severity severityEnum = null;
            if (severity != null && !severity.trim().isEmpty()) {
                try {
                    severityEnum = AlertRecord.Severity.valueOf(severity.toUpperCase());
                } catch (IllegalArgumentException e) {
                    return Result.error(400, "无效的严重程度：" + severity);
                }
            }
            
            IPage<AlertDTO> result = alertService.getAlertPage(current, size, alertTypeEnum, severityEnum, isResolved, startTime, endTime);
            logger.info("成功分页查询报警记录，总数：{}，当前页：{}", result.getTotal(), result.getCurrent());
            return Result.success("分页查询报警记录成功", result);
        } catch (Exception e) {
            logger.error("分页查询报警记录失败", e);
            return Result.error("分页查询报警记录失败：" + e.getMessage());
        }
    }

    /**
     * 根据报警类型查询报警记录
     * GET /api/alerts/type/{alertType}
     */
    @GetMapping("/type/{alertType}")
    public Result<List<AlertDTO>> getAlertsByType(@PathVariable String alertType) {
        try {
            logger.info("根据报警类型查询报警记录，类型：{}", alertType);
            
            // 参数验证
            AlertRecord.AlertType typeEnum;
            try {
                typeEnum = AlertRecord.AlertType.valueOf(alertType.toUpperCase());
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的报警类型：" + alertType);
            }
            
            List<AlertDTO> alerts = alertService.getAlertsByType(typeEnum);
            logger.info("成功获取{}类型报警记录，共{}条", alertType, alerts.size());
            return Result.success("获取报警记录成功", alerts);
        } catch (Exception e) {
            logger.error("根据报警类型查询报警记录失败，类型：{}", alertType, e);
            return Result.error("查询报警记录失败：" + e.getMessage());
        }
    }

    /**
     * 根据严重程度查询报警记录
     * GET /api/alerts/severity/{severity}
     */
    @GetMapping("/severity/{severity}")
    public Result<List<AlertDTO>> getAlertsBySeverity(@PathVariable String severity) {
        try {
            logger.info("根据严重程度查询报警记录，严重程度：{}", severity);
            
            // 参数验证
            AlertRecord.Severity severityEnum;
            try {
                severityEnum = AlertRecord.Severity.valueOf(severity.toUpperCase());
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的严重程度：" + severity);
            }
            
            List<AlertDTO> alerts = alertService.getAlertsBySeverity(severityEnum);
            logger.info("成功获取{}严重程度报警记录，共{}条", severity, alerts.size());
            return Result.success("获取报警记录成功", alerts);
        } catch (Exception e) {
            logger.error("根据严重程度查询报警记录失败，严重程度：{}", severity, e);
            return Result.error("查询报警记录失败：" + e.getMessage());
        }
    }

    /**
     * 根据设备ID查询报警记录
     * GET /api/alerts/device/{deviceId}
     */
    @GetMapping("/device/{deviceId}")
    public Result<List<AlertDTO>> getAlertsByDeviceId(@PathVariable String deviceId) {
        try {
            logger.info("根据设备ID查询报警记录，设备ID：{}", deviceId);
            
            // 参数验证
            if (deviceId == null || deviceId.trim().isEmpty()) {
                return Result.error(400, "设备ID不能为空");
            }
            
            List<AlertDTO> alerts = alertService.getAlertsByDeviceId(deviceId);
            logger.info("成功获取设备{}的报警记录，共{}条", deviceId, alerts.size());
            return Result.success("获取设备报警记录成功", alerts);
        } catch (Exception e) {
            logger.error("根据设备ID查询报警记录失败，设备ID：{}", deviceId, e);
            return Result.error("查询设备报警记录失败：" + e.getMessage());
        }
    }

    /**
     * 根据时间范围查询报警记录
     * GET /api/alerts/time-range?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/time-range")
    public Result<List<AlertDTO>> getAlertsByTimeRange(
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("根据时间范围查询报警记录，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 参数验证
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<AlertDTO> alerts = alertService.getAlertsByTimeRange(startTime, endTime);
            logger.info("成功获取时间范围内的报警记录，共{}条", alerts.size());
            return Result.success("获取时间范围报警记录成功", alerts);
        } catch (Exception e) {
            logger.error("根据时间范围查询报警记录失败", e);
            return Result.error("查询时间范围报警记录失败：" + e.getMessage());
        }
    }

    // ==================== 报警处理接口 ====================

    /**
     * 处理单个报警（标记为已解决）
     * POST /api/alerts/{alertId}/resolve
     */
    @PostMapping("/{alertId}/resolve")
    public Result<AlertDTO> resolveAlert(@PathVariable Integer alertId) {
        try {
            logger.info("处理报警，报警ID：{}", alertId);
            
            // 参数验证
            if (alertId == null || alertId <= 0) {
                return Result.error(400, "无效的报警ID");
            }
            
            boolean success = alertService.resolveAlert(alertId);
            if (success) {
                // 获取更新后的报警信息
                List<AlertDTO> alerts = alertService.getRecentAlerts(1000);
                AlertDTO resolvedAlert = alerts.stream()
                        .filter(alert -> alert.getId().equals(alertId))
                        .findFirst()
                        .orElse(null);
                
                logger.info("报警处理成功，报警ID：{}", alertId);
                return Result.success("报警处理成功", resolvedAlert);
            } else {
                logger.warn("报警处理失败，报警ID：{}", alertId);
                return Result.error("报警处理失败，可能报警不存在或已被处理");
            }
        } catch (Exception e) {
            logger.error("处理报警失败，报警ID：{}", alertId, e);
            return Result.error("处理报警失败：" + e.getMessage());
        }
    }

    /**
     * 批量处理报警
     * POST /api/alerts/batch-resolve
     */
    @PostMapping("/batch-resolve")
    public Result<Map<String, Object>> batchResolveAlerts(@RequestBody List<Integer> alertIds) {
        try {
            logger.info("批量处理报警，报警数量：{}", alertIds.size());
            
            // 参数验证
            if (alertIds == null || alertIds.isEmpty()) {
                return Result.error(400, "报警ID列表不能为空");
            }
            
            // 验证所有ID的有效性
            for (Integer alertId : alertIds) {
                if (alertId == null || alertId <= 0) {
                    return Result.error(400, "包含无效的报警ID：" + alertId);
                }
            }
            
            boolean success = alertService.batchResolveAlerts(alertIds);
            
            Map<String, Object> result = Map.of(
                    "totalCount", alertIds.size(),
                    "success", success,
                    "message", success ? "批量处理报警成功" : "批量处理报警失败"
            );
            
            if (success) {
                logger.info("批量处理报警成功，处理数量：{}", alertIds.size());
                return Result.success("批量处理报警成功", result);
            } else {
                logger.warn("批量处理报警失败");
                return Result.error("批量处理报警失败");
            }
        } catch (Exception e) {
            logger.error("批量处理报警失败", e);
            return Result.error("批量处理报警失败：" + e.getMessage());
        }
    }

    /**
     * 升级报警级别
     * POST /api/alerts/{alertId}/escalate
     */
    @PostMapping("/{alertId}/escalate")
    public Result<AlertDTO> escalateAlert(@PathVariable Integer alertId) {
        try {
            logger.info("升级报警级别，报警ID：{}", alertId);
            
            // 参数验证
            if (alertId == null || alertId <= 0) {
                return Result.error(400, "无效的报警ID");
            }
            
            // 检查是否需要升级
            if (!alertService.shouldEscalateAlert(alertId)) {
                return Result.error(400, "该报警不需要升级或已达到最高级别");
            }
            
            boolean success = alertService.escalateAlert(alertId);
            if (success) {
                // 获取更新后的报警信息
                List<AlertDTO> alerts = alertService.getRecentAlerts(1000);
                AlertDTO escalatedAlert = alerts.stream()
                        .filter(alert -> alert.getId().equals(alertId))
                        .findFirst()
                        .orElse(null);
                
                logger.info("报警级别升级成功，报警ID：{}", alertId);
                return Result.success("报警级别升级成功", escalatedAlert);
            } else {
                logger.warn("报警级别升级失败，报警ID：{}", alertId);
                return Result.error("报警级别升级失败");
            }
        } catch (Exception e) {
            logger.error("升级报警级别失败，报警ID：{}", alertId, e);
            return Result.error("升级报警级别失败：" + e.getMessage());
        }
    }

    // ==================== 报警统计接口 ====================

    /**
     * 获取报警统计信息
     * GET /api/alerts/statistics?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getAlertStatistics(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取报警统计信息，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 如果没有指定时间范围，默认查询最近30天
            if (startTime == null) {
                startTime = LocalDateTime.now().minusDays(30);
            }
            if (endTime == null) {
                endTime = LocalDateTime.now();
            }
            
            // 参数验证
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            Map<String, Object> statistics = alertService.getAlertStatistics(startTime, endTime);
            logger.info("成功获取报警统计信息");
            return Result.success("获取报警统计信息成功", statistics);
        } catch (Exception e) {
            logger.error("获取报警统计信息失败", e);
            return Result.error("获取报警统计信息失败：" + e.getMessage());
        }
    }

    /**
     * 获取报警类型统计
     * GET /api/alerts/statistics/type?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics/type")
    public Result<List<Map<String, Object>>> getAlertTypeStatistics(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取报警类型统计，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 如果没有指定时间范围，默认查询最近30天
            if (startTime == null) {
                startTime = LocalDateTime.now().minusDays(30);
            }
            if (endTime == null) {
                endTime = LocalDateTime.now();
            }
            
            // 参数验证
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> statistics = alertService.getAlertTypeStatistics(startTime, endTime);
            logger.info("成功获取报警类型统计");
            return Result.success("获取报警类型统计成功", statistics);
        } catch (Exception e) {
            logger.error("获取报警类型统计失败", e);
            return Result.error("获取报警类型统计失败：" + e.getMessage());
        }
    }

    /**
     * 获取报警严重程度统计
     * GET /api/alerts/statistics/severity?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics/severity")
    public Result<List<Map<String, Object>>> getSeverityStatistics(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取报警严重程度统计，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 如果没有指定时间范围，默认查询最近30天
            if (startTime == null) {
                startTime = LocalDateTime.now().minusDays(30);
            }
            if (endTime == null) {
                endTime = LocalDateTime.now();
            }
            
            // 参数验证
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> statistics = alertService.getSeverityStatistics(startTime, endTime);
            logger.info("成功获取报警严重程度统计");
            return Result.success("获取报警严重程度统计成功", statistics);
        } catch (Exception e) {
            logger.error("获取报警严重程度统计失败", e);
            return Result.error("获取报警严重程度统计失败：" + e.getMessage());
        }
    }

    /**
     * 获取每日报警统计
     * GET /api/alerts/statistics/daily?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics/daily")
    public Result<List<Map<String, Object>>> getDailyAlertStatistics(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取每日报警统计，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 如果没有指定时间范围，默认查询最近30天
            if (startTime == null) {
                startTime = LocalDateTime.now().minusDays(30);
            }
            if (endTime == null) {
                endTime = LocalDateTime.now();
            }
            
            // 参数验证
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> statistics = alertService.getDailyAlertStatistics(startTime, endTime);
            logger.info("成功获取每日报警统计");
            return Result.success("获取每日报警统计成功", statistics);
        } catch (Exception e) {
            logger.error("获取每日报警统计失败", e);
            return Result.error("获取每日报警统计失败：" + e.getMessage());
        }
    }

    /**
     * 获取设备报警统计
     * GET /api/alerts/statistics/device?startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics/device")
    public Result<List<Map<String, Object>>> getDeviceAlertStatistics(
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam(required = false) @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取设备报警统计，开始时间：{}，结束时间：{}", startTime, endTime);
            
            // 如果没有指定时间范围，默认查询最近30天
            if (startTime == null) {
                startTime = LocalDateTime.now().minusDays(30);
            }
            if (endTime == null) {
                endTime = LocalDateTime.now();
            }
            
            // 参数验证
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> statistics = alertService.getDeviceAlertStatistics(startTime, endTime);
            logger.info("成功获取设备报警统计");
            return Result.success("获取设备报警统计成功", statistics);
        } catch (Exception e) {
            logger.error("获取设备报警统计失败", e);
            return Result.error("获取设备报警统计失败：" + e.getMessage());
        }
    }

    // ==================== 报警状态和计数接口 ====================

    /**
     * 获取未解决报警数量
     * GET /api/alerts/count/unresolved
     */
    @GetMapping("/count/unresolved")
    public Result<Long> getUnresolvedAlertCount() {
        try {
            logger.info("获取未解决报警数量");
            long count = alertService.getUnresolvedAlertCount();
            logger.info("成功获取未解决报警数量：{}", count);
            return Result.success("获取未解决报警数量成功", count);
        } catch (Exception e) {
            logger.error("获取未解决报警数量失败", e);
            return Result.error("获取未解决报警数量失败：" + e.getMessage());
        }
    }

    /**
     * 获取指定严重程度的未解决报警数量
     * GET /api/alerts/count/unresolved/{severity}
     */
    @GetMapping("/count/unresolved/{severity}")
    public Result<Long> getUnresolvedAlertCountBySeverity(@PathVariable String severity) {
        try {
            logger.info("获取{}严重程度的未解决报警数量", severity);
            
            // 参数验证
            AlertRecord.Severity severityEnum;
            try {
                severityEnum = AlertRecord.Severity.valueOf(severity.toUpperCase());
            } catch (IllegalArgumentException e) {
                return Result.error(400, "无效的严重程度：" + severity);
            }
            
            long count = alertService.getUnresolvedAlertCountBySeverity(severityEnum);
            logger.info("成功获取{}严重程度的未解决报警数量：{}", severity, count);
            return Result.success("获取未解决报警数量成功", count);
        } catch (Exception e) {
            logger.error("获取{}严重程度的未解决报警数量失败", severity, e);
            return Result.error("获取未解决报警数量失败：" + e.getMessage());
        }
    }

    /**
     * 获取今日报警数量
     * GET /api/alerts/count/today
     */
    @GetMapping("/count/today")
    public Result<Long> getTodayAlertCount() {
        try {
            logger.info("获取今日报警数量");
            long count = alertService.getTodayAlertCount();
            logger.info("成功获取今日报警数量：{}", count);
            return Result.success("获取今日报警数量成功", count);
        } catch (Exception e) {
            logger.error("获取今日报警数量失败", e);
            return Result.error("获取今日报警数量失败：" + e.getMessage());
        }
    }

    // ==================== 报警管理接口 ====================

    /**
     * 清理历史报警记录
     * DELETE /api/alerts/cleanup?beforeDays=90
     */
    @DeleteMapping("/cleanup")
    public Result<Integer> cleanResolvedAlerts(@RequestParam(defaultValue = "90") int beforeDays) {
        try {
            logger.info("清理{}天前的已解决报警记录", beforeDays);
            
            // 参数验证
            if (beforeDays < 1) {
                return Result.error(400, "天数必须大于0");
            }
            
            LocalDateTime beforeTime = LocalDateTime.now().minusDays(beforeDays);
            int cleanedCount = alertService.cleanResolvedAlerts(beforeTime);
            
            logger.info("成功清理历史报警记录，清理数量：{}", cleanedCount);
            return Result.success("清理历史报警记录成功", cleanedCount);
        } catch (Exception e) {
            logger.error("清理历史报警记录失败", e);
            return Result.error("清理历史报警记录失败：" + e.getMessage());
        }
    }

    // ==================== 报警级别过滤接口 ====================

    /**
     * 获取所有可用的报警类型
     * GET /api/alerts/types
     */
    @GetMapping("/types")
    public Result<List<Map<String, String>>> getAlertTypes() {
        try {
            logger.info("获取所有可用的报警类型");
            
            List<Map<String, String>> types = List.of(
                    Map.of("code", "TEMPERATURE", "description", "温度报警"),
                    Map.of("code", "HUMIDITY", "description", "湿度报警"),
                    Map.of("code", "LIGHT", "description", "光照报警"),
                    Map.of("code", "DEVICE_ERROR", "description", "设备故障"),
                    Map.of("code", "SYSTEM_ERROR", "description", "系统错误")
            );
            
            logger.info("成功获取报警类型列表");
            return Result.success("获取报警类型成功", types);
        } catch (Exception e) {
            logger.error("获取报警类型失败", e);
            return Result.error("获取报警类型失败：" + e.getMessage());
        }
    }

    /**
     * 获取所有可用的严重程度
     * GET /api/alerts/severities
     */
    @GetMapping("/severities")
    public Result<List<Map<String, String>>> getSeverities() {
        try {
            logger.info("获取所有可用的严重程度");
            
            List<Map<String, String>> severities = List.of(
                    Map.of("code", "LOW", "description", "低"),
                    Map.of("code", "MEDIUM", "description", "中"),
                    Map.of("code", "HIGH", "description", "高"),
                    Map.of("code", "CRITICAL", "description", "紧急")
            );
            
            logger.info("成功获取严重程度列表");
            return Result.success("获取严重程度成功", severities);
        } catch (Exception e) {
            logger.error("获取严重程度失败", e);
            return Result.error("获取严重程度失败：" + e.getMessage());
        }
    }
}