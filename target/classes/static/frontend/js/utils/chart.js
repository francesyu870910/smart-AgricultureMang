/**
 * 智能温室环境监控系统 - 图表工具
 * 提供图表绘制和数据可视化功能
 */

class ChartUtils {
    /**
     * 绘制折线�?
     * @param {string} canvasId - Canvas元素ID
     * @param {Array} data - 数据数组
     * @param {Object} options - 配置选项
     */
    static drawLineChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // 设置canvas实际大小
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 默认配置
        const config = {
            padding: 40,
            gridColor: '#E0E0E0',
            lineColor: '#2E7D32',
            pointColor: '#2E7D32',
            lineWidth: 2,
            pointRadius: 3,
            showGrid: true,
            showPoints: true,
            ...options
        };

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 计算数据范围
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;

        // 设置绘图区域
        const chartWidth = canvas.width - config.padding * 2;
        const chartHeight = canvas.height - config.padding * 2;

        // 绘制网格�?
        if (config.showGrid) {
            this.drawGrid(ctx, config.padding, chartWidth, chartHeight, config.gridColor);
        }

        // 绘制数据�?
        this.drawLine(ctx, data, config.padding, chartWidth, chartHeight, minValue, valueRange, config);

        // 绘制数据�?
        if (config.showPoints) {
            this.drawPoints(ctx, data, config.padding, chartWidth, chartHeight, minValue, valueRange, config);
        }
    }

    /**
     * 绘制网格�?
     */
    static drawGrid(ctx, padding, chartWidth, chartHeight, gridColor) {
        ctx.strokeStyle = gridColor;
        ctx.lineWidth = 1;
        
        // 水平网格�?
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // 垂直网格�?
        for (let i = 0; i <= 6; i++) {
            const x = padding + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
    }

    /**
     * 绘制数据�?
     */
    static drawLine(ctx, data, padding, chartWidth, chartHeight, minValue, valueRange, config) {
        ctx.strokeStyle = config.lineColor;
        ctx.lineWidth = config.lineWidth;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    /**
     * 绘制数据�?
     */
    static drawPoints(ctx, data, padding, chartWidth, chartHeight, minValue, valueRange, config) {
        ctx.fillStyle = config.pointColor;
        
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, config.pointRadius, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    /**
     * 绘制柱状�?
     * @param {string} canvasId - Canvas元素ID
     * @param {Array} data - 数据数组
     * @param {Object} options - 配置选项
     */
    static drawBarChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const config = {
            padding: 40,
            barColor: '#2E7D32',
            barSpacing: 0.2,
            showValues: true,
            ...options
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const values = data.map(d => d.value);
        const maxValue = Math.max(...values);
        const chartWidth = canvas.width - config.padding * 2;
        const chartHeight = canvas.height - config.padding * 2;
        const barWidth = (chartWidth / data.length) * (1 - config.barSpacing);
        const barSpacing = (chartWidth / data.length) * config.barSpacing;

        // 绘制柱子
        ctx.fillStyle = config.barColor;
        data.forEach((item, index) => {
            const barHeight = (item.value / maxValue) * chartHeight;
            const x = config.padding + index * (barWidth + barSpacing) + barSpacing / 2;
            const y = config.padding + chartHeight - barHeight;

            ctx.fillRect(x, y, barWidth, barHeight);

            // 显示数�?
            if (config.showValues) {
                ctx.fillStyle = '#333';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.value.toString(), x + barWidth / 2, y - 5);
                ctx.fillStyle = config.barColor;
            }
        });
    }

    /**
     * 绘制饼图
     * @param {string} canvasId - Canvas元素ID
     * @param {Array} data - 数据数组
     * @param {Object} options - 配置选项
     */
    static drawPieChart(canvasId, data, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas || !data || data.length === 0) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const config = {
            colors: ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7'],
            showLabels: true,
            ...options
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        const total = data.reduce((sum, item) => sum + item.value, 0);

        let currentAngle = -Math.PI / 2; // 从顶部开�?

        data.forEach((item, index) => {
            const sliceAngle = (item.value / total) * 2 * Math.PI;
            
            // 绘制扇形
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = config.colors[index % config.colors.length];
            ctx.fill();

            // 绘制标签
            if (config.showLabels) {
                const labelAngle = currentAngle + sliceAngle / 2;
                const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
                const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
                
                ctx.fillStyle = '#fff';
                ctx.font = '12px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(item.label, labelX, labelY);
            }

            currentAngle += sliceAngle;
        });
    }

    /**
     * 绘制仪表�?
     * @param {string} canvasId - Canvas元素ID
     * @param {number} value - 当前�?
     * @param {number} min - 最小�?
     * @param {number} max - 最大�?
     * @param {Object} options - 配置选项
     */
    static drawGauge(canvasId, value, min, max, options = {}) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const config = {
            startAngle: Math.PI,
            endAngle: 2 * Math.PI,
            colors: ['#4CAF50', '#FF9800', '#F44336'],
            needleColor: '#333',
            textColor: '#333',
            ...options
        };

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;

        // 绘制背景�?
        const totalAngle = config.endAngle - config.startAngle;
        const segmentAngle = totalAngle / config.colors.length;

        config.colors.forEach((color, index) => {
            const startAngle = config.startAngle + segmentAngle * index;
            const endAngle = config.startAngle + segmentAngle * (index + 1);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = 20;
            ctx.strokeStyle = color;
            ctx.stroke();
        });

        // 绘制指针
        const valueAngle = config.startAngle + ((value - min) / (max - min)) * totalAngle;
        const needleLength = radius - 30;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(valueAngle) * needleLength,
            centerY + Math.sin(valueAngle) * needleLength
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = config.needleColor;
        ctx.stroke();

        // 绘制中心�?
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = config.needleColor;
        ctx.fill();

        // 绘制数�?
        ctx.fillStyle = config.textColor;
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(1), centerX, centerY + 40);
    }

    /**
     * 生成随机颜色
     * @param {number} count - 颜色数量
     * @returns {Array} 颜色数组
     */
    static generateColors(count) {
        const colors = [];
        const baseColors = ['#2E7D32', '#4CAF50', '#66BB6A', '#81C784', '#A5D6A7', '#C8E6C9'];
        
        for (let i = 0; i < count; i++) {
            if (i < baseColors.length) {
                colors.push(baseColors[i]);
            } else {
                // 生成随机颜色
                const hue = (i * 137.508) % 360; // 黄金角度分布
                colors.push(`hsl(${hue}, 70%, 50%)`);
            }
        }
        
        return colors;
    }

    /**
     * 计算图表数据的统计信�?
     * @param {Array} data - 数据数组
     * @returns {Object} 统计信息
     */
    static calculateStats(data) {
        if (!data || data.length === 0) {
            return { min: 0, max: 0, avg: 0, sum: 0, count: 0 };
        }

        const values = data.map(d => typeof d === 'object' ? d.value : d);
        const sum = values.reduce((a, b) => a + b, 0);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const avg = sum / values.length;

        return { min, max, avg, sum, count: values.length };
    }
}
