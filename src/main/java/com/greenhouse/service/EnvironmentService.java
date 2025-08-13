package com.greenhouse.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.EnvironmentStatisticsDTO;
import com.greenhouse.entity.EnvironmentData;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 环境数据服务接口
 * 提供环境数据的业务逻辑处理
 */
public interface EnvironmentService {

    /**
     * 获取指定温室的当前环境数据
     * @param greenhouseId 温室ID
     * @return 当前环境数据DTO
     */
    EnvironmentDTO getCurrentEnvironmentData(String greenhouseId);

    /**
     * 获取指定时间范围内的历史环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 历史环境数据列表
     */
    List<EnvironmentDTO> getHistoryEnvironmentData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 分页获取历史环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param pageNum 页码
     * @param pageSize 页大小
     * @return 分页结果
     */
    IPage<EnvironmentDTO> getHistoryEnvironmentDataPage(String greenhouseId, LocalDateTime startTime, 
                                                       LocalDateTime endTime, int pageNum, int pageSize);

    /**
     * 获取环境数据统计信息
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计信息DTO
     */
    EnvironmentStatisticsDTO getEnvironmentStatistics(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取每小时平均环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每小时平均数据列表
     */
    List<Map<String, Object>> getHourlyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取每日平均环境数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日平均数据列表
     */
    List<Map<String, Object>> getDailyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取温度异常数据
     * @param greenhouseId 温室ID
     * @param minTemp 最低温度阈值
     * @param maxTemp 最高温度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentDTO> getTemperatureAbnormalData(String greenhouseId, BigDecimal minTemp, BigDecimal maxTemp,
                                                   LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取湿度异常数据
     * @param greenhouseId 温室ID
     * @param minHumidity 最低湿度阈值
     * @param maxHumidity 最高湿度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentDTO> getHumidityAbnormalData(String greenhouseId, BigDecimal minHumidity, BigDecimal maxHumidity,
                                               LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取光照异常数据
     * @param greenhouseId 温室ID
     * @param minLight 最低光照强度阈值
     * @param maxLight 最高光照强度阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentDTO> getLightAbnormalData(String greenhouseId, BigDecimal minLight, BigDecimal maxLight,
                                            LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 保存环境数据
     * @param environmentData 环境数据实体
     * @return 保存结果
     */
    boolean saveEnvironmentData(EnvironmentData environmentData);

    /**
     * 批量保存环境数据
     * @param environmentDataList 环境数据列表
     * @return 保存结果
     */
    boolean batchSaveEnvironmentData(List<EnvironmentData> environmentDataList);

    /**
     * 验证环境数据的有效性
     * @param environmentData 环境数据
     * @return 验证结果
     */
    boolean validateEnvironmentData(EnvironmentData environmentData);

    /**
     * 检查环境参数是否异常
     * @param environmentData 环境数据
     * @return 异常检查结果Map，包含各参数的状态
     */
    Map<String, String> checkEnvironmentStatus(EnvironmentData environmentData);

    /**
     * 获取温室数据记录总数
     * @param greenhouseId 温室ID
     * @return 记录总数
     */
    long getDataCount(String greenhouseId);

    /**
     * 清理历史数据
     * @param beforeTime 清理此时间之前的数据
     * @return 清理的记录数
     */
    int cleanHistoryData(LocalDateTime beforeTime);
}