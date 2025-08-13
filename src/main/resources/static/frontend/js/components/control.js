/**
 * 智能温室环境监控系统 - 远程控制组件
 */

class ControlComponent {
    constructor() {
        this.refreshInterval = null;
        this.devices = [];
        this.selectedDevices = new Set();
        this.sceneProfiles = [];
        this.isLoading = false;
    }

    async render() {
        return `
            <div class="control-container">
                <!-- 控制面板头部 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <i class="icon-control"></i>
                            远程控制中心
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-refresh" onclick="controlComponent.refresh()">
                                <i class="icon-refresh"></i>
                                刷新
                            </button>
                            <button class="btn btn-primary" onclick="controlComponent.showSceneManager()">
                                场景管理
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="control-summary grid grid-4">
                            <div class="summary-item">
                                <div class="summary-label">总设备数</div>
                                <div class="summary-value" id="totalDevices">-</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">在线设备</div>
                                <div class="summary-value" id="onlineDevices">-</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">运行设备</div>
                                <div class="summary-value" id="runningDevices">-</div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">故障设备</div>
                                <div class="summary-value" id="errorDevices">-</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 批量控制面板 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">批量控制</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="controlComponent.selectAllDevices()">
                                全�?
                            </button>
                            <button class="btn btn-secondary" onclick="controlComponent.clearSelection()">
                                清空选择
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="batch-controls">
                            <div class="batch-info">
                                <span>已选择 <strong id="selectedCount">0</strong> 个设�?/span>
                            </div>
                            <div class="batch-actions">
                                <button class="btn btn-primary" onclick="controlComponent.batchStart()" id="batchStartBtn" disabled>
                                    批量启动
                                </button>
                                <button class="btn btn-secondary" onclick="controlComponent.batchStop()" id="batchStopBtn" disabled>
                                    批量停止
                                </button>
                                <button class="btn btn-danger" onclick="controlComponent.batchReset()" id="batchResetBtn" disabled>
                                    批量重置
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 场景模式快捷控制 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">场景模式</h3>
                    </div>
                    <div class="card-body">
                        <div class="scene-profiles" id="sceneProfiles">
                            <!-- 场景配置将在这里动态加�?-->
                        </div>
                    </div>
                </div>

                <!-- 设备控制列表 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">设备控制</h3>
                        <div class="card-actions">
                            <select class="form-select" id="deviceTypeFilter" onchange="controlComponent.filterDevices()">
                                <option value="">所有设�?/option>
                                <option value="heater">加热�?/option>
                                <option value="cooler">冷却�?/option>
                                <option value="humidifier">加湿�?/option>
                                <option value="dehumidifier">除湿�?/option>
                                <option value="fan">风扇</option>
                                <option value="light">补光�?/option>
                                <option value="irrigation">灌溉系统</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="devices-list" id="devicesList">
                            <!-- 设备列表将在这里动态加�?-->
                        </div>
                    </div>
                </div>

                <!-- 控制日志 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">控制日志</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="controlComponent.clearLogs()">
                                清空日志
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="control-logs" id="controlLogs">
                            <!-- 控制日志将在这里显示 -->
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('远程控制组件已初始化');
        await this.loadDevices();
        await this.loadSceneProfiles();
        this.startAutoRefresh();
    }

    async refresh() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        try {
            await this.loadDevices();
            await this.updateSummary();
            this.addLog('系统', '设备状态已刷新');
        } catch (error) {
            console.error('刷新设备状态失�?', error);
            notificationUtils.error('刷新设备状态失�?);
        } finally {
            this.isLoading = false;
        }
    }

    async loadDevices() {
        try {
            const response = await apiService.safeCall(
                () => apiService.getDevices(),
                {
                    operation: '获取设备列表',
                    fallbackData: apiService.generateMockDevices()
                }
            );
            
            this.devices = response.data || [];
            this.renderDevicesList();
            this.updateSummary();
        } catch (error) {
            console.error('加载设备列表失败:', error);
            this.devices = [];
        }
    }

    renderDevicesList() {
        const devicesList = document.getElementById('devicesList');
        if (!devicesList) return;

        const filterType = document.getElementById('deviceTypeFilter')?.value || '';
        const filteredDevices = filterType ? 
            this.devices.filter(device => device.type === filterType) : 
            this.devices;

        if (filteredDevices.length === 0) {
            devicesList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔌</div>
                    <div class="empty-state-title">暂无设备</div>
                    <div class="empty-state-description">没有找到符合条件的设�?/div>
                </div>
            `;
            return;
        }

        devicesList.innerHTML = filteredDevices.map(device => `
            <div class="device-control-item" data-device-id="${device.id}">
                <div class="device-selection">
                    <input type="checkbox" id="device_${device.id}" 
                           onchange="controlComponent.toggleDeviceSelection('${device.id}')"
                           ${this.selectedDevices.has(device.id) ? 'checked' : ''}>
                </div>
                <div class="device-info">
                    <div class="device-icon ${device.status}">
                        ${this.getDeviceIcon(device.type)}
                    </div>
                    <div class="device-details">
                        <h4>${device.name}</h4>
                        <p>类型: ${this.getDeviceTypeName(device.type)} | 状�? ${this.getStatusText(device.status)}</p>
                        <div class="device-status-indicators">
                            <span class="status-indicator ${device.status}"></span>
                            <span class="status-text">${device.isRunning ? '运行�? : '已停�?}</span>
                            ${device.powerLevel > 0 ? `<span class="power-level">功率: ${device.powerLevel}%</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="device-controls">
                    <div class="control-row">
                        <div class="switch">
                            <input type="checkbox" id="switch_${device.id}" 
                                   ${device.isRunning ? 'checked' : ''}
                                   ${device.status !== 'online' ? 'disabled' : ''}
                                   onchange="controlComponent.toggleDevice('${device.id}')">
                            <span class="slider"></span>
                        </div>
                        <div class="slider-control">
                            <span>功率</span>
                            <input type="range" class="range-slider" 
                                   min="0" max="100" value="${device.powerLevel}"
                                   ${device.status !== 'online' ? 'disabled' : ''}
                                   onchange="controlComponent.adjustPower('${device.id}', this.value)">
                            <span>${device.powerLevel}%</span>
                        </div>
                    </div>
                    <div class="control-buttons">
                        <button class="btn btn-sm btn-primary" 
                                onclick="controlComponent.showDeviceDetails('${device.id}')"
                                ${device.status !== 'online' ? 'disabled' : ''}>
                            详情
                        </button>
                        <button class="btn btn-sm btn-secondary" 
                                onclick="controlComponent.resetDevice('${device.id}')"
                                ${device.status !== 'online' ? 'disabled' : ''}>
                            重置
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateSummary() {
        const total = this.devices.length;
        const online = this.devices.filter(d => d.status === 'online').length;
        const running = this.devices.filter(d => d.isRunning).length;
        const error = this.devices.filter(d => d.status === 'error').length;

        document.getElementById('totalDevices').textContent = total;
        document.getElementById('onlineDevices').textContent = online;
        document.getElementById('runningDevices').textContent = running;
        document.getElementById('errorDevices').textContent = error;
    }

    toggleDeviceSelection(deviceId) {
        if (this.selectedDevices.has(deviceId)) {
            this.selectedDevices.delete(deviceId);
        } else {
            this.selectedDevices.add(deviceId);
        }
        this.updateBatchControls();
    }

    selectAllDevices() {
        const onlineDevices = this.devices.filter(d => d.status === 'online');
        onlineDevices.forEach(device => {
            this.selectedDevices.add(device.id);
            const checkbox = document.getElementById(`device_${device.id}`);
            if (checkbox) checkbox.checked = true;
        });
        this.updateBatchControls();
    }

    clearSelection() {
        this.selectedDevices.clear();
        this.devices.forEach(device => {
            const checkbox = document.getElementById(`device_${device.id}`);
            if (checkbox) checkbox.checked = false;
        });
        this.updateBatchControls();
    }

    updateBatchControls() {
        const count = this.selectedDevices.size;
        document.getElementById('selectedCount').textContent = count;
        
        const hasSelection = count > 0;
        document.getElementById('batchStartBtn').disabled = !hasSelection;
        document.getElementById('batchStopBtn').disabled = !hasSelection;
        document.getElementById('batchResetBtn').disabled = !hasSelection;
    }

    async toggleDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device || device.status !== 'online') return;

        const action = device.isRunning ? 'stop' : 'start';
        const actionText = device.isRunning ? '停止' : '启动';

        notificationUtils.showConfirm(
            `确定�?{actionText}设备 "${device.name}" 吗？`,
            async () => {
                try {
                    await this.controlDevice(deviceId, { action });
                    this.addLog(device.name, `设备�?{actionText}`);
                } catch (error) {
                    console.error(`${actionText}设备失败:`, error);
                    // 恢复开关状�?
                    const switchElement = document.getElementById(`switch_${deviceId}`);
                    if (switchElement) {
                        switchElement.checked = device.isRunning;
                    }
                }
            },
            () => {
                // 取消时恢复开关状�?
                const switchElement = document.getElementById(`switch_${deviceId}`);
                if (switchElement) {
                    switchElement.checked = device.isRunning;
                }
            }
        );
    }

    async adjustPower(deviceId, powerLevel) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device || device.status !== 'online') return;

        try {
            await this.controlDevice(deviceId, { 
                action: 'adjust', 
                powerLevel: parseInt(powerLevel) 
            });
            this.addLog(device.name, `功率调整�?${powerLevel}%`);
        } catch (error) {
            console.error('调整设备功率失败:', error);
            // 恢复滑块状�?
            const slider = document.querySelector(`input[onchange*="${deviceId}"]`);
            if (slider) {
                slider.value = device.powerLevel;
            }
        }
    }

    async controlDevice(deviceId, controlData) {
        const response = await apiService.controlDevice(deviceId, controlData, {
            showLoading: true,
            showSuccess: true
        });

        // 更新本地设备状�?
        const device = this.devices.find(d => d.id === deviceId);
        if (device && response.success) {
            if (controlData.action === 'start') {
                device.isRunning = true;
            } else if (controlData.action === 'stop') {
                device.isRunning = false;
            }
            if (controlData.powerLevel !== undefined) {
                device.powerLevel = controlData.powerLevel;
            }
            this.updateSummary();
        }

        return response;
    }

    async batchStart() {
        await this.batchControl('start', '启动');
    }

    async batchStop() {
        await this.batchControl('stop', '停止');
    }

    async batchReset() {
        await this.batchControl('reset', '重置');
    }

    async batchControl(action, actionText) {
        if (this.selectedDevices.size === 0) return;

        const selectedDeviceNames = Array.from(this.selectedDevices)
            .map(id => this.devices.find(d => d.id === id)?.name)
            .filter(name => name)
            .join('�?);

        notificationUtils.showConfirm(
            `确定�?{actionText}以下设备吗？\n${selectedDeviceNames}`,
            async () => {
                const controlCommands = Array.from(this.selectedDevices).map(deviceId => ({
                    deviceId,
                    controlData: { action }
                }));

                try {
                    const result = await apiService.batchControlDevices(controlCommands);
                    
                    const successCount = result.successCount;
                    const totalCount = controlCommands.length;
                    
                    if (successCount === totalCount) {
                        notificationUtils.success(`批量${actionText}成功，共${successCount}个设备`);
                    } else {
                        notificationUtils.warning(`批量${actionText}完成，成�?{successCount}个，失败${totalCount - successCount}个`);
                    }

                    this.addLog('批量操作', `${actionText}�?{successCount}个设备`);
                    await this.refresh();
                } catch (error) {
                    console.error(`批量${actionText}失败:`, error);
                    notificationUtils.error(`批量${actionText}失败`);
                }
            }
        );
    }

    async resetDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        notificationUtils.showConfirm(
            `确定要重置设�?"${device.name}" 吗？`,
            async () => {
                try {
                    await this.controlDevice(deviceId, { action: 'reset' });
                    this.addLog(device.name, '设备已重�?);
                } catch (error) {
                    console.error('重置设备失败:', error);
                }
            }
        );
    }

    filterDevices() {
        this.renderDevicesList();
    }

    async loadSceneProfiles() {
        // 模拟场景配置数据
        this.sceneProfiles = [
            {
                id: 'morning',
                name: '晨间模式',
                description: '适合早晨的设备配�?,
                icon: '🌅',
                devices: {
                    'light_01': { isRunning: true, powerLevel: 80 },
                    'heater_01': { isRunning: true, powerLevel: 60 },
                    'fan_01': { isRunning: true, powerLevel: 30 }
                }
            },
            {
                id: 'noon',
                name: '正午模式',
                description: '适合正午的设备配�?,
                icon: '☀�?,
                devices: {
                    'cooler_01': { isRunning: true, powerLevel: 70 },
                    'fan_01': { isRunning: true, powerLevel: 80 },
                    'irrigation_01': { isRunning: true, powerLevel: 50 }
                }
            },
            {
                id: 'evening',
                name: '傍晚模式',
                description: '适合傍晚的设备配�?,
                icon: '🌆',
                devices: {
                    'light_01': { isRunning: true, powerLevel: 60 },
                    'humidifier_01': { isRunning: true, powerLevel: 70 },
                    'fan_01': { isRunning: true, powerLevel: 40 }
                }
            },
            {
                id: 'night',
                name: '夜间模式',
                description: '适合夜间的设备配�?,
                icon: '🌙',
                devices: {
                    'heater_01': { isRunning: true, powerLevel: 40 },
                    'humidifier_01': { isRunning: true, powerLevel: 50 }
                }
            }
        ];

        this.renderSceneProfiles();
    }

    renderSceneProfiles() {
        const container = document.getElementById('sceneProfiles');
        if (!container) return;

        container.innerHTML = this.sceneProfiles.map(profile => `
            <div class="scene-profile" data-scene-id="${profile.id}">
                <div class="scene-icon">${profile.icon}</div>
                <div class="scene-info">
                    <h4>${profile.name}</h4>
                    <p>${profile.description}</p>
                </div>
                <div class="scene-actions">
                    <button class="btn btn-primary" onclick="controlComponent.applyScene('${profile.id}')">
                        应用
                    </button>
                </div>
            </div>
        `).join('');
    }

    async applyScene(sceneId) {
        const scene = this.sceneProfiles.find(s => s.id === sceneId);
        if (!scene) return;

        notificationUtils.showConfirm(
            `确定要应�?"${scene.name}" 场景模式吗？\n这将调整相关设备的运行状态。`,
            async () => {
                try {
                    const controlCommands = Object.entries(scene.devices).map(([deviceId, config]) => ({
                        deviceId,
                        controlData: {
                            action: config.isRunning ? 'start' : 'stop',
                            powerLevel: config.powerLevel
                        }
                    }));

                    const result = await apiService.batchControlDevices(controlCommands);
                    
                    if (result.successCount > 0) {
                        notificationUtils.success(`场景模式 "${scene.name}" 应用成功`);
                        this.addLog('场景模式', `应用�?"${scene.name}" 模式`);
                        await this.refresh();
                    } else {
                        notificationUtils.error(`场景模式 "${scene.name}" 应用失败`);
                    }
                } catch (error) {
                    console.error('应用场景模式失败:', error);
                    notificationUtils.error('应用场景模式失败');
                }
            }
        );
    }

    showSceneManager() {
        // 显示场景管理对话�?
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3>场景管理</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <p>场景管理功能正在开发中，敬请期�?..</p>
                    <div class="scene-manager-placeholder">
                        <div class="empty-state">
                            <div class="empty-state-icon">⚙️</div>
                            <div class="empty-state-title">功能开发中</div>
                            <div class="empty-state-description">
                                您可以在这里创建、编辑和删除场景配置�?br>
                                目前提供�?个预设场景供您使用�?
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">关闭</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        modal.querySelectorAll('.modal-close').forEach(btn => {
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

    showDeviceDetails(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.display = 'flex';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>设备详情 - ${device.name}</h3>
                    <button class="modal-close">×</button>
                </div>
                <div class="modal-body">
                    <div class="device-detail">
                        <div class="detail-row">
                            <label>设备ID:</label>
                            <span>${device.id}</span>
                        </div>
                        <div class="detail-row">
                            <label>设备名称:</label>
                            <span>${device.name}</span>
                        </div>
                        <div class="detail-row">
                            <label>设备类型:</label>
                            <span>${this.getDeviceTypeName(device.type)}</span>
                        </div>
                        <div class="detail-row">
                            <label>连接状�?</label>
                            <span class="tag tag-${device.status === 'online' ? 'success' : device.status === 'error' ? 'danger' : 'warning'}">
                                ${this.getStatusText(device.status)}
                            </span>
                        </div>
                        <div class="detail-row">
                            <label>运行状�?</label>
                            <span class="tag ${device.isRunning ? 'tag-success' : 'tag-secondary'}">
                                ${device.isRunning ? '运行�? : '已停�?}
                            </span>
                        </div>
                        <div class="detail-row">
                            <label>功率级别:</label>
                            <span>${device.powerLevel}%</span>
                        </div>
                        <div class="detail-row">
                            <label>最后维�?</label>
                            <span>${device.lastMaintenance || '未记�?}</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-secondary modal-close">关闭</button>
                    <button class="btn btn-primary" onclick="controlComponent.testDevice('${device.id}')">
                        设备测试
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定关闭事件
        modal.querySelectorAll('.modal-close').forEach(btn => {
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

    async testDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (!device) return;

        try {
            notificationUtils.info(`正在测试设备 "${device.name}"...`);
            
            // 模拟设备测试
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            notificationUtils.success(`设备 "${device.name}" 测试通过`);
            this.addLog(device.name, '设备测试通过');
        } catch (error) {
            console.error('设备测试失败:', error);
            notificationUtils.error(`设备 "${device.name}" 测试失败`);
        }
    }

    addLog(device, action) {
        const logsContainer = document.getElementById('controlLogs');
        if (!logsContainer) return;

        const timestamp = new Date().toLocaleString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <div class="log-time">${timestamp}</div>
            <div class="log-device">${device}</div>
            <div class="log-action">${action}</div>
        `;

        logsContainer.insertBefore(logEntry, logsContainer.firstChild);

        // 限制日志条数
        const logs = logsContainer.querySelectorAll('.log-entry');
        if (logs.length > 50) {
            logs[logs.length - 1].remove();
        }
    }

    clearLogs() {
        const logsContainer = document.getElementById('controlLogs');
        if (logsContainer) {
            logsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-description">暂无控制日志</div></div>';
        }
    }

    startAutoRefresh() {
        // �?0秒自动刷新设备状�?
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 30000);
    }

    getDeviceIcon(type) {
        const icons = {
            heater: '🔥',
            cooler: '❄️',
            humidifier: '💨',
            dehumidifier: '🌬�?,
            fan: '🌀',
            light: '💡',
            irrigation: '💧'
        };
        return icons[type] || '⚙️';
    }

    getDeviceTypeName(type) {
        const names = {
            heater: '加热�?,
            cooler: '冷却�?,
            humidifier: '加湿�?,
            dehumidifier: '除湿�?,
            fan: '风扇',
            light: '补光�?,
            irrigation: '灌溉系统'
        };
        return names[type] || type;
    }

    getStatusText(status) {
        const texts = {
            online: '在线',
            offline: '离线',
            error: '故障'
        };
        return texts[status] || status;
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
        console.log('远程控制组件已销�?);
    }
}

// 创建全局实例
const controlComponent = new ControlComponent();

