package com.greenhouse.dto;

import com.greenhouse.entity.ControlLog;
import com.greenhouse.entity.DeviceStatus;

import java.math.BigDecimal;
import java.util.List;

/**
 * 设备控制数据传输对象
 * 用于设备控制操作的参数传递和结果返回
 */
public class DeviceControlDTO {

    /**
     * 设备ID
     */
    private String deviceId;

    /**
     * 设备名称
     */
    private String deviceName;

    /**
     * 设备类型
     */
    private DeviceStatus.DeviceType deviceType;

    /**
     * 操作动作
     */
    private ControlLog.Action action;

    /**
     * 功率级别（0-100）
     */
    private BigDecimal powerLevel;

    /**
     * 操作员
     */
    private String operator;

    /**
     * 操作来源
     */
    private ControlLog.OperationSource operationSource;

    /**
     * 操作结果
     */
    private ControlLog.Result result;

    /**
     * 操作消息
     */
    private String message;

    /**
     * 旧值（用于调节操作）
     */
    private BigDecimal oldValue;

    /**
     * 新值（用于调节操作）
     */
    private BigDecimal newValue;

    // 构造函数
    public DeviceControlDTO() {}

    public DeviceControlDTO(String deviceId, ControlLog.Action action, String operator, ControlLog.OperationSource operationSource) {
        this.deviceId = deviceId;
        this.action = action;
        this.operator = operator;
        this.operationSource = operationSource;
    }

    // Getter和Setter方法
    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public DeviceStatus.DeviceType getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(DeviceStatus.DeviceType deviceType) {
        this.deviceType = deviceType;
    }

    public ControlLog.Action getAction() {
        return action;
    }

    public void setAction(ControlLog.Action action) {
        this.action = action;
    }

    public BigDecimal getPowerLevel() {
        return powerLevel;
    }

    public void setPowerLevel(BigDecimal powerLevel) {
        this.powerLevel = powerLevel;
    }

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public ControlLog.OperationSource getOperationSource() {
        return operationSource;
    }

    public void setOperationSource(ControlLog.OperationSource operationSource) {
        this.operationSource = operationSource;
    }

    public ControlLog.Result getResult() {
        return result;
    }

    public void setResult(ControlLog.Result result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public BigDecimal getOldValue() {
        return oldValue;
    }

    public void setOldValue(BigDecimal oldValue) {
        this.oldValue = oldValue;
    }

    public BigDecimal getNewValue() {
        return newValue;
    }

    public void setNewValue(BigDecimal newValue) {
        this.newValue = newValue;
    }

    @Override
    public String toString() {
        return "DeviceControlDTO{" +
                "deviceId='" + deviceId + '\'' +
                ", deviceName='" + deviceName + '\'' +
                ", deviceType=" + deviceType +
                ", action=" + action +
                ", powerLevel=" + powerLevel +
                ", operator='" + operator + '\'' +
                ", operationSource=" + operationSource +
                ", result=" + result +
                ", message='" + message + '\'' +
                ", oldValue=" + oldValue +
                ", newValue=" + newValue +
                '}';
    }

    /**
     * 批量设备控制请求DTO
     */
    public static class BatchControlRequest {
        /**
         * 设备ID列表
         */
        private List<String> deviceIds;

        /**
         * 操作动作
         */
        private ControlLog.Action action;

        /**
         * 功率级别（仅对启动和调节操作有效）
         */
        private BigDecimal powerLevel;

        /**
         * 操作员
         */
        private String operator;

        /**
         * 操作来源
         */
        private ControlLog.OperationSource operationSource;

        // 构造函数
        public BatchControlRequest() {}

        public BatchControlRequest(List<String> deviceIds, ControlLog.Action action, String operator, ControlLog.OperationSource operationSource) {
            this.deviceIds = deviceIds;
            this.action = action;
            this.operator = operator;
            this.operationSource = operationSource;
        }

        // Getter和Setter方法
        public List<String> getDeviceIds() {
            return deviceIds;
        }

        public void setDeviceIds(List<String> deviceIds) {
            this.deviceIds = deviceIds;
        }

        public ControlLog.Action getAction() {
            return action;
        }

        public void setAction(ControlLog.Action action) {
            this.action = action;
        }

        public BigDecimal getPowerLevel() {
            return powerLevel;
        }

        public void setPowerLevel(BigDecimal powerLevel) {
            this.powerLevel = powerLevel;
        }

        public String getOperator() {
            return operator;
        }

        public void setOperator(String operator) {
            this.operator = operator;
        }

        public ControlLog.OperationSource getOperationSource() {
            return operationSource;
        }

        public void setOperationSource(ControlLog.OperationSource operationSource) {
            this.operationSource = operationSource;
        }

        @Override
        public String toString() {
            return "BatchControlRequest{" +
                    "deviceIds=" + deviceIds +
                    ", action=" + action +
                    ", powerLevel=" + powerLevel +
                    ", operator='" + operator + '\'' +
                    ", operationSource=" + operationSource +
                    '}';
        }
    }

    /**
     * 自动控制结果DTO
     */
    public static class AutoControlResult {
        /**
         * 控制是否成功
         */
        private boolean success;

        /**
         * 控制的设备数量
         */
        private int controlledDeviceCount;

        /**
         * 控制操作列表
         */
        private List<DeviceControlDTO> controlOperations;

        /**
         * 结果消息
         */
        private String message;

        // 构造函数
        public AutoControlResult() {}

        public AutoControlResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        // Getter和Setter方法
        public boolean isSuccess() {
            return success;
        }

        public void setSuccess(boolean success) {
            this.success = success;
        }

        public int getControlledDeviceCount() {
            return controlledDeviceCount;
        }

        public void setControlledDeviceCount(int controlledDeviceCount) {
            this.controlledDeviceCount = controlledDeviceCount;
        }

        public List<DeviceControlDTO> getControlOperations() {
            return controlOperations;
        }

        public void setControlOperations(List<DeviceControlDTO> controlOperations) {
            this.controlOperations = controlOperations;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        @Override
        public String toString() {
            return "AutoControlResult{" +
                    "success=" + success +
                    ", controlledDeviceCount=" + controlledDeviceCount +
                    ", controlOperations=" + controlOperations +
                    ", message='" + message + '\'' +
                    '}';
        }
    }
}