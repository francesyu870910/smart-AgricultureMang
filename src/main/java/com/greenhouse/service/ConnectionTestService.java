package com.greenhouse.service;

import com.greenhouse.entity.ConnectionTest;

import java.util.List;

/**
 * 数据库连接测试服务接口
 */
public interface ConnectionTestService {

    /**
     * 获取所有测试记录
     */
    List<ConnectionTest> getAllTests();

    /**
     * 添加测试记录
     */
    boolean addTest(String message);

    /**
     * 根据消息查询测试记录
     */
    List<ConnectionTest> getTestsByMessage(String message);

    /**
     * 删除测试记录
     */
    boolean deleteTest(Integer id);
}