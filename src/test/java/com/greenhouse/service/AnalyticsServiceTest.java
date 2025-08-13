package com.greenhouse.service;

import com.greenhouse.dto.AnalyticsDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import com.greenhouse.service.impl.AnalyticsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * 数据分析服务测试类
 */
@ExtendWith(MockitoExtension.class)
public class AnalyticsServiceTest {

    @Mock
    private EnvironmentMapper environmentMapper;

    @InjectMocks
    private AnalyticsServiceImpl analyticsService;

    private List<EnvironmentData> testData;
    private String testGreenhouseId = "GH001";
    private LocalDateTime startTime = LocalDateTime.now().minusHours(24);
    private LocalDateTime endTime = LocalDateTime.now();

    @BeforeEach
    void setUp() {
        testData = createTestEnvironmentData();
    }

    @Test
    void testGetStatisticsSummary() {
        // 准备测试数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testData);

        // 执行测试
        AnalyticsDTO result = analyticsService.getStatisticsSummary(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals("summary", result.getAnalysisType());
        assertEquals(testGreenhouseId, result.getGreenhouseId());
        assertNotNull(result.getStatisticsSummary());
        assertEquals(testData.size(), result.getStatisticsSummary().getTotalRecords());

        // 验证温度统计
        AnalyticsDTO.ParameterStats tempStats = result.getStatisticsSummary().getTemperature();
        assertNotNull(tempStats);
        assertTrue(tempStats.getMin().compareTo(BigDecimal.ZERO) >= 0);
        assertTrue(tempStats.getMax().compareTo(tempStats.getMin()) >= 0);
        assertTrue(tempStats.getAvg().compareTo(BigDecimal.ZERO) >= 0);
    }

    @Test
    void testGetStatisticsSummaryWithEmptyData() {
        // 准备空数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(new ArrayList<>());

        // 执行测试
        AnalyticsDTO result = analyticsService.getStatisticsSummary(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals("summary", result.getAnalysisType());
        assertEquals(testGreenhouseId, result.getGreenhouseId());
        assertNull(result.getStatisticsSummary());
    }

    @Test
    void testDetectAnomalies() {
        // 准备测试数据（包含异常值）
        List<EnvironmentData> dataWithAnomalies = createTestDataWithAnomalies();
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(dataWithAnomalies);

        // 执行测试
        AnalyticsDTO result = analyticsService.detectAnomalies(testGreenhouseId, startTime, endTime, "medium");

        // 验证结果
        assertNotNull(result);
        assertEquals("anomaly", result.getAnalysisType());
        assertEquals(testGreenhouseId, result.getGreenhouseId());
        assertNotNull(result.getAnomalies());
        // 应该检测到异常数据
        assertTrue(result.getAnomalies().size() > 0);
    }

    @Test
    void testGetCorrelationAnalysis() {
        // 准备测试数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testData);

        // 执行测试
        AnalyticsDTO result = analyticsService.getCorrelationAnalysis(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals("correlation", result.getAnalysisType());
        assertEquals(testGreenhouseId, result.getGreenhouseId());
        assertNotNull(result.getCorrelations());
        assertTrue(result.getCorrelations().size() > 0);
        
        // 验证相关系数在合理范围内 (-1 到 1)
        for (BigDecimal correlation : result.getCorrelations().values()) {
            assertTrue(correlation.compareTo(BigDecimal.valueOf(-1)) >= 0);
            assertTrue(correlation.compareTo(BigDecimal.valueOf(1)) <= 0);
        }
    }

    @Test
    void testGetEnvironmentQualityScore() {
        // 准备测试数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testData);

        // 执行测试
        Map<String, Object> result = analyticsService.getEnvironmentQualityScore(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.containsKey("score"));
        assertTrue(result.containsKey("grade"));
        assertTrue(result.containsKey("parameterScores"));
        
        // 验证评分在合理范围内
        Double score = (Double) result.get("score");
        assertTrue(score >= 0 && score <= 100);
    }

    @Test
    void testGetDataIntegrityReport() {
        // 准备测试数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testData);

        // 执行测试
        Map<String, Object> result = analyticsService.getDataIntegrityReport(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.containsKey("expectedRecords"));
        assertTrue(result.containsKey("actualRecords"));
        assertTrue(result.containsKey("completeness"));
        assertTrue(result.containsKey("dataQuality"));
        
        // 验证完整性百分比
        Double completeness = (Double) result.get("completeness");
        assertTrue(completeness >= 0 && completeness <= 100);
    }

    @Test
    void testGetParameterDistribution() {
        // 准备测试数据
        when(environmentMapper.selectByTimeRange(eq(testGreenhouseId), any(LocalDateTime.class), any(LocalDateTime.class)))
                .thenReturn(testData);

        // 执行测试
        Map<String, Object> result = analyticsService.getParameterDistribution(testGreenhouseId, startTime, endTime, "temperature");

        // 验证结果
        assertNotNull(result);
        assertEquals("temperature", result.get("parameter"));
        assertTrue(result.containsKey("statistics"));
        assertTrue(result.containsKey("distribution"));
        assertTrue(result.containsKey("totalSamples"));
        
        // 验证分布数据
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> distribution = (List<Map<String, Object>>) result.get("distribution");
        assertNotNull(distribution);
        assertTrue(distribution.size() > 0);
    }

    // 辅助方法：创建测试环境数据
    private List<EnvironmentData> createTestEnvironmentData() {
        List<EnvironmentData> data = new ArrayList<>();
        LocalDateTime baseTime = LocalDateTime.now().minusHours(12);
        
        for (int i = 0; i < 20; i++) {
            EnvironmentData env = new EnvironmentData();
            env.setId(i + 1);
            env.setGreenhouseId(testGreenhouseId);
            env.setTemperature(BigDecimal.valueOf(22.0 + i * 0.5)); // 22.0 到 31.5
            env.setHumidity(BigDecimal.valueOf(65.0 + i * 1.0)); // 65.0 到 84.0
            env.setLightIntensity(BigDecimal.valueOf(30000.0 + i * 1000)); // 30000 到 49000
            env.setSoilHumidity(BigDecimal.valueOf(50.0 + i * 0.8)); // 50.0 到 65.2
            env.setCo2Level(BigDecimal.valueOf(900.0 + i * 10)); // 900 到 1090
            env.setRecordedAt(baseTime.plusMinutes(i * 30));
            data.add(env);
        }
        
        return data;
    }

    // 辅助方法：创建包含异常值的测试数据
    private List<EnvironmentData> createTestDataWithAnomalies() {
        List<EnvironmentData> data = createTestEnvironmentData();
        
        // 添加异常数据点
        EnvironmentData anomaly1 = new EnvironmentData();
        anomaly1.setId(100);
        anomaly1.setGreenhouseId(testGreenhouseId);
        anomaly1.setTemperature(BigDecimal.valueOf(45.0)); // 异常高温
        anomaly1.setHumidity(BigDecimal.valueOf(70.0));
        anomaly1.setLightIntensity(BigDecimal.valueOf(35000.0));
        anomaly1.setSoilHumidity(BigDecimal.valueOf(55.0));
        anomaly1.setCo2Level(BigDecimal.valueOf(950.0));
        anomaly1.setRecordedAt(LocalDateTime.now().minusHours(6));
        data.add(anomaly1);

        EnvironmentData anomaly2 = new EnvironmentData();
        anomaly2.setId(101);
        anomaly2.setGreenhouseId(testGreenhouseId);
        anomaly2.setTemperature(BigDecimal.valueOf(5.0)); // 异常低温
        anomaly2.setHumidity(BigDecimal.valueOf(75.0));
        anomaly2.setLightIntensity(BigDecimal.valueOf(40000.0));
        anomaly2.setSoilHumidity(BigDecimal.valueOf(60.0));
        anomaly2.setCo2Level(BigDecimal.valueOf(1000.0));
        anomaly2.setRecordedAt(LocalDateTime.now().minusHours(3));
        data.add(anomaly2);
        
        return data;
    }
}