package com.greenhouse.controller;

import com.greenhouse.service.DatabaseSetupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 数据库设置控制器
 * 提供数据库创建和设置的API接口
 */
@RestController
@RequestMapping("/api/database-setup")
public class DatabaseSetupController {

    @Autowired
    private DatabaseSetupService databaseSetupService;

    /**
     * 创建数据库
     */
    @PostMapping("/create-database")
    public Map<String, Object> createDatabase() {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = databaseSetupService.createDatabase();
            result.put("success", success);
            result.put("message", success ? "数据库创建成功" : "数据库创建失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "数据库创建失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 检查数据库是否存在
     */
    @GetMapping("/check-database")
    public Map<String, Object> checkDatabase() {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean exists = databaseSetupService.databaseExists();
            result.put("success", true);
            result.put("exists", exists);
            result.put("message", exists ? "数据库已存在" : "数据库不存在");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "检查数据库失败: " + e.getMessage());
        }
        return result;
    }

    /**
     * 完整设置数据库
     */
    @PostMapping("/setup")
    public Map<String, Object> setupDatabase() {
        Map<String, Object> result = new HashMap<>();
        try {
            boolean success = databaseSetupService.setupDatabase();
            result.put("success", success);
            result.put("message", success ? "数据库设置完成" : "数据库设置失败");
        } catch (Exception e) {
            result.put("success", false);
            result.put("message", "数据库设置失败: " + e.getMessage());
        }
        return result;
    }
}