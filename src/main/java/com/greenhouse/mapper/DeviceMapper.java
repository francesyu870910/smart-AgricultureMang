package com.greenhouse.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.greenhouse.entity.DeviceStatus;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * 设备状态Mapper接口
 * 提供设备状态的基础CRUD操作和复杂查询功能
 */
@Mapper
public interface DeviceMapper extends BaseMapper<DeviceStatus> {

    /**
     * 根据设备ID查询设备状态
     * @param deviceId 设备ID
     * @return 设备状态
     */
    @Select("SELECT * FROM device_status WHERE device_id = #{deviceId}")
    DeviceStatus selectByDeviceId(@Param("deviceId") String deviceId);

    /**
     * 根据设备类型查询设备列表
     * @param deviceType 设备类型
     * @return 设备列表
     */
    List<DeviceStatus> selectByDeviceType(@Param("deviceType") DeviceStatus.DeviceType deviceType);

    /**
     * 根据设备状态查询设备列表
     * @param status 设备状态
     * @return 设备列表
     */
    List<DeviceStatus> selectByStatus(@Param("status") DeviceStatus.DeviceStatusEnum status);

    /**
     * 查询正在运行的设备列表
     * @return 运行中的设备列表
     */
    @Select("SELECT * FROM device_status WHERE is_running = true ORDER BY updated_at DESC")
    List<DeviceStatus> selectRunningDevices();

    /**
     * 查询离线设备列表
     * @return 离线设备列表
     */
    @Select("SELECT * FROM device_status WHERE status = 'offline' ORDER BY updated_at DESC")
    List<DeviceStatus> selectOfflineDevices();

    /**
     * 查询故障设备列表
     * @return 故障设备列表
     */
    @Select("SELECT * FROM device_status WHERE status = 'error' ORDER BY updated_at DESC")
    List<DeviceStatus> selectErrorDevices();

    /**
     * 更新设备运行状态
     * @param deviceId 设备ID
     * @param isRunning 是否运行
     * @param powerLevel 功率级别
     * @return 更新记录数
     */
    @Update("UPDATE device_status SET is_running = #{isRunning}, power_level = #{powerLevel}, updated_at = NOW() WHERE device_id = #{deviceId}")
    int updateRunningStatus(@Param("deviceId") String deviceId,
                           @Param("isRunning") Boolean isRunning,
                           @Param("powerLevel") BigDecimal powerLevel);

    /**
     * 更新设备状态
     * @param deviceId 设备ID
     * @param status 设备状态
     * @return 更新记录数
     */
    @Update("UPDATE device_status SET status = #{status}, updated_at = NOW() WHERE device_id = #{deviceId}")
    int updateDeviceStatus(@Param("deviceId") String deviceId,
                          @Param("status") DeviceStatus.DeviceStatusEnum status);

    /**
     * 更新设备维护时间
     * @param deviceId 设备ID
     * @param maintenanceDate 维护日期
     * @return 更新记录数
     */
    @Update("UPDATE device_status SET last_maintenance = #{maintenanceDate}, updated_at = NOW() WHERE device_id = #{deviceId}")
    int updateMaintenanceDate(@Param("deviceId") String deviceId,
                             @Param("maintenanceDate") LocalDate maintenanceDate);

    /**
     * 批量更新设备状态
     * @param deviceIds 设备ID列表
     * @param status 设备状态
     * @return 更新记录数
     */
    int batchUpdateStatus(@Param("deviceIds") List<String> deviceIds,
                         @Param("status") DeviceStatus.DeviceStatusEnum status);

    /**
     * 分页查询设备列表
     * @param page 分页参数
     * @param deviceType 设备类型（可选）
     * @param status 设备状态（可选）
     * @return 分页结果
     */
    IPage<DeviceStatus> selectDevicePage(Page<DeviceStatus> page,
                                       @Param("deviceType") DeviceStatus.DeviceType deviceType,
                                       @Param("status") DeviceStatus.DeviceStatusEnum status);

    /**
     * 获取设备类型统计
     * @return 设备类型统计列表
     */
    List<Map<String, Object>> selectDeviceTypeStatistics();

    /**
     * 获取设备状态统计
     * @return 设备状态统计列表
     */
    List<Map<String, Object>> selectDeviceStatusStatistics();

    /**
     * 查询需要维护的设备（超过指定天数未维护）
     * @param days 天数阈值
     * @return 需要维护的设备列表
     */
    List<DeviceStatus> selectDevicesNeedMaintenance(@Param("days") int days);

    /**
     * 查询设备功率使用情况
     * @return 设备功率统计列表
     */
    @Select("SELECT device_type, AVG(power_level) as avg_power, MAX(power_level) as max_power FROM device_status WHERE is_running = true GROUP BY device_type")
    List<Map<String, Object>> selectPowerUsageStatistics();

    /**
     * 检查设备ID是否存在
     * @param deviceId 设备ID
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM device_status WHERE device_id = #{deviceId}")
    boolean existsByDeviceId(@Param("deviceId") String deviceId);

    /**
     * 获取设备总数
     * @return 设备总数
     */
    @Select("SELECT COUNT(*) FROM device_status")
    long countAllDevices();

    /**
     * 获取在线设备数量
     * @return 在线设备数量
     */
    @Select("SELECT COUNT(*) FROM device_status WHERE status = 'online'")
    long countOnlineDevices();
}