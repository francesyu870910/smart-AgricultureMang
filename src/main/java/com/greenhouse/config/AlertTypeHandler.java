package com.greenhouse.config;

import com.greenhouse.entity.AlertRecord;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedJdbcTypes;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * AlertType枚举类型处理器
 * 处理数据库中的字符串与Java枚举之间的转换
 */
@MappedTypes(AlertRecord.AlertType.class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class AlertTypeHandler extends BaseTypeHandler<AlertRecord.AlertType> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, AlertRecord.AlertType parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.getCode());
    }

    @Override
    public AlertRecord.AlertType getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String code = rs.getString(columnName);
        return code == null ? null : AlertRecord.AlertType.fromCode(code);
    }

    @Override
    public AlertRecord.AlertType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String code = rs.getString(columnIndex);
        return code == null ? null : AlertRecord.AlertType.fromCode(code);
    }

    @Override
    public AlertRecord.AlertType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String code = cs.getString(columnIndex);
        return code == null ? null : AlertRecord.AlertType.fromCode(code);
    }
}