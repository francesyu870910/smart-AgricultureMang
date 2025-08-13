package com.greenhouse.common;

import com.greenhouse.common.exception.BusinessException;
import com.greenhouse.common.exception.DataException;
import com.greenhouse.common.exception.DeviceException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.NoHandlerFoundException;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * 全局异常处理器
 * 统一处理系统中的异常并返回标准格式的错误响应
 * 包含完整的日志记录和错误追踪功能
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private static final String TRACE_ID_KEY = "traceId";

    /**
     * 生成追踪ID
     */
    private String generateTraceId() {
        String traceId = MDC.get(TRACE_ID_KEY);
        if (traceId == null) {
            traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
            MDC.put(TRACE_ID_KEY, traceId);
        }
        return traceId;
    }

    /**
     * 记录异常信息
     */
    private void logException(String level, String message, Exception ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String requestInfo = String.format("请求信息 - Method: %s, URI: %s, RemoteAddr: %s", 
                request.getMethod(), request.getRequestURI(), request.getRemoteAddr());
        
        switch (level.toLowerCase()) {
            case "error":
                logger.error("TraceId: {} | {} | {}", traceId, message, requestInfo, ex);
                break;
            case "warn":
                logger.warn("TraceId: {} | {} | {}", traceId, message, requestInfo);
                break;
            default:
                logger.info("TraceId: {} | {} | {}", traceId, message, requestInfo);
        }
    }

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<Result<String>> handleBusinessException(BusinessException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("warn", "业务异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.<String>error(ex.getCode(), ex.getMessage()).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理设备异常
     */
    @ExceptionHandler(DeviceException.class)
    public ResponseEntity<Result<String>> handleDeviceException(DeviceException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("warn", "设备异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.<String>error(ex.getCode(), ex.getMessage()).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理数据异常
     */
    @ExceptionHandler(DataException.class)
    public ResponseEntity<Result<String>> handleDataException(DataException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("warn", "数据异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.<String>error(ex.getCode(), ex.getMessage()).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    /**
     * 处理参数验证异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Result<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logException("warn", "参数验证失败: " + errors, ex, request);
        Result<Map<String, String>> result = Result.error(ResultCode.VALIDATION_ERROR.getCode(), 
                "参数验证失败", errors).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理绑定异常
     */
    @ExceptionHandler(BindException.class)
    public ResponseEntity<Result<Map<String, String>>> handleBindException(BindException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        
        logException("warn", "数据绑定失败: " + errors, ex, request);
        Result<Map<String, String>> result = Result.error(ResultCode.BAD_REQUEST.getCode(), 
                "数据绑定失败", errors).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Result<Map<String, String>>> handleConstraintViolationException(
            ConstraintViolationException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        Map<String, String> errors = new HashMap<>();
        Set<ConstraintViolation<?>> violations = ex.getConstraintViolations();
        for (ConstraintViolation<?> violation : violations) {
            String fieldName = violation.getPropertyPath().toString();
            String errorMessage = violation.getMessage();
            errors.put(fieldName, errorMessage);
        }
        
        logException("warn", "约束验证失败: " + errors, ex, request);
        Result<Map<String, String>> result = Result.error(ResultCode.VALIDATION_ERROR.getCode(), 
                "约束验证失败", errors).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理参数类型不匹配异常
     */
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<Result<String>> handleTypeMismatchException(
            MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String message = String.format("参数 '%s' 的值 '%s' 类型不正确，期望类型为 %s", 
                ex.getName(), ex.getValue(), ex.getRequiredType().getSimpleName());
        
        logException("warn", "参数类型不匹配: " + message, ex, request);
        Result<String> result = Result.error(ResultCode.BAD_REQUEST, message).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理缺少请求参数异常
     */
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<Result<String>> handleMissingParameterException(
            MissingServletRequestParameterException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String message = String.format("缺少必需的请求参数: %s", ex.getParameterName());
        
        logException("warn", message, ex, request);
        Result<String> result = Result.error(ResultCode.BAD_REQUEST, message).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理HTTP消息不可读异常
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Result<String>> handleHttpMessageNotReadableException(
            HttpMessageNotReadableException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String message = "请求体格式错误或无法解析";
        
        logException("warn", message + ": " + ex.getMessage(), ex, request);
        Result<String> result = Result.error(ResultCode.BAD_REQUEST, message).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理请求方法不支持异常
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<Result<String>> handleMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String message = String.format("不支持的请求方法: %s", ex.getMethod());
        
        logException("warn", message, ex, request);
        Result<String> result = Result.error(ResultCode.METHOD_NOT_ALLOWED, message).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(result);
    }

    /**
     * 处理404异常
     */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<Result<String>> handleNoHandlerFoundException(
            NoHandlerFoundException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        String message = String.format("请求的资源不存在: %s %s", ex.getHttpMethod(), ex.getRequestURL());
        
        logException("warn", message, ex, request);
        Result<String> result = Result.error(ResultCode.NOT_FOUND, message).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
    }

    /**
     * 处理数据库相关异常
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<Result<String>> handleDataAccessException(
            DataAccessException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("error", "数据库访问异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.DATABASE_OPERATION_FAILED).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    /**
     * 处理数据完整性违反异常
     */
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<Result<String>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("warn", "数据完整性违反: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.DATA_INTEGRITY_ERROR).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理SQL异常
     */
    @ExceptionHandler(SQLException.class)
    public ResponseEntity<Result<String>> handleSQLException(
            SQLException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("error", "SQL执行异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.DATABASE_OPERATION_FAILED).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    /**
     * 处理非法参数异常
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Result<String>> handleIllegalArgumentException(
            IllegalArgumentException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("warn", "非法参数异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.BAD_REQUEST, ex.getMessage()).withTraceId(traceId);
        return ResponseEntity.badRequest().body(result);
    }

    /**
     * 处理空指针异常
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Result<String>> handleNullPointerException(
            NullPointerException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("error", "空指针异常", ex, request);
        
        Result<String> result = Result.error(ResultCode.INTERNAL_SERVER_ERROR, "系统内部错误，请联系管理员").withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<Result<String>> handleRuntimeException(
            RuntimeException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("error", "运行时异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.INTERNAL_SERVER_ERROR, 
                "系统运行异常: " + ex.getMessage()).withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }

    /**
     * 处理所有其他异常
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Result<String>> handleGenericException(
            Exception ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        logException("error", "未知异常: " + ex.getMessage(), ex, request);
        
        Result<String> result = Result.error(ResultCode.INTERNAL_SERVER_ERROR, "系统异常，请联系管理员").withTraceId(traceId);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(result);
    }
}