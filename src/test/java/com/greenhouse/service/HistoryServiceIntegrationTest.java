package com.greenhouse.service;

import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.HistoryPageDTO;
import com.greenhouse.dto.HistoryQueryDTO;
import com.greenhouse.entity.EnvironmentData;
import com.greenhouse.mapper.EnvironmentMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 历史数据服务集成测试
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class HistoryServiceIntegrationTest {

    @Autowired
    private HistoryService historyService;

    @Autowired
    private EnvironmentMapper environmentMapper;

    private String testGreenhouseId = "TEST_GH001";

    @BeforeEach
    void setUp() {
        // 清理测试数据
        environmentMapper.delete(null);
        
        // 插入测试数据
        insertTestData();
    }

    private void insertTestData() {
        LocalDateTime baseTime = LocalDateTime.now().minusDays(1);
        
        for (int i = 0; i < 50; i++) {
            EnvironmentData data = new EnvironmentData();
            data.setGreenhouseId(testGreenhouseId);
            data.setTemperature(new BigDecimal(20 + i % 10)); // 20-29度
            data.setHumidity(new BigDecimal(50 + i % 20)); // 50-69%
            data.setLightIntensity(new BigDecimal(20000 + i * 500)); // 20000-44500 lux
            data.setSoilHumidity(new BigDecimal(40 + i % 30)); // 40-69%
            data.setCo2Level(new BigDecimal(350 + i * 5)); // 350-595 ppm
            data.setRecordedAt(baseTime.plusMinutes(i * 30)); // 每30分钟一条记录
            
            environmentMapper.insert(data);
        }
    }

    @Test
    void testQueryHistoryDataWithPagination() {
        // 准备查询条件
        HistoryQueryDTO queryDTO = new HistoryQueryDTO();
        queryDTO.setGreenhouseId(testGreenhouseId);
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(10);

        // 执行查询
        HistoryPageDTO<EnvironmentDTO> result = historyService.queryHistoryData(queryDTO);

        // 验证结果
        assertNotNull(result);
        assertEquals(50, result.getTotal()); // 总共50条记录
        assertEquals(1, result.getCurrent()); // 当前第1页
        assertEquals(10, result.getSize()); // 每页10条
        assertEquals(5, result.getPages()); // 总共5页
        assertEquals(10, result.getRecords().size()); // 当前页10条记录
        assertTrue(result.getHasNext()); // 有下一页
        assertFalse(result.getHasPrevious()); // 没有上一页

        // 验证数据内容
        EnvironmentDTO firstRecord = result.getRecords().get(0);
        assertEquals(testGreenhouseId, firstRecord.getGreenhouseId());
        assertNotNull(firstRecord.getTemperature());
        assertNotNull(firstRecord.getRecordedAt());
    }

    @Test
    void testQueryHistoryByTimeRange() {
        // 准备时间范围
        LocalDateTime startTime = LocalDateTime.now().minusDays(2);
        LocalDateTime endTime = LocalDateTime.now().plusHours(1);

        // 执行查询
        List<EnvironmentDTO> result = historyService.queryHistoryByTimeRange(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.size() >= 48); // 至少应该有48条记录
        
        // 验证时间范围
        for (EnvironmentDTO dto : result) {
            assertTrue(dto.getRecordedAt().isAfter(startTime) || dto.getRecordedAt().isEqual(startTime));
            assertTrue(dto.getRecordedAt().isBefore(endTime) || dto.getRecordedAt().isEqual(endTime));
        }
    }

    @Test
    void testQueryHistoryDataWithFilters() {
        // 准备查询条件（查询温度在25-30度之间的记录）
        HistoryQueryDTO queryDTO = new HistoryQueryDTO();
        queryDTO.setGreenhouseId(testGreenhouseId);
        queryDTO.setParameterType("temperature");
        queryDTO.setMinValue(new BigDecimal("25"));
        queryDTO.setMaxValue(new BigDecimal("30"));
        queryDTO.setPageNum(1);
        queryDTO.setPageSize(20);

        // 执行查询
        HistoryPageDTO<EnvironmentDTO> result = historyService.queryHistoryData(queryDTO);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.getTotal() > 0);
        
        // 验证所有记录都在指定温度范围内
        for (EnvironmentDTO dto : result.getRecords()) {
            assertTrue(dto.getTemperature().compareTo(new BigDecimal("25")) >= 0);
            assertTrue(dto.getTemperature().compareTo(new BigDecimal("30")) <= 0);
        }
    }

    @Test
    void testExportHistoryDataToCsv() {
        // 准备查询条件
        HistoryQueryDTO queryDTO = new HistoryQueryDTO();
        queryDTO.setGreenhouseId(testGreenhouseId);

        // 执行导出
        String csvResult = historyService.exportHistoryDataToCsv(queryDTO);

        // 验证结果
        assertNotNull(csvResult);
        assertTrue(csvResult.contains("ID,温室ID,温度(°C),湿度(%),光照强度(lux),土壤湿度(%),CO2浓度(ppm),记录时间"));
        assertTrue(csvResult.contains(testGreenhouseId));
        
        // 验证CSV行数（标题行 + 数据行）
        String[] lines = csvResult.split("\n");
        assertEquals(51, lines.length); // 1行标题 + 50行数据
    }

    @Test
    void testGetHistoryStatistics() {
        // 准备时间范围
        LocalDateTime startTime = LocalDateTime.now().minusDays(2);
        LocalDateTime endTime = LocalDateTime.now().plusHours(1);

        // 执行统计查询
        Map<String, Object> result = historyService.getHistoryStatistics(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertNotNull(result.get("avg_temperature"));
        assertNotNull(result.get("min_temperature"));
        assertNotNull(result.get("max_temperature"));
        assertNotNull(result.get("total_records"));
        
        // 验证记录数（至少应该有48条记录）
        assertTrue(((Number) result.get("total_records")).longValue() >= 48);
    }

    @Test
    void testGetHourlyAverageData() {
        // 准备时间范围
        LocalDateTime startTime = LocalDateTime.now().minusDays(2);
        LocalDateTime endTime = LocalDateTime.now().plusHours(1);

        // 执行查询
        List<Map<String, Object>> result = historyService.getHourlyAverageData(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.size() > 0);
        
        // 验证数据结构
        if (!result.isEmpty()) {
            Map<String, Object> firstHour = result.get(0);
            assertNotNull(firstHour.get("time"));
            assertNotNull(firstHour.get("avg_temperature"));
            assertNotNull(firstHour.get("record_count"));
        }
    }

    @Test
    void testGetDailyAverageData() {
        // 准备时间范围
        LocalDateTime startTime = LocalDateTime.now().minusDays(2);
        LocalDateTime endTime = LocalDateTime.now().plusHours(1);

        // 执行查询
        List<Map<String, Object>> result = historyService.getDailyAverageData(testGreenhouseId, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.size() > 0);
        
        // 验证数据结构
        if (!result.isEmpty()) {
            Map<String, Object> firstDay = result.get(0);
            assertNotNull(firstDay.get("time"));
            assertNotNull(firstDay.get("avg_temperature"));
            assertNotNull(firstDay.get("min_temperature"));
            assertNotNull(firstDay.get("max_temperature"));
            assertNotNull(firstDay.get("record_count"));
        }
    }

    @Test
    void testGetHistoryDataCount() {
        // 执行查询
        long result = historyService.getHistoryDataCount(testGreenhouseId);

        // 验证结果
        assertEquals(50L, result);
    }

    @Test
    void testQueryAbnormalHistoryData() {
        // 查询温度异常数据（低于22度或高于27度）
        LocalDateTime startTime = LocalDateTime.now().minusDays(1);
        LocalDateTime endTime = LocalDateTime.now();

        List<EnvironmentDTO> result = historyService.queryAbnormalHistoryData(
                testGreenhouseId, "temperature", 22.0, 27.0, startTime, endTime);

        // 验证结果
        assertNotNull(result);
        
        // 验证所有记录都是异常数据
        for (EnvironmentDTO dto : result) {
            double temp = dto.getTemperature().doubleValue();
            assertTrue(temp < 22.0 || temp > 27.0);
        }
    }

    @Test
    void testCleanHistoryDataBefore() {
        // 插入一些旧数据
        LocalDateTime oldTime = LocalDateTime.now().minusYears(2);
        EnvironmentData oldData = new EnvironmentData();
        oldData.setGreenhouseId(testGreenhouseId);
        oldData.setTemperature(new BigDecimal("20.0"));
        oldData.setHumidity(new BigDecimal("50.0"));
        oldData.setLightIntensity(new BigDecimal("20000.0"));
        oldData.setSoilHumidity(new BigDecimal("40.0"));
        oldData.setCo2Level(new BigDecimal("350.0"));
        oldData.setRecordedAt(oldTime);
        environmentMapper.insert(oldData);

        // 执行清理
        LocalDateTime cleanupTime = LocalDateTime.now().minusYears(1);
        int deletedCount = historyService.cleanHistoryDataBefore(cleanupTime);

        // 验证结果
        assertEquals(1, deletedCount); // 应该删除1条旧记录
        
        // 验证剩余数据数量
        long remainingCount = historyService.getHistoryDataCount(testGreenhouseId);
        assertEquals(50L, remainingCount); // 原来的50条记录应该还在
    }
}