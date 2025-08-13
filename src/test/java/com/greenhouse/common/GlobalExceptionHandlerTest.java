package com.greenhouse.common;

import com.greenhouse.common.exception.BusinessException;
import com.greenhouse.common.exception.DeviceException;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletRequest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 全局异常处理器测试类
 */
@SpringBootTest
public class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler exceptionHandler = new GlobalExceptionHandler();

    @Test
    public void testHandleBusinessException() {
        // 准备测试数据
        BusinessException ex = new BusinessException(ResultCode.DEVICE_NOT_FOUND);
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setMethod("GET");
        request.setRequestURI("/api/test");

        // 执行测试
        ResponseEntity<Result<String>> response = exceptionHandler.handleBusinessException(ex, request);

        // 验证结果
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertEquals(ResultCode.DEVICE_NOT_FOUND.getCode(), response.getBody().getCode());
        assertNotNull(response.getBody().getTraceId());
    }

    @Test
    public void testHandleDeviceException() {
        // 准备测试数据
        DeviceException ex = new DeviceException("TEST_DEVICE", ResultCode.DEVICE_OFFLINE);
        MockHttpServletRequest request = new MockHttpServletRequest();

        // 执行测试
        ResponseEntity<Result<String>> response = exceptionHandler.handleDeviceException(ex, request);

        // 验证结果
        assertNotNull(response);
        assertEquals(400, response.getStatusCodeValue());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        assertTrue(response.getBody().getMessage().contains("TEST_DEVICE"));
    }

    @Test
    public void testResultCodeEnum() {
        // 测试错误码枚举
        assertEquals(200, ResultCode.SUCCESS.getCode());
        assertEquals(1001, ResultCode.DEVICE_NOT_FOUND.getCode());
        assertEquals(2001, ResultCode.ENVIRONMENT_DATA_NOT_FOUND.getCode());
        
        // 测试根据代码获取枚举
        assertEquals(ResultCode.SUCCESS, ResultCode.getByCode(200));
        assertEquals(ResultCode.DEVICE_NOT_FOUND, ResultCode.getByCode(1001));
    }
}