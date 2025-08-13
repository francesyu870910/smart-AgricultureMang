/**
 * 智能温室环境监控系统 - 辅助工具函数
 * 提供各种常用的辅助功�?
 */

class HelperUtils {
    /**
     * 防抖函数
     * @param {Function} func - 要防抖的函数
     * @param {number} wait - 等待时间（毫秒）
     * @param {boolean} immediate - 是否立即执行
     * @returns {Function} 防抖后的函数
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(this, args);
        };
    }

    /**
     * 节流函数
     * @param {Function} func - 要节流的函数
     * @param {number} limit - 限制时间（毫秒）
     * @returns {Function} 节流后的函数
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * 深拷贝对�?
     * @param {*} obj - 要拷贝的对象
     * @returns {*} 拷贝后的对象
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (typeof obj === 'object') {
            const clonedObj = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    clonedObj[key] = this.deepClone(obj[key]);
                }
            }
            return clonedObj;
        }
    }

    /**
     * 生成唯一ID
     * @param {string} prefix - 前缀
     * @returns {string} 唯一ID
     */
    static generateId(prefix = 'id') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 格式化URL参数
     * @param {Object} params - 参数对象
     * @returns {string} URL参数字符�?
     */
    static formatUrlParams(params) {
        if (!params || typeof params !== 'object') return '';
        
        const searchParams = new URLSearchParams();
        Object.keys(params).forEach(key => {
            const value = params[key];
            if (value !== null && value !== undefined && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        
        return searchParams.toString();
    }

    /**
     * 解析URL参数
     * @param {string} url - URL字符�?
     * @returns {Object} 参数对象
     */
    static parseUrlParams(url = window.location.search) {
        const params = {};
        const searchParams = new URLSearchParams(url);
        
        for (const [key, value] of searchParams) {
            params[key] = value;
        }
        
        return params;
    }

    /**
     * 检查对象是否为�?
     * @param {*} obj - 要检查的对象
     * @returns {boolean} 是否为空
     */
    static isEmpty(obj) {
        if (obj === null || obj === undefined) return true;
        if (typeof obj === 'string') return obj.trim() === '';
        if (Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    }

    /**
     * 安全的JSON解析
     * @param {string} jsonString - JSON字符�?
     * @param {*} defaultValue - 默认�?
     * @returns {*} 解析结果
     */
    static safeJsonParse(jsonString, defaultValue = null) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            console.warn('JSON解析失败:', error);
            return defaultValue;
        }
    }

    /**
     * 安全的JSON字符串化
     * @param {*} obj - 要字符串化的对象
     * @param {string} defaultValue - 默认�?
     * @returns {string} JSON字符�?
     */
    static safeJsonStringify(obj, defaultValue = '{}') {
        try {
            return JSON.stringify(obj);
        } catch (error) {
            console.warn('JSON字符串化失败:', error);
            return defaultValue;
        }
    }

    /**
     * 数组去重
     * @param {Array} array - 原数�?
     * @param {string} key - 去重键（对象数组使用�?
     * @returns {Array} 去重后的数组
     */
    static uniqueArray(array, key = null) {
        if (!Array.isArray(array)) return [];
        
        if (key) {
            const seen = new Set();
            return array.filter(item => {
                const value = item[key];
                if (seen.has(value)) {
                    return false;
                }
                seen.add(value);
                return true;
            });
        }
        
        return [...new Set(array)];
    }

    /**
     * 数组分组
     * @param {Array} array - 原数�?
     * @param {string|Function} key - 分组键或函数
     * @returns {Object} 分组结果
     */
    static groupBy(array, key) {
        if (!Array.isArray(array)) return {};
        
        return array.reduce((groups, item) => {
            const groupKey = typeof key === 'function' ? key(item) : item[key];
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
            return groups;
        }, {});
    }

    /**
     * 数组排序
     * @param {Array} array - 原数�?
     * @param {string} key - 排序�?
     * @param {string} order - 排序顺序 (asc/desc)
     * @returns {Array} 排序后的数组
     */
    static sortArray(array, key, order = 'asc') {
        if (!Array.isArray(array)) return [];
        
        return [...array].sort((a, b) => {
            let valueA = key ? a[key] : a;
            let valueB = key ? b[key] : b;
            
            // 处理字符串比�?
            if (typeof valueA === 'string') valueA = valueA.toLowerCase();
            if (typeof valueB === 'string') valueB = valueB.toLowerCase();
            
            if (order === 'desc') {
                return valueA < valueB ? 1 : valueA > valueB ? -1 : 0;
            } else {
                return valueA > valueB ? 1 : valueA < valueB ? -1 : 0;
            }
        });
    }

    /**
     * 获取嵌套对象属性�?
     * @param {Object} obj - 对象
     * @param {string} path - 属性路�?(�? 'a.b.c')
     * @param {*} defaultValue - 默认�?
     * @returns {*} 属性�?
     */
    static getNestedValue(obj, path, defaultValue = undefined) {
        if (!obj || typeof obj !== 'object') return defaultValue;
        
        const keys = path.split('.');
        let current = obj;
        
        for (const key of keys) {
            if (current === null || current === undefined || !(key in current)) {
                return defaultValue;
            }
            current = current[key];
        }
        
        return current;
    }

    /**
     * 设置嵌套对象属性�?
     * @param {Object} obj - 对象
     * @param {string} path - 属性路�?
     * @param {*} value - 属性�?
     */
    static setNestedValue(obj, path, value) {
        if (!obj || typeof obj !== 'object') return;
        
        const keys = path.split('.');
        let current = obj;
        
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (!(key in current) || typeof current[key] !== 'object') {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
    }

    /**
     * 等待指定时间
     * @param {number} ms - 等待时间（毫秒）
     * @returns {Promise} Promise对象
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * 重试函数
     * @param {Function} fn - 要重试的函数
     * @param {number} maxRetries - 最大重试次�?
     * @param {number} delay - 重试间隔（毫秒）
     * @returns {Promise} 执行结果
     */
    static async retry(fn, maxRetries = 3, delay = 1000) {
        let lastError;
        
        for (let i = 0; i <= maxRetries; i++) {
            try {
                return await fn();
            } catch (error) {
                lastError = error;
                if (i < maxRetries) {
                    await this.sleep(delay * Math.pow(2, i)); // 指数退�?
                }
            }
        }
        
        throw lastError;
    }

    /**
     * 检查设备类�?
     * @returns {Object} 设备信息
     */
    static getDeviceInfo() {
        const userAgent = navigator.userAgent;
        
        return {
            isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(userAgent),
            isDesktop: !/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
            isIOS: /iPhone|iPad|iPod/i.test(userAgent),
            isAndroid: /Android/i.test(userAgent),
            isSafari: /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent),
            isChrome: /Chrome/i.test(userAgent),
            isFirefox: /Firefox/i.test(userAgent)
        };
    }

    /**
     * 复制文本到剪贴板
     * @param {string} text - 要复制的文本
     * @returns {Promise<boolean>} 是否成功
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // 降级方案
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const result = document.execCommand('copy');
                document.body.removeChild(textArea);
                return result;
            }
        } catch (error) {
            console.error('复制到剪贴板失败:', error);
            return false;
        }
    }

    /**
     * 下载文件
     * @param {string} content - 文件内容
     * @param {string} filename - 文件�?
     * @param {string} mimeType - MIME类型
     */
    static downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.style.display = 'none';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(url);
    }

    /**
     * 格式化文件大�?
     * @param {number} bytes - 字节�?
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的大�?
     */
    static formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    /**
     * 检查网络状�?
     * @returns {boolean} 是否在线
     */
    static isOnline() {
        return navigator.onLine;
    }

    /**
     * 监听网络状态变�?
     * @param {Function} callback - 回调函数
     */
    static onNetworkChange(callback) {
        window.addEventListener('online', () => callback(true));
        window.addEventListener('offline', () => callback(false));
    }

    /**
     * 获取随机颜色
     * @param {string} type - 颜色类型 (hex/rgb/hsl)
     * @returns {string} 颜色�?
     */
    static getRandomColor(type = 'hex') {
        switch (type) {
            case 'hex':
                return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
            case 'rgb':
                const r = Math.floor(Math.random() * 256);
                const g = Math.floor(Math.random() * 256);
                const b = Math.floor(Math.random() * 256);
                return `rgb(${r}, ${g}, ${b})`;
            case 'hsl':
                const h = Math.floor(Math.random() * 360);
                const s = Math.floor(Math.random() * 100);
                const l = Math.floor(Math.random() * 100);
                return `hsl(${h}, ${s}%, ${l}%)`;
            default:
                return this.getRandomColor('hex');
        }
    }
}
