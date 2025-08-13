package com.greenhouse.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.Statement;

/**
 * 数据库创建工具
 * 独立运行的工具类，用于创建greenhouse_db数据库
 */
public class DatabaseCreator {

    private static final String BASE_URL = "jdbc:mysql://localhost:3306/?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai";
    private static final String USERNAME = "root";
    private static final String PASSWORD = "123456";

    public static void main(String[] args) {
        System.out.println("开始创建数据库...");
        
        try {
            // 加载MySQL驱动
            Class.forName("com.mysql.cj.jdbc.Driver");
            
            // 连接到MySQL服务器
            try (Connection connection = DriverManager.getConnection(BASE_URL, USERNAME, PASSWORD);
                 Statement statement = connection.createStatement()) {
                
                // 创建数据库
                String createDbSql = "CREATE DATABASE IF NOT EXISTS greenhouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
                statement.executeUpdate(createDbSql);
                System.out.println("✓ 数据库 greenhouse_db 创建成功");
                
                // 验证数据库是否创建成功
                String checkSql = "SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = 'greenhouse_db'";
                if (statement.executeQuery(checkSql).next()) {
                    System.out.println("✓ 数据库验证成功");
                } else {
                    System.out.println("✗ 数据库验证失败");
                }
                
            }
            
        } catch (Exception e) {
            System.err.println("✗ 创建数据库失败: " + e.getMessage());
            e.printStackTrace();
            System.exit(1);
        }
        
        System.out.println("数据库创建完成，现在可以启动Spring Boot应用程序");
    }
}