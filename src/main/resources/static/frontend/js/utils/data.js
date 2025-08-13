/**
 * 智能温室环境监控系统 - 数据处理工具
 * 提供数据处理、转换和分析功能
 */

class DataUtils {
    /**
     * 数据插�?- 填补缺失数据�?
     * @param {Array} data - 原始数据数组
     * @param {string} timeField - 时间字段�?
     * @param {string} valueField - 数值字段名
     * @param {number} intervalMs - 数据间隔（毫秒）
     * @returns {Array} 插值后的数�?
     */
    static interpolateData(data, timeField = 'timestamp', valueField = 'value', intervalMs = 60000) {
        if (!data || data.length < 2) return data;

        const sortedData = [...data].sort((a, b) => new Date(a[timeField]) - new Date(b[timeField]));
        const result = [];
        
        for (let i = 0; i < sortedData.length - 1; i++) {
            const current = sortedData[i];
            const next = sortedData[i + 1];
            
            result.push(current);
            
            const currentTime = new Date(current[timeField]).getTime();
            const nextTime = new Date(next[timeField]).getTime();
            const timeDiff = nextTime - currentTime;
            
            // 如果时间间隔大于预期间隔，进行插�?
            if (timeDiff > intervalMs * 1.5) {
                const steps = Math.floor(timeDiff / intervalMs) - 1;
                const valueStep = (next[valueField] - current[valueField]) / (steps + 1);
                
                for (let j = 1; j <= steps; j++) {
                    const interpolatedTime = new Date(currentTime + j * intervalMs);
                    const interpolatedValue = current[valueField] + valueStep * j;
                    
                    const interpolatedPoint = { ...current };
                    interpolatedPoint[timeField] = interpolatedTime.toISOString();
                    interpolatedPoint[valueField] = interpolatedValue;
                    interpolatedPoint._interpolated = true;
                    
                    result.push(interpolatedPoint);
                }
            }
        }
        
        result.push(sortedData[sortedData.length - 1]);
        return result;
    }

    /**
     * 数据平滑 - 移动平均
     * @param {Array} data - 数据数组
     * @param {string} valueField - 数值字段名
     * @param {number} windowSize - 窗口大小
     * @returns {Array} 平滑后的数据
     */
    static smoothData(data, valueField = 'value', windowSize = 5) {
        if (!data || data.length < windowSize) return data;

        return data.map((item, index) => {
            const start = Math.max(0, index - Math.floor(windowSize / 2));
            const end = Math.min(data.length, start + windowSize);
            
            const window = data.slice(start, end);
            const average = window.reduce((sum, point) => sum + point[valueField], 0) / window.length;
            
            return {
                ...item,
                [valueField]: average,
                _original: item[valueField]
            };
        });
    }

    /**
     * 异常值检�?
     * @param {Array} data - 数据数组
     * @param {string} valueField - 数值字段名
     * @param {number} threshold - 异常阈值（标准差倍数�?
     * @returns {Array} 包含异常标记的数�?
     */
    static detectAnomalies(data, valueField = 'value', threshold = 2) {
        if (!data || data.length < 3) return data;

        const values = data.map(item => item[valueField]);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
        const stdDev = Math.sqrt(variance);

        return data.map(item => ({
            ...item,
            _isAnomaly: Math.abs(item[valueField] - mean) > threshold * stdDev,
            _zScore: (item[valueField] - mean) / stdDev
        }));
    }

    /**
     * 数据聚合 - 按时间段聚合
     * @param {Array} data - 数据数组
     * @param {string} timeField - 时间字段�?
     * @param {string} valueField - 数值字段名
     * @param {string} interval - 聚合间隔 (hour, day, week, month)
     * @param {string} aggregation - 聚合方式 (avg, sum, min, max, count)
     * @returns {Array} 聚合后的数据
     */
    static aggregateData(data, timeField = 'timestamp', valueField = 'value', interval = 'hour', aggregation = 'avg') {
        if (!data || data.length === 0) return [];

        const groups = {};
        
        data.forEach(item => {
            const date = new Date(item[timeField]);
            let groupKey;
            
            switch (interval) {
                case 'hour':
                    groupKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
                    break;
                case 'day':
                    groupKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                    break;
                case 'week':
                    const weekStart = new Date(date);
                    weekStart.setDate(date.getDate() - date.getDay());
                    groupKey = `${weekStart.getFullYear()}-${weekStart.getMonth()}-${weekStart.getDate()}`;
                    break;
                case 'month':
                    groupKey = `${date.getFullYear()}-${date.getMonth()}`;
                    break;
                default:
                    groupKey = item[timeField];
            }
            
            if (!groups[groupKey]) {
                groups[groupKey] = [];
            }
            groups[groupKey].push(item);
        });

        return Object.keys(groups).map(key => {
            const group = groups[key];
            const values = group.map(item => item[valueField]);
            
            let aggregatedValue;
            switch (aggregation) {
                case 'sum':
                    aggregatedValue = values.reduce((sum, val) => sum + val, 0);
                    break;
                case 'min':
                    aggregatedValue = Math.min(...values);
                    break;
                case 'max':
                    aggregatedValue = Math.max(...values);
                    break;
                case 'count':
                    aggregatedValue = values.length;
                    break;
                case 'avg':
                default:
                    aggregatedValue = values.reduce((sum, val) => sum + val, 0) / values.length;
            }
            
            return {
                [timeField]: group[0][timeField],
                [valueField]: aggregatedValue,
                _count: group.length,
                _interval: interval,
                _aggregation: aggregation
            };
        }).sort((a, b) => new Date(a[timeField]) - new Date(b[timeField]));
    }

    /**
     * 计算数据趋势
     * @param {Array} data - 数据数组
     * @param {string} valueField - 数值字段名
     * @returns {Object} 趋势信息
     */
    static calculateTrend(data, valueField = 'value') {
        if (!data || data.length < 2) {
            return { slope: 0, direction: 'stable', strength: 0 };
        }

        const n = data.length;
        const x = Array.from({ length: n }, (_, i) => i);
        const y = data.map(item => item[valueField]);

        // 计算线性回�?
        const sumX = x.reduce((sum, val) => sum + val, 0);
        const sumY = y.reduce((sum, val) => sum + val, 0);
        const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
        const sumXX = x.reduce((sum, val) => sum + val * val, 0);

        const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
        const intercept = (sumY - slope * sumX) / n;

        // 计算相关系数
        const meanX = sumX / n;
        const meanY = sumY / n;
        const numerator = x.reduce((sum, val, i) => sum + (val - meanX) * (y[i] - meanY), 0);
        const denomX = Math.sqrt(x.reduce((sum, val) => sum + Math.pow(val - meanX, 2), 0));
        const denomY = Math.sqrt(y.reduce((sum, val) => sum + Math.pow(val - meanY, 2), 0));
        const correlation = numerator / (denomX * denomY);

        let direction = 'stable';
        if (Math.abs(slope) > 0.01) {
            direction = slope > 0 ? 'increasing' : 'decreasing';
        }

        return {
            slope,
            intercept,
            correlation,
            direction,
            strength: Math.abs(correlation)
        };
    }

    /**
     * 数据分箱 - 将连续数据分�?
     * @param {Array} data - 数据数组
     * @param {string} valueField - 数值字段名
     * @param {number} binCount - 分箱数量
     * @returns {Array} 分箱结果
     */
    static binData(data, valueField = 'value', binCount = 10) {
        if (!data || data.length === 0) return [];

        const values = data.map(item => item[valueField]);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const binWidth = (max - min) / binCount;

        const bins = Array.from({ length: binCount }, (_, i) => ({
            min: min + i * binWidth,
            max: min + (i + 1) * binWidth,
            count: 0,
            items: []
        }));

        data.forEach(item => {
            const value = item[valueField];
            let binIndex = Math.floor((value - min) / binWidth);
            if (binIndex >= binCount) binIndex = binCount - 1;
            if (binIndex < 0) binIndex = 0;

            bins[binIndex].count++;
            bins[binIndex].items.push(item);
        });

        return bins;
    }

    /**
     * 计算相关性矩�?
     * @param {Array} data - 数据数组
     * @param {Array} fields - 要分析的字段
     * @returns {Object} 相关性矩�?
     */
    static calculateCorrelationMatrix(data, fields) {
        if (!data || data.length === 0 || !fields || fields.length < 2) {
            return {};
        }

        const matrix = {};
        
        for (let i = 0; i < fields.length; i++) {
            for (let j = i; j < fields.length; j++) {
                const field1 = fields[i];
                const field2 = fields[j];
                const key = `${field1}-${field2}`;
                
                if (i === j) {
                    matrix[key] = 1;
                } else {
                    const values1 = data.map(item => item[field1]).filter(val => val !== null && val !== undefined);
                    const values2 = data.map(item => item[field2]).filter(val => val !== null && val !== undefined);
                    
                    if (values1.length !== values2.length || values1.length < 2) {
                        matrix[key] = 0;
                        continue;
                    }

                    const mean1 = values1.reduce((sum, val) => sum + val, 0) / values1.length;
                    const mean2 = values2.reduce((sum, val) => sum + val, 0) / values2.length;

                    const numerator = values1.reduce((sum, val, idx) => 
                        sum + (val - mean1) * (values2[idx] - mean2), 0);
                    
                    const denom1 = Math.sqrt(values1.reduce((sum, val) => 
                        sum + Math.pow(val - mean1, 2), 0));
                    const denom2 = Math.sqrt(values2.reduce((sum, val) => 
                        sum + Math.pow(val - mean2, 2), 0));

                    matrix[key] = denom1 * denom2 === 0 ? 0 : numerator / (denom1 * denom2);
                    matrix[`${field2}-${field1}`] = matrix[key]; // 对称矩阵
                }
            }
        }

        return matrix;
    }

    /**
     * 数据质量评估
     * @param {Array} data - 数据数组
     * @param {Array} requiredFields - 必需字段
     * @returns {Object} 数据质量报告
     */
    static assessDataQuality(data, requiredFields = []) {
        if (!data || data.length === 0) {
            return {
                totalRecords: 0,
                completeness: 0,
                consistency: 0,
                accuracy: 0,
                overall: 0,
                issues: ['数据集为�?]
            };
        }

        const issues = [];
        let completenessScore = 0;
        let consistencyScore = 0;
        let accuracyScore = 0;

        // 完整性检�?
        const fieldCompleteness = {};
        requiredFields.forEach(field => {
            const nonNullCount = data.filter(item => 
                item[field] !== null && item[field] !== undefined && item[field] !== '').length;
            fieldCompleteness[field] = nonNullCount / data.length;
        });

        completenessScore = requiredFields.length > 0 ? 
            Object.values(fieldCompleteness).reduce((sum, score) => sum + score, 0) / requiredFields.length : 1;

        if (completenessScore < 0.9) {
            issues.push(`数据完整性不�? ${(completenessScore * 100).toFixed(1)}%`);
        }

        // 一致性检查（数据类型�?
        const typeConsistency = {};
        requiredFields.forEach(field => {
            const types = new Set(data.map(item => typeof item[field]));
            typeConsistency[field] = types.size === 1;
        });

        consistencyScore = requiredFields.length > 0 ? 
            Object.values(typeConsistency).filter(Boolean).length / requiredFields.length : 1;

        if (consistencyScore < 1) {
            issues.push('存在数据类型不一致的字段');
        }

        // 准确性检查（异常值）
        const numericFields = requiredFields.filter(field => 
            data.length > 0 && typeof data[0][field] === 'number');
        
        let anomalyCount = 0;
        numericFields.forEach(field => {
            const anomalies = this.detectAnomalies(data, field, 3);
            anomalyCount += anomalies.filter(item => item._isAnomaly).length;
        });

        accuracyScore = data.length > 0 ? 1 - (anomalyCount / (data.length * numericFields.length)) : 1;

        if (accuracyScore < 0.95) {
            issues.push(`检测到${anomalyCount}个可能的异常值`);
        }

        const overall = (completenessScore + consistencyScore + accuracyScore) / 3;

        return {
            totalRecords: data.length,
            completeness: completenessScore,
            consistency: consistencyScore,
            accuracy: accuracyScore,
            overall,
            fieldCompleteness,
            typeConsistency,
            anomalyCount,
            issues
        };
    }

    /**
     * 时间序列预测（简单线性预测）
     * @param {Array} data - 历史数据
     * @param {string} timeField - 时间字段�?
     * @param {string} valueField - 数值字段名
     * @param {number} steps - 预测步数
     * @returns {Array} 预测结果
     */
    static forecastTimeSeries(data, timeField = 'timestamp', valueField = 'value', steps = 5) {
        if (!data || data.length < 3) return [];

        const trend = this.calculateTrend(data, valueField);
        const lastPoint = data[data.length - 1];
        const lastTime = new Date(lastPoint[timeField]);
        
        // 计算时间间隔
        const timeInterval = data.length > 1 ? 
            new Date(data[data.length - 1][timeField]) - new Date(data[data.length - 2][timeField]) : 
            60000; // 默认1分钟

        const predictions = [];
        for (let i = 1; i <= steps; i++) {
            const futureTime = new Date(lastTime.getTime() + i * timeInterval);
            const predictedValue = lastPoint[valueField] + trend.slope * i;
            
            predictions.push({
                [timeField]: futureTime.toISOString(),
                [valueField]: predictedValue,
                _predicted: true,
                _confidence: Math.max(0.1, trend.strength)
            });
        }

        return predictions;
    }
}

// 创建全局数据处理工具实例
const dataUtils = DataUtils;
