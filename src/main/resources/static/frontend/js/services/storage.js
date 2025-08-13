/**
 * 智能温室环境监控系统 - 本地存储服务
 * 提供本地数据存储和缓存功�?
 */

class StorageService {
    constructor() {
        this.prefix = 'greenhouse_';
        this.defaultExpiry = 24 * 60 * 60 * 1000; // 24小时
    }

    /**
     * 设置本地存储数据
     * @param {string} key - 存储�?
     * @param {*} value - 存储�?
     * @param {number} expiry - 过期时间（毫秒）
     */
    set(key, value, expiry = this.defaultExpiry) {
        try {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiry: expiry
            };
            localStorage.setItem(this.prefix + key, JSON.stringify(item));
        } catch (error) {
            console.error('存储数据失败:', error);
        }
    }

    /**
     * 获取本地存储数据
     * @param {string} key - 存储�?
     * @param {*} defaultValue - 默认�?
     * @returns {*} 存储的值或默认�?
     */
    get(key, defaultValue = null) {
        try {
            const itemStr = localStorage.getItem(this.prefix + key);
            if (!itemStr) {
                return defaultValue;
            }

            const item = JSON.parse(itemStr);
            
            // 检查是否过�?
            if (Date.now() - item.timestamp > item.expiry) {
                this.remove(key);
                return defaultValue;
            }

            return item.value;
        } catch (error) {
            console.error('获取存储数据失败:', error);
            return defaultValue;
        }
    }

    /**
     * 删除本地存储数据
     * @param {string} key - 存储�?
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
        } catch (error) {
            console.error('删除存储数据失败:', error);
        }
    }

    /**
     * 清空所有本地存储数�?
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
        } catch (error) {
            console.error('清空存储数据失败:', error);
        }
    }

    /**
     * 检查存储键是否存在且未过期
     * @param {string} key - 存储�?
     * @returns {boolean} 是否存在
     */
    exists(key) {
        return this.get(key) !== null;
    }

    /**
     * 获取所有存储的�?
     * @returns {Array} 键数�?
     */
    keys() {
        try {
            const keys = Object.keys(localStorage);
            return keys
                .filter(key => key.startsWith(this.prefix))
                .map(key => key.substring(this.prefix.length));
        } catch (error) {
            console.error('获取存储键失�?', error);
            return [];
        }
    }

    /**
     * 获取存储使用情况
     * @returns {Object} 使用情况信息
     */
    getUsage() {
        try {
            let totalSize = 0;
            let itemCount = 0;
            
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    totalSize += localStorage.getItem(key).length;
                    itemCount++;
                }
            });

            return {
                itemCount,
                totalSize,
                totalSizeFormatted: this.formatBytes(totalSize)
            };
        } catch (error) {
            console.error('获取存储使用情况失败:', error);
            return { itemCount: 0, totalSize: 0, totalSizeFormatted: '0 B' };
        }
    }

    /**
     * 格式化字节数
     * @param {number} bytes - 字节�?
     * @returns {string} 格式化后的大�?
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    // ==================== 特定数据类型的存储方�?====================

    /**
     * 存储用户设置
     * @param {Object} settings - 用户设置
     */
    setUserSettings(settings) {
        this.set('user_settings', settings, 30 * 24 * 60 * 60 * 1000); // 30�?
    }

    /**
     * 获取用户设置
     * @returns {Object} 用户设置
     */
    getUserSettings() {
        return this.get('user_settings', {
            theme: 'light',
            language: 'zh-CN',
            autoRefresh: true,
            refreshInterval: 30000,
            notifications: true
        });
    }

    /**
     * 存储设备配置
     * @param {string} deviceId - 设备ID
     * @param {Object} config - 设备配置
     */
    setDeviceConfig(deviceId, config) {
        this.set(`device_config_${deviceId}`, config, 7 * 24 * 60 * 60 * 1000); // 7�?
    }

    /**
     * 获取设备配置
     * @param {string} deviceId - 设备ID
     * @returns {Object} 设备配置
     */
    getDeviceConfig(deviceId) {
        return this.get(`device_config_${deviceId}`, {});
    }

    /**
     * 存储环境阈�?
     * @param {Object} thresholds - 环境阈�?
     */
    setEnvironmentThresholds(thresholds) {
        this.set('environment_thresholds', thresholds, 30 * 24 * 60 * 60 * 1000); // 30�?
    }

    /**
     * 获取环境阈�?
     * @returns {Object} 环境阈�?
     */
    getEnvironmentThresholds() {
        return this.get('environment_thresholds', {
            temperature: { min: 15, max: 35 },
            humidity: { min: 30, max: 80 },
            lightIntensity: { min: 500, max: 3000 },
            co2Level: { min: 300, max: 1000 }
        });
    }

    /**
     * 存储图表配置
     * @param {string} chartId - 图表ID
     * @param {Object} config - 图表配置
     */
    setChartConfig(chartId, config) {
        this.set(`chart_config_${chartId}`, config, 7 * 24 * 60 * 60 * 1000); // 7�?
    }

    /**
     * 获取图表配置
     * @param {string} chartId - 图表ID
     * @returns {Object} 图表配置
     */
    getChartConfig(chartId) {
        return this.get(`chart_config_${chartId}`, {
            period: '24h',
            showGrid: true,
            showPoints: true
        });
    }

    /**
     * 存储缓存数据
     * @param {string} key - 缓存�?
     * @param {*} data - 缓存数据
     * @param {number} expiry - 过期时间（毫秒）
     */
    setCache(key, data, expiry = 5 * 60 * 1000) { // 默认5分钟
        this.set(`cache_${key}`, data, expiry);
    }

    /**
     * 获取缓存数据
     * @param {string} key - 缓存�?
     * @returns {*} 缓存数据
     */
    getCache(key) {
        return this.get(`cache_${key}`);
    }

    /**
     * 清除所有缓�?
     */
    clearCache() {
        const keys = this.keys();
        keys.forEach(key => {
            if (key.startsWith('cache_')) {
                this.remove(key);
            }
        });
    }

    /**
     * 存储最近访问的模块
     * @param {string} module - 模块名称
     */
    setLastVisitedModule(module) {
        this.set('last_visited_module', module, 7 * 24 * 60 * 60 * 1000); // 7�?
    }

    /**
     * 获取最近访问的模块
     * @returns {string} 模块名称
     */
    getLastVisitedModule() {
        return this.get('last_visited_module', 'dashboard');
    }

    /**
     * 存储搜索历史
     * @param {string} query - 搜索查询
     */
    addSearchHistory(query) {
        if (!query || query.trim() === '') return;
        
        const history = this.getSearchHistory();
        const newHistory = [query, ...history.filter(item => item !== query)].slice(0, 10); // 保留最�?0�?
        this.set('search_history', newHistory, 30 * 24 * 60 * 60 * 1000); // 30�?
    }

    /**
     * 获取搜索历史
     * @returns {Array} 搜索历史
     */
    getSearchHistory() {
        return this.get('search_history', []);
    }

    /**
     * 清除搜索历史
     */
    clearSearchHistory() {
        this.remove('search_history');
    }

    // ==================== 高级存储功能 ====================

    /**
     * 存储带版本的数据
     * @param {string} key - 存储�?
     * @param {*} data - 数据
     * @param {string} version - 版本�?
     * @param {number} expiry - 过期时间
     */
    setVersionedData(key, data, version = '1.0.0', expiry = this.defaultExpiry) {
        const versionedData = {
            data,
            version,
            createdAt: Date.now()
        };
        this.set(key, versionedData, expiry);
    }

    /**
     * 获取带版本的数据
     * @param {string} key - 存储�?
     * @param {string} expectedVersion - 期望版本
     * @param {*} defaultValue - 默认�?
     * @returns {*} 数据或默认�?
     */
    getVersionedData(key, expectedVersion = null, defaultValue = null) {
        const versionedData = this.get(key);
        if (!versionedData || typeof versionedData !== 'object') {
            return defaultValue;
        }

        if (expectedVersion && versionedData.version !== expectedVersion) {
            console.warn(`数据版本不匹�? 期望 ${expectedVersion}, 实际 ${versionedData.version}`);
            this.remove(key); // 清除过期版本数据
            return defaultValue;
        }

        return versionedData.data;
    }

    /**
     * 批量存储数据
     * @param {Object} dataMap - 数据映射 {key: value}
     * @param {number} expiry - 过期时间
     */
    setBatch(dataMap, expiry = this.defaultExpiry) {
        Object.entries(dataMap).forEach(([key, value]) => {
            this.set(key, value, expiry);
        });
    }

    /**
     * 批量获取数据
     * @param {Array} keys - 键数�?
     * @param {*} defaultValue - 默认�?
     * @returns {Object} 数据映射
     */
    getBatch(keys, defaultValue = null) {
        const result = {};
        keys.forEach(key => {
            result[key] = this.get(key, defaultValue);
        });
        return result;
    }

    /**
     * 存储加密数据（简单加密）
     * @param {string} key - 存储�?
     * @param {*} data - 数据
     * @param {string} password - 密码
     * @param {number} expiry - 过期时间
     */
    setEncrypted(key, data, password, expiry = this.defaultExpiry) {
        try {
            const jsonData = JSON.stringify(data);
            const encrypted = this.simpleEncrypt(jsonData, password);
            this.set(key, { encrypted: true, data: encrypted }, expiry);
        } catch (error) {
            console.error('加密存储失败:', error);
        }
    }

    /**
     * 获取加密数据
     * @param {string} key - 存储�?
     * @param {string} password - 密码
     * @param {*} defaultValue - 默认�?
     * @returns {*} 解密后的数据
     */
    getEncrypted(key, password, defaultValue = null) {
        try {
            const item = this.get(key);
            if (!item || !item.encrypted) {
                return defaultValue;
            }

            const decrypted = this.simpleDecrypt(item.data, password);
            return JSON.parse(decrypted);
        } catch (error) {
            console.error('解密数据失败:', error);
            return defaultValue;
        }
    }

    /**
     * 简单加密（仅用于演示，实际应用应使用更安全的加密方法）
     * @param {string} text - 原文
     * @param {string} password - 密码
     * @returns {string} 加密后的文本
     */
    simpleEncrypt(text, password) {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
            result += String.fromCharCode(charCode);
        }
        return btoa(result); // Base64编码
    }

    /**
     * 简单解�?
     * @param {string} encryptedText - 加密文本
     * @param {string} password - 密码
     * @returns {string} 解密后的文本
     */
    simpleDecrypt(encryptedText, password) {
        const text = atob(encryptedText); // Base64解码
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i) ^ password.charCodeAt(i % password.length);
            result += String.fromCharCode(charCode);
        }
        return result;
    }

    /**
     * 数据同步到服务器
     * @param {string} key - 存储�?
     * @param {string} endpoint - 同步端点
     * @returns {Promise} 同步结果
     */
    async syncToServer(key, endpoint) {
        try {
            const data = this.get(key);
            if (!data) return { success: false, message: '没有数据需要同�? };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key, data })
            });

            if (response.ok) {
                // 标记为已同步
                this.set(`${key}_synced`, true, 24 * 60 * 60 * 1000);
                return { success: true, message: '同步成功' };
            } else {
                return { success: false, message: '同步失败' };
            }
        } catch (error) {
            console.error('同步到服务器失败:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 从服务器同步数据
     * @param {string} key - 存储�?
     * @param {string} endpoint - 同步端点
     * @returns {Promise} 同步结果
     */
    async syncFromServer(key, endpoint) {
        try {
            const response = await fetch(`${endpoint}?key=${key}`);
            if (response.ok) {
                const serverData = await response.json();
                this.set(key, serverData.data, serverData.expiry || this.defaultExpiry);
                return { success: true, message: '同步成功', data: serverData.data };
            } else {
                return { success: false, message: '同步失败' };
            }
        } catch (error) {
            console.error('从服务器同步失败:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 清理过期数据
     * @returns {number} 清理的项目数�?
     */
    cleanupExpired() {
        let cleanedCount = 0;
        const keys = this.keys();
        
        keys.forEach(key => {
            const item = this.get(key);
            if (item === null) { // get方法会自动清理过期数�?
                cleanedCount++;
            }
        });
        
        return cleanedCount;
    }

    /**
     * 导出所有数�?
     * @returns {Object} 导出的数�?
     */
    exportData() {
        const exportData = {};
        const keys = this.keys();
        
        keys.forEach(key => {
            const data = this.get(key);
            if (data !== null) {
                exportData[key] = data;
            }
        });
        
        return {
            version: '1.0.0',
            exportTime: new Date().toISOString(),
            data: exportData
        };
    }

    /**
     * 导入数据
     * @param {Object} importData - 导入的数�?
     * @param {boolean} overwrite - 是否覆盖现有数据
     * @returns {Object} 导入结果
     */
    importData(importData, overwrite = false) {
        try {
            if (!importData.data || typeof importData.data !== 'object') {
                return { success: false, message: '导入数据格式无效' };
            }

            let importedCount = 0;
            let skippedCount = 0;

            Object.entries(importData.data).forEach(([key, value]) => {
                if (!overwrite && this.exists(key)) {
                    skippedCount++;
                } else {
                    this.set(key, value);
                    importedCount++;
                }
            });

            return {
                success: true,
                message: `导入完成: ${importedCount}项导�? ${skippedCount}项跳过`,
                imported: importedCount,
                skipped: skippedCount
            };
        } catch (error) {
            console.error('导入数据失败:', error);
            return { success: false, message: error.message };
        }
    }

    /**
     * 获取存储统计信息
     * @returns {Object} 统计信息
     */
    getStatistics() {
        const keys = this.keys();
        const usage = this.getUsage();
        
        // 按类型分组统�?
        const typeStats = {};
        keys.forEach(key => {
            const type = key.split('_')[0];
            if (!typeStats[type]) {
                typeStats[type] = 0;
            }
            typeStats[type]++;
        });

        return {
            totalItems: keys.length,
            totalSize: usage.totalSize,
            totalSizeFormatted: usage.totalSizeFormatted,
            typeBreakdown: typeStats,
            lastCleanup: this.get('last_cleanup', '从未清理'),
            storageQuota: this.getStorageQuota()
        };
    }

    /**
     * 获取存储配额信息
     * @returns {Object} 配额信息
     */
    getStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            return navigator.storage.estimate().then(estimate => ({
                quota: estimate.quota,
                usage: estimate.usage,
                available: estimate.quota - estimate.usage,
                usagePercentage: (estimate.usage / estimate.quota) * 100
            }));
        }
        
        return Promise.resolve({
            quota: null,
            usage: null,
            available: null,
            usagePercentage: null,
            message: '浏览器不支持存储配额查询'
        });
    }
}

// 创建全局存储服务实例
const storageService = new StorageService();
