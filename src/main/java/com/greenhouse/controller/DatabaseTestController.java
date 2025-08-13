package com.greenhouse.controller;

import com.greenhouse.entity.ConnectionTest;
import com.greenhouse.service.ConnectionTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 数据库连接测试控制器
 */
@RestController
@RequestMapping("/api/database")
public class DatabaseTestController {

    @Autowired
    private DataSource dataSource;

    @Autowired
    private ConnectionTestService connectionTestService;

    /**
     * 测试数据库连接
     */
    @GetMapping("/test")
    public Map<String, Object> testConnection() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            result.put("status", "SUCCESS");
            result.put("message", "数据库连接成功");
            result.put("database", connection.getCatalog());
            result.put("url", connection.getMetaData().getURL());
            result.put("driver", connection.getMetaData().getDriverName());
            result.put("timestamp", LocalDateTime.now());
        } catch (SQLException e) {
            result.put("status", "FAILED");
            result.put("message", "数据库连接失败: " + e.getMessage());
            result.put("timestamp", LocalDateTime.now());
        }
        
        return result;
    }

    /**
     * 获取数据源信息
     */
    @GetMapping("/info")
    public Map<String, Object> getDataSourceInfo() {
        Map<String, Object> result = new HashMap<>();
        
        try (Connection connection = dataSource.getConnection()) {
            result.put("dataSourceClass", dataSource.getClass().getSimpleName());
            result.put("autoCommit", connection.getAutoCommit());
            result.put("readOnly", connection.isReadOnly());
            result.put("transactionIsolation", connection.getTransactionIsolation());
            result.put("timestamp", LocalDateTime.now());
        } catch (SQLException e) {
            result.put("error", "获取数据源信息失败: " + e.getMessage());
            result.put("timestamp", LocalDateTime.now());
        }
        
        return result;
    }

    /**
     * 测试MyBatis-Plus功能
     */
    @GetMapping("/mybatis-test")
    public Map<String, Object> testMyBatisPlus() {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // 查询所有测试记录
            List<ConnectionTest> tests = connectionTestService.getAllTests();
            
            result.put("status", "SUCCESS");
            result.put("message", "MyBatis-Plus测试成功");
            result.put("recordCount", tests.size());
            result.put("records", tests);
            result.put("timestamp", LocalDateTime.now());
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("message", "MyBatis-Plus测试失败: " + e.getMessage());
            result.put("timestamp", LocalDateTime.now());
        }
        
        return result;
    }

    /**
     * 添加测试记录
     */
    @PostMapping("/add-test")
    public Map<String, Object> addTestRecord(@RequestParam String message) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            boolean success = connectionTestService.addTest(message);
            
            if (success) {
                result.put("status", "SUCCESS");
                result.put("message", "测试记录添加成功");
            } else {
                result.put("status", "FAILED");
                result.put("message", "测试记录添加失败");
            }
            result.put("timestamp", LocalDateTime.now());
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("message", "添加测试记录时发生错误: " + e.getMessage());
            result.put("timestamp", LocalDateTime.now());
        }
        
        return result;
    }

    /**
     * 根据消息查询测试记录
     */
    @GetMapping("/search")
    public Map<String, Object> searchTestRecords(@RequestParam String message) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            List<ConnectionTest> tests = connectionTestService.getTestsByMessage(message);
            
            result.put("status", "SUCCESS");
            result.put("message", "查询成功");
            result.put("recordCount", tests.size());
            result.put("records", tests);
            result.put("timestamp", LocalDateTime.now());
        } catch (Exception e) {
            result.put("status", "FAILED");
            result.put("message", "查询失败: " + e.getMessage());
            result.put("timestamp", LocalDateTime.now());
        }
        
        return result;
    }
}