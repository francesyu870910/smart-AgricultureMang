/**
 * 智能温室环境监控系统 - 存储服务工具
 * 提供本地存储和缓存功�?
 */

class StorageService {
    constructor() {
        this.prefix = 'greenhouse_';
        this.cachePrefix = 'cache_';
    }

    /**
     * 设置本地存储
     * @param {string} key - 键名
     * @param {any} value - �?
     */
    set(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            localStorage.setItem(this.prefix + key, serializedValue);
            return true;
        } catch (error) {
            console.error('存储数据失败:', error);
            return false;
        }
    }

    /**
     * 获取本地存储
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认�?
     * @returns {any} 存储的�?
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(this.prefix + key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('读取存储数据失败:', error);
            return defaultValue;
        }
    }

    /**
     * 删除本地存储
     * @param {string} key - 键名
     */
    remove(key) {
        try {
            localStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('删除存储数据失败:', error);
            return false;
        }
    }

    /**
     * 清除所有本地存�?
     */
    clear() {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(this.prefix)) {
                    localStorage.removeItem(key);
                }
            });
            return true;
        } catch (error) {
            console.error('清除存储数据失败:', error);
            return false;
        }
    }

    /**
     * 设置缓存（带过期时间�?
     * @param {string} key - 键名
     * @param {any} value - �?
     * @param {number} ttl - 过期时间（毫秒）
     */
    setCache(key, value, ttl = 5 * 60 * 1000) {
        const cacheData = {
            value: value,
            timestamp: Date.now(),
            ttl: ttl
        };
        return this.set(this.cachePrefix + key, cacheData);
    }

    /**
     * 获取缓存
     * @param {string} key - 键名
     * @returns {any} 缓存的值，如果过期或不存在则返回null
     */
    getCache(key) {
        const cacheData = this.get(this.cachePrefix + key);
        if (!cacheData) {
            return null;
        }

        const now = Date.now();
        if (now - cacheData.timestamp > cacheData.ttl) {
            // 缓存已过期，删除并返回null
            this.remove(this.cachePrefix + key);
            return null;
        }

        return cacheData.value;
    }

    /**
     * 删除缓存
     * @param {string} key - 键名
     */
    removeCache(key) {
        return this.remove(this.cachePrefix + key);
    }

    /**
     * 清除所有过期缓�?
     */
    clearExpiredCache() {
        try {
            const keys = Object.keys(localStorage);
            const now = Date.now();
            let clearedCount = 0;

            keys.forEach(key => {
                if (key.startsWith(this.prefix + this.cachePrefix)) {
                    try {
                        const item = localStorage.getItem(key);
                        const cacheData = JSON.parse(item);
                        if (now - cacheData.timestamp > cacheData.ttl) {
                            localStorage.removeItem(key);
                            clearedCount++;
                        }
                    } catch (error) {
                        // 如果解析失败，删除这个无效的缓存�?
                        localStorage.removeItem(key);
                        clearedCount++;
                    }
                }
            });

            console.log(`清除�?{clearedCount}个过期缓存项`);
            return clearedCount;
        } catch (error) {
            console.error('清除过期缓存失败:', error);
            return 0;
        }
    }

    /**
     * 获取存储使用情况
     * @returns {Object} 存储使用情况
     */
    getStorageInfo() {
        try {
            const keys = Object.keys(localStorage);
            const appKeys = keys.filter(key => key.startsWith(this.prefix));
            const cacheKeys = appKeys.filter(key => key.includes(this.cachePrefix));
            
            let totalSize = 0;
            let cacheSize = 0;

            appKeys.forEach(key => {
                const item = localStorage.getItem(key);
                const size = new Blob([item]).size;
                totalSize += size;
                
                if (key.includes(this.cachePrefix)) {
                    cacheSize += size;
                }
            });

            return {
                totalKeys: appKeys.length,
                cacheKeys: cacheKeys.length,
                totalSize: totalSize,
                cacheSize: cacheSize,
                availableSpace: this.getAvailableSpace()
            };
        } catch (error) {
            console.error('获取存储信息失败:', error);
            return null;
        }
    }

    /**
     * 获取可用存储空间（估算）
     * @returns {number} 可用空间大小（字节）
     */
    getAvailableSpace() {
        try {
            // 尝试存储一个大字符串来估算可用空间
            const testKey = '__storage_test__';
            let size = 1024 * 1024; // 1MB
            let available = 0;

            while (size > 1024) {
                try {
                    const testData = 'x'.repeat(size);
                    localStorage.setItem(testKey, testData);
                    localStorage.removeItem(testKey);
                    available = size;
                    break;
                } catch (e) {
                    size = Math.floor(size / 2);
                }
            }

            return available;
        } catch (error) {
            console.error('获取可用空间失败:', error);
            return 0;
        }
    }

    /**
     * 检查本地存储是否可�?
     * @returns {boolean} 是否可用
     */
    isAvailable() {
        try {
            const test = '__storage_test__';
            localStorage.setItem(test, test);
            localStorage.removeItem(test);
            return true;
        } catch (e) {
            return false;
        }
    }

    /**
     * 导出存储数据
     * @returns {Object} 所有存储数�?
     */
    exportData() {
        try {
            const keys = Object.keys(localStorage);
            const appKeys = keys.filter(key => key.startsWith(this.prefix));
            const data = {};

            appKeys.forEach(key => {
                const shortKey = key.replace(this.prefix, '');
                data[shortKey] = this.get(shortKey);
            });

            return data;
        } catch (error) {
            console.error('导出存储数据失败:', error);
            return {};
        }
    }

    /**
     * 导入存储数据
     * @param {Object} data - 要导入的数据
     * @returns {boolean} 是否成功
     */
    importData(data) {
        try {
            Object.keys(data).forEach(key => {
                this.set(key, data[key]);
            });
            return true;
        } catch (error) {
            console.error('导入存储数据失败:', error);
            return false;
        }
    }

    /**
     * 设置会话存储
     * @param {string} key - 键名
     * @param {any} value - �?
     */
    setSession(key, value) {
        try {
            const serializedValue = JSON.stringify(value);
            sessionStorage.setItem(this.prefix + key, serializedValue);
            return true;
        } catch (error) {
            console.error('设置会话存储失败:', error);
            return false;
        }
    }

    /**
     * 获取会话存储
     * @param {string} key - 键名
     * @param {any} defaultValue - 默认�?
     * @returns {any} 存储的�?
     */
    getSession(key, defaultValue = null) {
        try {
            const item = sessionStorage.getItem(this.prefix + key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (error) {
            console.error('读取会话存储失败:', error);
            return defaultValue;
        }
    }

    /**
     * 删除会话存储
     * @param {string} key - 键名
     */
    removeSession(key) {
        try {
            sessionStorage.removeItem(this.prefix + key);
            return true;
        } catch (error) {
            console.error('删除会话存储失败:', error);
            return false;
        }
    }
}

// 创建全局存储服务实例
const storageService = new StorageService();

// 定期清理过期缓存（每小时执行一次）
setInterval(() => {
    storageService.clearExpiredCache();
}, 60 * 60 * 1000);// 创建全局存储服务
实例
const storageService = new StorageService();
