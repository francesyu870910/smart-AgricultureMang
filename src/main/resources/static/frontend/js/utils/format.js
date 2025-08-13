/**
 * 智能温室环境监控系统 - 数据格式化工�?
 * 提供各种数据格式化和转换功能
 */

class FormatUtils {
    /**
     * 格式化数字，保留指定小数�?
     * @param {number} value - 数�?
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的数�?
     */
    static formatNumber(value, decimals = 1) {
        if (value === null || value === undefined || isNaN(value)) {
            return '--';
        }
        return Number(value).toFixed(decimals);
    }

    /**
     * 格式化温度�?
     * @param {number} temperature - 温度�?
     * @returns {string} 格式化后的温�?
     */
    static formatTemperature(temperature) {
        return `${this.formatNumber(temperature, 1)}°C`;
    }

    /**
     * 格式化湿度�?
     * @param {number} humidity - 湿度�?
     * @returns {string} 格式化后的湿�?
     */
    static formatHumidity(humidity) {
        return `${this.formatNumber(humidity, 1)}%`;
    }

    /**
     * 格式化光照强�?
     * @param {number} lightIntensity - 光照强度
     * @returns {string} 格式化后的光照强�?
     */
    static formatLightIntensity(lightIntensity) {
        const value = Number(lightIntensity);
        if (value >= 1000) {
            return `${this.formatNumber(value / 1000, 1)}k lux`;
        }
        return `${this.formatNumber(value, 0)} lux`;
    }

    /**
     * 格式化CO2浓度
     * @param {number} co2Level - CO2浓度
     * @returns {string} 格式化后的CO2浓度
     */
    static formatCO2Level(co2Level) {
        return `${this.formatNumber(co2Level, 0)} ppm`;
    }

    /**
     * 格式化功率百分比
     * @param {number} powerLevel - 功率百分�?
     * @returns {string} 格式化后的功�?
     */
    static formatPowerLevel(powerLevel) {
        return `${this.formatNumber(powerLevel, 0)}%`;
    }

    /**
     * 格式化日期时�?
     * @param {string|Date} dateTime - 日期时间
     * @param {string} format - 格式类型 (full, date, time, relative)
     * @returns {string} 格式化后的日期时�?
     */
    static formatDateTime(dateTime, format = 'full') {
        if (!dateTime) return '--';

        const date = new Date(dateTime);
        if (isNaN(date.getTime())) return '--';

        const options = {
            full: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            },
            date: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            },
            time: {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }
        };

        if (format === 'relative') {
            return this.formatRelativeTime(date);
        }

        return date.toLocaleString('zh-CN', options[format] || options.full);
    }

    /**
     * 格式化相对时�?
     * @param {Date} date - 日期对象
     * @returns {string} 相对时间描述
     */
    static formatRelativeTime(date) {
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSeconds < 60) {
            return '刚刚';
        } else if (diffMinutes < 60) {
            return `${diffMinutes}分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours}小时前`;
        } else if (diffDays < 7) {
            return `${diffDays}天前`;
        } else {
            return this.formatDateTime(date, 'date');
        }
    }

    /**
     * 格式化设备状�?
     * @param {string} status - 设备状�?
     * @returns {Object} 格式化后的状态信�?
     */
    static formatDeviceStatus(status) {
        const statusMap = {
            online: { text: '在线', class: 'status-normal' },
            offline: { text: '离线', class: 'status-warning' },
            error: { text: '故障', class: 'status-danger' }
        };

        return statusMap[status] || { text: '未知', class: 'status-warning' };
    }

    /**
     * 格式化报警级�?
     * @param {string} severity - 报警级别
     * @returns {Object} 格式化后的级别信�?
     */
    static formatAlertSeverity(severity) {
        const severityMap = {
            low: { text: '�?, class: 'tag-info' },
            medium: { text: '�?, class: 'tag-warning' },
            high: { text: '�?, class: 'tag-danger' },
            critical: { text: '紧�?, class: 'tag-danger' }
        };

        return severityMap[severity] || { text: '未知', class: 'tag-info' };
    }

    /**
     * 格式化文件大�?
     * @param {number} bytes - 字节�?
     * @returns {string} 格式化后的文件大�?
     */
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 B';

        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
    }

    /**
     * 格式化持续时�?
     * @param {number} seconds - 秒数
     * @returns {string} 格式化后的持续时�?
     */
    static formatDuration(seconds) {
        if (seconds < 60) {
            return `${seconds}秒`;
        } else if (seconds < 3600) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return remainingSeconds > 0 ? `${minutes}�?{remainingSeconds}秒` : `${minutes}分钟`;
        } else if (seconds < 86400) {
            const hours = Math.floor(seconds / 3600);
            const remainingMinutes = Math.floor((seconds % 3600) / 60);
            return remainingMinutes > 0 ? `${hours}小时${remainingMinutes}分钟` : `${hours}小时`;
        } else {
            const days = Math.floor(seconds / 86400);
            const remainingHours = Math.floor((seconds % 86400) / 3600);
            return remainingHours > 0 ? `${days}�?{remainingHours}小时` : `${days}天`;
        }
    }

    /**
     * 格式化百分比
     * @param {number} value - 数�?
     * @param {number} total - 总数
     * @param {number} decimals - 小数位数
     * @returns {string} 格式化后的百分比
     */
    static formatPercentage(value, total, decimals = 1) {
        if (total === 0) return '0%';
        const percentage = (value / total) * 100;
        return `${this.formatNumber(percentage, decimals)}%`;
    }

    /**
     * 格式化趋势变�?
     * @param {number} current - 当前�?
     * @param {number} previous - 之前�?
     * @returns {Object} 趋势信息
     */
    static formatTrend(current, previous) {
        if (previous === 0 || previous === null || previous === undefined) {
            return { direction: 'stable', change: 0, text: '无变�? };
        }

        const change = ((current - previous) / previous) * 100;
        const absChange = Math.abs(change);

        let direction = 'stable';
        let text = '无变�?;

        if (absChange > 0.1) { // 变化超过0.1%才显�?
            if (change > 0) {
                direction = 'up';
                text = `上升 ${this.formatNumber(absChange, 1)}%`;
            } else {
                direction = 'down';
                text = `下降 ${this.formatNumber(absChange, 1)}%`;
            }
        }

        return { direction, change, text };
    }

    /**
     * 格式化数值范�?
     * @param {number} min - 最小�?
     * @param {number} max - 最大�?
     * @param {string} unit - 单位
     * @returns {string} 格式化后的范�?
     */
    static formatRange(min, max, unit = '') {
        if (min === max) {
            return `${this.formatNumber(min)}${unit}`;
        }
        return `${this.formatNumber(min)} - ${this.formatNumber(max)}${unit}`;
    }

    /**
     * 格式化设备类�?
     * @param {string} deviceType - 设备类型
     * @returns {string} 中文设备类型
     */
    static formatDeviceType(deviceType) {
        const typeMap = {
            heater: '加热�?,
            cooler: '冷却�?,
            humidifier: '加湿�?,
            dehumidifier: '除湿�?,
            fan: '风扇',
            light: '补光�?,
            irrigation: '灌溉系统'
        };

        return typeMap[deviceType] || deviceType;
    }

    /**
     * 格式化报警类�?
     * @param {string} alertType - 报警类型
     * @returns {string} 中文报警类型
     */
    static formatAlertType(alertType) {
        const typeMap = {
            temperature: '温度异常',
            humidity: '湿度异常',
            light: '光照异常',
            device_error: '设备故障',
            system_error: '系统错误'
        };

        return typeMap[alertType] || alertType;
    }

    /**
     * 截断文本
     * @param {string} text - 原始文本
     * @param {number} maxLength - 最大长�?
     * @returns {string} 截断后的文本
     */
    static truncateText(text, maxLength = 50) {
        if (!text || text.length <= maxLength) {
            return text || '';
        }
        return text.substring(0, maxLength) + '...';
    }

    /**
     * 格式化JSON数据为可读格�?
     * @param {Object} data - JSON数据
     * @returns {string} 格式化后的JSON字符�?
     */
    static formatJSON(data) {
        try {
            return JSON.stringify(data, null, 2);
        } catch (error) {
            return String(data);
        }
    }
}
// 创建
全局格式化工具实�?
const formatUtils = FormatUtils;
