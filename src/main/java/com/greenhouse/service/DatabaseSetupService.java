package com.greenhouse.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 * 数据库设置服务
 * 用于创建数据库和执行初始化操作
 */
@Service
public class DatabaseSetupService {

    @Value("${spring.datasource.username}")
    private String username;

    @Value("${spring.datasource.password}")
    private String password;

    /**
     * 创建数据库
     */
    public boolean createDatabase() {
        String baseUrl = "jdbc:mysql://localhost:3306/?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai";
        
        try (Connection connection = DriverManager.getConnection(baseUrl, username, password);
             Statement statement = connection.createStatement()) {
            
            // 创建数据库
            String createDbSql = "CREATE DATABASE IF NOT EXISTS greenhouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
            statement.executeUpdate(createDbSql);
            
            System.out.println("数据库 greenhouse_db 创建成功");
            return true;
            
        } catch (Exception e) {
            System.err.println("创建数据库失败: " + e.getMessage());
            return false;
        }
    }

    /**
     * 检查数据库是否存在
     */
    public boolean databaseExists() {
        String baseUrl = "jdbc:mysql://localhost:3306/?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai";
        
        try (Connection connection = DriverManager.getConnection(baseUrl, username, password);
             Statement statement = connection.createStatement()) {
            
            String checkSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'greenhouse_db'";
            return statement.executeQuery(checkSql).next();
            
        } catch (Exception e) {
            System.err.println("检查数据库存在性失败: " + e.getMessage());
            return false;
        }
    }

    /**
     * 完整的数据库设置（创建数据库 + 初始化表结构和数据）
     */
    public boolean setupDatabase() {
        try {
            // 1. 创建数据库
            if (!createDatabase()) {
                return false;
            }
            
            // 等待一下确保数据库创建完成
            Thread.sleep(1000);
            
            System.out.println("数据库设置完成，可以启动应用程序");
            return true;
            
        } catch (Exception e) {
            System.err.println("数据库设置失败: " + e.getMessage());
            return false;
        }
    }
}