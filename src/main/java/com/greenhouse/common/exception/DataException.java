package com.greenhouse.common.exception;

import com.greenhouse.common.ResultCode;

/**
 * 数据相关异常类
 * 用于处理环境数据采集、存储和分析相关的异常
 */
public class DataException extends BusinessException {

    private final String dataType;
    private final String operation;

    public DataException(String dataType, String operation, String message) {
        super(message);
        this.dataType = dataType;
        this.operation = operation;
    }

    public DataException(String dataType, String operation, ResultCode resultCode) {
        super(resultCode);
        this.dataType = dataType;
        this.operation = operation;
    }

    public DataException(String dataType, String operation, ResultCode resultCode, String customMessage) {
        super(resultCode, customMessage);
        this.dataType = dataType;
        this.operation = operation;
    }

    public DataException(String dataType, String operation, String message, Throwable cause) {
        super(message, cause);
        this.dataType = dataType;
        this.operation = operation;
    }

    public String getDataType() {
        return dataType;
    }

    public String getOperation() {
        return operation;
    }

    @Override
    public String getMessage() {
        return String.format("数据操作异常[%s-%s]: %s", dataType, operation, super.getMessage());
    }
}