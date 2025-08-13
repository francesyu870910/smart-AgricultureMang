/**
 * 智能温室环境监控系统 - 错误处理工具
 * 提供统一的错误处理和日志记录功能
 */

class ErrorUtils {
    constructor() {
        this.errorLog = [];
        this.maxLogSize = 100;
        this.init();
    }

    /**
     * 初始化错误处�?
     */
    init() {
        // 监听全局错误
        window.addEventListener('error', (event) => {
            this.handleGlobalError(event.error, event.filename, event.lineno, event.colno);
        });

        // 监听Promise未捕获错�?
        window.addEventListener('unhandledrejection', (event) => {
            this.handlePromiseRejection(event.reason);
        });
    }

    /**
     * 处理全局错误
     */
    handleGlobalError(error, filename, lineno, colno) {
        const errorInfo = {
            type: 'javascript',
            message: error?.message || '未知错误',
            filename: filename || '未知文件',
            lineno: lineno || 0,
            colno: colno || 0,
            stack: error?.stack || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        this.logError(errorInfo);
        
        // 显示用户友好的错误提�?
        notificationUtils.error('页面发生错误，请刷新页面重试', '系统错误');
    }

    /**
     * 处理Promise拒绝错误
     */
    handlePromiseRejection(reason) {
        const errorInfo = {
            type: 'promise',
            message: reason?.message || String(reason) || '未知Promise错误',
            stack: reason?.stack || '',
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        this.logError(errorInfo);
        
        // 显示用户友好的错误提�?
        notificationUtils.error('操作失败，请重试', '系统错误');
    }

    /**
     * 记录错误日志
     */
    logError(errorInfo) {
        // 添加到内存日�?
        this.errorLog.unshift(errorInfo);
        
        // 限制日志大小
        if (this.errorLog.length > this.maxLogSize) {
            this.errorLog = this.errorLog.slice(0, this.maxLogSize);
        }

        // 输出到控制台
        console.error('错误详情:', errorInfo);

        // 尝试保存到本地存�?
        try {
            const existingLogs = JSON.parse(localStorage.getItem('greenhouse_error_logs') || '[]');
            existingLogs.unshift(errorInfo);
            const logsToSave = existingLogs.slice(0, 50); // 只保存最�?0�?
            localStorage.setItem('greenhouse_error_logs', JSON.stringify(logsToSave));
        } catch (e) {
            console.warn('无法保存错误日志到本地存�?', e);
        }
    }

    /**
     * 处理API错误
     */
    handleApiError(error, context = {}) {
        const errorInfo = {
            type: 'api',
            message: error.message || '未知API错误',
            status: error.status || 0,
            url: context.url || '',
            method: context.method || '',
            timestamp: new Date().toISOString(),
            context: context
        };

        this.logError(errorInfo);

        // 根据错误类型返回用户友好的消�?
        return this.getApiErrorMessage(error);
    }

    /**
     * 获取API错误的用户友好消�?
     */
    getApiErrorMessage(error) {
        const message = error.message || '';
        
        if (message.includes('timeout') || message.includes('超时')) {
            return '请求超时，请检查网络连接后重试';
        }
        
        if (message.includes('404')) {
            return '请求的资源不存在，请联系管理�?;
        }
        
        if (message.includes('403')) {
            return '权限不足，无法执行此操作';
        }
        
        if (message.includes('401')) {
            return '身份验证失败，请重新登录';
        }
        
        if (message.includes('500')) {
            return '服务器内部错误，请稍后重�?;
        }
        
        if (message.includes('502') || message.includes('503')) {
            return '服务暂时不可用，请稍后重�?;
        }
        
        if (message.includes('网络')) {
            return '网络连接异常，请检查网络设�?;
        }
        
        return message || '操作失败，请重试';
    }

    /**
     * 处理表单验证错误
     */
    handleValidationError(errors, formElement) {
        if (!errors || typeof errors !== 'object') return;

        // 清除之前的错误样�?
        if (formElement) {
            const errorElements = formElement.querySelectorAll('.field-error');
            errorElements.forEach(el => el.remove());
            
            const fieldElements = formElement.querySelectorAll('.field-invalid');
            fieldElements.forEach(el => el.classList.remove('field-invalid'));
        }

        // 显示新的错误
        Object.keys(errors).forEach(fieldName => {
            const message = errors[fieldName];
            
            if (formElement) {
                const fieldElement = formElement.querySelector(`[name="${fieldName}"]`);
                if (fieldElement) {
                    // 添加错误样式
                    fieldElement.classList.add('field-invalid');
                    
                    // 创建错误消息元素
                    const errorElement = document.createElement('div');
                    errorElement.className = 'field-error';
                    errorElement.textContent = message;
                    errorElement.style.color = '#F44336';
                    errorElement.style.fontSize = '12px';
                    errorElement.style.marginTop = '4px';
                    
                    // 插入错误消息
                    fieldElement.parentNode.appendChild(errorElement);
                }
            }
            
            // 记录验证错误
            this.logError({
                type: 'validation',
                field: fieldName,
                message: message,
                timestamp: new Date().toISOString()
            });
        });

        // 显示总体错误提示
        const errorCount = Object.keys(errors).length;
        notificationUtils.warning(`表单�?{errorCount}个字段需要修正`, '输入验证');
    }

    /**
     * 安全执行函数
     */
    async safeExecute(fn, context = {}) {
        try {
            return await fn();
        } catch (error) {
            const errorInfo = {
                type: 'execution',
                message: error.message || '执行失败',
                stack: error.stack || '',
                context: context,
                timestamp: new Date().toISOString()
            };

            this.logError(errorInfo);
            
            // 重新抛出错误，让调用者决定如何处�?
            throw error;
        }
    }

    /**
     * 获取错误日志
     */
    getErrorLogs(limit = 20) {
        return this.errorLog.slice(0, limit);
    }

    /**
     * 清除错误日志
     */
    clearErrorLogs() {
        this.errorLog = [];
        try {
            localStorage.removeItem('greenhouse_error_logs');
        } catch (e) {
            console.warn('无法清除本地存储的错误日�?', e);
        }
    }

    /**
     * 导出错误日志
     */
    exportErrorLogs() {
        try {
            const logs = this.getErrorLogs(100);
            const dataStr = JSON.stringify(logs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `greenhouse-error-logs-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            notificationUtils.success('错误日志已导�?);
        } catch (error) {
            notificationUtils.error('导出错误日志失败');
            console.error('导出错误日志失败:', error);
        }
    }

    /**
     * 获取系统诊断信息
     */
    getSystemDiagnostics() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            cookieEnabled: navigator.cookieEnabled,
            onLine: navigator.onLine,
            screenResolution: `${screen.width}x${screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            localStorageAvailable: this.isLocalStorageAvailable(),
            timestamp: new Date().toISOString(),
            errorCount: this.errorLog.length
        };
    }

    /**
     * 检查本地存储是否可�?
     */
    isLocalStorageAvailable() {
        try {
            const test = '__localStorage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 创建错误报告
     */
    createErrorReport(additionalInfo = {}) {
        return {
            diagnostics: this.getSystemDiagnostics(),
            recentErrors: this.getErrorLogs(10),
            additionalInfo: additionalInfo,
            reportTime: new Date().toISOString()
        };
    }
}

// 创建全局错误处理工具实例
const errorUtils = new ErrorUtils();
