# 智能温室环境监控系统数据库设置指南

## 快速设置（推荐）

### 方法1: 使用完整SQL脚本（最简单）
1. 确保MySQL服务已启动
2. 在项目根目录执行以下命令：
```bash
mysql -u root -p < database-setup-complete.sql
```
3. 输入MySQL root密码
4. 等待脚本执行完成

### 方法2: 使用MySQL命令行
1. 登录MySQL：
```bash
mysql -u root -p
```
2. 执行脚本：
```sql
source database-setup-complete.sql;
```

## 详细设置步骤

### 1. 安装MySQL
确保已安装MySQL 8.0或更高版本。

### 2. 创建数据库和表结构
项目提供了以下SQL脚本文件：

- `database-setup-complete.sql` - 完整设置脚本（包含数据库、表结构、索引、测试数据）
- `src/main/resources/sql/create-database.sql` - 仅创建数据库
- `src/main/resources/sql/schema.sql` - 创建表结构和索引
- `src/main/resources/sql/test-data.sql` - 插入测试数据

### 3. 数据库表结构说明

创建的表包括：

#### 核心数据表
- `environment_data` - 环境数据表（温度、湿度、光照、CO2等）
- `device_status` - 设备状态表（加热器、风扇、灯光等设备信息）
- `alert_records` - 报警记录表（各种报警信息）
- `control_logs` - 控制日志表（设备操作历史）
- `system_config` - 系统配置表（系统参数配置）

#### 性能优化索引
- 环境数据按时间和温室ID索引
- 设备状态按类型和状态索引
- 报警记录按类型、严重程度和时间索引
- 控制日志按设备ID和时间索引

### 4. 测试数据说明

脚本会自动插入以下测试数据：
- 9个设备状态记录（加热器、冷却器、加湿器等）
- 17条环境数据记录（模拟24小时内的数据变化）
- 6条报警记录（不同类型和严重程度的报警）
- 14条控制日志记录（设备操作历史）
- 25条系统配置记录（温度、湿度、光照等阈值配置）

### 5. 应用配置
在 `src/main/resources/application.yml` 中已配置数据库连接信息：

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/greenhouse_db?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: 123456
    driver-class-name: com.mysql.cj.jdbc.Driver
```

### 6. 验证设置
数据库设置完成后，可以通过以下方式验证：

#### 方法1: MySQL命令行验证
```sql
USE greenhouse_db;
SHOW TABLES;
SELECT COUNT(*) FROM environment_data;
SELECT COUNT(*) FROM device_status;
```

#### 方法2: 启动应用验证
启动Spring Boot应用后，访问以下接口：
- 数据库状态: `GET http://localhost:8080/api/database/status`
- 初始化数据库: `POST http://localhost:8080/api/database/init-all`

## 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查MySQL服务是否启动
   - 确认用户名密码是否正确
   - 检查端口3306是否可用

2. **数据库不存在错误**
   - 执行 `database-setup-complete.sql` 脚本
   - 或手动创建数据库：`CREATE DATABASE greenhouse_db;`

3. **字符编码问题**
   - 确保数据库使用utf8mb4字符集
   - 检查MySQL配置文件中的字符编码设置

4. **权限问题**
   - 确保MySQL用户有足够权限
   - 可以使用root用户进行初始设置

### 重置数据库
如需重置数据库，执行以下命令：
```sql
DROP DATABASE IF EXISTS greenhouse_db;
```
然后重新执行设置脚本。

## 配置说明

### HikariCP连接池配置
- 最大连接数: 20
- 最小空闲连接数: 5
- 连接超时时间: 30秒
- 空闲超时时间: 10分钟
- 连接最大生命周期: 30分钟

### MyBatis-Plus配置
- 自动驼峰命名转换: 启用
- SQL日志输出: 启用
- 分页插件: 启用
- 逻辑删除: 配置

## 数据库设计特点

1. **规范化设计**: 遵循数据库设计规范，避免数据冗余
2. **性能优化**: 创建合适的索引提高查询性能
3. **数据完整性**: 使用外键约束和数据验证确保数据一致性
4. **扩展性**: 设计支持多温室、多设备的扩展需求
5. **可维护性**: 清晰的表结构和字段命名，便于维护