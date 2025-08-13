/**
 * 智能温室环境监控系统 - 数据验证工具
 * 提供各种数据验证功能
 */

class ValidationUtils {
    /**
     * 验证温度�?
     * @param {number} temperature - 温度�?
     * @returns {Object} 验证结果
     */
    static validateTemperature(temperature) {
        const value = Number(temperature);
        
        if (isNaN(value)) {
            return { valid: false, message: '温度值必须是数字' };
        }
        
        if (value < -50 || value > 80) {
            return { valid: false, message: '温度值超出有效范�?-50°C ~ 80°C)' };
        }
        
        return { valid: true, message: '温度值有�? };
    }

    /**
     * 验证湿度�?
     * @param {number} humidity - 湿度�?
     * @returns {Object} 验证结果
     */
    static validateHumidity(humidity) {
        const value = Number(humidity);
        
        if (isNaN(value)) {
            return { valid: false, message: '湿度值必须是数字' };
        }
        
        if (value < 0 || value > 100) {
            return { valid: false, message: '湿度值超出有效范�?0% ~ 100%)' };
        }
        
        return { valid: true, message: '湿度值有�? };
    }

    /**
     * 验证光照强度
     * @param {number} lightIntensity - 光照强度
     * @returns {Object} 验证结果
     */
    static validateLightIntensity(lightIntensity) {
        const value = Number(lightIntensity);
        
        if (isNaN(value)) {
            return { valid: false, message: '光照强度必须是数�? };
        }
        
        if (value < 0 || value > 100000) {
            return { valid: false, message: '光照强度超出有效范围(0 ~ 100000 lux)' };
        }
        
        return { valid: true, message: '光照强度有效' };
    }

    /**
     * 验证CO2浓度
     * @param {number} co2Level - CO2浓度
     * @returns {Object} 验证结果
     */
    static validateCO2Level(co2Level) {
        const value = Number(co2Level);
        
        if (isNaN(value)) {
            return { valid: false, message: 'CO2浓度必须是数�? };
        }
        
        if (value < 0 || value > 5000) {
            return { valid: false, message: 'CO2浓度超出有效范围(0 ~ 5000 ppm)' };
        }
        
        return { valid: true, message: 'CO2浓度有效' };
    }

    /**
     * 验证设备ID
     * @param {string} deviceId - 设备ID
     * @returns {Object} 验证结果
     */
    static validateDeviceId(deviceId) {
        if (!deviceId || typeof deviceId !== 'string') {
            return { valid: false, message: '设备ID不能为空' };
        }
        
        if (deviceId.length < 3 || deviceId.length > 50) {
            return { valid: false, message: '设备ID长度必须�?-50个字符之�? };
        }
        
        if (!/^[a-zA-Z0-9_-]+$/.test(deviceId)) {
            return { valid: false, message: '设备ID只能包含字母、数字、下划线和连字符' };
        }
        
        return { valid: true, message: '设备ID有效' };
    }

    /**
     * 验证功率级别
     * @param {number} powerLevel - 功率级别
     * @returns {Object} 验证结果
     */
    static validatePowerLevel(powerLevel) {
        const value = Number(powerLevel);
        
        if (isNaN(value)) {
            return { valid: false, message: '功率级别必须是数�? };
        }
        
        if (value < 0 || value > 100) {
            return { valid: false, message: '功率级别必须�?-100之间' };
        }
        
        return { valid: true, message: '功率级别有效' };
    }

    /**
     * 验证日期范围
     * @param {string} startDate - 开始日�?
     * @param {string} endDate - 结束日期
     * @returns {Object} 验证结果
     */
    static validateDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start.getTime())) {
            return { valid: false, message: '开始日期格式无�? };
        }
        
        if (isNaN(end.getTime())) {
            return { valid: false, message: '结束日期格式无效' };
        }
        
        if (start > end) {
            return { valid: false, message: '开始日期不能晚于结束日�? };
        }
        
        const now = new Date();
        if (end > now) {
            return { valid: false, message: '结束日期不能超过当前时间' };
        }
        
        // 检查日期范围是否过大（超过1年）
        const oneYear = 365 * 24 * 60 * 60 * 1000;
        if (end.getTime() - start.getTime() > oneYear) {
            return { valid: false, message: '日期范围不能超过1�? };
        }
        
        return { valid: true, message: '日期范围有效' };
    }

    /**
     * 验证邮箱地址
     * @param {string} email - 邮箱地址
     * @returns {Object} 验证结果
     */
    static validateEmail(email) {
        if (!email || typeof email !== 'string') {
            return { valid: false, message: '邮箱地址不能为空' };
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return { valid: false, message: '邮箱地址格式无效' };
        }
        
        return { valid: true, message: '邮箱地址有效' };
    }

    /**
     * 验证手机号码
     * @param {string} phone - 手机号码
     * @returns {Object} 验证结果
     */
    static validatePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return { valid: false, message: '手机号码不能为空' };
        }
        
        const phoneRegex = /^1[3-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            return { valid: false, message: '手机号码格式无效' };
        }
        
        return { valid: true, message: '手机号码有效' };
    }

    /**
     * 验证阈值配�?
     * @param {Object} thresholds - 阈值配置对�?
     * @returns {Object} 验证结果
     */
    static validateThresholds(thresholds) {
        if (!thresholds || typeof thresholds !== 'object') {
            return { valid: false, message: '阈值配置不能为�? };
        }
        
        const errors = [];
        
        // 验证温度阈�?
        if (thresholds.temperature) {
            const { min, max } = thresholds.temperature;
            if (min !== undefined) {
                const tempValidation = this.validateTemperature(min);
                if (!tempValidation.valid) {
                    errors.push(`温度最小�? ${tempValidation.message}`);
                }
            }
            if (max !== undefined) {
                const tempValidation = this.validateTemperature(max);
                if (!tempValidation.valid) {
                    errors.push(`温度最大�? ${tempValidation.message}`);
                }
            }
            if (min !== undefined && max !== undefined && min >= max) {
                errors.push('温度最小值必须小于最大�?);
            }
        }
        
        // 验证湿度阈�?
        if (thresholds.humidity) {
            const { min, max } = thresholds.humidity;
            if (min !== undefined) {
                const humidityValidation = this.validateHumidity(min);
                if (!humidityValidation.valid) {
                    errors.push(`湿度最小�? ${humidityValidation.message}`);
                }
            }
            if (max !== undefined) {
                const humidityValidation = this.validateHumidity(max);
                if (!humidityValidation.valid) {
                    errors.push(`湿度最大�? ${humidityValidation.message}`);
                }
            }
            if (min !== undefined && max !== undefined && min >= max) {
                errors.push('湿度最小值必须小于最大�?);
            }
        }
        
        if (errors.length > 0) {
            return { valid: false, message: errors.join('; ') };
        }
        
        return { valid: true, message: '阈值配置有�? };
    }

    /**
     * 验证表单数据
     * @param {Object} formData - 表单数据
     * @param {Object} rules - 验证规则
     * @returns {Object} 验证结果
     */
    static validateForm(formData, rules) {
        const errors = {};
        let isValid = true;
        
        for (const field in rules) {
            const rule = rules[field];
            const value = formData[field];
            
            // 必填验证
            if (rule.required && (!value || value.toString().trim() === '')) {
                errors[field] = `${rule.label || field}不能为空`;
                isValid = false;
                continue;
            }
            
            // 如果值为空且不是必填，跳过其他验�?
            if (!value && !rule.required) {
                continue;
            }
            
            // 类型验证
            if (rule.type) {
                let typeValid = true;
                switch (rule.type) {
                    case 'number':
                        typeValid = !isNaN(Number(value));
                        break;
                    case 'email':
                        typeValid = this.validateEmail(value).valid;
                        break;
                    case 'phone':
                        typeValid = this.validatePhone(value).valid;
                        break;
                }
                
                if (!typeValid) {
                    errors[field] = `${rule.label || field}格式不正确`;
                    isValid = false;
                    continue;
                }
            }
            
            // 长度验证
            if (rule.minLength && value.toString().length < rule.minLength) {
                errors[field] = `${rule.label || field}长度不能少于${rule.minLength}个字符`;
                isValid = false;
                continue;
            }
            
            if (rule.maxLength && value.toString().length > rule.maxLength) {
                errors[field] = `${rule.label || field}长度不能超过${rule.maxLength}个字符`;
                isValid = false;
                continue;
            }
            
            // 数值范围验�?
            if (rule.min !== undefined && Number(value) < rule.min) {
                errors[field] = `${rule.label || field}不能小于${rule.min}`;
                isValid = false;
                continue;
            }
            
            if (rule.max !== undefined && Number(value) > rule.max) {
                errors[field] = `${rule.label || field}不能大于${rule.max}`;
                isValid = false;
                continue;
            }
            
            // 自定义验证函�?
            if (rule.validator && typeof rule.validator === 'function') {
                const customResult = rule.validator(value);
                if (!customResult.valid) {
                    errors[field] = customResult.message;
                    isValid = false;
                }
            }
        }
        
        return { valid: isValid, errors };
    }
}

// 创建全局验证工具实例
const validationUtils = ValidationUtils;
