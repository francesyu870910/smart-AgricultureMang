# 数据分析服务 (AnalyticsService) 说明文档

## 概述

AnalyticsService 是温室数字化监控系统的数据分析服务，提供环境数据的统计分析、趋势分析、异常检测等功能。该服务实现了需求6（数据分析）中定义的所有功能。

## 主要功能

### 1. 统计摘要分析 (getStatisticsSummary)
- **功能**: 计算指定时间范围内各环境参数的统计信息
- **包含**: 最大值、最小值、平均值、标准差、中位数
- **参数**: 温室ID、开始时间、结束时间
- **返回**: AnalyticsDTO 包含统计摘要数据

### 2. 趋势分析 (getTrendAnalysis)
- **功能**: 分析环境参数的变化趋势
- **支持间隔**: 小时(hour)、天(day)、原始数据
- **趋势方向**: 上升(up)、下降(down)、稳定(stable)
- **参数**: 温室ID、开始时间、结束时间、聚合间隔
- **返回**: AnalyticsDTO 包含趋势数据列表

### 3. 异常检测 (detectAnomalies)
- **功能**: 基于统计学方法检测异常数据点
- **敏感度**: 低(low)、中(medium)、高(high)
- **检测方法**: 基于标准差的异常检测
- **异常级别**: 低(low)、中(medium)、高(high)、紧急(critical)
- **参数**: 温室ID、开始时间、结束时间、敏感度
- **返回**: AnalyticsDTO 包含异常数据列表

### 4. 相关性分析 (getCorrelationAnalysis)
- **功能**: 计算各环境参数之间的相关系数
- **相关性对**: 温度-湿度、温度-光照、湿度-土壤湿度等
- **相关系数范围**: -1 到 1
- **参数**: 温室ID、开始时间、结束时间
- **返回**: AnalyticsDTO 包含相关性系数映射

### 5. 综合分析报告 (getComprehensiveReport)
- **功能**: 生成包含统计、趋势、异常、相关性的综合报告
- **集成**: 统计摘要 + 趋势分析 + 异常检测 + 相关性分析
- **参数**: 温室ID、开始时间、结束时间
- **返回**: AnalyticsDTO 包含完整分析结果

### 6. 环境参数预测 (getPrediction)
- **功能**: 基于历史数据预测未来环境参数变化
- **预测方法**: 简单线性预测
- **历史数据**: 使用最近24小时数据
- **参数**: 温室ID、预测小时数
- **返回**: AnalyticsDTO 包含预测数据

### 7. 环境质量评分 (getEnvironmentQualityScore)
- **功能**: 基于理想范围计算环境质量综合评分
- **理想范围**:
  - 温度: 20-28°C
  - 湿度: 60-80%
  - 光照强度: 20000-50000 lux
  - 土壤湿度: 40-70%
  - CO2浓度: 800-1200 ppm
- **评分等级**: 优秀(≥90)、良好(≥80)、中等(≥70)、及格(≥60)、较差(<60)
- **参数**: 温室ID、开始时间、结束时间
- **返回**: Map 包含总分、等级、各参数评分

### 8. 数据完整性报告 (getDataIntegrityReport)
- **功能**: 分析数据缺失情况和数据质量
- **完整性计算**: 实际记录数 / 期望记录数 * 100%
- **数据质量等级**: 优秀(≥90%)、良好(≥70%)、一般(≥50%)、较差(<50%)
- **参数**: 温室ID、开始时间、结束时间
- **返回**: Map 包含完整性百分比、缺失数据统计

### 9. 参数分布分析 (getParameterDistribution)
- **功能**: 分析指定环境参数的数值分布情况
- **统计信息**: 最小值、最大值、平均值、中位数、四分位数
- **分布区间**: 默认10个区间的分布统计
- **参数**: 温室ID、开始时间、结束时间、参数名称
- **返回**: Map 包含统计信息和分布数据

### 10. 时间段对比分析 (getComparativeAnalysis)
- **功能**: 对比不同时间段的环境数据差异
- **对比内容**: 各参数的平均值、最值、标准差差异
- **参数**: 温室ID、两个时间段的开始和结束时间
- **返回**: Map 包含两个时间段的统计和差异分析

## 数据传输对象 (DTO)

### AnalyticsDTO
主要的分析结果传输对象，包含：
- 分析类型 (analysisType)
- 温室ID (greenhouseId)
- 时间范围 (startTime, endTime)
- 统计摘要 (statisticsSummary)
- 趋势数据 (trendData)
- 异常数据 (anomalies)
- 相关性数据 (correlations)
- 生成时间 (generatedAt)

### 内部类
- **StatisticsSummary**: 统计摘要数据
- **ParameterStats**: 单个参数的统计信息
- **TrendData**: 趋势数据点
- **AnomalyData**: 异常数据点

## 异常检测算法

### 基于标准差的异常检测
1. 计算参数的平均值和标准差
2. 设定敏感度阈值：
   - 低敏感度: 3倍标准差
   - 中敏感度: 2倍标准差
   - 高敏感度: 1.5倍标准差
3. 超出阈值的数据点标记为异常
4. 根据偏差程度确定异常级别

### 异常级别判定
- **紧急 (critical)**: 偏差 ≥ 3倍标准差
- **高 (high)**: 偏差 ≥ 2.5倍标准差
- **中 (medium)**: 偏差 ≥ 2倍标准差
- **低 (low)**: 偏差 < 2倍标准差

## 相关性分析算法

使用皮尔逊相关系数计算各参数间的线性相关性：
```
r = Σ[(xi - x̄)(yi - ȳ)] / √[Σ(xi - x̄)² × Σ(yi - ȳ)²]
```

相关系数解释：
- r > 0.7: 强正相关
- 0.3 < r ≤ 0.7: 中等正相关
- -0.3 ≤ r ≤ 0.3: 弱相关或无相关
- -0.7 ≤ r < -0.3: 中等负相关
- r < -0.7: 强负相关

## 使用示例

```java
@Autowired
private AnalyticsService analyticsService;

// 获取统计摘要
LocalDateTime endTime = LocalDateTime.now();
LocalDateTime startTime = endTime.minusHours(24);
AnalyticsDTO summary = analyticsService.getStatisticsSummary("GH001", startTime, endTime);

// 检测异常
AnalyticsDTO anomalies = analyticsService.detectAnomalies("GH001", startTime, endTime, "medium");

// 获取环境质量评分
Map<String, Object> qualityScore = analyticsService.getEnvironmentQualityScore("GH001", startTime, endTime);
```

## 性能考虑

1. **数据量**: 大数据量时建议使用分页或时间范围限制
2. **缓存**: 可考虑对频繁查询的分析结果进行缓存
3. **异步处理**: 复杂分析可考虑异步处理
4. **数据库优化**: 确保相关字段有适当的索引

## 扩展性

该服务设计具有良好的扩展性，可以轻松添加：
- 新的分析算法
- 更多的统计指标
- 机器学习预测模型
- 自定义异常检测规则
- 更复杂的相关性分析

## 测试

服务包含完整的单元测试和集成测试：
- `AnalyticsServiceTest`: 单元测试
- `AnalyticsServiceIntegrationTest`: 集成测试

测试覆盖了所有主要功能和边界情况。