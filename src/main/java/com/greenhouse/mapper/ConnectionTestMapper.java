package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.greenhouse.entity.ConnectionTest;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 数据库连接测试Mapper接口
 */
@Mapper
public interface ConnectionTestMapper extends BaseMapper<ConnectionTest> {

    /**
     * 查询所有测试记录
     */
    @Select("SELECT * FROM connection_test ORDER BY created_at DESC")
    List<ConnectionTest> selectAllTests();

    /**
     * 根据消息内容查询
     */
    @Select("SELECT * FROM connection_test WHERE test_message LIKE CONCAT('%', #{message}, '%')")
    List<ConnectionTest> selectByMessage(String message);
}