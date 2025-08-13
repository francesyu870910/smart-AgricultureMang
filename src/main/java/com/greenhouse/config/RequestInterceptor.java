package com.greenhouse.config;

import com.greenhouse.common.LogUtils;
import org.slf4j.Logger;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * 请求拦截器
 * 用于设置追踪ID和记录请求日志
 */
@Component
public class RequestInterceptor implements HandlerInterceptor {

    private static final Logger logger = LogUtils.getLogger(RequestInterceptor.class);
    private static final String TRACE_ID_HEADER = "X-Trace-Id";
    private static final String START_TIME_ATTR = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        // 记录请求开始时间
        request.setAttribute(START_TIME_ATTR, System.currentTimeMillis());
        
        // 生成或获取追踪ID
        String traceId = request.getHeader(TRACE_ID_HEADER);
        if (traceId == null || traceId.trim().isEmpty()) {
            traceId = LogUtils.generateTraceId();
        } else {
            LogUtils.setRequestId(traceId);
        }
        
        // 将追踪ID添加到响应头
        response.setHeader(TRACE_ID_HEADER, traceId);
        
        // 记录请求日志
        LogUtils.logApiCall(logger, request, "请求开始");
        
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, 
                               Object handler, Exception ex) {
        try {
            // 计算请求处理时间
            Long startTime = (Long) request.getAttribute(START_TIME_ATTR);
            long duration = startTime != null ? System.currentTimeMillis() - startTime : 0;
            
            // 记录请求完成日志
            String operation = String.format("%s %s", request.getMethod(), request.getRequestURI());
            boolean success = response.getStatus() < 400 && ex == null;
            LogUtils.logApiResult(logger, operation, success, duration);
            
            // 如果处理时间过长，记录性能警告
            if (duration > 2000) {
                LogUtils.logPerformance(logger, operation, duration, 
                        String.format("响应状态: %d", response.getStatus()));
            }
            
        } finally {
            // 清理MDC
            LogUtils.clearMDC();
        }
    }
}