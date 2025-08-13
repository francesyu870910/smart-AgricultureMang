package com.greenhouse.controller;

import com.greenhouse.common.Result;
import com.greenhouse.dto.EnvironmentDTO;
import com.greenhouse.dto.HistoryPageDTO;
import com.greenhouse.dto.HistoryQueryDTO;
import com.greenhouse.service.HistoryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * 历史数据控制器
 * 提供历史数据查询、数据导出等API接口
 * 
 * 支持的需求：
 * - 需求8（历史记录）：历史数据查询、导出、分页功能
 */
@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    private static final Logger logger = LoggerFactory.getLogger(HistoryController.class);

    @Autowired
    private HistoryService historyService;

    // ==================== 历史数据查询接口 ====================

    /**
     * 分页查询历史环境数据
     * POST /api/history/query
     */
    @PostMapping("/query")
    public Result<HistoryPageDTO<EnvironmentDTO>> queryHistoryData(@RequestBody HistoryQueryDTO queryDTO) {
        try {
            logger.info("分页查询历史环境数据，查询条件：{}", queryDTO);
            
            // 参数验证
            if (queryDTO == null) {
                return Result.error(400, "查询条件不能为空");
            }
            
            // 验证分页参数
            if (queryDTO.getPageNum() == null || queryDTO.getPageNum() < 1) {
                queryDTO.setPageNum(1);
            }
            if (queryDTO.getPageSize() == null || queryDTO.getPageSize() < 1 || queryDTO.getPageSize() > 1000) {
                queryDTO.setPageSize(20);
            }
            
            // 验证时间范围
            if (queryDTO.getStartTime() != null && queryDTO.getEndTime() != null) {
                if (queryDTO.getStartTime().isAfter(queryDTO.getEndTime())) {
                    return Result.error(400, "开始时间不能晚于结束时间");
                }
            }
            
            HistoryPageDTO<EnvironmentDTO> result = historyService.queryHistoryData(queryDTO);
            logger.info("成功分页查询历史环境数据，总数：{}，当前页：{}", result.getTotal(), result.getCurrent());
            return Result.success("查询历史数据成功", result);
        } catch (Exception e) {
            logger.error("分页查询历史环境数据失败", e);
            return Result.error("查询历史数据失败：" + e.getMessage());
        }
    }

    /**
     * 根据时间范围查询历史数据
     * GET /api/history/time-range?greenhouseId=GH001&startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/time-range")
    public Result<List<EnvironmentDTO>> queryHistoryByTimeRange(
            @RequestParam String greenhouseId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("根据时间范围查询历史数据，温室ID：{}，开始时间：{}，结束时间：{}", 
                    greenhouseId, startTime, endTime);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<EnvironmentDTO> result = historyService.queryHistoryByTimeRange(greenhouseId, startTime, endTime);
            logger.info("成功查询时间范围内的历史数据，数量：{}", result.size());
            return Result.success("查询历史数据成功", result);
        } catch (Exception e) {
            logger.error("根据时间范围查询历史数据失败", e);
            return Result.error("查询历史数据失败：" + e.getMessage());
        }
    }

    /**
     * 查询异常历史数据
     * GET /api/history/abnormal?greenhouseId=GH001&parameterType=temperature&minValue=10&maxValue=35&startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/abnormal")
    public Result<List<EnvironmentDTO>> queryAbnormalHistoryData(
            @RequestParam String greenhouseId,
            @RequestParam String parameterType,
            @RequestParam(required = false) Double minValue,
            @RequestParam(required = false) Double maxValue,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("查询异常历史数据，温室ID：{}，参数类型：{}，最小值：{}，最大值：{}，开始时间：{}，结束时间：{}", 
                    greenhouseId, parameterType, minValue, maxValue, startTime, endTime);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            if (parameterType == null || parameterType.trim().isEmpty()) {
                return Result.error(400, "参数类型不能为空");
            }
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            // 验证参数类型
            List<String> validParameterTypes = List.of("temperature", "humidity", "light_intensity", "soil_humidity", "co2_level");
            if (!validParameterTypes.contains(parameterType.toLowerCase())) {
                return Result.error(400, "无效的参数类型：" + parameterType);
            }
            
            List<EnvironmentDTO> result = historyService.queryAbnormalHistoryData(
                    greenhouseId, parameterType, minValue, maxValue, startTime, endTime);
            logger.info("成功查询异常历史数据，数量：{}", result.size());
            return Result.success("查询异常历史数据成功", result);
        } catch (Exception e) {
            logger.error("查询异常历史数据失败", e);
            return Result.error("查询异常历史数据失败：" + e.getMessage());
        }
    }

    // ==================== 历史数据统计接口 ====================

    /**
     * 获取历史数据统计信息
     * GET /api/history/statistics?greenhouseId=GH001&startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/statistics")
    public Result<Map<String, Object>> getHistoryStatistics(
            @RequestParam String greenhouseId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取历史数据统计信息，温室ID：{}，开始时间：{}，结束时间：{}", 
                    greenhouseId, startTime, endTime);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            Map<String, Object> statistics = historyService.getHistoryStatistics(greenhouseId, startTime, endTime);
            logger.info("成功获取历史数据统计信息");
            return Result.success("获取历史数据统计成功", statistics);
        } catch (Exception e) {
            logger.error("获取历史数据统计信息失败", e);
            return Result.error("获取历史数据统计失败：" + e.getMessage());
        }
    }

    /**
     * 获取每小时平均数据
     * GET /api/history/hourly-average?greenhouseId=GH001&startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/hourly-average")
    public Result<List<Map<String, Object>>> getHourlyAverageData(
            @RequestParam String greenhouseId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取每小时平均数据，温室ID：{}，开始时间：{}，结束时间：{}", 
                    greenhouseId, startTime, endTime);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> result = historyService.getHourlyAverageData(greenhouseId, startTime, endTime);
            logger.info("成功获取每小时平均数据，数量：{}", result.size());
            return Result.success("获取每小时平均数据成功", result);
        } catch (Exception e) {
            logger.error("获取每小时平均数据失败", e);
            return Result.error("获取每小时平均数据失败：" + e.getMessage());
        }
    }

    /**
     * 获取每日平均数据
     * GET /api/history/daily-average?greenhouseId=GH001&startTime=2024-01-01 00:00:00&endTime=2024-01-31 23:59:59
     */
    @GetMapping("/daily-average")
    public Result<List<Map<String, Object>>> getDailyAverageData(
            @RequestParam String greenhouseId,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endTime) {
        try {
            logger.info("获取每日平均数据，温室ID：{}，开始时间：{}，结束时间：{}", 
                    greenhouseId, startTime, endTime);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            if (startTime == null || endTime == null) {
                return Result.error(400, "开始时间和结束时间不能为空");
            }
            if (startTime.isAfter(endTime)) {
                return Result.error(400, "开始时间不能晚于结束时间");
            }
            
            List<Map<String, Object>> result = historyService.getDailyAverageData(greenhouseId, startTime, endTime);
            logger.info("成功获取每日平均数据，数量：{}", result.size());
            return Result.success("获取每日平均数据成功", result);
        } catch (Exception e) {
            logger.error("获取每日平均数据失败", e);
            return Result.error("获取每日平均数据失败：" + e.getMessage());
        }
    }

    // ==================== 数据导出接口 ====================

    /**
     * 导出历史数据为CSV格式
     * POST /api/history/export/csv
     */
    @PostMapping("/export/csv")
    public ResponseEntity<String> exportHistoryDataToCsv(@RequestBody HistoryQueryDTO queryDTO) {
        try {
            logger.info("导出历史数据为CSV格式，查询条件：{}", queryDTO);
            
            // 参数验证
            if (queryDTO == null) {
                return ResponseEntity.badRequest()
                        .body("查询条件不能为空");
            }
            
            // 验证时间范围
            if (queryDTO.getStartTime() != null && queryDTO.getEndTime() != null) {
                if (queryDTO.getStartTime().isAfter(queryDTO.getEndTime())) {
                    return ResponseEntity.badRequest()
                            .body("开始时间不能晚于结束时间");
                }
            }
            
            String csvData = historyService.exportHistoryDataToCsv(queryDTO);
            
            // 生成文件名
            String filename = "history_data_" + System.currentTimeMillis() + ".csv";
            
            logger.info("成功导出历史数据为CSV格式，文件名：{}", filename);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .header(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8")
                    .body(csvData);
        } catch (Exception e) {
            logger.error("导出历史数据为CSV格式失败", e);
            return ResponseEntity.internalServerError()
                    .body("导出CSV数据失败：" + e.getMessage());
        }
    }

    /**
     * 导出历史数据为Excel格式
     * POST /api/history/export/excel
     */
    @PostMapping("/export/excel")
    public ResponseEntity<byte[]> exportHistoryDataToExcel(@RequestBody HistoryQueryDTO queryDTO) {
        try {
            logger.info("导出历史数据为Excel格式，查询条件：{}", queryDTO);
            
            // 参数验证
            if (queryDTO == null) {
                return ResponseEntity.badRequest()
                        .body("查询条件不能为空".getBytes());
            }
            
            // 验证时间范围
            if (queryDTO.getStartTime() != null && queryDTO.getEndTime() != null) {
                if (queryDTO.getStartTime().isAfter(queryDTO.getEndTime())) {
                    return ResponseEntity.badRequest()
                            .body("开始时间不能晚于结束时间".getBytes());
                }
            }
            
            byte[] excelData = historyService.exportHistoryDataToExcel(queryDTO);
            
            // 生成文件名
            String filename = "history_data_" + System.currentTimeMillis() + ".xlsx";
            
            logger.info("成功导出历史数据为Excel格式，文件名：{}", filename);
            
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(excelData);
        } catch (Exception e) {
            logger.error("导出历史数据为Excel格式失败", e);
            return ResponseEntity.internalServerError()
                    .body(("导出Excel数据失败：" + e.getMessage()).getBytes());
        }
    }

    // ==================== 数据管理接口 ====================

    /**
     * 获取历史数据记录总数
     * GET /api/history/count?greenhouseId=GH001
     */
    @GetMapping("/count")
    public Result<Long> getHistoryDataCount(@RequestParam String greenhouseId) {
        try {
            logger.info("获取历史数据记录总数，温室ID：{}", greenhouseId);
            
            // 参数验证
            if (greenhouseId == null || greenhouseId.trim().isEmpty()) {
                return Result.error(400, "温室ID不能为空");
            }
            
            long count = historyService.getHistoryDataCount(greenhouseId);
            logger.info("成功获取历史数据记录总数：{}", count);
            return Result.success("获取历史数据记录总数成功", count);
        } catch (Exception e) {
            logger.error("获取历史数据记录总数失败", e);
            return Result.error("获取历史数据记录总数失败：" + e.getMessage());
        }
    }

    /**
     * 清理历史数据
     * DELETE /api/history/cleanup?beforeDays=365
     */
    @DeleteMapping("/cleanup")
    public Result<Integer> cleanHistoryData(@RequestParam(defaultValue = "365") int beforeDays) {
        try {
            logger.info("清理{}天前的历史数据", beforeDays);
            
            // 参数验证
            if (beforeDays < 30) {
                return Result.error(400, "为保证数据安全，只能清理30天前的数据");
            }
            
            LocalDateTime beforeTime = LocalDateTime.now().minusDays(beforeDays);
            int cleanedCount = historyService.cleanHistoryDataBefore(beforeTime);
            
            logger.info("成功清理历史数据，清理数量：{}", cleanedCount);
            return Result.success("清理历史数据成功", cleanedCount);
        } catch (Exception e) {
            logger.error("清理历史数据失败", e);
            return Result.error("清理历史数据失败：" + e.getMessage());
        }
    }

    /**
     * 压缩历史数据
     * POST /api/history/compress?beforeDays=90
     */
    @PostMapping("/compress")
    public Result<Integer> compressHistoryData(@RequestParam(defaultValue = "90") int beforeDays) {
        try {
            logger.info("压缩{}天前的历史数据", beforeDays);
            
            // 参数验证
            if (beforeDays < 7) {
                return Result.error(400, "为保证数据完整性，只能压缩7天前的数据");
            }
            
            LocalDateTime beforeTime = LocalDateTime.now().minusDays(beforeDays);
            int compressedCount = historyService.compressHistoryData(beforeTime);
            
            logger.info("成功压缩历史数据，压缩数量：{}", compressedCount);
            return Result.success("压缩历史数据成功", compressedCount);
        } catch (Exception e) {
            logger.error("压缩历史数据失败", e);
            return Result.error("压缩历史数据失败：" + e.getMessage());
        }
    }

    // ==================== 数据格式转换接口 ====================

    /**
     * 获取支持的参数类型列表
     * GET /api/history/parameter-types
     */
    @GetMapping("/parameter-types")
    public Result<List<Map<String, String>>> getParameterTypes() {
        try {
            logger.info("获取支持的参数类型列表");
            
            List<Map<String, String>> parameterTypes = List.of(
                    Map.of("code", "temperature", "description", "温度", "unit", "°C"),
                    Map.of("code", "humidity", "description", "空气湿度", "unit", "%"),
                    Map.of("code", "light_intensity", "description", "光照强度", "unit", "lux"),
                    Map.of("code", "soil_humidity", "description", "土壤湿度", "unit", "%"),
                    Map.of("code", "co2_level", "description", "CO2浓度", "unit", "ppm")
            );
            
            logger.info("成功获取参数类型列表");
            return Result.success("获取参数类型列表成功", parameterTypes);
        } catch (Exception e) {
            logger.error("获取参数类型列表失败", e);
            return Result.error("获取参数类型列表失败：" + e.getMessage());
        }
    }

    /**
     * 获取支持的排序字段列表
     * GET /api/history/sort-fields
     */
    @GetMapping("/sort-fields")
    public Result<List<Map<String, String>>> getSortFields() {
        try {
            logger.info("获取支持的排序字段列表");
            
            List<Map<String, String>> sortFields = List.of(
                    Map.of("code", "recorded_at", "description", "记录时间"),
                    Map.of("code", "temperature", "description", "温度"),
                    Map.of("code", "humidity", "description", "空气湿度"),
                    Map.of("code", "light_intensity", "description", "光照强度"),
                    Map.of("code", "soil_humidity", "description", "土壤湿度"),
                    Map.of("code", "co2_level", "description", "CO2浓度")
            );
            
            logger.info("成功获取排序字段列表");
            return Result.success("获取排序字段列表成功", sortFields);
        } catch (Exception e) {
            logger.error("获取排序字段列表失败", e);
            return Result.error("获取排序字段列表失败：" + e.getMessage());
        }
    }
}