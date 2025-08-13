/**
 * 智能温室环境监控系统 - API调用服务
 * 封装所有后端接口调�?
 */

class ApiService {
    constructor() {
        this.baseUrl = '/api';
        this.timeout = 10000; // 10秒超�?
    }

    /**
     * 发送HTTP请求
     * @param {string} url - 请求URL
     * @param {Object} options - 请求选项
     * @returns {Promise} 请求结果
     */
    async request(url, options = {}) {
        const config = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        // 添加请求�?
        if (config.body && typeof config.body === 'object') {
            config.body = JSON.stringify(config.body);
        }

        // 显示加载提示（如果需要）
        let loadingElement = null;
        if (options.showLoading) {
            loadingElement = notificationUtils.showLoading(options.loadingMessage || '请求�?..');
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.timeout);

            const response = await fetch(`${this.baseUrl}${url}`, {
                ...config,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            // 隐藏加载提示
            if (loadingElement) {
                notificationUtils.hideLoading(loadingElement);
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.message || response.statusText;
                throw new Error(`HTTP ${response.status}: ${errorMessage}`);
            }

            const data = await response.json();
            
            // 显示成功提示（如果需要）
            if (options.showSuccess && data.success !== false) {
                notificationUtils.success(options.successMessage || '操作成功');
            }
            
            return data;

        } catch (error) {
            // 隐藏加载提示
            if (loadingElement) {
                notificationUtils.hideLoading(loadingElement);
            }

            // 使用错误处理工具处理API错误
            const context = {
                url: `${this.baseUrl}${url}`,
                method: config.method,
                operation: options.operation || '请求'
            };

            // 处理不同类型的错�?
            if (error.name === 'AbortError') {
                const timeoutError = new Error('请求超时，请检查网络连�?);
                errorUtils.handleApiError(timeoutError, context);
                
                if (options.showError !== false) {
                    notificationUtils.showApiError(timeoutError, options.operation || '请求');
                }
                throw timeoutError;
            }

            // 记录API错误
            errorUtils.handleApiError(error, context);

            // 显示错误提示（如果需要）
            if (options.showError !== false) {
                notificationUtils.showApiError(error, options.operation || '请求');
            }

            throw error;
        }
    }

    /**
     * GET请求
     * @param {string} url - 请求URL
     * @param {Object} params - 查询参数
     * @returns {Promise} 请求结果
     */
    async get(url, params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const fullUrl = queryString ? `${url}?${queryString}` : url;
        return this.request(fullUrl);
    }

    /**
     * POST请求
     * @param {string} url - 请求URL
     * @param {Object} data - 请求数据
     * @returns {Promise} 请求结果
     */
    async post(url, data = {}) {
        return this.request(url, {
            method: 'POST',
            body: data
        });
    }

    /**
     * PUT请求
     * @param {string} url - 请求URL
     * @param {Object} data - 请求数据
     * @returns {Promise} 请求结果
     */
    async put(url, data = {}) {
        return this.request(url, {
            method: 'PUT',
            body: data
        });
    }

    /**
     * DELETE请求
     * @param {string} url - 请求URL
     * @returns {Promise} 请求结果
     */
    async delete(url) {
        return this.request(url, {
            method: 'DELETE'
        });
    }

    /**
     * 安全的API调用包装�?
     * @param {Function} apiCall - API调用函数
     * @param {Object} options - 选项
     * @returns {Promise} 请求结果
     */
    async safeCall(apiCall, options = {}) {
        const {
            operation = '操作',
            showLoading = false,
            showSuccess = false,
            showError = true,
            loadingMessage,
            successMessage,
            fallbackData = null
        } = options;

        try {
            const result = await apiCall();
            
            if (showSuccess) {
                notificationUtils.success(successMessage || `${operation}成功`);
            }
            
            return result;
        } catch (error) {
            console.error(`${operation}失败:`, error);
            
            if (showError) {
                notificationUtils.showApiError(error, operation);
            }
            
            // 返回备用数据或重新抛出错�?
            if (fallbackData !== null) {
                return fallbackData;
            }
            
            throw error;
        }
    }

    /**
     * 批量API调用
     * @param {Array} apiCalls - API调用数组
     * @param {Object} options - 选项
     * @returns {Promise} 所有请求结�?
     */
    async batchCall(apiCalls, options = {}) {
        const {
            operation = '批量操作',
            showProgress = false,
            continueOnError = false
        } = options;

        const results = [];
        const errors = [];

        for (let i = 0; i < apiCalls.length; i++) {
            try {
                if (showProgress) {
                    notificationUtils.info(`正在执行 ${i + 1}/${apiCalls.length}...`, operation);
                }

                const result = await apiCalls[i]();
                results.push({ success: true, data: result, index: i });
            } catch (error) {
                const errorInfo = { success: false, error, index: i };
                results.push(errorInfo);
                errors.push(errorInfo);

                if (!continueOnError) {
                    notificationUtils.error(`${operation}在第${i + 1}项时失败: ${error.message}`);
                    break;
                }
            }
        }

        if (errors.length > 0 && continueOnError) {
            notificationUtils.warning(`${operation}完成，但�?{errors.length}项失败`);
        } else if (errors.length === 0) {
            notificationUtils.success(`${operation}全部完成`);
        }

        return { results, errors, successCount: results.length - errors.length };
    }

    // ==================== 环境数据相关接口 ====================

    /**
     * 获取当前环境数据
     * @param {Object} options - 请求选项
     * @returns {Promise} 环境数据
     */
    async getCurrentEnvironmentData(options = {}) {
        return this.safeCall(
            () => this.get('/environment/current'),
            {
                operation: '获取环境数据',
                fallbackData: this.generateMockEnvironmentData(),
                ...options
            }
        );
    }

    /**
     * 获取历史环境数据
     * @param {Object} params - 查询参数
     * @returns {Promise} 历史数据
     */
    async getEnvironmentHistory(params = {}) {
        return this.get('/environment/history', params);
    }

    /**
     * 设置环境阈�?
     * @param {Object} thresholds - 阈值配�?
     * @param {Object} options - 请求选项
     * @returns {Promise} 设置结果
     */
    async setEnvironmentThreshold(thresholds, options = {}) {
        // 验证阈值配�?
        const validation = validationUtils.validateThresholds(thresholds);
        if (!validation.valid) {
            notificationUtils.error(validation.message, '阈值设置失�?);
            throw new Error(validation.message);
        }

        return this.safeCall(
            () => this.post('/environment/threshold', thresholds),
            {
                operation: '设置环境阈�?,
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在保存阈值设�?..',
                successMessage: '阈值设置已保存',
                ...options
            }
        );
    }

    // ==================== 设备控制相关接口 ====================

    /**
     * 获取设备列表
     * @returns {Promise} 设备列表
     */
    async getDevices() {
        return this.get('/devices');
    }

    /**
     * 获取设备状�?
     * @param {string} deviceId - 设备ID
     * @returns {Promise} 设备状�?
     */
    async getDeviceStatus(deviceId) {
        return this.get(`/devices/${deviceId}/status`);
    }

    /**
     * 控制设备
     * @param {string} deviceId - 设备ID
     * @param {Object} controlData - 控制数据
     * @param {Object} options - 请求选项
     * @returns {Promise} 控制结果
     */
    async controlDevice(deviceId, controlData, options = {}) {
        // 验证设备ID
        const deviceValidation = validationUtils.validateDeviceId(deviceId);
        if (!deviceValidation.valid) {
            notificationUtils.error(deviceValidation.message, '设备控制失败');
            throw new Error(deviceValidation.message);
        }

        // 验证功率级别（如果存在）
        if (controlData.powerLevel !== undefined) {
            const powerValidation = validationUtils.validatePowerLevel(controlData.powerLevel);
            if (!powerValidation.valid) {
                notificationUtils.error(powerValidation.message, '设备控制失败');
                throw new Error(powerValidation.message);
            }
        }

        return this.safeCall(
            () => this.post(`/devices/${deviceId}/control`, controlData),
            {
                operation: '设备控制',
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在控制设备...',
                successMessage: '设备控制成功',
                ...options
            }
        );
    }

    /**
     * 更新设备配置
     * @param {string} deviceId - 设备ID
     * @param {Object} config - 设备配置
     * @returns {Promise} 更新结果
     */
    async updateDeviceConfig(deviceId, config) {
        return this.put(`/devices/${deviceId}/config`, config);
    }

    /**
     * 批量控制设备
     * @param {Array} controlCommands - 控制命令数组，每个元素包�?{deviceId, controlData}
     * @param {Object} options - 请求选项
     * @returns {Promise} 批量控制结果
     */
    async batchControlDevices(controlCommands, options = {}) {
        if (!Array.isArray(controlCommands) || controlCommands.length === 0) {
            throw new Error('控制命令列表不能为空');
        }

        // 验证所有控制命�?
        for (const command of controlCommands) {
            if (!command.deviceId || !command.controlData) {
                throw new Error('控制命令格式不正�?);
            }
        }

        return this.safeCall(
            () => this.post('/devices/batch-control', { commands: controlCommands }),
            {
                operation: '批量设备控制',
                showLoading: true,
                showSuccess: false, // 由调用方决定是否显示成功消息
                loadingMessage: '正在批量控制设备...',
                ...options
            }
        );
    }

    // ==================== 报警管理相关接口 ====================

    /**
     * 获取报警列表
     * @param {Object} params - 查询参数
     * @returns {Promise} 报警列表
     */
    async getAlerts(params = {}) {
        return this.get('/alerts', params);
    }

    /**
     * 处理报警
     * @param {number} alertId - 报警ID
     * @param {Object} resolveData - 处理数据
     * @returns {Promise} 处理结果
     */
    async resolveAlert(alertId, resolveData = {}) {
        return this.post(`/alerts/${alertId}/resolve`, resolveData);
    }

    /**
     * 获取报警统计
     * @param {Object} params - 查询参数
     * @returns {Promise} 统计数据
     */
    async getAlertStatistics(params = {}) {
        return this.get('/alerts/statistics', params);
    }

    // ==================== 数据分析相关接口 ====================

    /**
     * 获取数据摘要
     * @param {Object} params - 查询参数
     * @returns {Promise} 数据摘要
     */
    async getAnalyticsSummary(params = {}) {
        return this.safeCall(
            () => this.get('/analytics/summary', params),
            {
                operation: '获取数据摘要',
                fallbackData: this.generateMockAnalyticsSummary(params),
                ...params
            }
        );
    }

    /**
     * 获取趋势分析
     * @param {Object} params - 查询参数
     * @returns {Promise} 趋势数据
     */
    async getAnalyticsTrends(params = {}) {
        return this.safeCall(
            () => this.get('/analytics/trends', params),
            {
                operation: '获取趋势分析',
                fallbackData: this.generateMockAnalyticsTrends(params),
                ...params
            }
        );
    }

    /**
     * 获取分析报告
     * @param {Object} params - 查询参数
     * @returns {Promise} 分析报告
     */
    async getAnalyticsReports(params = {}) {
        return this.safeCall(
            () => this.get('/analytics/reports', params),
            {
                operation: '获取分析报告',
                fallbackData: this.generateMockAnalyticsReports(params),
                ...params
            }
        );
    }

    /**
     * 导出分析报告
     * @param {Object} params - 导出参数
     * @returns {Promise} 导出结果
     */
    async exportAnalyticsReport(params = {}) {
        return this.safeCall(
            () => this.get('/analytics/export', params),
            {
                operation: '导出分析报告',
                showLoading: true,
                loadingMessage: '正在生成报告...',
                fallbackData: {
                    success: true,
                    data: {
                        downloadUrl: '#',
                        filename: `环境分析报告_${new Date().toISOString().split('T')[0]}.pdf`
                    }
                }
            }
        );
    }

    // ==================== 历史数据相关接口 ====================

    /**
     * 获取历史数据
     * @param {Object} params - 查询参数
     * @returns {Promise} 历史数据
     */
    async getHistoryData(params = {}) {
        return this.safeCall(
            () => this.get('/history', params),
            {
                operation: '获取历史数据',
                fallbackData: this.generateMockHistoryData(params),
                ...params
            }
        );
    }

    /**
     * 导出历史数据
     * @param {Object} params - 导出参数
     * @returns {Promise} 导出结果
     */
    async exportHistoryData(params = {}) {
        return this.safeCall(
            () => this.get('/history/export', params),
            {
                operation: '导出历史数据',
                showLoading: true,
                loadingMessage: '正在生成导出文件...',
                fallbackData: this.generateMockExportResult(params)
            }
        );
    }

    // ==================== 模拟数据方法（用于开发测试） ====================

    /**
     * 生成模拟环境数据
     * @returns {Object} 模拟数据
     */
    generateMockEnvironmentData() {
        return {
            success: true,
            data: {
                temperature: (20 + Math.random() * 15).toFixed(1),
                humidity: (40 + Math.random() * 40).toFixed(1),
                lightIntensity: (1000 + Math.random() * 2000).toFixed(0),
                soilHumidity: (30 + Math.random() * 50).toFixed(1),
                co2Level: (400 + Math.random() * 200).toFixed(0),
                recordedAt: new Date().toISOString()
            }
        };
    }

    /**
     * 生成模拟设备数据
     * @returns {Object} 模拟设备列表
     */
    generateMockDevices() {
        const devices = [
            { id: 'heater_01', name: '加热�?', type: 'heater', status: 'online', isRunning: false, powerLevel: 0 },
            { id: 'cooler_01', name: '冷却�?', type: 'cooler', status: 'online', isRunning: false, powerLevel: 0 },
            { id: 'humidifier_01', name: '加湿�?', type: 'humidifier', status: 'online', isRunning: true, powerLevel: 65 },
            { id: 'fan_01', name: '通风�?', type: 'fan', status: 'online', isRunning: true, powerLevel: 45 },
            { id: 'light_01', name: '补光�?', type: 'light', status: 'online', isRunning: false, powerLevel: 0 },
            { id: 'irrigation_01', name: '灌溉系统1', type: 'irrigation', status: 'offline', isRunning: false, powerLevel: 0 }
        ];

        return {
            success: true,
            data: devices
        };
    }

    /**
     * 生成模拟报警数据
     * @returns {Object} 模拟报警列表
     */
    generateMockAlerts() {
        const alerts = [
            {
                id: 1,
                type: 'temperature',
                severity: 'high',
                message: '温度过高，当前温�?2.5°C，超出阈�?0°C',
                parameterValue: 32.5,
                thresholdValue: 30.0,
                isResolved: false,
                createdAt: new Date(Date.now() - 300000).toISOString()
            },
            {
                id: 2,
                type: 'device_error',
                severity: 'medium',
                message: '灌溉系统1离线',
                deviceId: 'irrigation_01',
                isResolved: false,
                createdAt: new Date(Date.now() - 600000).toISOString()
            }
        ];

        return {
            success: true,
            data: alerts
        };
    }

    // ==================== 数据处理和缓存方�?====================

    /**
     * 获取缓存的数据或从API获取
     * @param {string} cacheKey - 缓存�?
     * @param {Function} apiCall - API调用函数
     * @param {number} cacheTime - 缓存时间（毫秒）
     * @returns {Promise} 数据
     */
    async getCachedData(cacheKey, apiCall, cacheTime = 5 * 60 * 1000) {
        // 尝试从缓存获�?
        const cachedData = storageService.getCache(cacheKey);
        if (cachedData) {
            return cachedData;
        }

        // 从API获取数据
        const data = await apiCall();
        
        // 缓存数据
        storageService.setCache(cacheKey, data, cacheTime);
        
        return data;
    }

    /**
     * 清除指定的缓�?
     * @param {string} cacheKey - 缓存�?
     */
    clearCache(cacheKey) {
        storageService.remove(`cache_${cacheKey}`);
    }

    /**
     * 批量获取设备状�?
     * @param {Array} deviceIds - 设备ID数组
     * @returns {Promise} 设备状态数�?
     */
    async getBatchDeviceStatus(deviceIds) {
        const apiCalls = deviceIds.map(id => () => this.getDeviceStatus(id));
        
        const result = await this.batchCall(apiCalls, {
            operation: '获取设备状�?,
            continueOnError: true
        });

        return result.results.map((item, index) => ({
            deviceId: deviceIds[index],
            success: item.success,
            data: item.success ? item.data : null,
            error: item.success ? null : item.error
        }));
    }

    /**
     * 批量控制设备
     * @param {Array} controlCommands - 控制命令数组 [{deviceId, controlData}, ...]
     * @returns {Promise} 控制结果
     */
    async batchControlDevices(controlCommands) {
        const apiCalls = controlCommands.map(cmd => 
            () => this.controlDevice(cmd.deviceId, cmd.controlData, { showError: false })
        );

        return this.batchCall(apiCalls, {
            operation: '批量设备控制',
            showProgress: true,
            continueOnError: true
        });
    }

    /**
     * 轮询数据更新
     * @param {Function} apiCall - API调用函数
     * @param {Function} callback - 数据更新回调
     * @param {number} interval - 轮询间隔（毫秒）
     * @returns {Function} 停止轮询的函�?
     */
    startPolling(apiCall, callback, interval = 30000) {
        let isPolling = true;
        
        const poll = async () => {
            if (!isPolling) return;
            
            try {
                const data = await apiCall();
                callback(null, data);
            } catch (error) {
                callback(error, null);
            }
            
            if (isPolling) {
                setTimeout(poll, interval);
            }
        };

        // 立即执行一�?
        poll();

        // 返回停止函数
        return () => {
            isPolling = false;
        };
    }

    /**
     * 检查API连接状�?
     * @returns {Promise<boolean>} 连接状�?
     */
    async checkConnection() {
        try {
            await this.request('/health', { 
                showError: false,
                timeout: 5000 
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 获取系统状态摘�?
     * @returns {Promise} 系统状�?
     */
    async getSystemStatus() {
        return this.safeCall(
            async () => {
                const [envData, devices, alerts] = await Promise.all([
                    this.getCurrentEnvironmentData({ showError: false }),
                    this.getDevices({ showError: false }),
                    this.getAlerts({ showError: false, limit: 5 })
                ]);

                return {
                    environment: envData,
                    devices: devices,
                    alerts: alerts,
                    timestamp: new Date().toISOString()
                };
            },
            {
                operation: '获取系统状�?,
                fallbackData: {
                    environment: this.generateMockEnvironmentData(),
                    devices: this.generateMockDevices(),
                    alerts: this.generateMockAlerts(),
                    timestamp: new Date().toISOString()
                }
            }
        );
    }

    /**
     * 生成模拟数据分析摘要
     * @param {Object} params - 查询参数
     * @returns {Object} 模拟摘要数据
     */
    generateMockAnalyticsSummary(params = {}) {
        const period = params.period || '24h';
        const baseDataPoints = period === '1h' ? 60 : period === '6h' ? 360 : period === '24h' ? 1440 : 10080;
        
        return {
            success: true,
            data: {
                totalDataPoints: baseDataPoints + Math.floor(Math.random() * 1000),
                dataPointsGrowth: (Math.random() - 0.5) * 20,
                avgTemperature: 20 + Math.random() * 15,
                temperatureTrend: (Math.random() - 0.5) * 5,
                avgHumidity: 40 + Math.random() * 40,
                humidityTrend: (Math.random() - 0.5) * 10,
                anomalyCount: Math.floor(Math.random() * 5),
                anomalyChange: Math.floor((Math.random() - 0.5) * 4),
                temperatureDistribution: {
                    low: 10 + Math.random() * 20,
                    optimal: 50 + Math.random() * 30,
                    high: 10 + Math.random() * 20
                },
                humidityDistribution: {
                    low: 15 + Math.random() * 20,
                    optimal: 50 + Math.random() * 30,
                    high: 10 + Math.random() * 25
                },
                maxTemperature: 25 + Math.random() * 15,
                minTemperature: 15 + Math.random() * 10,
                temperatureStdDev: 1 + Math.random() * 5,
                maxHumidity: 70 + Math.random() * 25,
                minHumidity: 30 + Math.random() * 20,
                humidityStdDev: 5 + Math.random() * 10
            }
        };
    }

    /**
     * 生成模拟趋势分析数据
     * @param {Object} params - 查询参数
     * @returns {Object} 模拟趋势数据
     */
    generateMockAnalyticsTrends(params = {}) {
        const period = params.period || '24h';
        const dataPoints = period === '1h' ? 12 : period === '6h' ? 24 : period === '24h' ? 24 : 30;
        
        const timePoints = Array.from({length: dataPoints}, (_, i) => {
            const hoursBack = period === '1h' ? (dataPoints - 1 - i) * 5 / 60 : 
                             period === '6h' ? (dataPoints - 1 - i) * 0.25 :
                             period === '24h' ? (dataPoints - 1 - i) :
                             (dataPoints - 1 - i) * 24;
            return new Date(Date.now() - hoursBack * 60 * 60 * 1000).toISOString();
        });

        // 生成带趋势的模拟数据
        const generateTrendData = (base, variation, trend = 0) => {
            return Array.from({length: dataPoints}, (_, i) => {
                const trendValue = trend * (i / dataPoints);
                const randomVariation = (Math.random() - 0.5) * variation;
                return Math.max(0, base + trendValue + randomVariation);
            });
        };

        return {
            success: true,
            data: {
                timePoints: timePoints,
                temperature: generateTrendData(24, 6, 2),
                humidity: generateTrendData(60, 20, -5),
                lightIntensity: generateTrendData(1500, 800, 200),
                co2Level: generateTrendData(450, 100, 50)
            }
        };
    }

    /**
     * 生成模拟历史数据
     * @param {Object} params - 查询参数
     * @returns {Object} 模拟历史数据
     */
    generateMockHistoryData(params = {}) {
        const page = parseInt(params.page) || 1;
        const pageSize = parseInt(params.pageSize) || 20;
        const totalRecords = 1000 + Math.floor(Math.random() * 5000);
        
        // 生成模拟记录
        const records = [];
        const now = new Date();
        
        for (let i = 0; i < pageSize; i++) {
            const recordTime = new Date(now.getTime() - (page - 1) * pageSize * 60000 - i * 60000);
            
            records.push({
                id: (page - 1) * pageSize + i + 1,
                greenhouse_id: 'greenhouse_01',
                temperature: 15 + Math.random() * 20,
                humidity: 30 + Math.random() * 50,
                light_intensity: 500 + Math.random() * 3000,
                soil_humidity: 20 + Math.random() * 60,
                co2_level: 350 + Math.random() * 300,
                recorded_at: recordTime.toISOString()
            });
        }
        
        // 生成统计信息
        const statistics = {
            totalRecords: totalRecords,
            timeSpan: Math.floor(totalRecords * 60), // 秒数
            dataIntegrity: 85 + Math.random() * 15, // 85-100%
            anomalyCount: Math.floor(totalRecords * 0.02) // 2%异常�?
        };
        
        return {
            success: true,
            data: {
                records: records,
                total: totalRecords,
                page: page,
                pageSize: pageSize,
                totalPages: Math.ceil(totalRecords / pageSize),
                statistics: statistics
            }
        };
    }

    /**
     * 生成模拟导出结果
     * @param {Object} params - 导出参数
     * @returns {Object} 模拟导出结果
     */
    generateMockExportResult(params = {}) {
        const format = params.format || 'csv';
        const timestamp = new Date().toISOString().split('T')[0];
        
        const fileExtensions = {
            csv: 'csv',
            excel: 'xlsx',
            json: 'json'
        };
        
        const filename = `历史数据_${timestamp}.${fileExtensions[format]}`;
        
        return {
            success: true,
            data: {
                downloadUrl: `#download-${Date.now()}`, // 模拟下载链接
                filename: filename,
                fileSize: Math.floor(Math.random() * 5000000) + 1000000, // 1-5MB
                recordCount: Math.floor(Math.random() * 10000) + 1000
            }
        };
    }

    /**
     * 生成模拟分析报告数据
     * @param {Object} params - 查询参数
     * @returns {Object} 模拟报告数据
     */
    generateMockAnalyticsReports(params = {}) {
        const anomalies = [];
        const anomalyCount = Math.floor(Math.random() * 4);
        
        const anomalyTypes = [
            {
                type: '温度异常',
                severities: ['medium', 'high', 'critical'],
                descriptions: [
                    '检测到温度在短时间内快速上�?,
                    '温度持续超出正常范围',
                    '温度波动异常，可能影响作物生�?
                ],
                parameters: ['温度', '加热器状�?, '通风系统'],
                suggestions: [
                    '建议检查加热器设备状�?,
                    '建议调整温度控制参数',
                    '建议增强通风系统运行'
                ]
            },
            {
                type: '湿度异常',
                severities: ['low', 'medium', 'high'],
                descriptions: [
                    '湿度出现异常波动',
                    '湿度持续偏低，可能影响作物生�?,
                    '湿度过高，存在病害风�?
                ],
                parameters: ['湿度', '加湿器状�?, '除湿器状�?],
                suggestions: [
                    '建议调整湿度控制策略',
                    '建议检查加湿设备运行状�?,
                    '建议启动除湿设备'
                ]
            }
        ];

        for (let i = 0; i < anomalyCount; i++) {
            const typeData = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)];
            anomalies.push({
                type: typeData.type,
                severity: typeData.severities[Math.floor(Math.random() * typeData.severities.length)],
                timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
                description: typeData.descriptions[Math.floor(Math.random() * typeData.descriptions.length)],
                parameters: typeData.parameters.slice(0, 1 + Math.floor(Math.random() * 2)),
                score: 0.3 + Math.random() * 0.7,
                suggestion: typeData.suggestions[Math.floor(Math.random() * typeData.suggestions.length)]
            });
        }

        return {
            success: true,
            data: {
                correlation: {
                    matrix: {
                        'temperature-humidity': -0.65 + (Math.random() - 0.5) * 0.2,
                        'temperature-light': 0.42 + (Math.random() - 0.5) * 0.2,
                        'humidity-light': -0.38 + (Math.random() - 0.5) * 0.2,
                        'temperature-co2': 0.23 + (Math.random() - 0.5) * 0.2,
                        'humidity-co2': -0.15 + (Math.random() - 0.5) * 0.2,
                        'light-co2': 0.31 + (Math.random() - 0.5) * 0.2
                    },
                    temperatureHumidity: Array.from({length: 50}, () => ({
                        x: Math.random() * 100,
                        y: Math.random() * 100
                    }))
                },
                anomalies: anomalies,
                predictions: {
                    temperature: {
                        nextHour: 20 + Math.random() * 15,
                        confidence: 0.7 + Math.random() * 0.25,
                        trend: Math.random() > 0.5 ? 'rising' : 'falling'
                    },
                    humidity: {
                        nextHour: 40 + Math.random() * 40,
                        confidence: 0.6 + Math.random() * 0.3,
                        trend: Math.random() > 0.5 ? 'rising' : 'falling'
                    }
                },
                recommendations: [
                    '建议在下�?-4点增强通风系统运行',
                    '当前湿度水平适宜，建议保持现有设�?,
                    '光照强度充足，可适当调低补光灯功�?
                ].slice(0, 1 + Math.floor(Math.random() * 3))
            }
        };
    }
}

// 创建全局API服务实例
const apiService = new ApiService();
                        trend: (Math.random() - 0.5) * 2
                    },
                    humidity: {
                        nextHour: 40 + Math.random() * 40,
                        confidence: 0.6 + Math.random() * 0.3,
                        trend: (Math.random() - 0.5) * 5
                    }
                },
                recommendations: [
                    '建议在下�?-4点增加通风以降低温�?,
                    '当前湿度水平适宜，建议保持现有设�?,
                    '光照强度充足，可适当减少人工补光时间'
                ]
            }
        };
    }

    // ==================== 高级API功能 ====================

    /**
     * 健康检�?
     * @returns {Promise} 系统健康状�?
     */
    async healthCheck() {
        return this.safeCall(
            () => this.get('/health'),
            {
                operation: '系统健康检�?,
                showError: false,
                fallbackData: {
                    success: true,
                    data: {
                        status: 'healthy',
                        timestamp: new Date().toISOString(),
                        services: {
                            database: 'healthy',
                            api: 'healthy',
                            sensors: 'healthy'
                        }
                    }
                }
            }
        );
    }

    /**
     * 获取系统配置
     * @returns {Promise} 系统配置
     */
    async getSystemConfig() {
        return this.safeCall(
            () => this.get('/system/config'),
            {
                operation: '获取系统配置',
                fallbackData: {
                    success: true,
                    data: {
                        refreshInterval: 30000,
                        alertThresholds: {
                            temperature: { min: 15, max: 35 },
                            humidity: { min: 30, max: 80 }
                        },
                        deviceTimeout: 10000
                    }
                }
            }
        );
    }

    /**
     * 更新系统配置
     * @param {Object} config - 系统配置
     * @returns {Promise} 更新结果
     */
    async updateSystemConfig(config) {
        return this.safeCall(
            () => this.put('/system/config', config),
            {
                operation: '更新系统配置',
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在保存配置...',
                successMessage: '系统配置已更�?
            }
        );
    }

    /**
     * 获取API使用统计
     * @returns {Promise} API统计数据
     */
    async getApiStats() {
        return this.safeCall(
            () => this.get('/system/stats'),
            {
                operation: '获取API统计',
                fallbackData: {
                    success: true,
                    data: {
                        totalRequests: Math.floor(Math.random() * 10000),
                        successRate: 95 + Math.random() * 5,
                        avgResponseTime: 100 + Math.random() * 200,
                        errorCount: Math.floor(Math.random() * 50)
                    }
                }
            }
        );
    }

    /**
     * 重置系统
     * @param {Object} options - 重置选项
     * @returns {Promise} 重置结果
     */
    async resetSystem(options = {}) {
        return this.safeCall(
            () => this.post('/system/reset', options),
            {
                operation: '系统重置',
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在重置系统...',
                successMessage: '系统重置完成'
            }
        );
    }

    /**
     * 备份数据
     * @param {Object} options - 备份选项
     * @returns {Promise} 备份结果
     */
    async backupData(options = {}) {
        return this.safeCall(
            () => this.post('/system/backup', options),
            {
                operation: '数据备份',
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在备份数据...',
                successMessage: '数据备份完成'
            }
        );
    }

    /**
     * 恢复数据
     * @param {Object} backupData - 备份数据
     * @returns {Promise} 恢复结果
     */
    async restoreData(backupData) {
        return this.safeCall(
            () => this.post('/system/restore', backupData),
            {
                operation: '数据恢复',
                showLoading: true,
                showSuccess: true,
                loadingMessage: '正在恢复数据...',
                successMessage: '数据恢复完成'
            }
        );
    }
}

// 创建全局API服务实例
const apiService = new ApiService();
                        historical: Array.from({length: 12}, () => 20 + Math.random() * 10),
                        predicted: Array.from({length: 6}, () => 22 + Math.random() * 6)
                    },
                    humidity: {
                        nextHour: 50 + Math.random() * 30,
                        confidence: 0.7 + Math.random() * 0.25
                    },
                    trend: {
                        direction: ['上升', '下降', '稳定'][Math.floor(Math.random() * 3)],
                        accuracy: 0.6 + Math.random() * 0.3
                    }
                }
            }
        };
    }
}

// 创建全局API服务实例
const apiService = new ApiService();
