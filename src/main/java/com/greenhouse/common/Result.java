package com.greenhouse.common;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

/**
 * 统一返回结果类
 * 用于API接口的统一响应格式
 */
public class Result<T> {

    /**
     * 响应码
     */
    private int code;

    /**
     * 响应消息
     */
    private String message;

    /**
     * 响应数据
     */
    private T data;

    /**
     * 是否成功
     */
    private boolean success;

    /**
     * 响应时间戳
     */
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;

    /**
     * 请求追踪ID
     */
    private String traceId;

    // 构造函数
    public Result() {
        this.timestamp = LocalDateTime.now();
    }

    public Result(int code, String message, T data, boolean success) {
        this.code = code;
        this.message = message;
        this.data = data;
        this.success = success;
        this.timestamp = LocalDateTime.now();
    }

    public Result(ResultCode resultCode, T data) {
        this.code = resultCode.getCode();
        this.message = resultCode.getMessage();
        this.data = data;
        this.success = resultCode.getCode() == 200;
        this.timestamp = LocalDateTime.now();
    }

    // 成功响应
    public static <T> Result<T> success(T data) {
        return new Result<>(ResultCode.SUCCESS, data);
    }

    public static <T> Result<T> success(String message, T data) {
        return new Result<>(200, message, data, true);
    }

    public static Result<Void> success() {
        return new Result<>(ResultCode.SUCCESS, null);
    }

    public static Result<Void> success(String message) {
        return new Result<>(200, message, null, true);
    }

    // 失败响应
    public static <T> Result<T> error(String message) {
        return new Result<>(ResultCode.INTERNAL_SERVER_ERROR.getCode(), message, null, false);
    }

    public static <T> Result<T> error(int code, String message) {
        return new Result<>(code, message, null, false);
    }

    public static <T> Result<T> error(int code, String message, T data) {
        return new Result<>(code, message, data, false);
    }

    public static <T> Result<T> error(ResultCode resultCode) {
        return new Result<>(resultCode, null);
    }

    public static <T> Result<T> error(ResultCode resultCode, T data) {
        return new Result<>(resultCode, data);
    }

    public static <T> Result<T> error(ResultCode resultCode, String customMessage) {
        Result<T> result = new Result<>();
        result.code = resultCode.getCode();
        result.message = customMessage;
        result.data = null;
        result.success = false;
        result.timestamp = LocalDateTime.now();
        return result;
    }

    // 业务异常响应
    public static <T> Result<T> businessError(String message) {
        return new Result<>(400, message, null, false);
    }

    public static <T> Result<T> businessError(ResultCode resultCode) {
        return new Result<>(resultCode, null);
    }

    public static <T> Result<T> businessError(ResultCode resultCode, String customMessage) {
        return new Result<>(resultCode.getCode(), customMessage, null, false);
    }

    // Getter和Setter方法
    public int getCode() {
        return code;
    }

    public void setCode(int code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public T getData() {
        return data;
    }

    public void setData(T data) {
        this.data = data;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getTraceId() {
        return traceId;
    }

    public void setTraceId(String traceId) {
        this.traceId = traceId;
    }

    /**
     * 设置追踪ID并返回当前对象，支持链式调用
     */
    @SuppressWarnings("unchecked")
    public <R> Result<R> withTraceId(String traceId) {
        this.traceId = traceId;
        return (Result<R>) this;
    }

    /**
     * 判断是否为成功响应
     */
    public boolean isOk() {
        return this.success && this.code == 200;
    }

    /**
     * 判断是否为错误响应
     */
    public boolean isError() {
        return !this.success;
    }

    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", data=" + data +
                ", success=" + success +
                ", timestamp=" + timestamp +
                ", traceId='" + traceId + '\'' +
                '}';
    }
}