package com.greenhouse.service;

import com.greenhouse.dto.AnalyticsDTO;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 数据分析服务接口
 * 提供环境数据的统计分析、趋势分析、异常检测等功能
 */
public interface AnalyticsService {

    /**
     * 获取环境数据统计摘要
     * 包含各环境参数的最大值、最小值、平均值、标准差等统计信息
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 统计摘要数据
     */
    AnalyticsDTO getStatisticsSummary(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取环境数据趋势分析
     * 分析指定时间范围内环境参数的变化趋势
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param interval 数据聚合间隔 (hour, day)
     * @return 趋势分析数据
     */
    AnalyticsDTO getTrendAnalysis(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String interval);

    /**
     * 检测环境数据异常
     * 基于统计学方法检测异常数据点
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param sensitivity 敏感度 (low, medium, high)
     * @return 异常检测结果
     */
    AnalyticsDTO detectAnomalies(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String sensitivity);

    /**
     * 分析环境参数相关性
     * 计算各环境参数之间的相关系数
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 相关性分析结果
     */
    AnalyticsDTO getCorrelationAnalysis(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取综合分析报告
     * 包含统计摘要、趋势分析、异常检测和相关性分析的综合报告
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 综合分析报告
     */
    AnalyticsDTO getComprehensiveReport(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取环境参数预测
     * 基于历史数据预测未来环境参数变化
     * 
     * @param greenhouseId 温室ID
     * @param hours 预测小时数
     * @return 预测结果
     */
    AnalyticsDTO getPrediction(String greenhouseId, int hours);

    /**
     * 获取环境质量评分
     * 基于环境参数计算环境质量综合评分
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 环境质量评分和详细分析
     */
    Map<String, Object> getEnvironmentQualityScore(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取数据完整性报告
     * 分析数据缺失情况和数据质量
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @return 数据完整性报告
     */
    Map<String, Object> getDataIntegrityReport(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime);

    /**
     * 获取环境参数分布分析
     * 分析各环境参数的数值分布情况
     * 
     * @param greenhouseId 温室ID
     * @param startTime 开始时间
     * @param endTime 结束时间
     * @param parameter 参数名称 (temperature, humidity, light_intensity, soil_humidity, co2_level)
     * @return 参数分布分析结果
     */
    Map<String, Object> getParameterDistribution(String greenhouseId, LocalDateTime startTime, LocalDateTime endTime, String parameter);

    /**
     * 获取时间段对比分析
     * 对比不同时间段的环境数据差异
     * 
     * @param greenhouseId 温室ID
     * @param period1Start 第一个时间段开始时间
     * @param period1End 第一个时间段结束时间
     * @param period2Start 第二个时间段开始时间
     * @param period2End 第二个时间段结束时间
     * @return 对比分析结果
     */
    Map<String, Object> getComparativeAnalysis(String greenhouseId, 
                                             LocalDateTime period1Start, LocalDateTime period1End,
                                             LocalDateTime period2Start, LocalDateTime period2End);
}