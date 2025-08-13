package com.greenhouse.service;

import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.HistoryPageDTO;
import com.greenhouse.dto.HistoryQueryDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 历史数据服务接口
 * 提供历史数据查询、导出、清理等功能
 */
public interface HistoryService {

    /**
     * 分页查询历史环境数据
     * @param queryDTO 查询条件
     * @return 分页结果
     */
    HistoryPageDTO<EnvironmentDTO> queryHistoryData(HistoryQueryDTO queryDTO);

    /**
     * 查询指定时间范围内的历史数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 历史数据列表
     */
    List<EnvironmentDTO> queryHistoryByTimeRange(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 导出历史数据为CSV格式
     * @param queryDTO 查询条件
     * @return CSV格式的数据字符串
     */
    String exportHistoryDataToCsv(HistoryQueryDTO queryDTO);

    /**
     * 导出历史数据为Excel格式
     * @param queryDTO 查询条件
     * @return Excel文件的字节数组
     */
    byte[] exportHistoryDataToExcel(HistoryQueryDTO queryDTO);

    /**
     * 获取历史数据统计信息
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计信息
     */
    Map<String, Object> getHistoryStatistics(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取每小时平均数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每小时平均数据列表
     */
    List<Map<String, Object>> getHourlyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取每日平均数据
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 每日平均数据列表
     */
    List<Map<String, Object>> getDailyAverageData(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 清理指定时间之前的历史数据
     * @param beforeTime 时间阈值
     * @return 清理的记录数
     */
    int cleanHistoryDataBefore(LocalDateTime beforeTime);

    /**
     * 获取历史数据记录总数
     * @param greenhouseId 温室ID
     * @return 记录总数
     */
    long getHistoryDataCount(String greenhouseId);

    /**
     * 压缩历史数据（将详细数据聚合为小时/日平均数据）
     * @param beforeTime 压缩时间阈值
     * @return 压缩的记录数
     */
    int compressHistoryData(LocalDateTime beforeTime);

    /**
     * 查询异常历史数据
     * @param greenhouseId 温室ID
     * @param parameterType 参数类型
     * @param minValue 最小值阈值
     * @param maxValue 最大值阈值
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 异常数据列表
     */
    List<EnvironmentDTO> queryAbnormalHistoryData(String greenhouseId, String parameterType, 
                                                 Double minValue, Double maxValue, 
                                                 LocalDateTime startTime, LocalDateTime endTime);
}