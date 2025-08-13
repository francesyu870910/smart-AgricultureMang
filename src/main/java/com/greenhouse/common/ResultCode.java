package com.greenhouse.common;

/**
 * 统一返回结果码枚举
 * 定义系统中所有可能的返回状态码和对应消息
 */
public enum ResultCode {
    
    // 成功状态码
    SUCCESS(200, "操作成功"),
    
    // 客户端错误 4xx
    BAD_REQUEST(400, "请求参数错误"),
    UNAUTHORIZED(401, "未授权访问"),
    FORBIDDEN(403, "禁止访问"),
    NOT_FOUND(404, "资源不存在"),
    METHOD_NOT_ALLOWED(405, "请求方法不允许"),
    CONFLICT(409, "资源冲突"),
    VALIDATION_ERROR(422, "数据验证失败"),
    
    // 服务器错误 5xx
    INTERNAL_SERVER_ERROR(500, "服务器内部错误"),
    SERVICE_UNAVAILABLE(503, "服务暂不可用"),
    
    // 业务错误码 1xxx
    DEVICE_NOT_FOUND(1001, "设备不存在"),
    DEVICE_OFFLINE(1002, "设备离线"),
    DEVICE_CONTROL_FAILED(1003, "设备控制失败"),
    DEVICE_STATUS_ERROR(1004, "设备状态异常"),
    
    // 环境数据相关错误 2xxx
    ENVIRONMENT_DATA_NOT_FOUND(2001, "环境数据不存在"),
    SENSOR_ERROR(2002, "传感器异常"),
    DATA_COLLECTION_FAILED(2003, "数据采集失败"),
    THRESHOLD_INVALID(2004, "阈值设置无效"),
    
    // 报警相关错误 3xxx
    ALERT_NOT_FOUND(3001, "报警记录不存在"),
    ALERT_ALREADY_RESOLVED(3002, "报警已处理"),
    ALERT_CREATION_FAILED(3003, "报警创建失败"),
    
    // 数据分析相关错误 4xxx
    ANALYSIS_DATA_INSUFFICIENT(4001, "分析数据不足"),
    ANALYSIS_FAILED(4002, "数据分析失败"),
    REPORT_GENERATION_FAILED(4003, "报告生成失败"),
    
    // 历史数据相关错误 5xxx
    HISTORY_DATA_NOT_FOUND(5001, "历史数据不存在"),
    DATA_EXPORT_FAILED(5002, "数据导出失败"),
    DATA_IMPORT_FAILED(5003, "数据导入失败"),
    
    // 系统配置相关错误 6xxx
    CONFIG_NOT_FOUND(6001, "配置项不存在"),
    CONFIG_UPDATE_FAILED(6002, "配置更新失败"),
    CONFIG_INVALID(6003, "配置参数无效"),
    
    // 数据库相关错误 7xxx
    DATABASE_CONNECTION_ERROR(7001, "数据库连接异常"),
    DATABASE_OPERATION_FAILED(7002, "数据库操作失败"),
    DATA_INTEGRITY_ERROR(7003, "数据完整性错误"),
    
    // 网络通信相关错误 8xxx
    NETWORK_ERROR(8001, "网络通信异常"),
    TIMEOUT_ERROR(8002, "请求超时"),
    CONNECTION_REFUSED(8003, "连接被拒绝");
    
    private final int code;
    private final String message;
    
    ResultCode(int code, String message) {
        this.code = code;
        this.message = message;
    }
    
    public int getCode() {
        return code;
    }
    
    public String getMessage() {
        return message;
    }
    
    /**
     * 根据状态码获取枚举
     */
    public static ResultCode getByCode(int code) {
        for (ResultCode resultCode : values()) {
            if (resultCode.getCode() == code) {
                return resultCode;
            }
        }
        return INTERNAL_SERVER_ERROR;
    }
}