/**
 * 智能温室环境监控系统 - 湿度控制组件
 */

class HumidityComponent {
    constructor() {
        this.refreshInterval = null;
        this.currentData = null;
        this.devices = [];
        this.thresholds = {
            airHumidity: { min: 40, max: 80 },
            soilHumidity: { min: 30, max: 70 }
        };
        this.chartData = {
            timePoints: [],
            airHumidity: [],
            soilHumidity: []
        };
    }

    async render() {
        return `
            <div class="humidity-container">
                <!-- 湿度数据概览 -->
                <div class="grid grid-2">
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span class="icon-humidity"></span>
                                空气湿度
                            </h3>
                            <div class="card-actions">
                                <button class="btn btn-sm btn-secondary" onclick="humidityComponent.showThresholdModal('air')">
                                    设置阈�?
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">当前湿度</div>
                                <div class="data-value" id="currentAirHumidity">
                                    --<span class="data-unit">%</span>
                                    <span class="data-status status-normal" id="airHumidityStatus">正常</span>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="airHumidityProgress" style="width: 0%"></div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">目标范围</div>
                                <div class="data-value">
                                    <span id="airHumidityRange">${this.thresholds.airHumidity.min}% - ${this.thresholds.airHumidity.max}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span class="icon-humidity"></span>
                                土壤湿度
                            </h3>
                            <div class="card-actions">
                                <button class="btn btn-sm btn-secondary" onclick="humidityComponent.showThresholdModal('soil')">
                                    设置阈�?
                                </button>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">当前湿度</div>
                                <div class="data-value" id="currentSoilHumidity">
                                    --<span class="data-unit">%</span>
                                    <span class="data-status status-normal" id="soilHumidityStatus">正常</span>
                                </div>
                            </div>
                            <div class="progress-bar">
                                <div class="progress-fill" id="soilHumidityProgress" style="width: 0%"></div>
                            </div>
                            <div class="data-display">
                                <div class="data-label">目标范围</div>
                                <div class="data-value">
                                    <span id="soilHumidityRange">${this.thresholds.soilHumidity.min}% - ${this.thresholds.soilHumidity.max}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 湿度趋势图表 -->
                <div class="data-card chart-card">
                    <div class="card-header">
                        <h3 class="card-title">湿度变化趋势</h3>
                        <div class="chart-controls">
                            <div class="period-buttons">
                                <button class="period-btn active" data-period="1h" onclick="humidityComponent.changePeriod('1h')">1小时</button>
                                <button class="period-btn" data-period="6h" onclick="humidityComponent.changePeriod('6h')">6小时</button>
                                <button class="period-btn" data-period="24h" onclick="humidityComponent.changePeriod('24h')">24小时</button>
                                <button class="period-btn" data-period="7d" onclick="humidityComponent.changePeriod('7d')">7�?/button>
                            </div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="humidityChart" width="800" height="300"></canvas>
                            <div class="chart-axes">
                                <div class="chart-y-axis" id="humidityChartYAxis"></div>
                                <div class="chart-x-axis" id="humidityChartXAxis"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 湿度控制设备 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">湿度控制设备</h3>
                        <div class="card-actions">
                            <button class="btn btn-sm btn-primary" onclick="humidityComponent.refreshDevices()">
                                <span class="icon-refresh"></span>
                                刷新状�?
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="humidityDevicesList">
                            <div class="loading">
                                <div class="loading-spinner"></div>
                                <p>正在加载设备信息...</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 自动控制策略 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">自动控制策略</h3>
                        <div class="card-actions">
                            <button class="btn btn-sm btn-primary" onclick="humidityComponent.saveControlStrategy()">
                                保存设置
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" id="autoAirHumidityControl" checked>
                                    启用空气湿度自动控制
                                </label>
                                <small class="form-help">当空气湿度超出设定范围时自动启动相关设备</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" id="autoSoilHumidityControl" checked>
                                    启用土壤湿度自动控制
                                </label>
                                <small class="form-help">当土壤湿度低于设定值时自动启动灌溉系统</small>
                            </div>
                        </div>
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">控制响应延迟</label>
                                <select class="form-select" id="controlDelay">
                                    <option value="0">立即响应</option>
                                    <option value="300" selected>5分钟</option>
                                    <option value="600">10分钟</option>
                                    <option value="1800">30分钟</option>
                                </select>
                                <small class="form-help">避免频繁启停设备</small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">控制强度</label>
                                <select class="form-select" id="controlIntensity">
                                    <option value="gentle">温和调节</option>
                                    <option value="normal" selected>正常调节</option>
                                    <option value="aggressive">快速调�?/option>
                                </select>
                                <small class="form-help">调节设备的运行强�?/small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 阈值设置模态框 -->
            <div class="modal" id="thresholdModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 id="thresholdModalTitle">设置湿度阈�?/h3>
                        <button class="modal-close" onclick="humidityComponent.closeThresholdModal()">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">最低湿�?(%)</label>
                            <input type="number" class="form-input" id="minHumidityThreshold" min="0" max="100" step="1">
                            <small class="form-help">低于此值将触发加湿设备</small>
                        </div>
                        <div class="form-group">
                            <label class="form-label">最高湿�?(%)</label>
                            <input type="number" class="form-input" id="maxHumidityThreshold" min="0" max="100" step="1">
                            <small class="form-help">高于此值将触发除湿设备</small>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="humidityComponent.closeThresholdModal()">取消</button>
                        <button class="btn btn-primary" onclick="humidityComponent.saveThreshold()">保存</button>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('湿度控制组件已初始化');
        
        // 加载初始数据
        await this.loadInitialData();
        
        // 启动自动刷新
        this.startAutoRefresh();
        
        // 绑定事件
        this.bindEvents();
    }

    async loadInitialData() {
        try {
            // 并行加载环境数据和设备列�?
            const [envData, devices] = await Promise.all([
                apiService.getCurrentEnvironmentData(),
                this.loadHumidityDevices()
            ]);

            if (envData && envData.success) {
                this.currentData = envData.data;
                this.updateHumidityDisplay();
            }

            if (devices) {
                this.devices = devices;
                this.renderDevicesList();
            }

            // 加载历史数据用于图表
            await this.loadChartData('1h');

        } catch (error) {
            console.error('加载湿度数据失败:', error);
            notificationUtils.error('加载湿度数据失败，请刷新页面重试');
        }
    }

    async loadHumidityDevices() {
        try {
            const response = await apiService.getDevices();
            if (response && response.success) {
                // 筛选湿度相关设�?
                return response.data.filter(device => 
                    ['humidifier', 'dehumidifier', 'irrigation'].includes(device.type)
                );
            }
            return [];
        } catch (error) {
            console.error('加载湿度设备失败:', error);
            // 返回模拟数据
            return [
                { id: 'humidifier_01', name: '加湿�?', type: 'humidifier', status: 'online', isRunning: true, powerLevel: 65 },
                { id: 'dehumidifier_01', name: '除湿�?', type: 'dehumidifier', status: 'online', isRunning: false, powerLevel: 0 },
                { id: 'irrigation_01', name: '灌溉系统1', type: 'irrigation', status: 'online', isRunning: false, powerLevel: 0 }
            ];
        }
    }

    updateHumidityDisplay() {
        if (!this.currentData) return;

        const airHumidity = parseFloat(this.currentData.humidity || 0);
        const soilHumidity = parseFloat(this.currentData.soilHumidity || 0);

        // 更新空气湿度显示
        const airHumidityElement = document.getElementById('currentAirHumidity');
        const airHumidityStatus = document.getElementById('airHumidityStatus');
        const airHumidityProgress = document.getElementById('airHumidityProgress');

        if (airHumidityElement) {
            airHumidityElement.innerHTML = `${airHumidity.toFixed(1)}<span class="data-unit">%</span>`;
        }

        // 判断空气湿度状�?
        let airStatus = 'normal';
        let airStatusText = '正常';
        let airProgressClass = '';

        if (airHumidity < this.thresholds.airHumidity.min) {
            airStatus = 'warning';
            airStatusText = '偏低';
            airProgressClass = 'warning';
        } else if (airHumidity > this.thresholds.airHumidity.max) {
            airStatus = 'danger';
            airStatusText = '偏高';
            airProgressClass = 'danger';
        }

        if (airHumidityStatus) {
            airHumidityStatus.className = `data-status status-${airStatus}`;
            airHumidityStatus.textContent = airStatusText;
        }

        if (airHumidityProgress) {
            airHumidityProgress.className = `progress-fill ${airProgressClass}`;
            airHumidityProgress.style.width = `${Math.min(100, airHumidity)}%`;
        }

        // 更新土壤湿度显示
        const soilHumidityElement = document.getElementById('currentSoilHumidity');
        const soilHumidityStatus = document.getElementById('soilHumidityStatus');
        const soilHumidityProgress = document.getElementById('soilHumidityProgress');

        if (soilHumidityElement) {
            soilHumidityElement.innerHTML = `${soilHumidity.toFixed(1)}<span class="data-unit">%</span>`;
        }

        // 判断土壤湿度状�?
        let soilStatus = 'normal';
        let soilStatusText = '正常';
        let soilProgressClass = '';

        if (soilHumidity < this.thresholds.soilHumidity.min) {
            soilStatus = 'warning';
            soilStatusText = '偏低';
            soilProgressClass = 'warning';
        } else if (soilHumidity > this.thresholds.soilHumidity.max) {
            soilStatus = 'danger';
            soilStatusText = '偏高';
            soilProgressClass = 'danger';
        }

        if (soilHumidityStatus) {
            soilHumidityStatus.className = `data-status status-${soilStatus}`;
            soilHumidityStatus.textContent = soilStatusText;
        }

        if (soilHumidityProgress) {
            soilHumidityProgress.className = `progress-fill ${soilProgressClass}`;
            soilHumidityProgress.style.width = `${Math.min(100, soilHumidity)}%`;
        }
    }

    renderDevicesList() {
        const container = document.getElementById('humidityDevicesList');
        if (!container) return;

        if (this.devices.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔧</div>
                    <div class="empty-state-title">暂无湿度控制设备</div>
                    <div class="empty-state-description">请检查设备连接状�?/div>
                </div>
            `;
            return;
        }

        const devicesHtml = this.devices.map(device => {
            const deviceTypeNames = {
                'humidifier': '加湿�?,
                'dehumidifier': '除湿�?,
                'irrigation': '灌溉系统'
            };

            const deviceIcons = {
                'humidifier': '💧',
                'dehumidifier': '🌬�?,
                'irrigation': '🚿'
            };

            const statusClass = device.status === 'online' ? 'online' : 
                               device.status === 'error' ? 'error' : 'offline';

            return `
                <div class="device-control">
                    <div class="device-info">
                        <div class="device-icon ${statusClass}">
                            ${deviceIcons[device.type] || '🔧'}
                        </div>
                        <div class="device-details">
                            <h4>${device.name}</h4>
                            <p>${deviceTypeNames[device.type] || device.type} - ${device.status === 'online' ? '在线' : '离线'}</p>
                        </div>
                    </div>
                    <div class="device-controls">
                        <div class="switch">
                            <input type="checkbox" id="switch_${device.id}" 
                                   ${device.isRunning ? 'checked' : ''} 
                                   ${device.status !== 'online' ? 'disabled' : ''}
                                   onchange="humidityComponent.toggleDevice('${device.id}', this.checked)">
                            <span class="slider"></span>
                        </div>
                        <div class="slider-control">
                            <div class="slider-label">
                                <span>功率</span>
                                <span id="power_${device.id}">${device.powerLevel}%</span>
                            </div>
                            <input type="range" class="range-slider" 
                                   min="0" max="100" step="5" 
                                   value="${device.powerLevel}"
                                   ${device.status !== 'online' || !device.isRunning ? 'disabled' : ''}
                                   oninput="humidityComponent.adjustDevicePower('${device.id}', this.value)">
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = devicesHtml;
    }

    async loadChartData(period) {
        try {
            // 模拟历史湿度数据
            const dataPoints = period === '1h' ? 12 : period === '6h' ? 24 : period === '24h' ? 24 : 30;
            const timePoints = [];
            const airHumidity = [];
            const soilHumidity = [];

            const now = new Date();
            const intervalMs = period === '1h' ? 5 * 60 * 1000 : 
                              period === '6h' ? 15 * 60 * 1000 :
                              period === '24h' ? 60 * 60 * 1000 :
                              24 * 60 * 60 * 1000;

            for (let i = dataPoints - 1; i >= 0; i--) {
                const time = new Date(now.getTime() - i * intervalMs);
                timePoints.push(time);
                
                // 生成带趋势的模拟数据
                const baseAirHumidity = 60 + Math.sin(i * 0.1) * 15;
                const baseSoilHumidity = 45 + Math.cos(i * 0.08) * 20;
                
                airHumidity.push(Math.max(0, Math.min(100, baseAirHumidity + (Math.random() - 0.5) * 10)));
                soilHumidity.push(Math.max(0, Math.min(100, baseSoilHumidity + (Math.random() - 0.5) * 15)));
            }

            this.chartData = { timePoints, airHumidity, soilHumidity };
            this.renderChart();

        } catch (error) {
            console.error('加载图表数据失败:', error);
        }
    }

    renderChart() {
        const canvas = document.getElementById('humidityChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const { timePoints, airHumidity, soilHumidity } = this.chartData;

        if (timePoints.length === 0) return;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 设置绘图区域
        const padding = 40;
        const chartWidth = canvas.width - 2 * padding;
        const chartHeight = canvas.height - 2 * padding;

        // 绘制网格�?
        ctx.strokeStyle = '#e0e0e0';
        ctx.lineWidth = 1;

        // 垂直网格�?
        for (let i = 0; i <= 10; i++) {
            const x = padding + (chartWidth / 10) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }

        // 水平网格�?
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // 绘制空气湿度曲线
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 2;
        ctx.beginPath();

        airHumidity.forEach((value, index) => {
            const x = padding + (chartWidth / (airHumidity.length - 1)) * index;
            const y = padding + chartHeight - (value / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // 绘制土壤湿度曲线
        ctx.strokeStyle = '#4CAF50';
        ctx.lineWidth = 2;
        ctx.beginPath();

        soilHumidity.forEach((value, index) => {
            const x = padding + (chartWidth / (soilHumidity.length - 1)) * index;
            const y = padding + chartHeight - (value / 100) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.stroke();

        // 更新坐标轴标�?
        this.updateChartAxes();
    }

    updateChartAxes() {
        const yAxisContainer = document.getElementById('humidityChartYAxis');
        const xAxisContainer = document.getElementById('humidityChartXAxis');

        if (yAxisContainer) {
            yAxisContainer.innerHTML = '';
            for (let i = 0; i <= 5; i++) {
                const value = 100 - (i * 20);
                const span = document.createElement('span');
                span.textContent = `${value}%`;
                yAxisContainer.appendChild(span);
            }
        }

        if (xAxisContainer && this.chartData.timePoints.length > 0) {
            xAxisContainer.innerHTML = '';
            const timePoints = this.chartData.timePoints;
            const step = Math.ceil(timePoints.length / 6);
            
            for (let i = 0; i < timePoints.length; i += step) {
                const time = timePoints[i];
                const span = document.createElement('span');
                span.textContent = time.toLocaleTimeString('zh-CN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                });
                xAxisContainer.appendChild(span);
            }
        }
    }

    async toggleDevice(deviceId, isOn) {
        try {
            const controlData = {
                action: isOn ? 'start' : 'stop',
                powerLevel: isOn ? 50 : 0
            };

            await apiService.controlDevice(deviceId, controlData, {
                operation: `${isOn ? '启动' : '停止'}设备`,
                showLoading: true,
                showSuccess: true
            });

            // 更新本地设备状�?
            const device = this.devices.find(d => d.id === deviceId);
            if (device) {
                device.isRunning = isOn;
                device.powerLevel = isOn ? 50 : 0;
                
                // 更新功率显示
                const powerElement = document.getElementById(`power_${deviceId}`);
                if (powerElement) {
                    powerElement.textContent = `${device.powerLevel}%`;
                }
                
                // 更新滑块状�?
                const slider = document.querySelector(`input[oninput*="${deviceId}"]`);
                if (slider) {
                    slider.disabled = !isOn;
                    slider.value = device.powerLevel;
                }
            }

        } catch (error) {
            console.error('设备控制失败:', error);
            
            // 恢复开关状�?
            const switchElement = document.getElementById(`switch_${deviceId}`);
            if (switchElement) {
                switchElement.checked = !isOn;
            }
        }
    }

    async adjustDevicePower(deviceId, powerLevel) {
        try {
            const controlData = {
                action: 'adjust',
                powerLevel: parseInt(powerLevel)
            };

            await apiService.controlDevice(deviceId, controlData, {
                operation: '调节设备功率',
                showError: false // 不显示错误，避免频繁提示
            });

            // 更新本地设备状�?
            const device = this.devices.find(d => d.id === deviceId);
            if (device) {
                device.powerLevel = parseInt(powerLevel);
            }

            // 更新功率显示
            const powerElement = document.getElementById(`power_${deviceId}`);
            if (powerElement) {
                powerElement.textContent = `${powerLevel}%`;
            }

        } catch (error) {
            console.error('调节设备功率失败:', error);
        }
    }

    async changePeriod(period) {
        // 更新按钮状�?
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`).classList.add('active');

        // 加载新的图表数据
        await this.loadChartData(period);
    }

    showThresholdModal(type) {
        const modal = document.getElementById('thresholdModal');
        const title = document.getElementById('thresholdModalTitle');
        const minInput = document.getElementById('minHumidityThreshold');
        const maxInput = document.getElementById('maxHumidityThreshold');

        if (type === 'air') {
            title.textContent = '设置空气湿度阈�?;
            minInput.value = this.thresholds.airHumidity.min;
            maxInput.value = this.thresholds.airHumidity.max;
        } else {
            title.textContent = '设置土壤湿度阈�?;
            minInput.value = this.thresholds.soilHumidity.min;
            maxInput.value = this.thresholds.soilHumidity.max;
        }

        modal.dataset.type = type;
        modal.classList.add('show');
    }

    closeThresholdModal() {
        const modal = document.getElementById('thresholdModal');
        modal.classList.remove('show');
    }

    async saveThreshold() {
        const modal = document.getElementById('thresholdModal');
        const type = modal.dataset.type;
        const minValue = parseInt(document.getElementById('minHumidityThreshold').value);
        const maxValue = parseInt(document.getElementById('maxHumidityThreshold').value);

        if (minValue >= maxValue) {
            notificationUtils.error('最低湿度必须小于最高湿�?);
            return;
        }

        if (minValue < 0 || maxValue > 100) {
            notificationUtils.error('湿度值必须在0-100%之间');
            return;
        }

        try {
            const thresholdData = {
                type: type === 'air' ? 'airHumidity' : 'soilHumidity',
                min: minValue,
                max: maxValue
            };

            await apiService.setEnvironmentThreshold(thresholdData, {
                operation: '设置湿度阈�?,
                showLoading: true,
                showSuccess: true
            });

            // 更新本地阈�?
            if (type === 'air') {
                this.thresholds.airHumidity = { min: minValue, max: maxValue };
                document.getElementById('airHumidityRange').textContent = `${minValue}% - ${maxValue}%`;
            } else {
                this.thresholds.soilHumidity = { min: minValue, max: maxValue };
                document.getElementById('soilHumidityRange').textContent = `${minValue}% - ${maxValue}%`;
            }

            // 重新评估当前状�?
            this.updateHumidityDisplay();
            
            this.closeThresholdModal();

        } catch (error) {
            console.error('保存阈值失�?', error);
        }
    }

    async saveControlStrategy() {
        try {
            const strategy = {
                autoAirHumidityControl: document.getElementById('autoAirHumidityControl').checked,
                autoSoilHumidityControl: document.getElementById('autoSoilHumidityControl').checked,
                controlDelay: parseInt(document.getElementById('controlDelay').value),
                controlIntensity: document.getElementById('controlIntensity').value
            };

            // 这里应该调用API保存控制策略
            // await apiService.saveHumidityControlStrategy(strategy);
            
            notificationUtils.success('控制策略已保�?);
            console.log('保存控制策略:', strategy);

        } catch (error) {
            console.error('保存控制策略失败:', error);
            notificationUtils.error('保存控制策略失败');
        }
    }

    async refreshDevices() {
        try {
            const devices = await this.loadHumidityDevices();
            this.devices = devices;
            this.renderDevicesList();
            notificationUtils.success('设备状态已刷新');
        } catch (error) {
            console.error('刷新设备状态失�?', error);
            notificationUtils.error('刷新设备状态失�?);
        }
    }

    bindEvents() {
        // 监听窗口大小变化，重新绘制图�?
        window.addEventListener('resize', () => {
            setTimeout(() => this.renderChart(), 100);
        });
    }

    startAutoRefresh() {
        // �?0秒刷新一次数�?
        this.refreshInterval = setInterval(async () => {
            try {
                const envData = await apiService.getCurrentEnvironmentData({ showError: false });
                if (envData && envData.success) {
                    this.currentData = envData.data;
                    this.updateHumidityDisplay();
                }
            } catch (error) {
                console.error('自动刷新数据失败:', error);
            }
        }, 30000);
    }

    async refresh() {
        console.log('刷新湿度数据');
        await this.loadInitialData();
    }

    // 组件生命周期方法
    updateEnvironmentData(data) {
        this.currentData = data;
        this.updateHumidityDisplay();
    }

    updateDeviceStatus(data) {
        const device = this.devices.find(d => d.id === data.deviceId);
        if (device) {
            Object.assign(device, data);
            this.renderDevicesList();
        }
    }

    onResize() {
        this.renderChart();
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        console.log('湿度控制组件已销�?);
    }
}

// 创建全局实例
const humidityComponent = new HumidityComponent();
