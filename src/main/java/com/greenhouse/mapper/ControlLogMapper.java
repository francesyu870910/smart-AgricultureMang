package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.ControlLog;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 控制日志Mapper接口
 * 提供控制日志的基础CRUD操作和复杂查询功能
 */
@Mapper
public interface ControlLogMapper extends BaseMapper<ControlLog> {

    /**
     * 根据设备ID查询控制日志
     * @param deviceId 设备ID
     * @return 控制日志列表
     */
    @Select("SELECT * FROM control_logs WHERE device_id = #{deviceId} ORDER BY created_at DESC")
    List<ControlLog> selectByDeviceId(@Param("deviceId") String deviceId);

    /**
     * 根据操作动作查询控制日志
     * @param action 操作动作
     * @return 控制日志列表
     */
    List<ControlLog> selectByAction(@Param("action") ControlLog.Action action);

    /**
     * 根据操作员查询控制日志
     * @param operator 操作员
     * @return 控制日志列表
     */
    @Select("SELECT * FROM control_logs WHERE operator = #{operator} ORDER BY created_at DESC")
    List<ControlLog> selectByOperator(@Param("operator") String operator);

    /**
     * 根据操作来源查询控制日志
     * @param operationSource 操作来源
     * @return 控制日志列表
     */
    List<ControlLog> selectByOperationSource(@Param("operationSource") ControlLog.OperationSource operationSource);

    /**
     * 根据操作结果查询控制日志
     * @param result 操作结果
     * @return 控制日志列表
     */
    List<ControlLog> selectByResult(@Param("result") ControlLog.Result result);

    /**
     * 查询指定时间范围内的控制日志
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 控制日志列表
     */
    List<ControlLog> selectByTimeRange(@Param("startTime") LocalDateTime startTime,
                                     @Param("endTime") LocalDateTime endTime);

    /**
     * 查询指定设备在指定时间范围内的控制日志
     * @param deviceId 设备ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 控制日志列表
     */
    List<ControlLog> selectByDeviceAndTimeRange(@Param("deviceId") String deviceId,
                                              @Param("startTime") LocalDateTime startTime,
                                              @Param("endTime") LocalDateTime endTime);

    /**
     * 查询失败的控制操作
     * @return 失败的控制日志列表
     */
    @Select("SELECT * FROM control_logs WHERE result IN ('failed', 'timeout') ORDER BY created_at DESC")
    List<ControlLog> selectFailedOperations();

    /**
     * 查询最近的控制日志
     * @param limit 限制数量
     * @return 最近的控制日志列表
     */
    @Select("SELECT * FROM control_logs ORDER BY created_at DESC LIMIT #{limit}")
    List<ControlLog> selectRecentLogs(@Param("limit") int limit);

    /**
     * 分页查询控制日志
     * @param page 分页参数
     * @param deviceId 设备ID（可选）
     * @param action 操作动作（可选）
     * @param operator 操作员（可选）
     * @param operationSource 操作来源（可选）
     * @param result 操作结果（可选）
     * @param startTime 开始时间（可选）
     * @param endTime 结束时间（可选）
     * @return 分页结果
     */
    IPage<ControlLog> selectControlLogPage(Page<ControlLog> page,
                                         @Param("deviceId") String deviceId,
                                         @Param("action") ControlLog.Action action,
                                         @Param("operator") String operator,
                                         @Param("operationSource") ControlLog.OperationSource operationSource,
                                         @Param("result") ControlLog.Result result,
                                         @Param("startTime") LocalDateTime startTime,
                                         @Param("endTime") LocalDateTime endTime);

    /**
     * 获取操作动作统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作动作统计列表
     */
    List<Map<String, Object>> selectActionStatistics(@Param("startTime") LocalDateTime startTime,
                                                    @Param("endTime") LocalDateTime endTime);

    /**
     * 获取操作员统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作员统计列表
     */
    List<Map<String, Object>> selectOperatorStatistics(@Param("startTime") LocalDateTime startTime,
                                                      @Param("endTime") LocalDateTime endTime);

    /**
     * 获取操作来源统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 操作来源统计列表
     */
    List<Map<String, Object>> selectOperationSourceStatistics(@Param("startTime") LocalDateTime startTime,
                                                             @Param("endTime") LocalDateTime endTime);

    /**
     * 获取设备操作统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 设备操作统计列表
     */
    List<Map<String, Object>> selectDeviceOperationStatistics(@Param("startTime") LocalDateTime startTime,
                                                             @Param("endTime") LocalDateTime endTime);

    /**
     * 获取每日操作统计
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日操作统计列表
     */
    List<Map<String, Object>> selectDailyOperationStatistics(@Param("startTime") LocalDateTime startTime,
                                                            @Param("endTime") LocalDateTime endTime);

    /**
     * 删除指定时间之前的控制日志
     * @param beforeTime 时间阈值
     * @return 删除的记录数
     */
    int deleteBeforeTime(@Param("beforeTime") LocalDateTime beforeTime);

    /**
     * 获取指定设备的操作次数
     * @param deviceId 设备ID
     * @return 操作次数
     */
    @Select("SELECT COUNT(*) FROM control_logs WHERE device_id = #{deviceId}")
    long countByDeviceId(@Param("deviceId") String deviceId);

    /**
     * 获取今日操作次数
     * @return 今日操作次数
     */
    @Select("SELECT COUNT(*) FROM control_logs WHERE DATE(created_at) = CURDATE()")
    long countTodayOperations();

    /**
     * 获取失败操作次数
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 失败操作次数
     */
    @Select("SELECT COUNT(*) FROM control_logs WHERE result IN ('failed', 'timeout') AND created_at BETWEEN #{startTime} AND #{endTime}")
    long countFailedOperations(@Param("startTime") LocalDateTime startTime,
                              @Param("endTime") LocalDateTime endTime);

    /**
     * 获取指定设备的最后一次操作记录
     * @param deviceId 设备ID
     * @return 最后一次操作记录
     */
    @Select("SELECT * FROM control_logs WHERE device_id = #{deviceId} ORDER BY created_at DESC LIMIT 1")
    ControlLog selectLastOperationByDeviceId(@Param("deviceId") String deviceId);
}