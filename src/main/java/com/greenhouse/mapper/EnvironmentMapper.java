package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.EnvironmentData;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 环境数据Mapper接口
 * 提供环境数据的基础CRUD操作和复杂查询功能
 */
@Mapper
public interface EnvironmentMapper extends BaseMapper<EnvironmentData> {

    /**
     * 获取指定温室的最新环境数据
     * @param greenhouseId 温室ID
     * @return 最新环境数据
     */
    @Select("SELECT * FROM environment_data WHERE greenhouse_id = #{greenhouseId} ORDER BY recorded_at DESC LIMIT 1")
    EnvironmentData selectLatestByGreenhouseId(@Param("greenhouseId") String greenhouseId);

    /**
     * 获取指定时间范围内的环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 环境数据列表
     */
    List<EnvironmentData> selectByTimeRange(@Param("greenhouseId") String greenhouseId,
                                          @Param("startTime") LocalDateTime startTime,
                                          @Param("endTime") LocalDateTime endTime);

    /**
     * 获取指定时间范围内的环境数据统计信息
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计信息Map
     */
    Map<String, Object> selectStatisticsByTimeRange(@Param("greenhouseId") String greenhouseId,
                                                   @Param("startTime") LocalDateTime startTime,
                                                   @Param("endTime") LocalDateTime endTime);

    /**
     * 获取温度异常的环境数据
     * @param greenhouseId 温室ID
     * @param minTemp 最低温度阈值
     * @param maxTemp 最高温度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentData> selectTemperatureAbnormal(@Param("greenhouseId") String greenhouseId,
                                                   @Param("minTemp") BigDecimal minTemp,
                                                   @Param("maxTemp") BigDecimal maxTemp,
                                                   @Param("startTime") LocalDateTime startTime,
                                                   @Param("endTime") LocalDateTime endTime);

    /**
     * 获取湿度异常的环境数据
     * @param greenhouseId 温室ID
     * @param minHumidity 最低湿度阈值
     * @param maxHumidity 最高湿度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentData> selectHumidityAbnormal(@Param("greenhouseId") String greenhouseId,
                                               @Param("minHumidity") BigDecimal minHumidity,
                                               @Param("maxHumidity") BigDecimal maxHumidity,
                                               @Param("startTime") LocalDateTime startTime,
                                               @Param("endTime") LocalDateTime endTime);

    /**
     * 获取光照强度异常的环境数据
     * @param greenhouseId 温室ID
     * @param minLight 最低光照强度阈值
     * @param maxLight 最高光照强度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentData> selectLightAbnormal(@Param("greenhouseId") String greenhouseId,
                                            @Param("minLight") BigDecimal minLight,
                                            @Param("maxLight") BigDecimal maxLight,
                                            @Param("startTime") LocalDateTime startTime,
                                            @Param("endTime") LocalDateTime endTime);

    /**
     * 分页查询环境数据历史记录
     * @param page 分页参数
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 分页结果
     */
    IPage<EnvironmentData> selectHistoryPage(Page<EnvironmentData> page,
                                           @Param("greenhouseId") String greenhouseId,
                                           @Param("startTime") LocalDateTime startTime,
                                           @Param("endTime") LocalDateTime endTime);

    /**
     * 获取每小时平均环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每小时平均数据列表
     */
    List<Map<String, Object>> selectHourlyAverage(@Param("greenhouseId") String greenhouseId,
                                                @Param("startTime") LocalDateTime startTime,
                                                @Param("endTime") LocalDateTime endTime);

    /**
     * 获取每日平均环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日平均数据列表
     */
    List<Map<String, Object>> selectDailyAverage(@Param("greenhouseId") String greenhouseId,
                                               @Param("startTime") LocalDateTime startTime,
                                               @Param("endTime") LocalDateTime endTime);

    /**
     * 删除指定时间之前的历史数据
     * @param beforeTime 时间阈值
     * @return 删除的记录数
     */
    int deleteBeforeTime(@Param("beforeTime") LocalDateTime beforeTime);

    /**
     * 获取数据记录总数
     * @param greenhouseId 温室ID
     * @return 记录总数
     */
    @Select("SELECT COUNT(*) FROM environment_data WHERE greenhouse_id = #{greenhouseId}")
    long countByGreenhouseId(@Param("greenhouseId") String greenhouseId);
}