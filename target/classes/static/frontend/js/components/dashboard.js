                         <div class="data-value" id="currentTemperature">
                                    --°C
                                </div>
                                <div class="data-status" id="temperatureStatus">正常</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="temperatureProgress" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="icon-humidity"></i>
                                空气湿度
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-value" id="currentHumidity">
                                    --%
                                </div>
                                <div class="data-status" id="humidityStatus">正常</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="humidityProgress" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="icon-light"></i>
                                光照强度
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-value" id="currentLight">
                                    -- lux
                                </div>
                                <div class="data-status" id="lightStatus">正常</div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="lightProgress" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <i class="icon-alert"></i>
                                活跃报警
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-value" id="activeAlerts">
                                    0
                                </div>
                                <div class="data-status" id="alertsStatus">正常</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 设备状态概�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-control"></i>
                            设备状态概�?
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="app.loadModule('control')">
                                设备控制
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2" id="deviceOverview">
                            <!-- 设备状态将在这里动态加�?-->
                        </div>
                    </div>
                </div>

                <!-- 环境趋势图表 -->
                <div class="grid grid-2">
                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">24小时温度趋势</h3>
                            <div class="chart-controls">
                                <div class="chart-period">
                                    <button class="period-btn active" data-period="24h">24小时</button>
                                    <button class="period-btn" data-period="7d">7�?/button>
                                    <button class="period-btn" data-period="30d">30�?/button>
                                </div>
                            </div>
                        </div>
                        <div class="line-chart">
                            <canvas id="temperatureChart" class="chart-canvas"></canvas>
                        </div>
                    </div>

                    <div class="chart-container">
                        <div class="chart-header">
                            <h3 class="chart-title">24小时湿度趋势</h3>
                            <div class="chart-controls">
                                <div class="chart-period">
                                    <button class="period-btn active" data-period="24h">24小时</button>
                                    <button class="period-btn" data-period="7d">7�?/button>
                                    <button class="period-btn" data-period="30d">30�?/button>
                                </div>
                            </div>
                        </div>
                        <div class="line-chart">
                            <canvas id="humidityChart" class="chart-canvas"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 最近报�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-alert"></i>
                            最近报�?
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="app.loadModule('alerts')">
                                查看全部
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="recentAlerts">
                            <!-- 最近报警将在这里动态加�?-->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 初始化组�?
     */
    async init() {
        await this.loadData();
        this.bindEvents();
        this.startAutoRefresh();
    }

    /**
     * 加载数据
     */
    async loadData() {
        try {
            // 加载环境数据
            await this.loadEnvironmentData();
            
            // 加载设备状�?
            await this.loadDeviceStatus();
            
            // 加载报警信息
            await this.loadAlerts();
            
            // 加载图表数据
            await this.loadChartData();
            
        } catch (error) {
            console.error('加载仪表盘数据失�?', error);
            app.showToast('加载数据失败', 'error');
        }
    }

    /**
     * 加载环境数据
     */
    async loadEnvironmentData() {
        try {
            // 使用模拟数据，实际项目中应调用真实API
            const response = apiService.generateMockEnvironmentData();
            const data = response.data;

            // 更新温度显示
            document.getElementById('currentTemperature').textContent = 
                FormatUtils.formatTemperature(data.temperature);
            this.updateProgressBar('temperatureProgress', data.temperature, 15, 35);
            this.updateStatus('temperatureStatus', data.temperature, 15, 35);

            // 更新湿度显示
            document.getElementById('currentHumidity').textContent = 
                FormatUtils.formatHumidity(data.humidity);
            this.updateProgressBar('humidityProgress', data.humidity, 30, 80);
            this.updateStatus('humidityStatus', data.humidity, 30, 80);

            // 更新光照显示
            document.getElementById('currentLight').textContent = 
                FormatUtils.formatLightIntensity(data.lightIntensity);
            this.updateProgressBar('lightProgress', data.lightIntensity, 500, 3000);
            this.updateStatus('lightStatus', data.lightIntensity, 500, 3000);

        } catch (error) {
            console.error('加载环境数据失败:', error);
        }
    }

    /**
     * 加载设备状�?
     */
    async loadDeviceStatus() {
        try {
            const response = apiService.generateMockDevices();
            const devices = response.data;

            const deviceOverview = document.getElementById('deviceOverview');
            deviceOverview.innerHTML = devices.map(device => {
                const statusInfo = FormatUtils.formatDeviceStatus(device.status);
                const deviceTypeText = FormatUtils.formatDeviceType(device.type);
                
                return `
                    <div class="device-control">
                        <div class="device-info">
                            <div class="device-icon ${device.status}">
                                ${this.getDeviceIcon(device.type)}
                            </div>
                            <div class="device-details">
                                <h4>${device.name}</h4>
                                <p>${deviceTypeText} - ${statusInfo.text}</p>
                            </div>
                        </div>
                        <div class="device-controls">
                            <div class="data-status ${statusInfo.class}">
                                ${device.isRunning ? '运行�? : '已停�?}
                            </div>
                        </div>
                    </div>
                `;
            }).join('');

        } catch (error) {
            console.error('加载设备状态失�?', error);
        }
    }

    /**
     * 加载报警信息
     */
    async loadAlerts() {
        try {
            const response = apiService.generateMockAlerts();
            const alerts = response.data;

            // 更新活跃报警数量
            const activeAlerts = alerts.filter(alert => !alert.isResolved);
            document.getElementById('activeAlerts').textContent = activeAlerts.length;
            
            const alertsStatus = document.getElementById('alertsStatus');
            if (activeAlerts.length === 0) {
                alertsStatus.textContent = '正常';
                alertsStatus.className = 'data-status status-normal';
            } else {
                alertsStatus.textContent = '有报�?;
                alertsStatus.className = 'data-status status-danger';
            }

            // 显示最近报�?
            const recentAlerts = document.getElementById('recentAlerts');
            if (alerts.length === 0) {
                recentAlerts.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">�?/div>
                        <div class="empty-state-title">暂无报警</div>
                        <div class="empty-state-description">系统运行正常</div>
                    </div>
                `;
            } else {
                recentAlerts.innerHTML = alerts.slice(0, 3).map(alert => {
                    const severityInfo = FormatUtils.formatAlertSeverity(alert.severity);
                    return `
                        <div class="data-display">
                            <div class="data-label">
                                <span class="tag ${severityInfo.class}">${severityInfo.text}</span>
                                ${FormatUtils.formatAlertType(alert.type)}
                            </div>
                            <div class="data-value">
                                ${FormatUtils.formatDateTime(alert.createdAt, 'relative')}
                            </div>
                        </div>
                    `;
                }).join('');
            }

        } catch (error) {
            console.error('加载报警信息失败:', error);
        }
    }

    /**
     * 加载图表数据
     */
    async loadChartData() {
        try {
            // 生成模拟�?4小时数据
            const hours = 24;
            const temperatureData = [];
            const humidityData = [];
            
            for (let i = hours; i >= 0; i--) {
                const time = new Date(Date.now() - i * 60 * 60 * 1000);
                temperatureData.push({
                    time: time.getHours() + ':00',
                    value: 20 + Math.random() * 15
                });
                humidityData.push({
                    time: time.getHours() + ':00',
                    value: 40 + Math.random() * 40
                });
            }

            // 绘制温度图表
            this.drawLineChart('temperatureChart', temperatureData, '°C');
            
            // 绘制湿度图表
            this.drawLineChart('humidityChart', humidityData, '%');

        } catch (error) {
            console.error('加载图表数据失败:', error);
        }
    }

    /**
     * 绘制折线�?
     * @param {string} canvasId - Canvas元素ID
     * @param {Array} data - 数据数组
     * @param {string} unit - 单位
     */
    drawLineChart(canvasId, data, unit) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        // 设置canvas实际大小
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (data.length === 0) return;

        // 计算数据范围
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;

        // 设置绘图区域
        const padding = 40;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        // 绘制网格�?
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
        const stepX = chartWidth / (data.length - 1);
        for (let i = 0; i < data.length; i += Math.ceil(data.length / 6)) {
            const x = padding + stepX * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }

        // 绘制数据�?
        ctx.strokeStyle = '#2E7D32';
        ctx.lineWidth = 2;
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

        // 绘制数据�?
        ctx.fillStyle = '#2E7D32';
        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, 2 * Math.PI);
            ctx.fill();
        });
    }

    /**
     * 更新进度�?
     * @param {string} elementId - 进度条元素ID
     * @param {number} value - 当前�?
     * @param {number} min - 最小�?
     * @param {number} max - 最大�?
     */
    updateProgressBar(elementId, value, min, max) {
        const element = document.getElementById(elementId);
        if (!element) return;

        const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));
        element.style.width = `${percentage}%`;

        // 根据值设置颜�?
        element.className = 'progress-fill';
        if (value < min * 1.1 || value > max * 0.9) {
            element.classList.add('warning');
        }
        if (value < min || value > max) {
            element.classList.add('danger');
        }
    }

    /**
     * 更新状态显�?
     * @param {string} elementId - 状态元素ID
     * @param {number} value - 当前�?
     * @param {number} min - 最小�?
     * @param {number} max - 最大�?
     */
    updateStatus(elementId, value, min, max) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (value >= min && value <= max) {
            element.textContent = '正常';
            element.className = 'data-status status-normal';
        } else if (value < min * 0.9 || value > max * 1.1) {
            element.textContent = '异常';
            element.className = 'data-status status-danger';
        } else {
            element.textContent = '警告';
            element.className = 'data-status status-warning';
        }
    }

    /**
     * 获取设备图标
     * @param {string} deviceType - 设备类型
     * @returns {string} 图标字符
     */
    getDeviceIcon(deviceType) {
        const icons = {
            heater: '🔥',
            cooler: '❄️',
            humidifier: '💧',
            dehumidifier: '💨',
            fan: '🌀',
            light: '💡',
            irrigation: '🚿'
        };
        return icons[deviceType] || '⚙️';
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 图表周期切换
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const period = e.target.dataset.period;
                const container = e.target.closest('.chart-container');
                
                // 更新按钮状�?
                container.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                // 重新加载图表数据
                this.loadChartData();
            });
        });
    }

    /**
     * 开始自动刷�?
     */
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.loadData();
        }, 30000); // 30秒刷新一�?
    }

    /**
     * 停止自动刷新
     */
    stopAutoRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /**
     * 刷新组件
     */
    async refresh() {
        await this.loadData();
    }

    /**
     * 窗口大小变化处理
     */
    onResize() {
        // 重新绘制图表
        setTimeout(() => {
            this.loadChartData();
        }, 100);
    }

    /**
     * 销毁组�?
     */
    destroy() {
        this.stopAutoRefresh();
    }
}
