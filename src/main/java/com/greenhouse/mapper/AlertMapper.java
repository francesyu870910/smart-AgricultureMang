package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.AlertRecord;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 报警记录Mapper接口
 * 提供报警记录的基础CRUD操作和复杂查询功能
 */
@Mapper
public interface AlertMapper extends BaseMapper<AlertRecord> {

    /**
     * 查询未解决的报警记录
     * @return 未解决的报警列表
     */
    @Select("SELECT * FROM alert_records WHERE is_resolved = false ORDER BY created_at DESC")
    List<AlertRecord> selectUnresolvedAlerts();

    /**
     * 根据报警类型查询报警记录
     * @param alertType 报警类型
     * @return 报警记录列表
     */
    List<AlertRecord> selectByAlertType(@Param("alertType") AlertRecord.AlertType alertType);

    /**
     * 根据严重程度查询报警记录
     * @param severity 严重程度
     * @return 报警记录列表
     */
    List<AlertRecord> selectBySeverity(@Param("severity") AlertRecord.Severity severity);

    /**
     * 根据设备ID查询报警记录
     * @param deviceId 设备ID
     * @return 报警记录列表
     */
    @Select("SELECT * FROM alert_records WHERE device_id = #{deviceId} ORDER BY created_at DESC")
    List<AlertRecord> selectByDeviceId(@Param("deviceId") String deviceId);

    /**
     * 查询指定时间范围内的报警记录
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 报警记录列表
     */
    List<AlertRecord> selectByTimeRange(@Param("startTime") LocalDateTime startTime,
                                      @Param("endTime") LocalDateTime endTime);

    /**
     * 查询高优先级未解决的报警（高级和紧急）
     * @return 高优先级报警列表
     */
    @Select("SELECT * FROM alert_records WHERE is_resolved = false AND severity IN ('high', 'critical') ORDER BY severity DESC, created_at DESC")
    List<AlertRecord> selectHighPriorityUnresolved();

    /**
     * 标记报警为已解决
     * @param alertId 报警ID
     * @return 更新记录数
     */
    @Update("UPDATE alert_records SET is_resolved = true, resolved_at = NOW() WHERE id = #{alertId}")
    int markAsResolved(@Param("alertId") Integer alertId);

    /**
     * 批量标记报警为已解决
     * @param alertIds 报警ID列表
     * @return 更新记录数
     */
    int batchMarkAsResolved(@Param("alertIds") List<Integer> alertIds);

    /**
     * 分页查询报警记录
     * @param page 分页参数
     * @param alertType 报警类型（可选）
     * @param severity 严重程度（可选）
     * @param isResolved 是否已解决（可选）
     * @param startTime 开始时间（可选）
     * @param endTime 结束时间（可选）
     * @return 分页结果
     */
    IPage<AlertRecord> selectAlertPage(Page<AlertRecord> page,
                                     @Param("alertType") AlertRecord.AlertType alertType,
                                     @Param("severity") AlertRecord.Severity severity,
                                     @Param("isResolved") Boolean isResolved,
                                     @Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);

    /**
     * 获取报警类型统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 报警类型统计列表
     */
    List<Map<String, Object>> selectAlertTypeStatistics(@Param("startTime") LocalDateTime startTime,
                                                       @Param("endTime") LocalDateTime endTime);

    /**
     * 获取报警严重程度统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 严重程度统计列表
     */
    List<Map<String, Object>> selectSeverityStatistics(@Param("startTime") LocalDateTime startTime,
                                                      @Param("endTime") LocalDateTime endTime);

    /**
     * 获取每日报警统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日报警统计列表
     */
    List<Map<String, Object>> selectDailyAlertStatistics(@Param("startTime") LocalDateTime startTime,
                                                        @Param("endTime") LocalDateTime endTime);

    /**
     * 获取设备报警统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 设备报警统计列表
     */
    List<Map<String, Object>> selectDeviceAlertStatistics(@Param("startTime") LocalDateTime startTime,
                                                         @Param("endTime") LocalDateTime endTime);

    /**
     * 删除指定时间之前的已解决报警记录
     * @param beforeTime 时间阈值
     * @return 删除的记录数
     */
    int deleteResolvedBeforeTime(@Param("beforeTime") LocalDateTime beforeTime);

    /**
     * 获取未解决报警数量
     * @return 未解决报警数量
     */
    @Select("SELECT COUNT(*) FROM alert_records WHERE is_resolved = false")
    long countUnresolvedAlerts();

    /**
     * 获取指定严重程度的未解决报警数量
     * @param severity 严重程度
     * @return 未解决报警数量
     */
    @Select("SELECT COUNT(*) FROM alert_records WHERE is_resolved = false AND severity = #{severity}")
    long countUnresolvedBySeverity(@Param("severity") AlertRecord.Severity severity);

    /**
     * 获取今日报警数量
     * @return 今日报警数量
     */
    @Select("SELECT COUNT(*) FROM alert_records WHERE DATE(created_at) = CURDATE()")
    long countTodayAlerts();

    /**
     * 查询最近的报警记录
     * @param limit 限制数量
     * @return 最近的报警记录列表
     */
    @Select("SELECT * FROM alert_records ORDER BY created_at DESC LIMIT #{limit}")
    List<AlertRecord> selectRecentAlerts(@Param("limit") int limit);
}