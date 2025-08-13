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
 * Severity枚举类型处理器
 * 处理数据库中的字符串与Java枚举之间的转换
 */
@MappedTypes(AlertRecord.Severity.class)
@MappedJdbcTypes(JdbcType.VARCHAR)
public class SeverityTypeHandler extends BaseTypeHandler<AlertRecord.Severity> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, AlertRecord.Severity parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.getCode());
    }

    @Override
    public AlertRecord.Severity getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String code = rs.getString(columnName);
        return code == null ? null : AlertRecord.Severity.fromCode(code);
    }

    @Override
    public AlertRecord.Severity getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String code = rs.getString(columnIndex);
        return code == null ? null : AlertRecord.Severity.fromCode(code);
    }

    @Override
    public AlertRecord.Severity getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String code = cs.getString(columnIndex);
        return code == null ? null : AlertRecord.Severity.fromCode(code);
    }
}