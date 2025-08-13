package com.greenhouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.dto.AlertDTO;
import com.greenhouse.entity.AlertRecord;
import com.greenhouse.entity.EnvironmentData;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 报警管理服务接口
 * 提供报警触发、处理、统计等功能
 */
public interface AlertService {

    /**
     * 触发环境参数报警
     * @param alertType 报警类型
     * @param parameterValue 参数值
     * @param thresholdValue 阈值
     * @param message 报警消息
     * @return 报警记录DTO
     */
    AlertDTO triggerEnvironmentAlert(AlertRecord.AlertType alertType, BigDecimal parameterValue, 
                                   BigDecimal thresholdValue, String message);

    /**
     * 触发设备故障报警
     * @param deviceId 设备ID
     * @param message 报警消息
     * @return 报警记录DTO
     */
    AlertDTO triggerDeviceAlert(String deviceId, String message);

    /**
     * 触发系统错误报警
     * @param message 报警消息
     * @return 报警记录DTO
     */
    AlertDTO triggerSystemAlert(String message);

    /**
     * 检查环境数据并触发相应报警
     * @param environmentData 环境数据
     * @return 触发的报警列表
     */
    List<AlertDTO> checkAndTriggerEnvironmentAlerts(EnvironmentData environmentData);

    /**
     * 处理报警（标记为已解决）
     * @param alertId 报警ID
     * @return 处理结果
     */
    boolean resolveAlert(Integer alertId);

    /**
     * 批量处理报警
     * @param alertIds 报警ID列表
     * @return 处理结果
     */
    boolean batchResolveAlerts(List<Integer> alertIds);

    /**
     * 获取未解决的报警列表
     * @return 未解决报警列表
     */
    List<AlertDTO> getUnresolvedAlerts();

    /**
     * 获取高优先级未解决报警
     * @return 高优先级报警列表
     */
    List<AlertDTO> getHighPriorityUnresolvedAlerts();

    /**
     * 分页查询报警记录
     * @param pageNum 页码
     * @param pageSize 页大小
     * @param alertType 报警类型（可选）
     * @param severity 严重程度（可选）
     * @param isResolved 是否已解决（可选）
     * @param startTime 开始时间（可选）
     * @param endTime 结束时间（可选）
     * @return 分页结果
     */
    IPage<AlertDTO> getAlertPage(int pageNum, int pageSize, AlertRecord.AlertType alertType,
                               AlertRecord.Severity severity, Boolean isResolved,
                               LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 根据报警类型查询报警记录
     * @param alertType 报警类型
     * @return 报警记录列表
     */
    List<AlertDTO> getAlertsByType(AlertRecord.AlertType alertType);

    /**
     * 根据严重程度查询报警记录
     * @param severity 严重程度
     * @return 报警记录列表
     */
    List<AlertDTO> getAlertsBySeverity(AlertRecord.Severity severity);

    /**
     * 根据设备ID查询报警记录
     * @param deviceId 设备ID
     * @return 报警记录列表
     */
    List<AlertDTO> getAlertsByDeviceId(String deviceId);

    /**
     * 获取指定时间范围内的报警记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 报警记录列表
     */
    List<AlertDTO> getAlertsByTimeRange(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取最近的报警记录
     * @param limit 限制数量
     * @return 最近报警记录列表
     */
    List<AlertDTO> getRecentAlerts(int limit);

    /**
     * 获取报警统计信息
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计信息Map
     */
    Map<String, Object> getAlertStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取报警类型统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 报警类型统计列表
     */
    List<Map<String, Object>> getAlertTypeStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取报警严重程度统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 严重程度统计列表
     */
    List<Map<String, Object>> getSeverityStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取每日报警统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日报警统计列表
     */
    List<Map<String, Object>> getDailyAlertStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取设备报警统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 设备报警统计列表
     */
    List<Map<String, Object>> getDeviceAlertStatistics(LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 判断报警级别
     * @param alertType 报警类型
     * @param parameterValue 参数值
     * @param thresholdValue 阈值
     * @return 报警严重程度
     */
    AlertRecord.Severity determineSeverity(AlertRecord.AlertType alertType, BigDecimal parameterValue, 
                                         BigDecimal thresholdValue);

    /**
     * 检查是否需要升级报警
     * @param alertId 报警ID
     * @return 是否需要升级
     */
    boolean shouldEscalateAlert(Integer alertId);

    /**
     * 升级报警级别
     * @param alertId 报警ID
     * @return 升级结果
     */
    boolean escalateAlert(Integer alertId);

    /**
     * 获取未解决报警数量
     * @return 未解决报警数量
     */
    long getUnresolvedAlertCount();

    /**
     * 获取指定严重程度的未解决报警数量
     * @param severity 严重程度
     * @return 未解决报警数量
     */
    long getUnresolvedAlertCountBySeverity(AlertRecord.Severity severity);

    /**
     * 获取今日报警数量
     * @return 今日报警数量
     */
    long getTodayAlertCount();

    /**
     * 清理历史报警记录
     * @param beforeTime 清理此时间之前的已解决报警
     * @return 清理的记录数
     */
    int cleanResolvedAlerts(LocalDateTime beforeTime);

    /**
     * 验证报警数据的有效性
     * @param alertRecord 报警记录
     * @return 验证结果
     */
    boolean validateAlertData(AlertRecord alertRecord);
}