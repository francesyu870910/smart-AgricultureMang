/**
 * 智能温室环境监控系统 - 通风系统组件
 * 实现通风设备控制、CO2监测和空气质量显示功�?
 */

class VentilationComponent {
    constructor() {
        this.refreshInterval = null;
        this.ventilationDevices = [];
        this.environmentData = null;
        this.isLoading = false;
    }

    async render() {
        return `
            <div class="ventilation-container">
                <!-- 空气质量监控卡片 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-fan"></i>
                            空气质量监控
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-refresh" onclick="ventilationComponent.refreshData()">
                                <i class="icon-refresh"></i>
                                刷新
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-3">
                            <div class="data-display">
                                <div class="data-label">CO2浓度</div>
                                <div class="data-value" id="co2Level">
                                    <span id="co2Value">--</span>
                                    <span class="data-unit">ppm</span>
                                    <span class="data-status" id="co2Status">--</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="co2Progress" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">空气流通率</div>
                                <div class="data-value" id="airFlowRate">
                                    <span id="flowValue">--</span>
                                    <span class="data-unit">%</span>
                                    <span class="data-status" id="flowStatus">--</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="flowProgress" style="width: 0%"></div>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">空气质量指数</div>
                                <div class="data-value" id="airQuality">
                                    <span id="qualityValue">--</span>
                                    <span class="data-status" id="qualityStatus">--</span>
                                </div>
                                <div class="progress-bar">
                                    <div class="progress-fill" id="qualityProgress" style="width: 0%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 通风设备控制卡片 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-control"></i>
                            通风设备控制
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="ventilationComponent.showBatchControlModal()">
                                批量控制
                            </button>
                            <button class="btn btn-secondary" onclick="ventilationComponent.showAutoControlModal()">
                                自动控制
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="ventilationDevicesList">
                            <div class="loading">
                                <div class="loading-spinner"></div>
                                <p>加载设备列表�?..</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 通风数据图表卡片 -->
                <div class="data-card chart-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-chart"></i>
                            通风数据趋势
                        </h3>
                        <div class="chart-controls">
                            <div class="period-buttons">
                                <button class="period-btn active" data-period="1h" onclick="ventilationComponent.changePeriod('1h')">1小时</button>
                                <button class="period-btn" data-period="6h" onclick="ventilationComponent.changePeriod('6h')">6小时</button>
                                <button class="period-btn" data-period="24h" onclick="ventilationComponent.changePeriod('24h')">24小时</button>
                                <button class="period-btn" data-period="7d" onclick="ventilationComponent.changePeriod('7d')">7�?/button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="ventilationChart" width="800" height="300"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 通风系统状态卡�?-->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-dashboard"></i>
                            系统运行状�?
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2">
                            <div class="data-display">
                                <div class="data-label">运行设备数量</div>
                                <div class="data-value">
                                    <span id="runningDevicesCount">--</span>
                                    <span class="data-unit">�?/span>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">总功�?/div>
                                <div class="data-value">
                                    <span id="totalPowerConsumption">--</span>
                                    <span class="data-unit">W</span>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">平均风�?/div>
                                <div class="data-value">
                                    <span id="averageWindSpeed">--</span>
                                    <span class="data-unit">m/s</span>
                                </div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">通风效率</div>
                                <div class="data-value">
                                    <span id="ventilationEfficiency">--</span>
                                    <span class="data-unit">%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('通风系统组件初始化开�?);
        
        try {
            // 加载初始数据
            await this.loadInitialData();
            
            // 设置定时刷新
            this.startAutoRefresh();
            
            console.log('通风系统组件初始化完�?);
        } catch (error) {
            console.error('通风系统组件初始化失�?', error);
            notificationUtils.error('通风系统初始化失�?, '系统错误');
        }
    }

    async loadInitialData() {
        this.isLoading = true;
        
        try {
            // 并行加载数据
            const [environmentData, ventilationDevices] = await Promise.all([
                this.loadEnvironmentData(),
                this.loadVentilationDevices()
            ]);

            this.environmentData = environmentData;
            this.ventilationDevices = ventilationDevices;

            // 更新界面
            this.updateAirQualityDisplay();
            this.updateDevicesList();
            this.updateSystemStatus();
            this.updateChart('1h');

        } catch (error) {
            console.error('加载初始数据失败:', error);
            throw error;
        } finally {
            this.isLoading = false;
        }
    }

    async loadEnvironmentData() {
        try {
            const response = await apiService.getCurrentEnvironmentData();
            return response.data || this.generateMockEnvironmentData();
        } catch (error) {
            console.warn('获取环境数据失败，使用模拟数�?', error);
            return this.generateMockEnvironmentData();
        }
    }

    async loadVentilationDevices() {
        try {
            const response = await apiService.get('/devices/type/fan');
            return response.data || [];
        } catch (error) {
            console.warn('获取通风设备失败，使用模拟数�?', error);
            return this.generateMockVentilationDevices();
        }
    }

    updateAirQualityDisplay() {
        if (!this.environmentData) return;

        const co2Level = this.environmentData.co2Level || 400;
        const temperature = this.environmentData.temperature || 25;
        
        // 更新CO2浓度显示
        document.getElementById('co2Value').textContent = FormatUtils.formatNumber(co2Level, 0);
        
        // 计算CO2状态和进度
        const co2Status = this.getCO2Status(co2Level);
        const co2StatusElement = document.getElementById('co2Status');
        co2StatusElement.textContent = co2Status.text;
        co2StatusElement.className = `data-status ${co2Status.class}`;
        
        const co2Progress = Math.min((co2Level / 1500) * 100, 100);
        const co2ProgressElement = document.getElementById('co2Progress');
        co2ProgressElement.style.width = `${co2Progress}%`;
        co2ProgressElement.className = `progress-fill ${co2Status.progressClass}`;

        // 计算空气流通率
        const airFlowRate = this.calculateAirFlowRate();
        document.getElementById('flowValue').textContent = FormatUtils.formatNumber(airFlowRate, 0);
        
        const flowStatus = this.getFlowStatus(airFlowRate);
        const flowStatusElement = document.getElementById('flowStatus');
        flowStatusElement.textContent = flowStatus.text;
        flowStatusElement.className = `data-status ${flowStatus.class}`;
        
        document.getElementById('flowProgress').style.width = `${airFlowRate}%`;

        // 计算空气质量指数
        const airQualityIndex = this.calculateAirQualityIndex(co2Level, temperature);
        document.getElementById('qualityValue').textContent = airQualityIndex.value;
        
        const qualityStatusElement = document.getElementById('qualityStatus');
        qualityStatusElement.textContent = airQualityIndex.status;
        qualityStatusElement.className = `data-status ${airQualityIndex.class}`;
        
        document.getElementById('qualityProgress').style.width = `${airQualityIndex.progress}%`;
    }

    updateDevicesList() {
        const container = document.getElementById('ventilationDevicesList');
        
        if (this.ventilationDevices.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🌀</div>
                    <div class="empty-state-title">暂无通风设备</div>
                    <div class="empty-state-description">请检查设备连接状�?/div>
                </div>
            `;
            return;
        }

        const devicesHtml = this.ventilationDevices.map(device => `
            <div class="device-control" data-device-id="${device.deviceId}">
                <div class="device-info">
                    <div class="device-icon ${device.status}">
                        ${this.getDeviceIcon(device.deviceType)}
                    </div>
                    <div class="device-details">
                        <h4>${device.deviceName}</h4>
                        <p>${FormatUtils.formatDeviceType(device.deviceType)} - ${FormatUtils.formatDeviceStatus(device.status).text}</p>
                        <p>功率: ${FormatUtils.formatPowerLevel(device.powerLevel)}</p>
                    </div>
                </div>
                <div class="device-controls">
                    <div class="switch">
                        <input type="checkbox" id="switch-${device.deviceId}" 
                               ${device.isRunning ? 'checked' : ''} 
                               ${device.status !== 'online' ? 'disabled' : ''}
                               onchange="ventilationComponent.toggleDevice('${device.deviceId}', this.checked)">
                        <span class="slider"></span>
                    </div>
                    <div class="slider-control">
                        <div class="slider-label">
                            <span>风�?/span>
                            <span>${FormatUtils.formatPowerLevel(device.powerLevel)}</span>
                        </div>
                        <input type="range" class="range-slider" 
                               min="0" max="100" value="${device.powerLevel}"
                               ${device.status !== 'online' || !device.isRunning ? 'disabled' : ''}
                               onchange="ventilationComponent.adjustDevicePower('${device.deviceId}', this.value)">
                    </div>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-secondary" 
                                onclick="ventilationComponent.showDeviceDetails('${device.deviceId}')"
                                title="设备详情">
                            详情
                        </button>
                        <button class="btn btn-sm btn-danger" 
                                onclick="ventilationComponent.resetDevice('${device.deviceId}')"
                                ${device.status !== 'online' ? 'disabled' : ''}
                                title="重置设备">
                            重置
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        container.innerHTML = devicesHtml;
    }

    updateSystemStatus() {
        const runningDevices = this.ventilationDevices.filter(d => d.isRunning);
        const totalPower = runningDevices.reduce((sum, d) => sum + (d.powerLevel * 0.5), 0); // 假设每台设备最大功�?0W
        const averageWindSpeed = runningDevices.length > 0 ? 
            runningDevices.reduce((sum, d) => sum + (d.powerLevel * 0.1), 0) / runningDevices.length : 0;
        const efficiency = this.calculateVentilationEfficiency();

        document.getElementById('runningDevicesCount').textContent = runningDevices.length;
        document.getElementById('totalPowerConsumption').textContent = FormatUtils.formatNumber(totalPower, 0);
        document.getElementById('averageWindSpeed').textContent = FormatUtils.formatNumber(averageWindSpeed, 1);
        document.getElementById('ventilationEfficiency').textContent = FormatUtils.formatNumber(efficiency, 0);
    }

    async updateChart(period) {
        try {
            // 生成模拟图表数据
            const chartData = this.generateChartData(period);
            
            // 绘制图表
            ChartUtils.drawLineChart('ventilationChart', chartData, {
                lineColor: '#2E7D32',
                pointColor: '#4CAF50',
                showGrid: true,
                showPoints: true
            });
        } catch (error) {
            console.error('更新图表失败:', error);
        }
    }

    async toggleDevice(deviceId, isRunning) {
        try {
            const action = isRunning ? 'start' : 'stop';
            const response = await apiService.post(`/devices/${deviceId}/${action}`, {
                operator: 'user',
                operationSource: 'manual'
            });

            if (response.success) {
                // 更新本地设备状�?
                const device = this.ventilationDevices.find(d => d.deviceId === deviceId);
                if (device) {
                    device.isRunning = isRunning;
                    if (!isRunning) {
                        device.powerLevel = 0;
                    }
                }

                // 刷新显示
                this.updateDevicesList();
                this.updateSystemStatus();
                
                notificationUtils.success(`设备${isRunning ? '启动' : '停止'}成功`);
            }
        } catch (error) {
            console.error('设备控制失败:', error);
            notificationUtils.error('设备控制失败', '操作失败');
            
            // 恢复开关状�?
            const switchElement = document.getElementById(`switch-${deviceId}`);
            if (switchElement) {
                switchElement.checked = !isRunning;
            }
        }
    }

    async adjustDevicePower(deviceId, powerLevel) {
        try {
            const response = await apiService.post(`/devices/${deviceId}/adjust`, {
                powerLevel: parseFloat(powerLevel),
                operator: 'user',
                operationSource: 'manual'
            });

            if (response.success) {
                // 更新本地设备状�?
                const device = this.ventilationDevices.find(d => d.deviceId === deviceId);
                if (device) {
                    device.powerLevel = parseFloat(powerLevel);
                }

                // 更新显示
                this.updateSystemStatus();
                
                // 更新滑块标签
                const deviceElement = document.querySelector(`[data-device-id="${deviceId}"]`);
                if (deviceElement) {
                    const label = deviceElement.querySelector('.slider-label span:last-child');
                    if (label) {
                        label.textContent = FormatUtils.formatPowerLevel(powerLevel);
                    }
                }
            }
        } catch (error) {
            console.error('调节设备功率失败:', error);
            notificationUtils.error('调节设备功率失败', '操作失败');
        }
    }

    async resetDevice(deviceId) {
        notificationUtils.showConfirm(
            '确定要重置该设备吗？重置后设备将停止运行并恢复默认设置�?,
            async () => {
                try {
                    const response = await apiService.post(`/devices/${deviceId}/reset`, {
                        operator: 'user',
                        operationSource: 'manual'
                    });

                    if (response.success) {
                        // 更新本地设备状�?
                        const device = this.ventilationDevices.find(d => d.deviceId === deviceId);
                        if (device) {
                            device.isRunning = false;
                            device.powerLevel = 0;
                        }

                        // 刷新显示
                        this.updateDevicesList();
                        this.updateSystemStatus();
                        
                        notificationUtils.success('设备重置成功');
                    }
                } catch (error) {
                    console.error('设备重置失败:', error);
                    notificationUtils.error('设备重置失败', '操作失败');
                }
            },
            null,
            '重置设备'
        );
    }

    showDeviceDetails(deviceId) {
        const device = this.ventilationDevices.find(d => d.deviceId === deviceId);
        if (!device) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>设备详情 - ${device.deviceName}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="data-display">
                        <div class="data-label">设备ID</div>
                        <div class="data-value">${device.deviceId}</div>
                    </div>
                    <div class="data-display">
                        <div class="data-label">设备类型</div>
                        <div class="data-value">${FormatUtils.formatDeviceType(device.deviceType)}</div>
                    </div>
                    <div class="data-display">
                        <div class="data-label">运行状�?/div>
                        <div class="data-value">
                            <span class="data-status ${FormatUtils.formatDeviceStatus(device.status).class}">
                                ${FormatUtils.formatDeviceStatus(device.status).text}
                            </span>
                        </div>
                    </div>
                    <div class="data-display">
                        <div class="data-label">是否运行</div>
                        <div class="data-value">${device.isRunning ? '�? : '�?}</div>
                    </div>
                    <div class="data-display">
                        <div class="data-label">当前功率</div>
                        <div class="data-value">${FormatUtils.formatPowerLevel(device.powerLevel)}</div>
                    </div>
                    <div class="data-display">
                        <div class="data-label">最后维�?/div>
                        <div class="data-value">${FormatUtils.formatDateTime(device.lastMaintenance, 'date')}</div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close-btn">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showBatchControlModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>批量控制通风设备</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">控制操作</label>
                        <select class="form-select" id="batchAction">
                            <option value="start">启动设备</option>
                            <option value="stop">停止设备</option>
                            <option value="adjust">调节功率</option>
                        </select>
                    </div>
                    <div class="form-group" id="powerLevelGroup" style="display: none;">
                        <label class="form-label">功率级别 (%)</label>
                        <input type="range" class="range-slider" id="batchPowerLevel" min="0" max="100" value="50">
                        <div class="slider-label">
                            <span>0%</span>
                            <span id="batchPowerValue">50%</span>
                            <span>100%</span>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="form-label">选择设备</label>
                        <div id="deviceCheckboxes">
                            ${this.ventilationDevices.map(device => `
                                <label style="display: block; margin: 5px 0;">
                                    <input type="checkbox" value="${device.deviceId}" 
                                           ${device.status === 'online' ? '' : 'disabled'}>
                                    ${device.deviceName} (${FormatUtils.formatDeviceStatus(device.status).text})
                                </label>
                            `).join('')}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close-btn">取消</button>
                    <button class="btn btn-primary" id="executeBatchControl">执行</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        const actionSelect = modal.querySelector('#batchAction');
        const powerLevelGroup = modal.querySelector('#powerLevelGroup');
        const powerSlider = modal.querySelector('#batchPowerLevel');
        const powerValue = modal.querySelector('#batchPowerValue');

        actionSelect.addEventListener('change', () => {
            powerLevelGroup.style.display = actionSelect.value === 'adjust' ? 'block' : 'none';
        });

        powerSlider.addEventListener('input', () => {
            powerValue.textContent = `${powerSlider.value}%`;
        });

        const executeBtn = modal.querySelector('#executeBatchControl');
        executeBtn.addEventListener('click', async () => {
            const action = actionSelect.value;
            const powerLevel = powerSlider.value;
            const selectedDevices = Array.from(modal.querySelectorAll('#deviceCheckboxes input:checked'))
                .map(cb => cb.value);

            if (selectedDevices.length === 0) {
                notificationUtils.warning('请选择要控制的设备');
                return;
            }

            try {
                const controlData = {
                    deviceIds: selectedDevices,
                    action: action,
                    powerLevel: action === 'adjust' ? parseFloat(powerLevel) : null,
                    operator: 'user',
                    operationSource: 'manual'
                };

                const response = await apiService.post('/devices/batch-control', controlData);
                
                if (response.success) {
                    notificationUtils.success(`批量控制完成，成功：${response.data.successCount}，失败：${response.data.failedCount}`);
                    document.body.removeChild(modal);
                    await this.refreshData();
                }
            } catch (error) {
                console.error('批量控制失败:', error);
                notificationUtils.error('批量控制失败', '操作失败');
            }
        });

        // 绑定关闭事件
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    showAutoControlModal() {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>自动通风控制</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">当前温度 (°C)</label>
                        <input type="number" class="form-input" id="currentTemp" 
                               value="${this.environmentData?.temperature || 25}" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">当前CO2浓度 (ppm)</label>
                        <input type="number" class="form-input" id="currentCO2" 
                               value="${this.environmentData?.co2Level || 400}" step="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">最高温度阈�?(°C)</label>
                        <input type="number" class="form-input" id="maxTemp" value="30" step="0.1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">最高CO2阈�?(ppm)</label>
                        <input type="number" class="form-input" id="maxCO2" value="1000" step="1">
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close-btn">取消</button>
                    <button class="btn btn-primary" id="executeAutoControl">启动自动控制</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        const executeBtn = modal.querySelector('#executeAutoControl');
        executeBtn.addEventListener('click', async () => {
            const currentTemp = parseFloat(modal.querySelector('#currentTemp').value);
            const currentCO2 = parseFloat(modal.querySelector('#currentCO2').value);
            const maxTemp = parseFloat(modal.querySelector('#maxTemp').value);
            const maxCO2 = parseFloat(modal.querySelector('#maxCO2').value);

            try {
                const response = await apiService.post('/devices/auto-control/ventilation', {
                    currentTemperature: currentTemp,
                    currentCo2Level: currentCO2,
                    maxTemperature: maxTemp,
                    maxCo2Level: maxCO2
                });

                if (response.success) {
                    notificationUtils.success('自动通风控制已启�?);
                    document.body.removeChild(modal);
                    await this.refreshData();
                }
            } catch (error) {
                console.error('自动控制失败:', error);
                notificationUtils.error('自动控制失败', '操作失败');
            }
        });

        // 绑定关闭事件
        const closeButtons = modal.querySelectorAll('.modal-close, .modal-close-btn');
        closeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    changePeriod(period) {
        // 更新按钮状�?
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        // 更新图表
        this.updateChart(period);
    }

    async refreshData() {
        if (this.isLoading) return;

        try {
            await this.loadInitialData();
            notificationUtils.success('数据刷新成功');
        } catch (error) {
            console.error('刷新数据失败:', error);
            notificationUtils.error('数据刷新失败', '刷新失败');
        }
    }

    startAutoRefresh() {
        // �?0秒自动刷新一次数�?
        this.refreshInterval = setInterval(() => {
            this.refreshData();
        }, 30000);
    }

    // 辅助方法
    getCO2Status(co2Level) {
        if (co2Level <= 600) {
            return { text: '优秀', class: 'status-normal', progressClass: '' };
        } else if (co2Level <= 1000) {
            return { text: '良好', class: 'status-warning', progressClass: 'warning' };
        } else {
            return { text: '超标', class: 'status-danger', progressClass: 'danger' };
        }
    }

    getFlowStatus(flowRate) {
        if (flowRate >= 80) {
            return { text: '优秀', class: 'status-normal' };
        } else if (flowRate >= 60) {
            return { text: '良好', class: 'status-warning' };
        } else {
            return { text: '不足', class: 'status-danger' };
        }
    }

    calculateAirFlowRate() {
        const runningDevices = this.ventilationDevices.filter(d => d.isRunning);
        if (runningDevices.length === 0) return 0;
        
        const totalPower = runningDevices.reduce((sum, d) => sum + d.powerLevel, 0);
        return Math.min(totalPower / runningDevices.length, 100);
    }

    calculateAirQualityIndex(co2Level, temperature) {
        let score = 100;
        
        // CO2影响
        if (co2Level > 600) {
            score -= Math.min((co2Level - 600) / 10, 40);
        }
        
        // 温度影响
        if (temperature > 30 || temperature < 15) {
            score -= 20;
        }
        
        score = Math.max(score, 0);
        
        let status, className;
        if (score >= 80) {
            status = '优秀';
            className = 'status-normal';
        } else if (score >= 60) {
            status = '良好';
            className = 'status-warning';
        } else {
            status = '较差';
            className = 'status-danger';
        }
        
        return {
            value: Math.round(score),
            status: status,
            class: className,
            progress: score
        };
    }

    calculateVentilationEfficiency() {
        const runningDevices = this.ventilationDevices.filter(d => d.isRunning);
        const totalDevices = this.ventilationDevices.length;
        
        if (totalDevices === 0) return 0;
        
        const runningRatio = runningDevices.length / totalDevices;
        const avgPower = runningDevices.length > 0 ? 
            runningDevices.reduce((sum, d) => sum + d.powerLevel, 0) / runningDevices.length : 0;
        
        return runningRatio * avgPower;
    }

    getDeviceIcon(deviceType) {
        const icons = {
            fan: '🌀',
            ventilation: '💨',
            exhaust: '🌪�?
        };
        return icons[deviceType] || '🌀';
    }

    generateChartData(period) {
        const now = new Date();
        const data = [];
        let points, interval;

        switch (period) {
            case '1h':
                points = 12;
                interval = 5 * 60 * 1000; // 5分钟
                break;
            case '6h':
                points = 24;
                interval = 15 * 60 * 1000; // 15分钟
                break;
            case '24h':
                points = 24;
                interval = 60 * 60 * 1000; // 1小时
                break;
            case '7d':
                points = 7;
                interval = 24 * 60 * 60 * 1000; // 1�?
                break;
            default:
                points = 12;
                interval = 5 * 60 * 1000;
        }

        for (let i = points - 1; i >= 0; i--) {
            const time = new Date(now.getTime() - i * interval);
            const co2Value = 400 + Math.random() * 200 + Math.sin(i * 0.5) * 100;
            
            data.push({
                time: time,
                value: Math.max(300, co2Value),
                label: FormatUtils.formatDateTime(time, 'time')
            });
        }

        return data;
    }

    generateMockEnvironmentData() {
        return {
            temperature: 20 + Math.random() * 15,
            humidity: 40 + Math.random() * 40,
            lightIntensity: 1000 + Math.random() * 2000,
            soilHumidity: 30 + Math.random() * 50,
            co2Level: 400 + Math.random() * 200,
            recordedAt: new Date().toISOString()
        };
    }

    generateMockVentilationDevices() {
        return [
            {
                deviceId: 'fan_01',
                deviceName: '排风�?�?,
                deviceType: 'fan',
                status: 'online',
                isRunning: true,
                powerLevel: 65,
                lastMaintenance: '2024-01-15'
            },
            {
                deviceId: 'fan_02',
                deviceName: '排风�?�?,
                deviceType: 'fan',
                status: 'online',
                isRunning: false,
                powerLevel: 0,
                lastMaintenance: '2024-01-10'
            },
            {
                deviceId: 'ventilation_01',
                deviceName: '通风�?�?,
                deviceType: 'ventilation',
                status: 'online',
                isRunning: true,
                powerLevel: 45,
                lastMaintenance: '2024-01-20'
            },
            {
                deviceId: 'exhaust_01',
                deviceName: '排气�?�?,
                deviceType: 'exhaust',
                status: 'offline',
                isRunning: false,
                powerLevel: 0,
                lastMaintenance: '2023-12-25'
            }
        ];
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        console.log('通风系统组件已销�?);
    }
}
