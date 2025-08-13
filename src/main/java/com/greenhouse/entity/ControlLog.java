package com.greenhouse.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 控制日志实体类
 * 对应数据库表: control_logs
 */
@TableName("control_logs")
public class ControlLog {

    /**
     * 主键ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Integer id;

    /**
     * 设备ID
     */
    @TableField("device_id")
    private String deviceId;

    /**
     * 操作动作
     */
    @TableField("action")
    private Action action;

    /**
     * 旧值
     */
    @TableField("old_value")
    private BigDecimal oldValue;

    /**
     * 新值
     */
    @TableField("new_value")
    private BigDecimal newValue;

    /**
     * 操作员
     */
    @TableField("operator")
    private String operator;

    /**
     * 操作来源
     */
    @TableField("operation_source")
    private OperationSource operationSource;

    /**
     * 操作结果
     */
    @TableField("result")
    private Result result;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;

    // 操作动作枚举
    public enum Action {
        start("start", "启动"),
        stop("stop", "停止"),
        adjust("adjust", "调节"),
        reset("reset", "重置");

        private final String code;
        private final String description;

        Action(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    // 操作来源枚举
    public enum OperationSource {
        manual("manual", "手动"),
        auto("auto", "自动"),
        remote("remote", "远程");

        private final String code;
        private final String description;

        OperationSource(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    // 操作结果枚举
    public enum Result {
        success("success", "成功"),
        failed("failed", "失败"),
        timeout("timeout", "超时");

        private final String code;
        private final String description;

        Result(String code, String description) {
            this.code = code;
            this.description = description;
        }

        public String getCode() {
            return code;
        }

        public String getDescription() {
            return description;
        }
    }

    // 构造函数
    public ControlLog() {}

    public ControlLog(String deviceId, Action action, String operator, OperationSource operationSource) {
        this.deviceId = deviceId;
        this.action = action;
        this.operator = operator;
        this.operationSource = operationSource;
        this.result = Result.success;
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public Action getAction() {
        return action;
    }

    public void setAction(Action action) {
        this.action = action;
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

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public OperationSource getOperationSource() {
        return operationSource;
    }

    public void setOperationSource(OperationSource operationSource) {
        this.operationSource = operationSource;
    }

    public Result getResult() {
        return result;
    }

    public void setResult(Result result) {
        this.result = result;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ControlLog{" +
                "id=" + id +
                ", deviceId='" + deviceId + '\'' +
                ", action=" + action +
                ", oldValue=" + oldValue +
                ", newValue=" + newValue +
                ", operator='" + operator + '\'' +
                ", operationSource=" + operationSource +
                ", result=" + result +
                ", createdAt=" + createdAt +
                '}';
    }
}