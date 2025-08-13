/**
 * 智能温室环境监控系统 - 数据分析组件
 */

class AnalyticsComponent {
    constructor() {
        this.refreshInterval = null;
        this.currentPeriod = '24h';
        this.analysisData = null;
        this.charts = {};
    }

    async render() {
        return `
            <div class="analytics-container">
                <!-- 分析参数设置 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">📊 分析参数设置</h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="analyticsComponent.exportReport()">
                                📄 导出报告
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-3">
                            <div class="form-group">
                                <label class="form-label">分析周期</label>
                                <select class="form-select" id="analysisPeriod" onchange="analyticsComponent.changePeriod(this.value)">
                                    <option value="1h">最�?小时</option>
                                    <option value="6h">最�?小时</option>
                                    <option value="24h" selected>最�?4小时</option>
                                    <option value="7d">最�?�?/option>
                                    <option value="30d">最�?0�?/option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">分析类型</label>
                                <select class="form-select" id="analysisType" onchange="analyticsComponent.changeAnalysisType(this.value)">
                                    <option value="summary">数据摘要</option>
                                    <option value="trends">趋势分析</option>
                                    <option value="correlation">相关性分�?/option>
                                    <option value="anomaly">异常检�?/option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">数据粒度</label>
                                <select class="form-select" id="dataGranularity">
                                    <option value="1m">1分钟</option>
                                    <option value="5m">5分钟</option>
                                    <option value="15m">15分钟</option>
                                    <option value="1h" selected>1小时</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 数据统计摘要 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">📈 数据统计摘要</h3>
                        <div class="chart-controls">
                            <span id="lastUpdateTime" class="text-secondary">--</span>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-4" id="summaryStats">
                            <!-- 统计数据将在这里动态生�?-->
                        </div>
                    </div>
                </div>

                <!-- 环境参数趋势图表 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">📊 环境参数趋势分析</h3>
                        <div class="chart-controls">
                            <div class="period-buttons">
                                <button class="period-btn active" data-period="24h">24小时</button>
                                <button class="period-btn" data-period="7d">7�?/button>
                                <button class="period-btn" data-period="30d">30�?/button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="trendsChart" class="chart-canvas"></canvas>
                        </div>
                        <div class="chart-legend" id="trendsLegend">
                            <!-- 图例将在这里动态生�?-->
                        </div>
                    </div>
                </div>

                <!-- 参数分布分析 -->
                <div class="grid grid-2">
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">🎯 温度分布分析</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="temperatureDistChart" class="chart-canvas"></canvas>
                            </div>
                            <div id="temperatureStats" class="data-grid">
                                <!-- 温度统计信息 -->
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">💧 湿度分布分析</h3>
                        </div>
                        <div class="card-body">
                            <div class="chart-container">
                                <canvas id="humidityDistChart" class="chart-canvas"></canvas>
                            </div>
                            <div id="humidityStats" class="data-grid">
                                <!-- 湿度统计信息 -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 相关性分�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">🔗 参数相关性分�?/h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2">
                            <div class="chart-container">
                                <canvas id="correlationChart" class="chart-canvas"></canvas>
                            </div>
                            <div id="correlationMatrix">
                                <!-- 相关性矩�?-->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 异常检测结�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">⚠️ 异常模式检�?/h3>
                    </div>
                    <div class="card-body">
                        <div id="anomalyDetection">
                            <!-- 异常检测结�?-->
                        </div>
                    </div>
                </div>

                <!-- 预测分析 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">🔮 环境参数预测</h3>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="predictionChart" class="chart-canvas"></canvas>
                        </div>
                        <div id="predictionSummary" class="grid grid-3">
                            <!-- 预测摘要 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('数据分析组件已初始化');
        
        // 绑定事件监听�?
        this.bindEventListeners();
        
        // 加载初始数据
        await this.loadAnalysisData();
        
        // 启动定时刷新
        this.startAutoRefresh();
    }

    bindEventListeners() {
        // 周期按钮事件
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('period-btn')) {
                // 更新按钮状�?
                document.querySelectorAll('.period-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                
                // 更新图表
                const period = e.target.dataset.period;
                this.currentPeriod = period;
                this.updateTrendsChart(period);
            }
        });
    }

    async changePeriod(period) {
        this.currentPeriod = period;
        await this.loadAnalysisData();
    }

    async changeAnalysisType(type) {
        // 根据分析类型更新显示
        await this.loadAnalysisData();
    }

    async loadAnalysisData() {
        try {
            // 显示加载状�?
            this.showLoading();

            // 获取分析数据
            const params = {
                period: this.currentPeriod,
                granularity: document.getElementById('dataGranularity')?.value || '1h'
            };

            const [summaryData, trendsData, reportsData] = await Promise.all([
                apiService.getAnalyticsSummary(params),
                apiService.getAnalyticsTrends(params),
                apiService.getAnalyticsReports(params)
            ]);

            this.analysisData = {
                summary: summaryData,
                trends: trendsData,
                reports: reportsData
            };

            // 更新各个组件
            this.updateSummaryStats();
            this.updateTrendsChart();
            this.updateDistributionCharts();
            this.updateCorrelationAnalysis();
            this.updateAnomalyDetection();
            this.updatePredictionAnalysis();

            // 更新最后更新时�?
            document.getElementById('lastUpdateTime').textContent = 
                `最后更�? ${formatUtils.formatDateTime(new Date(), 'time')}`;

        } catch (error) {
            console.error('加载分析数据失败:', error);
            this.showError('数据加载失败，请稍后重试');
        } finally {
            this.hideLoading();
        }
    }

    updateSummaryStats() {
        const container = document.getElementById('summaryStats');
        if (!container || !this.analysisData?.summary?.data) return;

        const stats = this.analysisData.summary.data;
        
        container.innerHTML = `
            <div class="data-grid-item">
                <div class="data-grid-value">${formatUtils.formatNumber(stats.totalDataPoints || 0, 0)}</div>
                <div class="data-grid-label">数据点总数</div>
                <div class="data-grid-change trend-up">
                    <span class="trend-arrow"></span>
                    ${formatUtils.formatNumber(stats.dataPointsGrowth || 0, 1)}%
                </div>
            </div>
            <div class="data-grid-item">
                <div class="data-grid-value">${formatUtils.formatTemperature(stats.avgTemperature || 0)}</div>
                <div class="data-grid-label">平均温度</div>
                <div class="data-grid-change ${stats.temperatureTrend > 0 ? 'trend-up' : 'trend-down'}">
                    <span class="trend-arrow"></span>
                    ${formatUtils.formatNumber(Math.abs(stats.temperatureTrend || 0), 1)}°C
                </div>
            </div>
            <div class="data-grid-item">
                <div class="data-grid-value">${formatUtils.formatHumidity(stats.avgHumidity || 0)}</div>
                <div class="data-grid-label">平均湿度</div>
                <div class="data-grid-change ${stats.humidityTrend > 0 ? 'trend-up' : 'trend-down'}">
                    <span class="trend-arrow"></span>
                    ${formatUtils.formatNumber(Math.abs(stats.humidityTrend || 0), 1)}%
                </div>
            </div>
            <div class="data-grid-item">
                <div class="data-grid-value">${formatUtils.formatNumber(stats.anomalyCount || 0, 0)}</div>
                <div class="data-grid-label">异常事件</div>
                <div class="data-grid-change ${stats.anomalyCount > 0 ? 'trend-up' : 'trend-stable'}">
                    <span class="trend-arrow"></span>
                    ${stats.anomalyChange || 0} �?
                </div>
            </div>
        `;
    }

    updateTrendsChart(period = this.currentPeriod) {
        const canvas = document.getElementById('trendsChart');
        if (!canvas || !this.analysisData?.trends?.data) return;

        const trendsData = this.analysisData.trends.data;
        
        // 准备图表数据
        const chartData = this.prepareTrendsData(trendsData, period);
        
        // 绘制多线图表
        this.drawMultiLineChart(canvas, chartData);
        
        // 更新图例
        this.updateTrendsLegend(chartData.series);
    }

    prepareTrendsData(data, period) {
        // 根据周期准备数据
        const timePoints = data.timePoints || [];
        const series = [
            {
                name: '温度',
                data: data.temperature || [],
                color: '#FF6B6B',
                unit: '°C'
            },
            {
                name: '湿度',
                data: data.humidity || [],
                color: '#4ECDC4',
                unit: '%'
            },
            {
                name: '光照强度',
                data: data.lightIntensity || [],
                color: '#FFE66D',
                unit: 'lux'
            },
            {
                name: 'CO2浓度',
                data: data.co2Level || [],
                color: '#A8E6CF',
                unit: 'ppm'
            }
        ];

        return { timePoints, series };
    }

    drawMultiLineChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制网格
        this.drawChartGrid(ctx, padding, chartWidth, chartHeight);

        // 绘制每个数据系列
        data.series.forEach((series, index) => {
            if (series.data && series.data.length > 0) {
                this.drawDataSeries(ctx, series, padding, chartWidth, chartHeight, data.timePoints);
            }
        });

        // 绘制坐标轴标�?
        this.drawAxisLabels(ctx, data.timePoints, padding, chartWidth, chartHeight);
    }

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

    drawDataSeries(ctx, series, padding, chartWidth, chartHeight, timePoints) {
        const values = series.data;
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;

        ctx.strokeStyle = series.color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        values.forEach((value, index) => {
            const x = padding + (chartWidth / (values.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();

        // 绘制数据�?
        ctx.fillStyle = series.color;
        values.forEach((value, index) => {
            const x = padding + (chartWidth / (values.length - 1)) * index;
            const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    drawAxisLabels(ctx, timePoints, padding, chartWidth, chartHeight) {
        ctx.fillStyle = '#666';
        ctx.font = '11px Arial';
        ctx.textAlign = 'center';

        // X轴标签（时间�?
        if (timePoints && timePoints.length > 0) {
            const labelCount = Math.min(6, timePoints.length);
            for (let i = 0; i < labelCount; i++) {
                const index = Math.floor((timePoints.length - 1) * i / (labelCount - 1));
                const x = padding + (chartWidth / (labelCount - 1)) * i;
                const time = new Date(timePoints[index]);
                const label = formatUtils.formatDateTime(time, 'time');
                
                ctx.fillText(label, x, padding + chartHeight + 20);
            }
        }
    }

    updateTrendsLegend(series) {
        const container = document.getElementById('trendsLegend');
        if (!container) return;

        container.innerHTML = series.map(s => `
            <div class="legend-item">
                <div class="legend-color" style="background-color: ${s.color}"></div>
                <span>${s.name} (${s.unit})</span>
            </div>
        `).join('');
    }

    updateDistributionCharts() {
        // 更新温度分布图表
        this.updateTemperatureDistribution();
        
        // 更新湿度分布图表
        this.updateHumidityDistribution();
    }

    updateTemperatureDistribution() {
        const canvas = document.getElementById('temperatureDistChart');
        const statsContainer = document.getElementById('temperatureStats');
        
        if (!canvas || !this.analysisData?.summary?.data) return;

        const tempData = this.analysisData.summary.data.temperatureDistribution || {};
        
        // 绘制温度分布柱状�?
        const distributionData = [
            { label: '低温\n(<20°C)', value: tempData.low || 0 },
            { label: '适宜\n(20-30°C)', value: tempData.optimal || 0 },
            { label: '高温\n(>30°C)', value: tempData.high || 0 }
        ];

        ChartUtils.drawBarChart(canvas.id, distributionData, {
            barColor: '#FF6B6B',
            showValues: true
        });

        // 更新统计信息
        if (statsContainer) {
            const stats = this.analysisData.summary.data;
            statsContainer.innerHTML = `
                <div class="data-display">
                    <div class="data-label">最高温�?/div>
                    <div class="data-value">${formatUtils.formatTemperature(stats.maxTemperature || 0)}</div>
                </div>
                <div class="data-display">
                    <div class="data-label">最低温�?/div>
                    <div class="data-value">${formatUtils.formatTemperature(stats.minTemperature || 0)}</div>
                </div>
                <div class="data-display">
                    <div class="data-label">温度标准�?/div>
                    <div class="data-value">${formatUtils.formatNumber(stats.temperatureStdDev || 0, 2)}°C</div>
                </div>
            `;
        }
    }

    updateHumidityDistribution() {
        const canvas = document.getElementById('humidityDistChart');
        const statsContainer = document.getElementById('humidityStats');
        
        if (!canvas || !this.analysisData?.summary?.data) return;

        const humidityData = this.analysisData.summary.data.humidityDistribution || {};
        
        // 绘制湿度分布柱状�?
        const distributionData = [
            { label: '干燥\n(<40%)', value: humidityData.low || 0 },
            { label: '适宜\n(40-70%)', value: humidityData.optimal || 0 },
            { label: '潮湿\n(>70%)', value: humidityData.high || 0 }
        ];

        ChartUtils.drawBarChart(canvas.id, distributionData, {
            barColor: '#4ECDC4',
            showValues: true
        });

        // 更新统计信息
        if (statsContainer) {
            const stats = this.analysisData.summary.data;
            statsContainer.innerHTML = `
                <div class="data-display">
                    <div class="data-label">最高湿�?/div>
                    <div class="data-value">${formatUtils.formatHumidity(stats.maxHumidity || 0)}</div>
                </div>
                <div class="data-display">
                    <div class="data-label">最低湿�?/div>
                    <div class="data-value">${formatUtils.formatHumidity(stats.minHumidity || 0)}</div>
                </div>
                <div class="data-display">
                    <div class="data-label">湿度标准�?/div>
                    <div class="data-value">${formatUtils.formatNumber(stats.humidityStdDev || 0, 2)}%</div>
                </div>
            `;
        }
    }

    updateCorrelationAnalysis() {
        const canvas = document.getElementById('correlationChart');
        const matrixContainer = document.getElementById('correlationMatrix');
        
        if (!canvas || !this.analysisData?.reports?.data) return;

        const correlationData = this.analysisData.reports.data.correlation || {};
        
        // 绘制相关性散点图
        this.drawCorrelationScatter(canvas, correlationData);
        
        // 更新相关性矩�?
        this.updateCorrelationMatrix(matrixContainer, correlationData);
    }

    drawCorrelationScatter(canvas, data) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制坐标�?
        ctx.strokeStyle = '#ccc';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(padding, padding);
        ctx.lineTo(padding, padding + chartHeight);
        ctx.lineTo(padding + chartWidth, padding + chartHeight);
        ctx.stroke();

        // 绘制散点（温度vs湿度相关性）
        if (data.temperatureHumidity) {
            ctx.fillStyle = '#FF6B6B';
            data.temperatureHumidity.forEach(point => {
                const x = padding + (point.x / 100) * chartWidth;
                const y = padding + chartHeight - (point.y / 100) * chartHeight;
                
                ctx.beginPath();
                ctx.arc(x, y, 2, 0, 2 * Math.PI);
                ctx.fill();
            });
        }

        // 添加标签
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('温度 vs 湿度相关�?, canvas.width / 2, padding - 10);
    }

    updateCorrelationMatrix(container, data) {
        if (!container) return;

        const correlations = data.matrix || {
            'temperature-humidity': -0.65,
            'temperature-light': 0.42,
            'humidity-light': -0.38,
            'temperature-co2': 0.23,
            'humidity-co2': -0.15,
            'light-co2': 0.31
        };

        container.innerHTML = `
            <div class="correlation-matrix">
                <h4>参数相关性系�?/h4>
                ${Object.entries(correlations).map(([key, value]) => {
                    const [param1, param2] = key.split('-');
                    const strength = Math.abs(value);
                    const direction = value > 0 ? '正相�? : '负相�?;
                    const strengthText = strength > 0.7 ? '�? : strength > 0.4 ? '中等' : '�?;
                    
                    return `
                        <div class="correlation-item">
                            <div class="correlation-params">${this.getParamName(param1)} - ${this.getParamName(param2)}</div>
                            <div class="correlation-value ${value > 0 ? 'positive' : 'negative'}">
                                ${formatUtils.formatNumber(value, 2)}
                            </div>
                            <div class="correlation-desc">${strengthText}${direction}</div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    getParamName(param) {
        const names = {
            temperature: '温度',
            humidity: '湿度',
            light: '光照',
            co2: 'CO2'
        };
        return names[param] || param;
    }

    updateAnomalyDetection() {
        const container = document.getElementById('anomalyDetection');
        if (!container || !this.analysisData?.reports?.data) return;

        const anomalies = this.analysisData.reports.data.anomalies || [];
        
        if (anomalies.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">�?/div>
                    <div class="empty-state-title">未发现异常模�?/div>
                    <div class="empty-state-description">当前分析周期内环境参数表现正�?/div>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="anomaly-list">
                ${anomalies.map(anomaly => `
                    <div class="anomaly-item">
                        <div class="anomaly-header">
                            <div class="anomaly-type ${anomaly.severity}">${anomaly.type}</div>
                            <div class="anomaly-time">${formatUtils.formatDateTime(anomaly.timestamp)}</div>
                        </div>
                        <div class="anomaly-description">${anomaly.description}</div>
                        <div class="anomaly-details">
                            <span>影响参数: ${anomaly.parameters.join(', ')}</span>
                            <span>异常程度: ${formatUtils.formatNumber(anomaly.score * 100, 1)}%</span>
                        </div>
                        ${anomaly.suggestion ? `<div class="anomaly-suggestion">💡 ${anomaly.suggestion}</div>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }

    updatePredictionAnalysis() {
        const canvas = document.getElementById('predictionChart');
        const summaryContainer = document.getElementById('predictionSummary');
        
        if (!canvas || !this.analysisData?.reports?.data) return;

        const predictions = this.analysisData.reports.data.predictions || {};
        
        // 绘制预测图表
        this.drawPredictionChart(canvas, predictions);
        
        // 更新预测摘要
        this.updatePredictionSummary(summaryContainer, predictions);
    }

    drawPredictionChart(canvas, data) {
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        const padding = 60;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制网格
        this.drawChartGrid(ctx, padding, chartWidth, chartHeight);

        // 绘制历史数据和预测数�?
        if (data.temperature) {
            this.drawPredictionSeries(ctx, data.temperature, padding, chartWidth, chartHeight, '#FF6B6B');
        }

        // 添加预测区域标识
        ctx.fillStyle = 'rgba(255, 107, 107, 0.1)';
        const predictionStart = chartWidth * 0.7; // 假设70%是历史数�?
        ctx.fillRect(padding + predictionStart, padding, chartWidth - predictionStart, chartHeight);

        // 添加标签
        ctx.fillStyle = '#666';
        ctx.font = '12px Arial';
        ctx.textAlign = 'left';
        ctx.fillText('历史数据', padding + 10, padding + 20);
        ctx.fillText('预测数据', padding + predictionStart + 10, padding + 20);
    }

    drawPredictionSeries(ctx, data, padding, chartWidth, chartHeight, color) {
        const allValues = [...(data.historical || []), ...(data.predicted || [])];
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const valueRange = maxValue - minValue || 1;

        // 绘制历史数据
        if (data.historical && data.historical.length > 0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            data.historical.forEach((value, index) => {
                const x = padding + (chartWidth * 0.7 / (data.historical.length - 1)) * index;
                const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
        }

        // 绘制预测数据（虚线）
        if (data.predicted && data.predicted.length > 0) {
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();

            const startX = padding + chartWidth * 0.7;
            data.predicted.forEach((value, index) => {
                const x = startX + (chartWidth * 0.3 / (data.predicted.length - 1)) * index;
                const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;
                
                if (index === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            });
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }

    updatePredictionSummary(container, data) {
        if (!container) return;

        container.innerHTML = `
            <div class="prediction-item">
                <div class="prediction-param">温度预测</div>
                <div class="prediction-value">${formatUtils.formatTemperature(data.temperature?.nextHour || 0)}</div>
                <div class="prediction-confidence">置信�? ${formatUtils.formatPercentage(data.temperature?.confidence || 0, 1)}%</div>
            </div>
            <div class="prediction-item">
                <div class="prediction-param">湿度预测</div>
                <div class="prediction-value">${formatUtils.formatHumidity(data.humidity?.nextHour || 0)}</div>
                <div class="prediction-confidence">置信�? ${formatUtils.formatPercentage(data.humidity?.confidence || 0, 1)}%</div>
            </div>
            <div class="prediction-item">
                <div class="prediction-param">趋势预测</div>
                <div class="prediction-value">${data.trend?.direction || '稳定'}</div>
                <div class="prediction-confidence">预测准确�? ${formatUtils.formatPercentage(data.trend?.accuracy || 0, 1)}%</div>
            </div>
        `;
    }

    async exportReport() {
        try {
            const params = {
                period: this.currentPeriod,
                format: 'pdf',
                includeCharts: true
            };

            // 显示导出进度
            const loadingElement = document.createElement('div');
            loadingElement.className = 'loading-overlay';
            loadingElement.innerHTML = `
                <div class="loading-spinner"></div>
                <div>正在生成分析报告...</div>
            `;
            document.body.appendChild(loadingElement);

            // 调用导出API
            const result = await apiService.exportAnalyticsReport(params);
            
            if (result.success && result.data.downloadUrl) {
                // 创建下载链接
                const link = document.createElement('a');
                link.href = result.data.downloadUrl;
                link.download = result.data.filename || `环境分析报告_${formatUtils.formatDateTime(new Date(), 'date')}.pdf`;
                
                // 模拟下载（在实际环境中会触发真实下载�?
                if (result.data.downloadUrl === '#') {
                    this.showSuccess('报告导出功能演示完成（实际环境中会下载PDF文件�?);
                } else {
                    link.click();
                    this.showSuccess('报告导出成功');
                }
            } else {
                throw new Error('导出失败');
            }

        } catch (error) {
            console.error('导出报告失败:', error);
            this.showError('报告导出失败，请稍后重试');
        } finally {
            // 隐藏加载提示
            const loadingElement = document.querySelector('.loading-overlay');
            if (loadingElement) {
                loadingElement.remove();
            }
        }
    }

    startAutoRefresh() {
        // �?分钟自动刷新数据
        this.refreshInterval = setInterval(() => {
            this.loadAnalysisData();
        }, 5 * 60 * 1000);
    }

    showLoading() {
        // 显示加载状态的实现
        const containers = ['summaryStats', 'trendsChart', 'temperatureDistChart', 'humidityDistChart'];
        containers.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.innerHTML = `
                    <div class="loading">
                        <div class="loading-spinner"></div>
                        <div>加载�?..</div>
                    </div>
                `;
            }
        });
    }

    hideLoading() {
        // 隐藏加载状态的实现已在updateXXX方法中处�?
    }

    showError(message) {
        // 显示错误提示
        console.error(message);
        // 这里可以集成通知系统
    }

    showSuccess(message) {
        // 显示成功提示
        console.log(message);
        // 这里可以集成通知系统
    }

    async refresh() {
        console.log('刷新分析数据');
        await this.loadAnalysisData();
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        
        // 清理图表资源
        Object.values(this.charts).forEach(chart => {
            if (chart && chart.destroy) {
                chart.destroy();
            }
        });
        
        this.charts = {};
    }
}
