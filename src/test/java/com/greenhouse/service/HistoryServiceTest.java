package com.greenhouse.service;

import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.HistoryPageDTO;
import com.greenhouse.dto.HistoryQueryDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import com.greenhouse.service.impl.HistoryServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 历史数据服务单元测试
 */
@ExtendWith(MockitoExtension.class)
class HistoryServiceTest {

    @Mock
    private EnvironmentMapper environmentMapper;

    @InjectMocks
    private HistoryServiceImpl historyService;

    private EnvironmentData testData;
    private HistoryQueryDTO queryDTO;

    @BeforeEach
    void setUp() {
        testData = new EnvironmentData();
        testData.setId(1);
        testData.setGreenhouseId("GH001");
        testData.setTemperature(new BigDecimal("25.5"));
        testData.setHumidity(new BigDecimal("60.0"));
        testData.setLightIntensity(new BigDecimal("30000.0"));
        testData.setSoilHumidity(new BigDecimal("55.0"));
        testData.setCo2Level(new BigDecimal("400.0"));
        testData.setRecordedAt(LocalDateTime.now());

        queryDTO = new HistoryQueryDTO();
        queryDTO.setGreenhouseId("GH001");
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(20);
    }

    @Test
    void testQueryHistoryData() {
        // 准备测试数据
        Page<EnvironmentData> mockPage = new Page<>(1, 20);
        mockPage.setRecords(Arrays.asList(testData));
        mockPage.setTotal(1);
        mockPage.setCurrent(1);
        mockPage.setSize(20);

        when(environmentMapper.selectPage(any(Page.class), any(QueryWrapper.class)))
                .thenReturn(mockPage);

        // 执行测试
        HistoryPageDTO<EnvironmentDTO> result = historyService.queryHistoryData(queryDTO);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getTotal());
        assertEquals(1, result.getCurrent());
        assertEquals(20, result.getSize());
        assertEquals(1, result.getRecords().size());
        
        EnvironmentDTO dto = result.getRecords().get(0);
        assertEquals("GH001", dto.getGreenhouseId());
        assertEquals(new BigDecimal("25.5"), dto.getTemperature());
        assertEquals("normal", dto.getTemperatureStatus());

        verify(environmentMapper).selectPage(any(Page.class), any(QueryWrapper.class));
    }

    @Test
    void testQueryHistoryByTimeRange() {
        // 准备测试数据
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();
        List<EnvironmentData> mockData = Arrays.asList(testData);

        when(environmentMapper.selectByTimeRange("GH001", startTime, endTime))
                .thenReturn(mockData);

        // 执行测试
        List<EnvironmentDTO> result = historyService.queryHistoryByTimeRange("GH001", startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("GH001", result.get(0).getGreenhouseId());

        verify(environmentMapper).selectByTimeRange("GH001", startTime, endTime);
    }

    @Test
    void testExportHistoryDataToCsv() {
        // 准备测试数据
        List<EnvironmentData> mockData = Arrays.asList(testData);

        when(environmentMapper.selectList(any(QueryWrapper.class)))
                .thenReturn(mockData);

        // 执行测试
        String csvResult = historyService.exportHistoryDataToCsv(queryDTO);

        // 验证结果
        assertNotNull(csvResult);
        assertTrue(csvResult.contains("ID,温室ID,温度(°C),湿度(%),光照强度(lux),土壤湿度(%),CO2浓度(ppm),记录时间"));
        assertTrue(csvResult.contains("GH001"));
        assertTrue(csvResult.contains("25.5"));

        verify(environmentMapper).selectList(any(QueryWrapper.class));
    }

    @Test
    void testExportHistoryDataToExcel() {
        // 准备测试数据
        List<EnvironmentData> mockData = Arrays.asList(testData);

        when(environmentMapper.selectList(any(QueryWrapper.class)))
                .thenReturn(mockData);

        // 执行测试
        byte[] excelResult = historyService.exportHistoryDataToExcel(queryDTO);

        // 验证结果
        assertNotNull(excelResult);
        assertTrue(excelResult.length > 0);

        verify(environmentMapper).selectList(any(QueryWrapper.class));
    }

    @Test
    void testGetHistoryStatistics() {
        // 准备测试数据
        Map<String, Object> mockStats = new HashMap<>();
        mockStats.put("avg_temperature", 25.5);
        mockStats.put("min_temperature", 20.0);
        mockStats.put("max_temperature", 30.0);
        mockStats.put("total_records", 100L);

        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();

        when(environmentMapper.selectStatisticsByTimeRange("GH001", startTime, endTime))
                .thenReturn(mockStats);

        // 执行测试
        Map<String, Object> result = historyService.getHistoryStatistics("GH001", startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals(25.5, result.get("avg_temperature"));
        assertEquals(100L, result.get("total_records"));

        verify(environmentMapper).selectStatisticsByTimeRange("GH001", startTime, endTime);
    }

    @Test
    void testGetHourlyAverageData() {
        // 准备测试数据
        Map<String, Object> hourlyData = new HashMap<>();
        hourlyData.put("time", "2024-01-01 10:00:00");
        hourlyData.put("avg_temperature", 25.5);
        hourlyData.put("record_count", 60);

        List<Map<String, Object>> mockData = Arrays.asList(hourlyData);
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();

        when(environmentMapper.selectHourlyAverage("GH001", startTime, endTime))
                .thenReturn(mockData);

        // 执行测试
        List<Map<String, Object>> result = historyService.getHourlyAverageData("GH001", startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("2024-01-01 10:00:00", result.get(0).get("time"));
        assertEquals(25.5, result.get(0).get("avg_temperature"));

        verify(environmentMapper).selectHourlyAverage("GH001", startTime, endTime);
    }

    @Test
    void testGetDailyAverageData() {
        // 准备测试数据
        Map<String, Object> dailyData = new HashMap<>();
        dailyData.put("time", "2024-01-01 00:00:00");
        dailyData.put("avg_temperature", 25.5);
        dailyData.put("min_temperature", 20.0);
        dailyData.put("max_temperature", 30.0);

        List<Map<String, Object>> mockData = Arrays.asList(dailyData);
        LocalDateTime startTime = LocalDateTime.now().minusDays(7);
        LocalDateTime endTime = LocalDateTime.now();

        when(environmentMapper.selectDailyAverage("GH001", startTime, endTime))
                .thenReturn(mockData);

        // 执行测试
        List<Map<String, Object>> result = historyService.getDailyAverageData("GH001", startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("2024-01-01 00:00:00", result.get(0).get("time"));
        assertEquals(25.5, result.get(0).get("avg_temperature"));

        verify(environmentMapper).selectDailyAverage("GH001", startTime, endTime);
    }

    @Test
    void testCleanHistoryDataBefore() {
        // 准备测试数据
        LocalDateTime beforeTime = LocalDateTime.now().minusYears(1);
        int expectedDeletedCount = 1000;

        when(environmentMapper.deleteBeforeTime(beforeTime))
                .thenReturn(expectedDeletedCount);

        // 执行测试
        int result = historyService.cleanHistoryDataBefore(beforeTime);

        // 验证结果
        assertEquals(expectedDeletedCount, result);

        verify(environmentMapper).deleteBeforeTime(beforeTime);
    }

    @Test
    void testGetHistoryDataCount() {
        // 准备测试数据
        long expectedCount = 5000L;

        when(environmentMapper.countByGreenhouseId("GH001"))
                .thenReturn(expectedCount);

        // 执行测试
        long result = historyService.getHistoryDataCount("GH001");

        // 验证结果
        assertEquals(expectedCount, result);

        verify(environmentMapper).countByGreenhouseId("GH001");
    }

    @Test
    void testQueryAbnormalHistoryData() {
        // 准备测试数据
        List<EnvironmentData> mockData = Arrays.asList(testData);
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();

        when(environmentMapper.selectTemperatureAbnormal(eq("GH001"), any(BigDecimal.class), 
                any(BigDecimal.class), eq(startTime), eq(endTime)))
                .thenReturn(mockData);

        // 执行测试
        List<EnvironmentDTO> result = historyService.queryAbnormalHistoryData(
                "GH001", "temperature", 15.0, 35.0, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("GH001", result.get(0).getGreenhouseId());

        verify(environmentMapper).selectTemperatureAbnormal(eq("GH001"), any(BigDecimal.class), 
                any(BigDecimal.class), eq(startTime), eq(endTime));
    }

    @Test
    void testQueryAbnormalHistoryDataWithInvalidParameterType() {
        // 执行测试
        List<EnvironmentDTO> result = historyService.queryAbnormalHistoryData(
                "GH001", "invalid_type", 15.0, 35.0, 
                LocalDateTime.now().minusDays(1), LocalDateTime.now());

        // 验证结果
        assertNotNull(result);
        assertEquals(0, result.size());

        // 验证没有调用任何mapper方法
        verifyNoInteractions(environmentMapper);
    }
}