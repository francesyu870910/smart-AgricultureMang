package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.greenhouse.entity.SystemConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

/**
 * 系统配置Mapper接口
 * 提供系统配置的基础CRUD操作和查询功能
 */
@Mapper
public interface SystemConfigMapper extends BaseMapper<SystemConfig> {

    /**
     * 根据配置键查询配置
     * @param configKey 配置键
     * @return 系统配置
     */
    @Select("SELECT * FROM system_config WHERE config_key = #{configKey}")
    SystemConfig selectByConfigKey(@Param("configKey") String configKey);

    /**
     * 根据配置键获取配置值
     * @param configKey 配置键
     * @return 配置值
     */
    @Select("SELECT config_value FROM system_config WHERE config_key = #{configKey}")
    String selectValueByKey(@Param("configKey") String configKey);

    /**
     * 更新配置值
     * @param configKey 配置键
     * @param configValue 配置值
     * @return 更新记录数
     */
    @Update("UPDATE system_config SET config_value = #{configValue}, updated_at = NOW() WHERE config_key = #{configKey}")
    int updateValueByKey(@Param("configKey") String configKey, @Param("configValue") String configValue);

    /**
     * 查询所有配置
     * @return 配置列表
     */
    @Select("SELECT * FROM system_config ORDER BY config_key")
    List<SystemConfig> selectAllConfigs();

    /**
     * 根据配置键模糊查询
     * @param keyPattern 配置键模式
     * @return 配置列表
     */
    @Select("SELECT * FROM system_config WHERE config_key LIKE CONCAT('%', #{keyPattern}, '%') ORDER BY config_key")
    List<SystemConfig> selectByKeyPattern(@Param("keyPattern") String keyPattern);

    /**
     * 检查配置键是否存在
     * @param configKey 配置键
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM system_config WHERE config_key = #{configKey}")
    boolean existsByConfigKey(@Param("configKey") String configKey);

    /**
     * 获取配置总数
     * @return 配置总数
     */
    @Select("SELECT COUNT(*) FROM system_config")
    long countAllConfigs();
}