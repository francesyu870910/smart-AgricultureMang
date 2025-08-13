/**
 * 智能温室环境监控系统 - 温度监控组件
 */

class TemperatureComponent {
    constructor() {
        this.refreshInterval = null;
        this.currentData = null;
        this.historyData = [];
        this.thresholds = {
            min: 18,
            max: 30,
            optimal: { min: 20, max: 28 }
        };
        this.chartCanvas = null;
    }

    async render() {
        return `
            <div class="temperature-container">
                <!-- 温度数据概览卡片 -->
                <div class="grid grid-3">
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span class="icon-temperature"></span>
                                当前温度
                            </h3>
                            <div class="card-actions">
                                <button class="btn btn-refresh" onclick="temperatureComponent.refresh()">
                                    <span class="icon-refresh"></span>
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-value" id="current-temperature">
                                    <span id="temp-value">--</span>
                                    <span class="data-unit">°C</span>
                                    <span id="temp-status" class="data-status status-normal">正常</span>
                                </div>
                                <div class="progress-bar">
                                    <div id="temp-progress" class="progress-fill" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">传感器状�?/div>
                                <div class="data-value">
                                    <span id="sensor-status" class="tag tag-success">在线</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">温度统计</h3>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">最高温�?/div>
                                <div class="data-value">
                                    <span id="max-temp">--</span>
                                    <span class="data-unit">°C</span>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">最低温�?/div>
                                <div class="data-value">
                                    <span id="min-temp">--</span>
                                    <span class="data-unit">°C</span>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">平均温度</div>
                                <div class="data-value">
                                    <span id="avg-temp">--</span>
                                    <span class="data-unit">°C</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">温度趋势</h3>
                        </div>
                        <div class="card-body">
                            <div class="gauge-chart" id="temp-gauge">
                                <canvas id="temperature-gauge-canvas" width="180" height="180"></canvas>
                            </div>
                            <div class="trend-indicator" id="temp-trend">
                                <span class="trend-arrow"></span>
                                <span id="trend-text">稳定</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 温度趋势图表 -->
                <div class="chart-container">
                    <div class="chart-header">
                        <h3 class="chart-title">24小时温度变化趋势</h3>
                        <div class="chart-controls">
                            <div class="chart-period">
                                <button class="period-btn active" data-period="24h">24小时</button>
                                <button class="period-btn" data-period="7d">7�?/button>
                                <button class="period-btn" data-period="30d">30�?/button>
                            </div>
                            <button class="btn btn-secondary" onclick="temperatureComponent.exportData()">
                                导出数据
                            </button>
                        </div>
                    </div>
                    <div class="line-chart">
                        <canvas id="temperature-chart-canvas" width="800" height="300"></canvas>
                        <div class="chart-axis x-axis" id="chart-x-axis">
                            <!-- 时间轴标签将通过JavaScript动态生�?-->
                        </div>
                        <div class="chart-axis y-axis" id="chart-y-axis">
                            <!-- 温度轴标签将通过JavaScript动态生�?-->
                        </div>
                    </div>
                    <div class="chart-legend">
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #2E7D32;"></div>
                            <span>实时温度</span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #FF9800;"></div>
                            <span>警告阈�?/span>
                        </div>
                        <div class="legend-item">
                            <div class="legend-color" style="background-color: #F44336;"></div>
                            <span>危险阈�?/span>
                        </div>
                    </div>
                </div>

                <!-- 温度阈值设�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">温度阈值设�?/h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="temperatureComponent.saveThresholds()">
                                保存设置
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">最低温度阈�?(°C)</label>
                                <input type="number" id="min-threshold" class="form-input" 
                                       value="${this.thresholds.min}" min="0" max="50" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">最高温度阈�?(°C)</label>
                                <input type="number" id="max-threshold" class="form-input" 
                                       value="${this.thresholds.max}" min="0" max="50" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">最适温度下�?(°C)</label>
                                <input type="number" id="optimal-min-threshold" class="form-input" 
                                       value="${this.thresholds.optimal.min}" min="0" max="50" step="0.1">
                            </div>
                            <div class="form-group">
                                <label class="form-label">最适温度上�?(°C)</label>
                                <input type="number" id="optimal-max-threshold" class="form-input" 
                                       value="${this.thresholds.optimal.max}" min="0" max="50" step="0.1">
                            </div>
                        </div>
                        <div class="form-group">
                            <label class="form-label">温度异常处理</label>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <label style="display: flex; align-items: center; gap: 5px;">
                                    <input type="checkbox" id="auto-alert" checked>
                                    自动报警
                                </label>
                                <label style="display: flex; align-items: center; gap: 5px;">
                                    <input type="checkbox" id="auto-control" checked>
                                    自动调节
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 温度异常记录 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">温度异常记录</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="temperatureComponent.clearAlerts()">
                                清除记录
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="temperature-alerts">
                            <!-- 异常记录将通过JavaScript动态生�?-->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('温度监控组件初始化中...');
        
        // 初始化图表画�?
        this.initCharts();
        
        // 绑定事件监听�?
        this.bindEvents();
        
        // 加载初始数据
        await this.loadInitialData();
        
        // 启动定时刷新
        this.startAutoRefresh();
        
        console.log('温度监控组件已初始化');
    }

    /**
     * 初始化图�?
     */
    initCharts() {
        // 初始化温度仪表盘
        setTimeout(() => {
            const gaugeCanvas = document.getElementById('temperature-gauge-canvas');
            if (gaugeCanvas) {
                this.drawGauge(25, 0, 50);
            }
            
            // 初始化趋势图�?
            const chartCanvas = document.getElementById('temperature-chart-canvas');
            if (chartCanvas) {
                this.chartCanvas = chartCanvas;
                this.drawTrendChart();
            }
        }, 100);
    }

    /**
     * 绑定事件监听�?
     */
    bindEvents() {
        // 时间周期切换
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('period-btn')) {
                // 移除其他按钮的active�?
                document.querySelectorAll('.period-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // 添加当前按钮的active�?
                e.target.classList.add('active');
                
                // 重新加载对应周期的数�?
                const period = e.target.dataset.period;
                this.loadHistoryData(period);
            }
        });

        // 阈值输入验�?
        ['min-threshold', 'max-threshold', 'optimal-min-threshold', 'optimal-max-threshold'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('change', () => {
                    this.validateThresholds();
                });
            }
        });
    }

    /**
     * 加载初始数据
     */
    async loadInitialData() {
        try {
            // 加载当前环境数据
            await this.refresh();
            
            // 加载历史数据
            await this.loadHistoryData('24h');
            
        } catch (error) {
            console.error('加载温度数据失败:', error);
            notificationUtils.error('加载温度数据失败，请检查网络连�?);
        }
    }

    /**
     * 刷新温度数据
     */
    async refresh() {
        try {
            const response = await apiService.getCurrentEnvironmentData();
            
            if (response && response.data) {
                this.currentData = response.data;
                this.updateDisplay();
                this.updateGauge();
                this.checkThresholds();
            }
        } catch (error) {
            console.error('刷新温度数据失败:', error);
            // 使用模拟数据作为备用
            this.currentData = this.generateMockData();
            this.updateDisplay();
            this.updateGauge();
        }
    }

    /**
     * 更新显示数据
     */
    updateDisplay() {
        if (!this.currentData) return;

        const temperature = parseFloat(this.currentData.temperature);
        
        // 更新当前温度显示
        const tempValueEl = document.getElementById('temp-value');
        const tempStatusEl = document.getElementById('temp-status');
        const tempProgressEl = document.getElementById('temp-progress');
        
        if (tempValueEl) {
            tempValueEl.textContent = temperature.toFixed(1);
        }
        
        // 更新温度状态和进度�?
        if (tempStatusEl && tempProgressEl) {
            const status = this.getTemperatureStatus(temperature);
            tempStatusEl.textContent = status.text;
            tempStatusEl.className = `data-status ${status.class}`;
            
            // 更新进度�?
            const progress = ((temperature - 0) / 50) * 100;
            tempProgressEl.style.width = `${Math.min(100, Math.max(0, progress))}%`;
            tempProgressEl.className = `progress-fill ${status.progressClass}`;
        }
        
        // 更新传感器状�?
        const sensorStatusEl = document.getElementById('sensor-status');
        if (sensorStatusEl) {
            sensorStatusEl.textContent = '在线';
            sensorStatusEl.className = 'tag tag-success';
        }
        
        // 更新统计数据
        this.updateStatistics();
        
        // 更新趋势指示�?
        this.updateTrendIndicator();
    }

    /**
     * 获取温度状�?
     */
    getTemperatureStatus(temperature) {
        if (temperature < this.thresholds.min) {
            return {
                text: '过低',
                class: 'status-danger',
                progressClass: 'danger'
            };
        } else if (temperature > this.thresholds.max) {
            return {
                text: '过高',
                class: 'status-danger',
                progressClass: 'danger'
            };
        } else if (temperature < this.thresholds.optimal.min || temperature > this.thresholds.optimal.max) {
            return {
                text: '警告',
                class: 'status-warning',
                progressClass: 'warning'
            };
        } else {
            return {
                text: '正常',
                class: 'status-normal',
                progressClass: ''
            };
        }
    }

    /**
     * 更新统计数据
     */
    updateStatistics() {
        if (this.historyData.length === 0) return;
        
        const temperatures = this.historyData.map(d => parseFloat(d.temperature));
        const maxTemp = Math.max(...temperatures);
        const minTemp = Math.min(...temperatures);
        const avgTemp = temperatures.reduce((a, b) => a + b, 0) / temperatures.length;
        
        const maxTempEl = document.getElementById('max-temp');
        const minTempEl = document.getElementById('min-temp');
        const avgTempEl = document.getElementById('avg-temp');
        
        if (maxTempEl) maxTempEl.textContent = maxTemp.toFixed(1);
        if (minTempEl) minTempEl.textContent = minTemp.toFixed(1);
        if (avgTempEl) avgTempEl.textContent = avgTemp.toFixed(1);
    }

    /**
     * 更新趋势指示�?
     */
    updateTrendIndicator() {
        if (this.historyData.length < 2) return;
        
        const recent = this.historyData.slice(-5).map(d => parseFloat(d.temperature));
        const trend = this.calculateTrend(recent);
        
        const trendEl = document.getElementById('temp-trend');
        const trendTextEl = document.getElementById('trend-text');
        
        if (trendEl && trendTextEl) {
            if (trend > 0.5) {
                trendEl.className = 'trend-indicator trend-up';
                trendTextEl.textContent = '上升';
            } else if (trend < -0.5) {
                trendEl.className = 'trend-indicator trend-down';
                trendTextEl.textContent = '下降';
            } else {
                trendEl.className = 'trend-indicator trend-stable';
                trendTextEl.textContent = '稳定';
            }
        }
    }

    /**
     * 计算趋势
     */
    calculateTrend(data) {
        if (data.length < 2) return 0;
        
        const first = data[0];
        const last = data[data.length - 1];
        return last - first;
    }

    /**
     * 更新仪表�?
     */
    updateGauge() {
        if (!this.currentData) return;
        
        const temperature = parseFloat(this.currentData.temperature);
        this.drawGauge(temperature, 0, 50);
    }

    /**
     * 绘制温度仪表�?
     */
    drawGauge(value, min, max) {
        const canvas = document.getElementById('temperature-gauge-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // 设置canvas实际大小
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 20;
        
        // 绘制背景弧线
        const startAngle = Math.PI;
        const endAngle = 2 * Math.PI;
        const totalAngle = endAngle - startAngle;
        
        // 绘制温度区间弧线
        const segments = [
            { color: '#4CAF50', start: 0, end: 0.6 },      // 正常区间
            { color: '#FF9800', start: 0.6, end: 0.8 },    // 警告区间
            { color: '#F44336', start: 0.8, end: 1.0 }     // 危险区间
        ];
        
        segments.forEach(segment => {
            const segmentStartAngle = startAngle + totalAngle * segment.start;
            const segmentEndAngle = startAngle + totalAngle * segment.end;
            
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, segmentStartAngle, segmentEndAngle);
            ctx.lineWidth = 15;
            ctx.strokeStyle = segment.color;
            ctx.stroke();
        });
        
        // 绘制指针
        const valueAngle = startAngle + ((value - min) / (max - min)) * totalAngle;
        const needleLength = radius - 25;
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(
            centerX + Math.cos(valueAngle) * needleLength,
            centerY + Math.sin(valueAngle) * needleLength
        );
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2E7D32';
        ctx.stroke();
        
        // 绘制中心�?
        ctx.beginPath();
        ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#2E7D32';
        ctx.fill();
        
        // 绘制数值文�?
        ctx.fillStyle = '#333';
        ctx.font = 'bold 20px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toFixed(1) + '°C', centerX, centerY + 35);
    }

    /**
     * 加载历史数据
     */
    async loadHistoryData(period = '24h') {
        try {
            const params = {
                period: period,
                type: 'temperature'
            };
            
            const response = await apiService.getEnvironmentHistory(params);
            
            if (response && response.data) {
                this.historyData = response.data;
            } else {
                // 生成模拟历史数据
                this.historyData = this.generateMockHistoryData(period);
            }
            
            this.drawTrendChart();
            this.updateStatistics();
            
        } catch (error) {
            console.error('加载历史数据失败:', error);
            // 使用模拟数据
            this.historyData = this.generateMockHistoryData(period);
            this.drawTrendChart();
        }
    }

    /**
     * 绘制趋势图表
     */
    drawTrendChart() {
        if (!this.chartCanvas || this.historyData.length === 0) return;
        
        const chartData = this.historyData.map((item, index) => ({
            value: parseFloat(item.temperature),
            label: this.formatTimeLabel(item.recordedAt || new Date(Date.now() - (this.historyData.length - index) * 60000))
        }));
        
        const ctx = this.chartCanvas.getContext('2d');
        const rect = this.chartCanvas.getBoundingClientRect();
        
        // 设置canvas实际大小
        this.chartCanvas.width = rect.width;
        this.chartCanvas.height = rect.height;
        
        // 清空画布
        ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
        
        if (chartData.length === 0) return;
        
        // 配置参数
        const padding = 40;
        const chartWidth = this.chartCanvas.width - padding * 2;
        const chartHeight = this.chartCanvas.height - padding * 2;
        
        // 计算数据范围
        const values = chartData.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;
        
        // 绘制网格�?
        this.drawChartGrid(ctx, padding, chartWidth, chartHeight);
        
        // 绘制阈值线
        this.drawThresholdLines(ctx, padding, chartWidth, chartHeight, minValue, valueRange);
        
        // 绘制数据�?
        this.drawDataLine(ctx, chartData, padding, chartWidth, chartHeight, minValue, valueRange);
        
        // 绘制数据�?
        this.drawDataPoints(ctx, chartData, padding, chartWidth, chartHeight, minValue, valueRange);
        
        // 更新坐标轴标�?
        this.updateChartAxes(chartData);
    }
    
    /**
     * 绘制图表网格
     */
    drawChartGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#E0E0E0';
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
     * 绘制阈值线
     */
    drawThresholdLines(ctx, padding, chartWidth, chartHeight, minValue, valueRange) {
        // 绘制最低阈值线
        const minThresholdY = padding + chartHeight - ((this.thresholds.min - minValue) / valueRange) * chartHeight;
        if (minThresholdY >= padding && minThresholdY <= padding + chartHeight) {
            ctx.strokeStyle = '#F44336';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, minThresholdY);
            ctx.lineTo(padding + chartWidth, minThresholdY);
            ctx.stroke();
        }
        
        // 绘制最高阈值线
        const maxThresholdY = padding + chartHeight - ((this.thresholds.max - minValue) / valueRange) * chartHeight;
        if (maxThresholdY >= padding && maxThresholdY <= padding + chartHeight) {
            ctx.strokeStyle = '#F44336';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(padding, maxThresholdY);
            ctx.lineTo(padding + chartWidth, maxThresholdY);
            ctx.stroke();
        }
        
        // 绘制最适温度范�?
        const optimalMinY = padding + chartHeight - ((this.thresholds.optimal.min - minValue) / valueRange) * chartHeight;
        const optimalMaxY = padding + chartHeight - ((this.thresholds.optimal.max - minValue) / valueRange) * chartHeight;
        
        if (optimalMinY >= padding && optimalMinY <= padding + chartHeight && 
            optimalMaxY >= padding && optimalMaxY <= padding + chartHeight) {
            ctx.fillStyle = 'rgba(76, 175, 80, 0.1)';
            ctx.fillRect(padding, optimalMaxY, chartWidth, optimalMinY - optimalMaxY);
        }
        
        // 重置线条样式
        ctx.setLineDash([]);
    }
    
    /**
     * 绘制数据�?
     */
    drawDataLine(ctx, chartData, padding, chartWidth, chartHeight, minValue, valueRange) {
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        chartData.forEach((point, index) => {
            const x = padding + (chartWidth / (chartData.length - 1)) * index;
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
    drawDataPoints(ctx, chartData, padding, chartWidth, chartHeight, minValue, valueRange) {
        chartData.forEach((point, index) => {
            const x = padding + (chartWidth / (chartData.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            // 根据温度值选择颜色
            let pointColor = '#2E7D32'; // 正常
            if (point.value < this.thresholds.min || point.value > this.thresholds.max) {
                pointColor = '#F44336'; // 危险
            } else if (point.value < this.thresholds.optimal.min || point.value > this.thresholds.optimal.max) {
                pointColor = '#FF9800'; // 警告
            }
            
            ctx.fillStyle = pointColor;
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    /**
     * 更新图表坐标�?
     */
    updateChartAxes(data) {
        // 更新X轴（时间轴）
        const xAxisEl = document.getElementById('chart-x-axis');
        if (xAxisEl && data.length > 0) {
            const timeLabels = [];
            const step = Math.max(1, Math.floor(data.length / 6));
            
            for (let i = 0; i < data.length; i += step) {
                timeLabels.push(data[i].label);
            }
            
            xAxisEl.innerHTML = timeLabels.map(label => `<span>${label}</span>`).join('');
        }
        
        // 更新Y轴（温度轴）
        const yAxisEl = document.getElementById('chart-y-axis');
        if (yAxisEl && data.length > 0) {
            const values = data.map(d => d.value);
            const minVal = Math.min(...values);
            const maxVal = Math.max(...values);
            const range = maxVal - minVal;
            const step = range / 5;
            
            const tempLabels = [];
            for (let i = 0; i <= 5; i++) {
                tempLabels.push((maxVal - i * step).toFixed(1) + '°C');
            }
            
            yAxisEl.innerHTML = tempLabels.map(label => `<span>${label}</span>`).join('');
        }
    }

    /**
     * 格式化时间标�?
     */
    formatTimeLabel(date) {
        const d = new Date(date);
        return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    }

    /**
     * 检查温度阈�?
     */
    checkThresholds() {
        if (!this.currentData) return;
        
        const temperature = parseFloat(this.currentData.temperature);
        const autoAlert = document.getElementById('auto-alert')?.checked;
        const autoControl = document.getElementById('auto-control')?.checked;
        
        // 检查是否需要报�?
        if (autoAlert && (temperature < this.thresholds.min || temperature > this.thresholds.max)) {
            this.addTemperatureAlert(temperature);
            
            // 发送系统通知
            if (temperature < this.thresholds.min) {
                notificationUtils.showSystemNotification('温度报警', `温度过低: ${temperature.toFixed(1)}°C`);
            } else {
                notificationUtils.showSystemNotification('温度报警', `温度过高: ${temperature.toFixed(1)}°C`);
            }
        }
        
        // 自动控制逻辑
        if (autoControl) {
            this.performAutoControl(temperature);
        }
    }
    
    /**
     * 执行自动控制
     */
    async performAutoControl(temperature) {
        try {
            if (temperature < this.thresholds.optimal.min) {
                // 温度过低，启动加热器
                await apiService.controlDevice('heater_01', {
                    action: 'start',
                    powerLevel: Math.min(100, (this.thresholds.optimal.min - temperature) * 10)
                }, { showError: false });
                
                // 关闭冷却�?
                await apiService.controlDevice('cooler_01', {
                    action: 'stop'
                }, { showError: false });
                
            } else if (temperature > this.thresholds.optimal.max) {
                // 温度过高，启动冷却器
                await apiService.controlDevice('cooler_01', {
                    action: 'start',
                    powerLevel: Math.min(100, (temperature - this.thresholds.optimal.max) * 10)
                }, { showError: false });
                
                // 关闭加热�?
                await apiService.controlDevice('heater_01', {
                    action: 'stop'
                }, { showError: false });
                
            } else {
                // 温度正常，关闭加热和冷却设备
                await apiService.controlDevice('heater_01', { action: 'stop' }, { showError: false });
                await apiService.controlDevice('cooler_01', { action: 'stop' }, { showError: false });
            }
        } catch (error) {
            console.error('自动控制失败:', error);
        }
    }

    /**
     * 添加温度异常记录
     */
    addTemperatureAlert(temperature) {
        const alertsContainer = document.getElementById('temperature-alerts');
        if (!alertsContainer) return;
        
        const alertType = temperature < this.thresholds.min ? '温度过低' : '温度过高';
        const alertClass = 'status-danger';
        const timestamp = new Date().toLocaleString();
        
        const alertHtml = `
            <div class="data-display">
                <div class="data-label">${timestamp}</div>
                <div class="data-value">
                    <span class="data-status ${alertClass}">${alertType}</span>
                    <span>${temperature.toFixed(1)}°C</span>
                </div>
            </div>
        `;
        
        alertsContainer.insertAdjacentHTML('afterbegin', alertHtml);
        
        // 限制显示最�?0条记�?
        const alerts = alertsContainer.querySelectorAll('.data-display');
        if (alerts.length > 10) {
            alerts[alerts.length - 1].remove();
        }
    }

    /**
     * 验证阈值设�?
     */
    validateThresholds() {
        const minThreshold = parseFloat(document.getElementById('min-threshold')?.value || 0);
        const maxThreshold = parseFloat(document.getElementById('max-threshold')?.value || 50);
        const optimalMin = parseFloat(document.getElementById('optimal-min-threshold')?.value || 20);
        const optimalMax = parseFloat(document.getElementById('optimal-max-threshold')?.value || 28);
        
        let isValid = true;
        let message = '';
        
        if (minThreshold >= maxThreshold) {
            isValid = false;
            message = '最低温度阈值必须小于最高温度阈�?;
        } else if (optimalMin < minThreshold || optimalMax > maxThreshold) {
            isValid = false;
            message = '最适温度范围必须在温度阈值范围内';
        } else if (optimalMin >= optimalMax) {
            isValid = false;
            message = '最适温度下限必须小于上�?;
        }
        
        if (!isValid) {
            notificationUtils.warning(message);
            return false;
        }
        
        return true;
    }

    /**
     * 保存阈值设�?
     */
    async saveThresholds() {
        if (!this.validateThresholds()) {
            return;
        }
        
        const thresholds = {
            min: parseFloat(document.getElementById('min-threshold')?.value || 0),
            max: parseFloat(document.getElementById('max-threshold')?.value || 50),
            optimal: {
                min: parseFloat(document.getElementById('optimal-min-threshold')?.value || 20),
                max: parseFloat(document.getElementById('optimal-max-threshold')?.value || 28)
            },
            autoAlert: document.getElementById('auto-alert')?.checked || false,
            autoControl: document.getElementById('auto-control')?.checked || false
        };
        
        try {
            await apiService.setEnvironmentThreshold({
                type: 'temperature',
                ...thresholds
            });
            
            this.thresholds = thresholds;
            notificationUtils.success('温度阈值设置已保存');
            
        } catch (error) {
            console.error('保存阈值设置失�?', error);
            notificationUtils.error('保存阈值设置失败，请重�?);
        }
    }

    /**
     * 导出数据
     */
    async exportData() {
        try {
            const period = document.querySelector('.period-btn.active')?.dataset.period || '24h';
            const response = await apiService.exportHistoryData({
                type: 'temperature',
                period: period,
                format: 'csv'
            });
            
            if (response && response.data) {
                // 创建下载链接
                const blob = new Blob([response.data], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `temperature_data_${period}_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                notificationUtils.success('数据导出成功');
            }
        } catch (error) {
            console.error('导出数据失败:', error);
            notificationUtils.error('导出数据失败，请重试');
        }
    }

    /**
     * 清除异常记录
     */
    clearAlerts() {
        const alertsContainer = document.getElementById('temperature-alerts');
        if (alertsContainer) {
            alertsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-description">暂无异常记录</div></div>';
            notificationUtils.success('异常记录已清�?);
        }
    }

    /**
     * 启动自动刷新
     */
    startAutoRefresh() {
        // �?0秒刷新一次数�?
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 30000);
    }

    /**
     * 生成模拟数据
     */
    generateMockData() {
        return {
            temperature: (20 + Math.random() * 15).toFixed(1),
            recordedAt: new Date().toISOString()
        };
    }

    /**
     * 生成模拟历史数据
     */
    generateMockHistoryData(period) {
        const data = [];
        let count = 24; // 默认24小时
        let interval = 60 * 60 * 1000; // 1小时间隔
        
        if (period === '7d') {
            count = 7 * 24;
            interval = 60 * 60 * 1000; // 1小时间隔
        } else if (period === '30d') {
            count = 30;
            interval = 24 * 60 * 60 * 1000; // 1天间�?
        }
        
        const baseTemp = 25;
        let currentTemp = baseTemp;
        
        for (let i = count - 1; i >= 0; i--) {
            // 模拟温度变化
            const variation = (Math.random() - 0.5) * 4; // ±2度变�?
            currentTemp = Math.max(15, Math.min(35, currentTemp + variation));
            
            data.push({
                temperature: currentTemp.toFixed(1),
                recordedAt: new Date(Date.now() - i * interval).toISOString()
            });
        }
        
        return data;
    }

    /**
     * 处理实时数据更新
     * @param {Object} data - 实时环境数据
     */
    updateEnvironmentData(data) {
        if (data && data.temperature !== undefined) {
            this.currentData = data;
            this.updateDisplay();
            this.updateGauge();
            this.checkThresholds();
            
            // 更新历史数据（保持最新的数据在前面）
            this.historyData.unshift({
                temperature: data.temperature,
                recordedAt: data.recordedAt || new Date().toISOString()
            });
            
            // 限制历史数据长度
            if (this.historyData.length > 100) {
                this.historyData = this.historyData.slice(0, 100);
            }
            
            // 重绘图表
            this.drawTrendChart();
        }
    }
    
    /**
     * 处理窗口大小变化
     */
    onResize() {
        // 重新绘制图表以适应新的尺寸
        setTimeout(() => {
            this.drawTrendChart();
            this.updateGauge();
        }, 100);
    }
    
    /**
     * 获取组件状�?
     */
    getStatus() {
        return {
            currentTemperature: this.currentData ? parseFloat(this.currentData.temperature) : null,
            thresholds: this.thresholds,
            historyDataCount: this.historyData.length,
            isAutoRefreshEnabled: !!this.refreshInterval
        };
    }
    
    /**
     * 重置组件状�?
     */
    reset() {
        this.currentData = null;
        this.historyData = [];
        
        // 清空显示
        const elements = [
            'temp-value', 'temp-status', 'sensor-status',
            'max-temp', 'min-temp', 'avg-temp', 'trend-text'
        ];
        
        elements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = '--';
            }
        });
        
        // 清空图表
        if (this.chartCanvas) {
            const ctx = this.chartCanvas.getContext('2d');
            ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
        }
        
        // 清空异常记录
        this.clearAlerts();
    }
    
    /**
     * 销毁组�?
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        this.reset();
        this.chartCanvas = null;
        
        console.log('温度监控组件已销�?);
    }
}

// 创建全局温度组件实例
const temperatureComponent = new TemperatureComponent();
