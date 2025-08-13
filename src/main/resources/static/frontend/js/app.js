/**
 * 智能温室环境监控系统 - 主应用控制器
 * 负责页面路由、组件管理和全局状态管�?
 */

class GreenhouseApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.components = {};
        this.refreshInterval = null;
        this.isOnline = true;
        this.autoRefreshEnabled = true;
        this.refreshIntervalMs = 30000;
        this.realtimeConnectionId = null;
        this.startTime = Date.now();
        
        this.init();
    }

    /**
     * 初始化应�?
     */
    async init() {
        try {
            // 初始化工具类
            await this.initializeUtils();
            
            // 初始化组�?
            this.initializeComponents();
            
            // 绑定事件
            this.bindEvents();
            
            // 启动定时任务
            this.startTimeUpdate();
            this.startDataRefresh();
            
            // 加载默认模块
            await this.loadModule('dashboard');
            
            // 检查系统健康状�?
            await this.checkSystemHealth();
            
            console.log('智能温室环境监控系统已启�?);
            notificationUtils.success('系统初始化完�?, '欢迎使用');
            
        } catch (error) {
            console.error('系统初始化失�?', error);
            notificationUtils.error('系统初始化失败，请刷新页面重�?, '启动错误');
        }
    }

    /**
     * 初始化工具类
     */
    async initializeUtils() {
        // 检查必要的工具类是否已加载
        const requiredUtils = [
            'apiService', 'storageService', 'notificationUtils', 
            'errorUtils', 'formatUtils', 'validationUtils',
            'chartUtils', 'dataUtils', 'uiUtils', 'realtimeUtils'
        ];

        const missingUtils = requiredUtils.filter(util => typeof window[util] === 'undefined');
        if (missingUtils.length > 0) {
            throw new Error(`缺少必要的工具类: ${missingUtils.join(', ')}`);
        }

        // 初始化实时数据连接（如果需要）
        try {
            await this.initializeRealtimeConnection();
        } catch (error) {
            console.warn('实时连接初始化失败，将使用轮询模�?', error);
        }

        // 加载用户设置
        this.loadUserSettings();
    }

    /**
     * 初始化实时连�?
     */
    async initializeRealtimeConnection() {
        // 尝试建立WebSocket连接
        const wsUrl = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws/greenhouse`;
        
        try {
            const connection = await realtimeUtils.connect(wsUrl, {
                autoReconnect: true,
                heartbeat: true,
                onMessage: (data) => this.handleRealtimeMessage(data),
                onError: (error) => console.warn('WebSocket连接错误:', error)
            });

            this.realtimeConnectionId = connection.connectionId;
            console.log('实时连接已建�?);
            
        } catch (error) {
            console.warn('无法建立实时连接，使用轮询模�?);
        }
    }

    /**
     * 处理实时消息
     */
    handleRealtimeMessage(data) {
        switch (data.type) {
            case 'environment_data':
                this.updateEnvironmentData(data.payload);
                break;
            case 'device_status':
                this.updateDeviceStatus(data.payload);
                break;
            case 'alert':
                this.handleAlert(data.payload);
                break;
            default:
                console.log('收到未知类型的实时消�?', data);
        }
    }

    /**
     * 加载用户设置
     */
    loadUserSettings() {
        const settings = storageService.getUserSettings();
        
        // 应用主题设置
        if (settings.theme) {
            document.body.setAttribute('data-theme', settings.theme);
        }
        
        // 应用自动刷新设置
        if (settings.autoRefresh !== undefined) {
            this.autoRefreshEnabled = settings.autoRefresh;
        }
        
        // 应用刷新间隔设置
        if (settings.refreshInterval) {
            this.refreshInterval = settings.refreshInterval;
        }
    }

    /**
     * 检查系统健康状�?
     */
    async checkSystemHealth() {
        try {
            const healthStatus = await apiService.healthCheck();
            if (healthStatus.success) {
                console.log('系统健康检查通过');
            } else {
                console.warn('系统健康检查失�?', healthStatus);
                notificationUtils.warning('系统状态异常，部分功能可能受影�?, '系统警告');
            }
        } catch (error) {
            console.error('健康检查失�?', error);
            notificationUtils.warning('无法连接到服务器，将使用离线模式', '连接警告');
        }
    }

    /**
     * 初始化所有组�?
     */
    initializeComponents() {
        // 注册所有功能模块组�?
        this.components = {
            dashboard: new DashboardComponent(),
            temperature: new TemperatureComponent(),
            humidity: new HumidityComponent(),
            lighting: new LightingComponent(),
            ventilation: new VentilationComponent(),
            alerts: new AlertsComponent(),
            analytics: new AnalyticsComponent(),
            control: new ControlComponent(),
            history: new HistoryComponent()
        };
    }

    /**
     * 绑定事件监听�?
     */
    bindEvents() {
        // 导航菜单点击事件
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const module = e.currentTarget.dataset.module;
                if (module) {
                    this.loadModule(module);
                }
            });
        });

        // 刷新按钮点击事件
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshCurrentModule();
            });
        }

        // 模态框事件
        this.bindModalEvents();

        // 键盘快捷�?
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // 窗口大小变化事件
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // 网络状态监�?
        window.addEventListener('online', () => {
            this.setOnlineStatus(true);
        });

        window.addEventListener('offline', () => {
            this.setOnlineStatus(false);
        });
    }

    /**
     * 加载指定模块
     * @param {string} moduleName - 模块名称
     */
    async loadModule(moduleName) {
        if (!this.components[moduleName]) {
            this.showToast('模块不存�?, 'error');
            return;
        }

        try {
            // 显示加载状�?
            this.showLoading();

            // 更新导航状�?
            this.updateNavigation(moduleName);

            // 更新内容标题
            this.updateContentTitle(moduleName);

            // 加载模块内容
            const component = this.components[moduleName];
            const content = await component.render();
            
            // 更新内容区域
            const contentBody = document.getElementById('contentBody');
            contentBody.innerHTML = content;

            // 初始化模�?
            if (typeof component.init === 'function') {
                await component.init();
            }

            this.currentModule = moduleName;
            
            // 隐藏加载状�?
            this.hideLoading();

        } catch (error) {
            console.error('加载模块失败:', error);
            this.showToast('加载模块失败', 'error');
            this.hideLoading();
        }
    }

    /**
     * 更新导航状�?
     * @param {string} moduleName - 当前模块名称
     */
    updateNavigation(moduleName) {
        // 移除所有活动状�?
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });

        // 添加当前模块的活动状�?
        const currentNavItem = document.querySelector(`[data-module="${moduleName}"]`);
        if (currentNavItem) {
            currentNavItem.classList.add('active');
        }
    }

    /**
     * 更新内容标题
     * @param {string} moduleName - 模块名称
     */
    updateContentTitle(moduleName) {
        const titles = {
            dashboard: '系统概览',
            temperature: '温度监控',
            humidity: '湿度控制',
            lighting: '光照管理',
            ventilation: '通风系统',
            alerts: '报警通知',
            analytics: '数据分析',
            control: '远程控制',
            history: '历史记录'
        };

        const titleElement = document.getElementById('contentTitle');
        if (titleElement && titles[moduleName]) {
            titleElement.textContent = titles[moduleName];
        }
    }

    /**
     * 刷新当前模块
     */
    async refreshCurrentModule() {
        if (this.currentModule && this.components[this.currentModule]) {
            const component = this.components[this.currentModule];
            if (typeof component.refresh === 'function') {
                try {
                    await component.refresh();
                    this.showToast('数据已刷�?, 'success');
                } catch (error) {
                    console.error('刷新数据失败:', error);
                    this.showToast('刷新数据失败', 'error');
                }
            }
        }
    }

    /**
     * 显示加载状�?
     */
    showLoading(message = '正在加载数据...') {
        const contentBody = document.getElementById('contentBody');
        const loader = uiUtils.createLoader(message, 'large');
        contentBody.innerHTML = '';
        contentBody.appendChild(loader);
    }

    /**
     * 隐藏加载状�?
     */
    hideLoading() {
        // 加载状态会被新内容替换，这里不需要特殊处�?
    }

    /**
     * 显示提示消息（使用新的通知工具�?
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, error)
     */
    showToast(message, type = 'info') {
        // 使用新的通知工具
        switch (type) {
            case 'success':
                notificationUtils.success(message);
                break;
            case 'warning':
                notificationUtils.warning(message);
                break;
            case 'error':
                notificationUtils.error(message);
                break;
            default:
                notificationUtils.info(message);
        }
    }

    /**
     * 显示确认对话框（使用新的通知工具�?
     * @param {string} message - 确认消息
     * @param {Function} onConfirm - 确认回调
     * @param {Function} onCancel - 取消回调
     */
    showConfirm(message, onConfirm, onCancel) {
        // 使用新的通知工具显示确认对话�?
        notificationUtils.showConfirm(message, onConfirm, onCancel);
    }

    /**
     * 绑定模态框事件
     */
    bindModalEvents() {
        // 点击关闭按钮关闭模态框
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.remove('show');
                }
            });
        });

        // 点击模态框背景关闭
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.classList.remove('show');
                }
            });
        });
    }

    /**
     * 处理键盘快捷�?
     * @param {KeyboardEvent} e - 键盘事件
     */
    handleKeyboardShortcuts(e) {
        // Ctrl + R: 刷新当前模块
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            this.refreshCurrentModule();
        }

        // ESC: 关闭模态框
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
            });
        }

        // 数字键快速切换模�?
        const moduleKeys = {
            '1': 'dashboard',
            '2': 'temperature',
            '3': 'humidity',
            '4': 'lighting',
            '5': 'ventilation',
            '6': 'alerts',
            '7': 'analytics',
            '8': 'control',
            '9': 'history'
        };

        if (e.altKey && moduleKeys[e.key]) {
            e.preventDefault();
            this.loadModule(moduleKeys[e.key]);
        }
    }

    /**
     * 处理窗口大小变化
     */
    handleResize() {
        // 通知当前组件窗口大小已变�?
        if (this.currentModule && this.components[this.currentModule]) {
            const component = this.components[this.currentModule];
            if (typeof component.onResize === 'function') {
                component.onResize();
            }
        }
    }

    /**
     * 设置在线状�?
     * @param {boolean} online - 是否在线
     */
    setOnlineStatus(online) {
        this.isOnline = online;
        
        const statusIndicator = document.querySelector('.status-indicator');
        const statusText = document.querySelector('.status-text');
        
        if (statusIndicator && statusText) {
            if (online) {
                statusIndicator.className = 'status-indicator online';
                statusText.textContent = '系统正常';
            } else {
                statusIndicator.className = 'status-indicator offline';
                statusText.textContent = '网络断开';
            }
        }

        // 显示网络状态提�?
        this.showToast(online ? '网络已连�? : '网络已断开', online ? 'success' : 'warning');
    }

    /**
     * 开始时间更�?
     */
    startTimeUpdate() {
        const updateTime = () => {
            const now = new Date();
            const timeString = now.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            
            const timeElement = document.getElementById('currentTime');
            if (timeElement) {
                timeElement.textContent = timeString;
            }
        };

        // 立即更新一�?
        updateTime();
        
        // 每秒更新时间
        setInterval(updateTime, 1000);
    }

    /**
     * 开始数据自动刷�?
     */
    startDataRefresh() {
        // �?0秒自动刷新数�?
        this.refreshInterval = setInterval(() => {
            if (this.isOnline) {
                this.refreshCurrentModule();
            }
        }, 30000);
    }

    /**
     * 停止数据自动刷新
     */
    stopDataRefresh() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
    }

    /**
     * 获取当前模块
     * @returns {string} 当前模块名称
     */
    getCurrentModule() {
        return this.currentModule;
    }

    /**
     * 获取组件实例
     * @param {string} moduleName - 模块名称
     * @returns {Object} 组件实例
     */
    getComponent(moduleName) {
        return this.components[moduleName];
    }

    /**
     * 更新环境数据
     */
    updateEnvironmentData(data) {
        // 通知当前组件更新环境数据
        if (this.currentModule && this.components[this.currentModule]) {
            const component = this.components[this.currentModule];
            if (typeof component.updateEnvironmentData === 'function') {
                component.updateEnvironmentData(data);
            }
        }
    }

    /**
     * 更新设备状�?
     */
    updateDeviceStatus(data) {
        // 通知当前组件更新设备状�?
        if (this.currentModule && this.components[this.currentModule]) {
            const component = this.components[this.currentModule];
            if (typeof component.updateDeviceStatus === 'function') {
                component.updateDeviceStatus(data);
            }
        }
    }

    /**
     * 处理报警
     */
    handleAlert(alertData) {
        // 显示报警通知
        const severity = alertData.severity || 'medium';
        const message = alertData.message || '系统报警';
        
        switch (severity) {
            case 'critical':
                notificationUtils.error(message, '紧急报�?);
                // 播放报警声音（如果支持）
                this.playAlertSound();
                break;
            case 'high':
                notificationUtils.error(message, '高级报警');
                break;
            case 'medium':
                notificationUtils.warning(message, '中级报警');
                break;
            default:
                notificationUtils.info(message, '低级报警');
        }

        // 通知报警组件更新
        if (this.components.alerts && typeof this.components.alerts.addAlert === 'function') {
            this.components.alerts.addAlert(alertData);
        }
    }

    /**
     * 播放报警声音
     */
    playAlertSound() {
        try {
            // 创建音频上下文播放报警音
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('无法播放报警声音:', error);
        }
    }

    /**
     * 保存用户设置
     */
    saveUserSettings(settings) {
        const currentSettings = storageService.getUserSettings();
        const newSettings = { ...currentSettings, ...settings };
        storageService.setUserSettings(newSettings);
        
        // 应用新设�?
        this.loadUserSettings();
    }

    /**
     * 获取应用统计信息
     */
    getAppStats() {
        return {
            currentModule: this.currentModule,
            isOnline: this.isOnline,
            autoRefreshEnabled: this.autoRefreshEnabled,
            refreshInterval: this.refreshInterval,
            realtimeConnected: !!this.realtimeConnectionId,
            componentCount: Object.keys(this.components).length,
            uptime: Date.now() - this.startTime
        };
    }

    /**
     * 销毁应�?
     */
    destroy() {
        this.stopDataRefresh();
        
        // 断开实时连接
        if (this.realtimeConnectionId) {
            realtimeUtils.disconnect(this.realtimeConnectionId);
        }
        
        // 清理实时数据管理�?
        if (typeof realtimeDataManager !== 'undefined') {
            realtimeDataManager.cleanup();
        }
        
        // 销毁所有组�?
        Object.values(this.components).forEach(component => {
            if (typeof component.destroy === 'function') {
                component.destroy();
            }
        });
        
        // 清理通知
        if (typeof notificationUtils !== 'undefined') {
            notificationUtils.clearAll();
        }
        
        console.log('智能温室环境监控系统已关�?);
    }
}

// 全局应用实例
let app;

// DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new GreenhouseApp();
});

// 页面卸载前清理资�?
window.addEventListener('beforeunload', () => {
    if (app) {
        app.destroy();
    }
});
