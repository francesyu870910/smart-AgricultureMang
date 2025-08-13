package com.greenhouse.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;

/**
 * 数据库初始化服务
 * 用于执行数据库表结构创建和测试数据插入
 */
@Service
public class DatabaseInitService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * 初始化数据库表结构
     */
    public void initSchema() {
        try {
            String schemaSql = loadSqlFile("sql/schema.sql");
            executeSqlScript(schemaSql);
            System.out.println("数据库表结构创建成功");
        } catch (Exception e) {
            System.err.println("数据库表结构创建失败: " + e.getMessage());
            throw new RuntimeException("数据库表结构创建失败", e);
        }
    }

    /**
     * 插入测试数据
     */
    public void initTestData() {
        try {
            String testDataSql = loadSqlFile("sql/test-data.sql");
            executeSqlScript(testDataSql);
            System.out.println("测试数据插入成功");
        } catch (Exception e) {
            System.err.println("测试数据插入失败: " + e.getMessage());
            throw new RuntimeException("测试数据插入失败", e);
        }
    }

    /**
     * 完整初始化数据库（表结构 + 测试数据）
     */
    public void initDatabase() {
        initSchema();
        initTestData();
        System.out.println("数据库初始化完成");
    }

    /**
     * 检查表是否存在
     */
    public boolean tableExists(String tableName) {
        try {
            String sql = "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'greenhouse_db' AND table_name = ?";
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class, tableName);
            return count != null && count > 0;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * 获取表记录数
     */
    public int getTableCount(String tableName) {
        try {
            String sql = "SELECT COUNT(*) FROM " + tableName;
            Integer count = jdbcTemplate.queryForObject(sql, Integer.class);
            return count != null ? count : 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * 获取数据库状态信息
     */
    public String getDatabaseStatus() {
        StringBuilder status = new StringBuilder();
        status.append("数据库状态检查:\n");
        
        String[] tables = {"environment_data", "device_status", "alert_records", "control_logs", "system_config"};
        
        for (String table : tables) {
            boolean exists = tableExists(table);
            int count = exists ? getTableCount(table) : 0;
            status.append(String.format("- %s: %s (记录数: %d)\n", 
                table, exists ? "存在" : "不存在", count));
        }
        
        return status.toString();
    }

    /**
     * 加载SQL文件内容
     */
    private String loadSqlFile(String filePath) throws IOException {
        ClassPathResource resource = new ClassPathResource(filePath);
        try (InputStreamReader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
            return FileCopyUtils.copyToString(reader);
        }
    }

    /**
     * 执行SQL脚本
     */
    private void executeSqlScript(String sqlScript) {
        // 按分号分割SQL语句
        String[] statements = sqlScript.split(";");
        
        for (String statement : statements) {
            String trimmedStatement = statement.trim();
            
            // 跳过空语句和注释
            if (trimmedStatement.isEmpty() || 
                trimmedStatement.startsWith("--") || 
                trimmedStatement.startsWith("/*") ||
                trimmedStatement.toLowerCase().startsWith("use ")) {
                continue;
            }
            
            try {
                jdbcTemplate.execute(trimmedStatement);
            } catch (Exception e) {
                System.err.println("执行SQL语句失败: " + trimmedStatement);
                System.err.println("错误信息: " + e.getMessage());
                // 继续执行其他语句，不中断整个过程
            }
        }
    }
}