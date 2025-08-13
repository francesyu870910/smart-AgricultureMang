package com.greenhouse.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;

import java.time.LocalDateTime;

/**
 * 数据库连接测试实体类
 */
@TableName("connection_test")
public class ConnectionTest {

    @TableId(type = IdType.AUTO)
    private Integer id;

    private String testMessage;

    private LocalDateTime createdAt;

    // 构造函数
    public ConnectionTest() {}

    public ConnectionTest(String testMessage) {
        this.testMessage = testMessage;
    }

    // Getter和Setter方法
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTestMessage() {
        return testMessage;
    }

    public void setTestMessage(String testMessage) {
        this.testMessage = testMessage;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "ConnectionTest{" +
                "id=" + id +
                ", testMessage='" + testMessage + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}