/**
 * 智能温室环境监控系统 - 报警通知组件
 */

class AlertsComponent {
    constructor() {
        this.refreshInterval = null;
        this.alerts = [];
        this.currentPage = 1;
        this.pageSize = 10;
        this.totalPages = 1;
        this.filters = {
            alertType: '',
            severity: '',
            isResolved: null
        };
        this.soundEnabled = true;
        this.notificationPermission = false;
        this.alertSound = null;
        this.lastAlertCount = 0;
    }

    async render() {
        return `
            <div class="alerts-container">
                <!-- 报警概览卡片 -->
                <div class="grid grid-4">
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span class="icon-alert"></span>
                                活跃报警
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-value" id="activeAlertsCount">-</div>
                            <div class="data-label">未解决报�?/div>
                        </div>
                    </div>
                    
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span style="color: var(--danger-color);">🔥</span>
                                紧急报�?
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-value" id="criticalAlertsCount" style="color: var(--danger-color);">-</div>
                            <div class="data-label">需要立即处�?/div>
                        </div>
                    </div>
                    
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span style="color: var(--warning-color);">⚠️</span>
                                高级报警
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-value" id="highAlertsCount" style="color: var(--warning-color);">-</div>
                            <div class="data-label">需要关�?/div>
                        </div>
                    </div>
                    
                    <div class="data-card">
                        <div class="card-header">
                            <h3 class="card-title">
                                <span>📊</span>
                                今日报警
                            </h3>
                        </div>
                        <div class="card-body">
                            <div class="data-value" id="todayAlertsCount">-</div>
                            <div class="data-label">今日新增</div>
                        </div>
                    </div>
                </div>

                <!-- 报警设置卡片 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <span>🔧</span>
                            报警设置
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-3">
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" id="soundEnabled" checked>
                                    声音通知
                                </label>
                                <small class="form-help">新报警时播放提示�?/small>
                            </div>
                            <div class="form-group">
                                <label class="form-label">
                                    <input type="checkbox" id="browserNotification">
                                    浏览器通知
                                </label>
                                <small class="form-help">允许浏览器弹窗通知</small>
                            </div>
                            <div class="form-group">
                                <button class="btn btn-secondary btn-sm" id="testAlertBtn">
                                    测试报警
                                </button>
                                <small class="form-help">测试报警通知功能</small>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 报警筛选和操作 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <span>📋</span>
                            报警列表
                        </h3>
                        <div class="card-actions">
                            <button class="btn btn-primary btn-sm" id="refreshAlertsBtn">
                                <span class="icon-refresh"></span>
                                刷新
                            </button>
                            <button class="btn btn-secondary btn-sm" id="resolveAllBtn">
                                全部处理
                            </button>
                        </div>
                    </div>
                    
                    <!-- 筛选条�?-->
                    <div class="card-body">
                        <div class="grid grid-4" style="margin-bottom: 20px;">
                            <div class="form-group">
                                <label class="form-label">报警类型</label>
                                <select class="form-select" id="alertTypeFilter">
                                    <option value="">全部类型</option>
                                    <option value="temperature">温度报警</option>
                                    <option value="humidity">湿度报警</option>
                                    <option value="light">光照报警</option>
                                    <option value="device_error">设备故障</option>
                                    <option value="system_error">系统错误</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">严重程度</label>
                                <select class="form-select" id="severityFilter">
                                    <option value="">全部级别</option>
                                    <option value="critical">紧�?/option>
                                    <option value="high">�?/option>
                                    <option value="medium">�?/option>
                                    <option value="low">�?/option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">处理状�?/label>
                                <select class="form-select" id="statusFilter">
                                    <option value="">全部状�?/option>
                                    <option value="false">未处�?/option>
                                    <option value="true">已处�?/option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">&nbsp;</label>
                                <button class="btn btn-primary" id="applyFiltersBtn" style="width: 100%;">
                                    应用筛�?
                                </button>
                            </div>
                        </div>

                        <!-- 报警列表 -->
                        <div id="alertsList">
                            <div class="loading">
                                <div class="loading-spinner"></div>
                                <p>正在加载报警数据...</p>
                            </div>
                        </div>

                        <!-- 分页控件 -->
                        <div class="pagination" id="alertsPagination" style="display: none;">
                            <button id="prevPageBtn" disabled>上一�?/button>
                            <span id="pageInfo">�?1 页，�?1 �?/span>
                            <button id="nextPageBtn" disabled>下一�?/button>
                        </div>
                    </div>
                </div>

                <!-- 报警历史统计 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">
                            <span>📈</span>
                            报警统计
                        </h3>
                    </div>
                    <div class="card-body">
                        <div class="grid grid-2">
                            <div id="alertTypeChart">
                                <h4>报警类型分布</h4>
                                <div id="typeChartContainer" style="height: 200px;">
                                    <div class="loading">
                                        <div class="loading-spinner"></div>
                                        <p>正在加载统计数据...</p>
                                    </div>
                                </div>
                            </div>
                            <div id="alertSeverityChart">
                                <h4>严重程度分布</h4>
                                <div id="severityChartContainer" style="height: 200px;">
                                    <div class="loading">
                                        <div class="loading-spinner"></div>
                                        <p>正在加载统计数据...</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 报警详情模态框 -->
            <div class="modal" id="alertDetailModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>报警详情</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body" id="alertDetailContent">
                        <!-- 动态内�?-->
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" id="closeDetailBtn">关闭</button>
                        <button class="btn btn-primary" id="resolveDetailBtn">处理报警</button>
                    </div>
                </div>
            </div>
        `;
    }

    async init() {
        console.log('报警通知组件已初始化');
        
        // 初始化音�?
        this.initAlertSound();
        
        // 请求浏览器通知权限
        await this.requestNotificationPermission();
        
        // 绑定事件
        this.bindEvents();
        
        // 加载初始数据
        await this.loadAlertCounts();
        await this.loadAlerts();
        await this.loadStatistics();
        
        // 开始定时刷�?
        this.startAutoRefresh();
    }

    /**
     * 初始化报警音�?
     */
    initAlertSound() {
        try {
            // 创建音频上下文和音频
            this.alertSound = new Audio();
            this.alertSound.preload = 'auto';
            
            // 使用数据URL创建简单的提示�?
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            // 创建简单的提示音频数据
            const sampleRate = audioContext.sampleRate;
            const duration = 0.5; // 0.5�?
            const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let i = 0; i < data.length; i++) {
                const t = i / sampleRate;
                data[i] = Math.sin(2 * Math.PI * 800 * t) * Math.exp(-t * 3);
            }
            
            // 将音频数据转换为blob URL
            const source = audioContext.createBufferSource();
            source.buffer = buffer;
            
            console.log('报警音频初始化成�?);
        } catch (error) {
            console.warn('报警音频初始化失�?', error);
        }
    }

    /**
     * 播放报警声音
     */
    playAlertSound() {
        if (!this.soundEnabled) return;
        
        try {
            // 使用Web Audio API创建简单的提示�?
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1);
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
            
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
            
            console.log('播放报警声音');
        } catch (error) {
            console.warn('播放报警声音失败:', error);
        }
    }

    /**
     * 请求浏览器通知权限
     */
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            this.notificationPermission = permission === 'granted';
            
            const checkbox = document.getElementById('browserNotification');
            if (checkbox) {
                checkbox.checked = this.notificationPermission;
                checkbox.disabled = !('Notification' in window);
            }
        }
    }

    /**
     * 显示浏览器通知
     */
    showBrowserNotification(alert) {
        if (!this.notificationPermission) return;
        
        const title = `${this.getSeverityText(alert.severity)}报警`;
        const options = {
            body: alert.message,
            icon: '/favicon.ico',
            tag: `alert-${alert.id}`,
            requireInteraction: alert.severity === 'critical'
        };
        
        const notification = new Notification(title, options);
        
        notification.onclick = () => {
            window.focus();
            this.showAlertDetail(alert);
            notification.close();
        };
        
        // 自动关闭通知
        setTimeout(() => {
            notification.close();
        }, 5000);
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 设置选项
        const soundCheckbox = document.getElementById('soundEnabled');
        if (soundCheckbox) {
            soundCheckbox.addEventListener('change', (e) => {
                this.soundEnabled = e.target.checked;
            });
        }

        const notificationCheckbox = document.getElementById('browserNotification');
        if (notificationCheckbox) {
            notificationCheckbox.addEventListener('change', async (e) => {
                if (e.target.checked && !this.notificationPermission) {
                    await this.requestNotificationPermission();
                    e.target.checked = this.notificationPermission;
                }
            });
        }

        // 测试报警按钮
        const testBtn = document.getElementById('testAlertBtn');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.testAlert();
            });
        }

        // 刷新按钮
        const refreshBtn = document.getElementById('refreshAlertsBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refresh();
            });
        }

        // 全部处理按钮
        const resolveAllBtn = document.getElementById('resolveAllBtn');
        if (resolveAllBtn) {
            resolveAllBtn.addEventListener('click', () => {
                this.resolveAllAlerts();
            });
        }

        // 筛选按�?
        const applyFiltersBtn = document.getElementById('applyFiltersBtn');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // 分页按钮
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.loadAlerts();
                }
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                if (this.currentPage < this.totalPages) {
                    this.currentPage++;
                    this.loadAlerts();
                }
            });
        }

        // 模态框事件
        const modal = document.getElementById('alertDetailModal');
        const closeBtn = document.getElementById('closeDetailBtn');
        const resolveBtn = document.getElementById('resolveDetailBtn');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }
        
        if (resolveBtn) {
            resolveBtn.addEventListener('click', () => {
                const alertId = resolveBtn.dataset.alertId;
                if (alertId) {
                    this.resolveAlert(parseInt(alertId));
                    modal.style.display = 'none';
                }
            });
        }
    }

    /**
     * 加载报警统计数据
     */
    async loadAlertCounts() {
        try {
            const [activeCount, criticalCount, highCount, todayCount] = await Promise.all([
                apiService.get('/alerts/count/unresolved'),
                apiService.get('/alerts/count/unresolved/critical'),
                apiService.get('/alerts/count/unresolved/high'),
                apiService.get('/alerts/count/today')
            ]);

            document.getElementById('activeAlertsCount').textContent = activeCount.data || 0;
            document.getElementById('criticalAlertsCount').textContent = criticalCount.data || 0;
            document.getElementById('highAlertsCount').textContent = highCount.data || 0;
            document.getElementById('todayAlertsCount').textContent = todayCount.data || 0;

            // 检查是否有新报�?
            const currentActiveCount = activeCount.data || 0;
            if (this.lastAlertCount > 0 && currentActiveCount > this.lastAlertCount) {
                this.playAlertSound();
                notificationUtils.warning(`检测到 ${currentActiveCount - this.lastAlertCount} 个新报警`, '报警通知');
            }
            this.lastAlertCount = currentActiveCount;

        } catch (error) {
            console.error('加载报警统计失败:', error);
            // 显示模拟数据
            document.getElementById('activeAlertsCount').textContent = '2';
            document.getElementById('criticalAlertsCount').textContent = '1';
            document.getElementById('highAlertsCount').textContent = '1';
            document.getElementById('todayAlertsCount').textContent = '3';
        }
    }

    /**
     * 加载报警列表
     */
    async loadAlerts() {
        try {
            const params = {
                current: this.currentPage,
                size: this.pageSize,
                ...this.filters
            };

            const response = await apiService.get('/alerts/page', params);
            
            if (response.success && response.data) {
                this.alerts = response.data.records || [];
                this.totalPages = Math.ceil((response.data.total || 0) / this.pageSize);
                this.renderAlertsList();
                this.updatePagination();
            } else {
                throw new Error('获取报警数据失败');
            }
        } catch (error) {
            console.error('加载报警列表失败:', error);
            // 显示模拟数据
            this.alerts = this.generateMockAlerts();
            this.renderAlertsList();
        }
    }

    /**
     * 渲染报警列表
     */
    renderAlertsList() {
        const container = document.getElementById('alertsList');
        
        if (this.alerts.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">�?/div>
                    <div class="empty-state-title">暂无报警</div>
                    <div class="empty-state-description">系统运行正常，没有需要处理的报警</div>
                </div>
            `;
            return;
        }

        const alertsHtml = this.alerts.map(alert => `
            <div class="alert-item ${alert.isResolved ? 'resolved' : 'active'}" data-alert-id="${alert.id}">
                <div class="alert-header">
                    <div class="alert-severity ${alert.severity}">
                        ${this.getSeverityIcon(alert.severity)}
                        ${this.getSeverityText(alert.severity)}
                    </div>
                    <div class="alert-type">
                        ${this.getTypeText(alert.alertType)}
                    </div>
                    <div class="alert-time">
                        ${FormatUtils.formatDateTime(alert.createdAt)}
                    </div>
                </div>
                <div class="alert-message">
                    ${alert.message}
                </div>
                <div class="alert-actions">
                    <button class="btn btn-sm btn-secondary" data-alert-id="${alert.id}" onclick="alertsComponent.showAlertDetailById(${alert.id})">
                        详情
                    </button>
                    ${!alert.isResolved ? `
                        <button class="btn btn-sm btn-primary" onclick="alertsComponent.resolveAlert(${alert.id})">
                            处理
                        </button>
                    ` : `
                        <span class="tag tag-success">已处�?/span>
                    `}
                </div>
            </div>
        `).join('');

        container.innerHTML = alertsHtml;
    }

    /**
     * 更新分页控件
     */
    updatePagination() {
        const pagination = document.getElementById('alertsPagination');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const pageInfo = document.getElementById('pageInfo');

        if (this.totalPages <= 1) {
            pagination.style.display = 'none';
            return;
        }

        pagination.style.display = 'flex';
        prevBtn.disabled = this.currentPage <= 1;
        nextBtn.disabled = this.currentPage >= this.totalPages;
        pageInfo.textContent = `�?${this.currentPage} 页，�?${this.totalPages} 页`;
    }

    /**
     * 应用筛选条�?
     */
    applyFilters() {
        this.filters.alertType = document.getElementById('alertTypeFilter').value;
        this.filters.severity = document.getElementById('severityFilter').value;
        const statusValue = document.getElementById('statusFilter').value;
        this.filters.isResolved = statusValue === '' ? null : statusValue === 'true';
        
        this.currentPage = 1;
        this.loadAlerts();
    }

    /**
     * 处理单个报警
     */
    async resolveAlert(alertId) {
        try {
            const response = await apiService.post(`/alerts/${alertId}/resolve`);
            
            if (response.success) {
                notificationUtils.success('报警处理成功');
                await this.refresh();
            } else {
                throw new Error(response.message || '处理失败');
            }
        } catch (error) {
            console.error('处理报警失败:', error);
            notificationUtils.error('处理报警失败: ' + error.message);
        }
    }

    /**
     * 处理所有未解决报警
     */
    async resolveAllAlerts() {
        const unresolvedAlerts = this.alerts.filter(alert => !alert.isResolved);
        
        if (unresolvedAlerts.length === 0) {
            notificationUtils.info('没有需要处理的报警');
            return;
        }

        const confirmed = await new Promise(resolve => {
            notificationUtils.showConfirm(
                `确定要处理所�?${unresolvedAlerts.length} 个未解决的报警吗？`,
                () => resolve(true),
                () => resolve(false)
            );
        });

        if (!confirmed) return;

        try {
            const alertIds = unresolvedAlerts.map(alert => alert.id);
            const response = await apiService.post('/alerts/batch-resolve', alertIds);
            
            if (response.success) {
                notificationUtils.success(`成功处理 ${alertIds.length} 个报警`);
                await this.refresh();
            } else {
                throw new Error(response.message || '批量处理失败');
            }
        } catch (error) {
            console.error('批量处理报警失败:', error);
            notificationUtils.error('批量处理报警失败: ' + error.message);
        }
    }

    /**
     * 根据ID显示报警详情
     */
    showAlertDetailById(alertId) {
        const alert = this.alerts.find(a => a.id === alertId);
        if (alert) {
            this.showAlertDetail(alert);
        }
    }

    /**
     * 显示报警详情
     */
    showAlertDetail(alert) {
        const modal = document.getElementById('alertDetailModal');
        const content = document.getElementById('alertDetailContent');
        const resolveBtn = document.getElementById('resolveDetailBtn');

        content.innerHTML = `
            <div class="alert-detail">
                <div class="detail-row">
                    <label>报警ID:</label>
                    <span>${alert.id}</span>
                </div>
                <div class="detail-row">
                    <label>报警类型:</label>
                    <span>${this.getTypeText(alert.alertType)}</span>
                </div>
                <div class="detail-row">
                    <label>严重程度:</label>
                    <span class="tag tag-${alert.severity}">${this.getSeverityText(alert.severity)}</span>
                </div>
                <div class="detail-row">
                    <label>报警消息:</label>
                    <span>${alert.message}</span>
                </div>
                <div class="detail-row">
                    <label>参数�?</label>
                    <span>${alert.parameterValue || '-'}</span>
                </div>
                <div class="detail-row">
                    <label>阈�?</label>
                    <span>${alert.thresholdValue || '-'}</span>
                </div>
                <div class="detail-row">
                    <label>设备ID:</label>
                    <span>${alert.deviceId || '-'}</span>
                </div>
                <div class="detail-row">
                    <label>创建时间:</label>
                    <span>${FormatUtils.formatDateTime(alert.createdAt)}</span>
                </div>
                <div class="detail-row">
                    <label>处理状�?</label>
                    <span class="tag ${alert.isResolved ? 'tag-success' : 'tag-warning'}">
                        ${alert.isResolved ? '已处�? : '未处�?}
                    </span>
                </div>
                ${alert.resolvedAt ? `
                    <div class="detail-row">
                        <label>处理时间:</label>
                        <span>${FormatUtils.formatDateTime(alert.resolvedAt)}</span>
                    </div>
                ` : ''}
            </div>
        `;

        resolveBtn.style.display = alert.isResolved ? 'none' : 'inline-block';
        resolveBtn.dataset.alertId = alert.id;

        modal.style.display = 'flex';
    }

    /**
     * 加载统计数据
     */
    async loadStatistics() {
        try {
            const [typeStats, severityStats] = await Promise.all([
                apiService.get('/alerts/statistics/type'),
                apiService.get('/alerts/statistics/severity')
            ]);

            this.renderTypeChart(typeStats.data || []);
            this.renderSeverityChart(severityStats.data || []);
        } catch (error) {
            console.error('加载统计数据失败:', error);
            // 显示模拟数据
            this.renderTypeChart(this.generateMockTypeStats());
            this.renderSeverityChart(this.generateMockSeverityStats());
        }
    }

    /**
     * 渲染报警类型统计图表
     */
    renderTypeChart(data) {
        const container = document.getElementById('typeChartContainer');
        
        if (data.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>暂无数据</p></div>';
            return;
        }

        const total = data.reduce((sum, item) => sum + item.count, 0);
        
        const chartHtml = data.map(item => {
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `
                <div class="chart-bar">
                    <div class="bar-label">${this.getTypeText(item.alertType)}</div>
                    <div class="bar-container">
                        <div class="bar-fill" style="width: ${percentage}%"></div>
                        <div class="bar-value">${item.count} (${percentage}%)</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="bar-chart">${chartHtml}</div>`;
    }

    /**
     * 渲染严重程度统计图表
     */
    renderSeverityChart(data) {
        const container = document.getElementById('severityChartContainer');
        
        if (data.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>暂无数据</p></div>';
            return;
        }

        const total = data.reduce((sum, item) => sum + item.count, 0);
        
        const chartHtml = data.map(item => {
            const percentage = ((item.count / total) * 100).toFixed(1);
            return `
                <div class="chart-bar">
                    <div class="bar-label">${this.getSeverityText(item.severity)}</div>
                    <div class="bar-container">
                        <div class="bar-fill severity-${item.severity}" style="width: ${percentage}%"></div>
                        <div class="bar-value">${item.count} (${percentage}%)</div>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = `<div class="bar-chart">${chartHtml}</div>`;
    }

    /**
     * 测试报警功能
     */
    testAlert() {
        const testAlert = {
            id: 999,
            alertType: 'system_error',
            severity: 'medium',
            message: '这是一个测试报警，用于验证报警通知功能是否正常工作',
            isResolved: false,
            createdAt: new Date().toISOString()
        };

        this.playAlertSound();
        this.showBrowserNotification(testAlert);
        notificationUtils.warning('测试报警已触�?, '报警测试');
    }

    /**
     * 开始自动刷�?
     */
    startAutoRefresh() {
        this.refreshInterval = setInterval(() => {
            this.loadAlertCounts();
            this.loadAlerts();
        }, 30000); // 30秒刷新一�?
    }

    /**
     * 刷新所有数�?
     */
    async refresh() {
        console.log('刷新报警数据');
        await Promise.all([
            this.loadAlertCounts(),
            this.loadAlerts(),
            this.loadStatistics()
        ]);
        notificationUtils.success('报警数据已刷�?);
    }

    /**
     * 获取严重程度文本
     */
    getSeverityText(severity) {
        const texts = {
            low: '�?,
            medium: '�?,
            high: '�?,
            critical: '紧�?
        };
        return texts[severity] || severity;
    }

    /**
     * 获取严重程度图标
     */
    getSeverityIcon(severity) {
        const icons = {
            low: '🔵',
            medium: '🟡',
            high: '🟠',
            critical: '🔴'
        };
        return icons[severity] || '�?;
    }

    /**
     * 获取报警类型文本
     */
    getTypeText(alertType) {
        const texts = {
            temperature: '温度报警',
            humidity: '湿度报警',
            light: '光照报警',
            device_error: '设备故障',
            system_error: '系统错误'
        };
        return texts[alertType] || alertType;
    }

    /**
     * 生成模拟报警数据
     */
    generateMockAlerts() {
        return [
            {
                id: 1,
                alertType: 'temperature',
                severity: 'high',
                message: '温度过高，当前温�?2.5°C，超出阈�?0°C',
                parameterValue: 32.5,
                thresholdValue: 30.0,
                isResolved: false,
                createdAt: new Date(Date.now() - 300000).toISOString()
            },
            {
                id: 2,
                alertType: 'device_error',
                severity: 'medium',
                message: '灌溉系统1离线',
                deviceId: 'irrigation_01',
                isResolved: false,
                createdAt: new Date(Date.now() - 600000).toISOString()
            },
            {
                id: 3,
                alertType: 'humidity',
                severity: 'low',
                message: '湿度偏低，当前湿�?5%，建议�?0-60%',
                parameterValue: 35,
                thresholdValue: 40,
                isResolved: true,
                createdAt: new Date(Date.now() - 900000).toISOString(),
                resolvedAt: new Date(Date.now() - 300000).toISOString()
            }
        ];
    }

    /**
     * 生成模拟类型统计数据
     */
    generateMockTypeStats() {
        return [
            { alertType: 'temperature', count: 15 },
            { alertType: 'humidity', count: 8 },
            { alertType: 'device_error', count: 5 },
            { alertType: 'light', count: 3 },
            { alertType: 'system_error', count: 2 }
        ];
    }

    /**
     * 生成模拟严重程度统计数据
     */
    generateMockSeverityStats() {
        return [
            { severity: 'critical', count: 2 },
            { severity: 'high', count: 8 },
            { severity: 'medium', count: 15 },
            { severity: 'low', count: 8 }
        ];
    }

    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
        }
    }
}

// 创建全局实例
const alertsComponent = new AlertsComponent();

