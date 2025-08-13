package com.greenhouse.controller;

import com.greenhouse.service.DatabaseInitService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 数据库初始化控制器
 * 提供数据库表结构创建和测试数据插入的API接口
 */
@RestController
@RequestMapping("/api/database")
public class DatabaseInitController {

    @Autowired
    private DatabaseInitService databaseInitService;

    /**
     * 初始化数据库表结构
     */
    @PostMapping("/init-schema")
    public Map<String, Object> initSchema() {
        Map<String, Object> result = new HashMap<>();
        try {
            databaseInitService.initSchema();
            result.put("success", true);
            result.put("message", "数据库表结构创建成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "数据库表结构创建失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 插入测试数据
     */
    @PostMapping("/init-test-data")
    public Map<String, Object> initTestData() {
        Map<String, Object> result = new HashMap<>();
        try {
            databaseInitService.initTestData();
            result.put("success", true);
            result.put("message", "测试数据插入成功");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "测试数据插入失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 完整初始化数据库
     */
    @PostMapping("/init-all")
    public Map<String, Object> initDatabase() {
        Map<String, Object> result = new HashMap<>();
        try {
            databaseInitService.initDatabase();
            result.put("success", true);
            result.put("message", "数据库初始化完成");
            result.put("status", databaseInitService.getDatabaseStatus());
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "数据库初始化失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 获取数据库状态
     */
    @GetMapping("/status")
    public Map<String, Object> getDatabaseStatus() {
        Map<String, Object> result = new HashMap<>();
        try {
            String status = databaseInitService.getDatabaseStatus();
            result.put("success", true);
            result.put("status", status);
            
            // 添加详细的表信息
            Map<String, Object> tableInfo = new HashMap<>();
            String[] tables = {"environment_data", "device_status", "alert_records", "control_logs", "system_config"};
            
            for (String table : tables) {
                Map<String, Object> info = new HashMap<>();
                info.put("exists", databaseInitService.tableExists(table));
                info.put("count", databaseInitService.getTableCount(table));
                tableInfo.put(table, info);
            }
            
            result.put("tables", tableInfo);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "获取数据库状态失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 检查特定表是否存在
     */
    @GetMapping("/table/{tableName}/exists")
    public Map<String, Object> checkTableExists(@PathVariable String tableName) {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean exists = databaseInitService.tableExists(tableName);
            int count = exists ? databaseInitService.getTableCount(tableName) : 0;
            
            result.put("success", true);
            result.put("tableName", tableName);
            result.put("exists", exists);
            result.put("count", count);
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "检查表状态失败: " + e.getMessage());
        }
        return result;
    }
}