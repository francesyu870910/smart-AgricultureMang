package com.greenhouse.common.exception;

import com.greenhouse.common.ResultCode;

/**
 * 设备相关异常类
 * 用于处理设备控制和状态相关的异常
 */
public class DeviceException extends BusinessException {

    private final String deviceId;

    public DeviceException(String deviceId, String message) {
        super(message);
        this.deviceId = deviceId;
    }

    public DeviceException(String deviceId, ResultCode resultCode) {
        super(resultCode);
        this.deviceId = deviceId;
    }

    public DeviceException(String deviceId, ResultCode resultCode, String customMessage) {
        super(resultCode, customMessage);
        this.deviceId = deviceId;
    }

    public DeviceException(String deviceId, String message, Throwable cause) {
        super(message, cause);
        this.deviceId = deviceId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    @Override
    public String getMessage() {
        return String.format("设备[%s]: %s", deviceId, super.getMessage());
    }
}