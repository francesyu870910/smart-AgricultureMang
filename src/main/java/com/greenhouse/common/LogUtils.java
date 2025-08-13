package com.greenhouse.common;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import javax.servlet.http.HttpServletRequest;
import java.util.UUID;

/**
 * 日志工具类
 * 提供统一的日志记录功能和追踪ID管理
 */
public class LogUtils {

    private static final String TRACE_ID_KEY = "traceId";
    private static final String USER_ID_KEY = "userId";
    private static final String REQUEST_ID_KEY = "requestId";

    /**
     * 生成追踪ID
     */
    public static String generateTraceId() {
        String traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        MDC.put(TRACE_ID_KEY, traceId);
        return traceId;
    }

    /**
     * 获取当前追踪ID
     */
    public static String getCurrentTraceId() {
        String traceId = MDC.get(TRACE_ID_KEY);
        if (traceId == null) {
            traceId = generateTraceId();
        }
        return traceId;
    }

    /**
     * 设置用户ID到MDC
     */
    public static void setUserId(String userId) {
        if (userId != null) {
            MDC.put(USER_ID_KEY, userId);
        }
    }

    /**
     * 设置请求ID到MDC
     */
    public static void setRequestId(String requestId) {
        if (requestId != null) {
            MDC.put(REQUEST_ID_KEY, requestId);
        }
    }

    /**
     * 清理MDC
     */
    public static void clearMDC() {
        MDC.clear();
    }

    /**
     * 记录API调用日志
     */
    public static void logApiCall(Logger logger, HttpServletRequest request, String operation) {
        String traceId = getCurrentTraceId();
        String requestInfo = buildRequestInfo(request);
        logger.info("TraceId: {} | API调用 - {} | {}", traceId, operation, requestInfo);
    }

    /**
     * 记录API调用结果日志
     */
    public static void logApiResult(Logger logger, String operation, boolean success, long duration) {
        String traceId = getCurrentTraceId();
        String status = success ? "成功" : "失败";
        logger.info("TraceId: {} | API结果 - {} {} | 耗时: {}ms", traceId, operation, status, duration);
    }

    /**
     * 记录业务操作日志
     */
    public static void logBusinessOperation(Logger logger, String operation, String details) {
        String traceId = getCurrentTraceId();
        logger.info("TraceId: {} | 业务操作 - {} | {}", traceId, operation, details);
    }

    /**
     * 记录设备操作日志
     */
    public static void logDeviceOperation(Logger logger, String deviceId, String operation, String result) {
        String traceId = getCurrentTraceId();
        logger.info("TraceId: {} | 设备操作 - 设备[{}] {} | 结果: {}", traceId, deviceId, operation, result);
    }

    /**
     * 记录数据操作日志
     */
    public static void logDataOperation(Logger logger, String dataType, String operation, int count) {
        String traceId = getCurrentTraceId();
        logger.info("TraceId: {} | 数据操作 - {}[{}] | 数量: {}", traceId, dataType, operation, count);
    }

    /**
     * 记录性能日志
     */
    public static void logPerformance(Logger logger, String operation, long duration, String details) {
        String traceId = getCurrentTraceId();
        if (duration > 1000) { // 超过1秒记录为警告
            logger.warn("TraceId: {} | 性能警告 - {} 耗时: {}ms | {}", traceId, operation, duration, details);
        } else {
            logger.debug("TraceId: {} | 性能监控 - {} 耗时: {}ms | {}", traceId, operation, duration, details);
        }
    }

    /**
     * 记录安全相关日志
     */
    public static void logSecurity(Logger logger, String event, String details, HttpServletRequest request) {
        String traceId = getCurrentTraceId();
        String requestInfo = buildRequestInfo(request);
        logger.warn("TraceId: {} | 安全事件 - {} | {} | {}", traceId, event, details, requestInfo);
    }

    /**
     * 构建请求信息字符串
     */
    private static String buildRequestInfo(HttpServletRequest request) {
        if (request == null) {
            return "请求信息不可用";
        }
        
        return String.format("Method: %s, URI: %s, RemoteAddr: %s, UserAgent: %s", 
                request.getMethod(), 
                request.getRequestURI(), 
                getClientIpAddress(request),
                request.getHeader("User-Agent"));
    }

    /**
     * 获取客户端真实IP地址
     */
    private static String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty() && !"unknown".equalsIgnoreCase(xForwardedFor)) {
            return xForwardedFor.split(",")[0].trim();
        }
        
        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty() && !"unknown".equalsIgnoreCase(xRealIp)) {
            return xRealIp;
        }
        
        return request.getRemoteAddr();
    }

    /**
     * 创建带有类名的Logger
     */
    public static Logger getLogger(Class<?> clazz) {
        return LoggerFactory.getLogger(clazz);
    }

    /**
     * 创建带有名称的Logger
     */
    public static Logger getLogger(String name) {
        return LoggerFactory.getLogger(name);
    }
}