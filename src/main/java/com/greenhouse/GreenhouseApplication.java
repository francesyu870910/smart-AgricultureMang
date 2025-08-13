package com.greenhouse;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 温室数字化监控系统启动类
 */
@SpringBootApplication
@EnableScheduling
@MapperScan("com.greenhouse.mapper")
public class GreenhouseApplication {

    public static void main(String[] args) {
        SpringApplication.run(GreenhouseApplication.class, args);
        System.out.println("温室数字化监控系统启动成功！");
    }
}