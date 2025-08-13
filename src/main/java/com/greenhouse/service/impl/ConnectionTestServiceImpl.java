package com.greenhouse.service.impl;

import com.greenhouse.entity.ConnectionTest;
import com.greenhouse.mapper.ConnectionTestMapper;
import com.greenhouse.service.ConnectionTestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 数据库连接测试服务实现类
 */
@Service
public class ConnectionTestServiceImpl implements ConnectionTestService {

    @Autowired
    private ConnectionTestMapper connectionTestMapper;

    @Override
    public List<ConnectionTest> getAllTests() {
        return connectionTestMapper.selectAllTests();
    }

    @Override
    public boolean addTest(String message) {
        ConnectionTest test = new ConnectionTest(message);
        return connectionTestMapper.insert(test) > 0;
    }

    @Override
    public List<ConnectionTest> getTestsByMessage(String message) {
        return connectionTestMapper.selectByMessage(message);
    }

    @Override
    public boolean deleteTest(Integer id) {
        return connectionTestMapper.deleteById(id) > 0;
    }
}