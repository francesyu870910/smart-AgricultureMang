/**
 * 智能温室环境监控系统 - WebSocket服务
 * 提供实时数据推送功�?
 */

class WebSocketService {
    constructor() {
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 5;
        this.reconnectInterval = 5000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimer = null;
        this.listeners = new Map();
        this.isConnecting = false;
        this.isManualClose = false;
    }

    /**
     * 连接WebSocket
     * @param {string} url - WebSocket URL
     */
    connect(url = null) {
        if (this.isConnecting || (this.ws && this.ws.readyState === WebSocket.CONNECTING)) {
            return;
        }

        this.isConnecting = true;
        this.isManualClose = false;

        // 构建WebSocket URL
        const wsUrl = url || this.buildWebSocketUrl();

        try {
            this.ws = new WebSocket(wsUrl);
            this.setupEventHandlers();
        } catch (error) {
            console.error('WebSocket连接失败:', error);
            this.isConnecting = false;
            this.handleConnectionError(error);
        }
    }

    /**
     * 构建WebSocket URL
     */
    buildWebSocketUrl() {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        return `${protocol}//${host}/ws/greenhouse`;
    }

    /**
     * 设置事件处理�?
     */
    setupEventHandlers() {
        this.ws.onopen = (event) => {
            console.log('WebSocket连接已建�?);
            this.isConnecting = false;
            this.reconnectAttempts = 0;
            this.startHeartbeat();
            this.emit('connected', event);
            notificationUtils.success('实时数据连接已建�?);
        };

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handleMessage(data);
            } catch (error) {
                console.error('WebSocket消息解析失败:', error);
            }
        };

        this.ws.onclose = (event) => {
            console.log('WebSocket连接已关�?', event.code, event.reason);
            this.isConnecting = false;
            this.stopHeartbeat();
            this.emit('disconnected', event);

            if (!this.isManualClose && this.reconnectAttempts < this.maxReconnectAttempts) {
                this.scheduleReconnect();
            } else if (!this.isManualClose) {
                notificationUtils.error('实时数据连接已断开，请刷新页面重试');
            }
        };

        this.ws.onerror = (error) => {
            console.error('WebSocket错误:', error);
            this.isConnecting = false;
            this.emit('error', error);
            this.handleConnectionError(error);
        };
    }

    /**
     * 处理接收到的消息
     */
    handleMessage(data) {
        const { type, payload, timestamp } = data;

        switch (type) {
            case 'environment_data':
                this.emit('environmentData', payload);
                break;
            case 'device_status':
                this.emit('deviceStatus', payload);
                break;
            case 'alert':
                this.emit('alert', payload);
                this.handleAlert(payload);
                break;
            case 'system_status':
                this.emit('systemStatus', payload);
                break;
            case 'heartbeat':
                // 心跳响应，不需要特殊处�?
                break;
            default:
                console.warn('未知的WebSocket消息类型:', type);
                this.emit('message', data);
        }
    }

    /**
     * 处理报警消息
     */
    handleAlert(alert) {
        const { severity, message, type } = alert;
        
        // 显示通知
        switch (severity) {
            case 'critical':
                notificationUtils.error(message, '紧急报�?);
                // 显示系统通知
                notificationUtils.showSystemNotification('紧急报�?, message, {
                    requireInteraction: true
                });
                break;
            case 'high':
                notificationUtils.error(message, '高级报警');
                break;
            case 'medium':
                notificationUtils.warning(message, '中级报警');
                break;
            case 'low':
                notificationUtils.info(message, '低级报警');
                break;
        }

        // 播放报警声音（如果启用）
        this.playAlertSound(severity);
    }

    /**
     * 播放报警声音
     */
    playAlertSound(severity) {
        try {
            // 创建音频上下�?
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            // 根据报警级别设置不同的音�?
            const frequencies = {
                critical: 800,
                high: 600,
                medium: 400,
                low: 300
            };

            oscillator.frequency.setValueAtTime(frequencies[severity] || 400, audioContext.currentTime);
            oscillator.type = 'sine';

            // 设置音量
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

            // 播放声音
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        } catch (error) {
            console.warn('无法播放报警声音:', error);
        }
    }

    /**
     * 发送消�?
     */
    send(type, payload = {}) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            const message = {
                type,
                payload,
                timestamp: new Date().toISOString()
            };
            this.ws.send(JSON.stringify(message));
            return true;
        } else {
            console.warn('WebSocket未连接，无法发送消�?);
            return false;
        }
    }

    /**
     * 订阅数据更新
     */
    subscribe(dataType) {
        return this.send('subscribe', { dataType });
    }

    /**
     * 取消订阅
     */
    unsubscribe(dataType) {
        return this.send('unsubscribe', { dataType });
    }

    /**
     * 开始心�?
     */
    startHeartbeat() {
        this.stopHeartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.send('heartbeat');
        }, this.heartbeatInterval);
    }

    /**
     * 停止心跳
     */
    stopHeartbeat() {
        if (this.heartbeatTimer) {
            clearInterval(this.heartbeatTimer);
            this.heartbeatTimer = null;
        }
    }

    /**
     * 安排重连
     */
    scheduleReconnect() {
        this.reconnectAttempts++;
        const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
        
        console.log(`${delay / 1000}秒后尝试�?{this.reconnectAttempts}次重�?..`);
        
        setTimeout(() => {
            if (!this.isManualClose) {
                this.connect();
            }
        }, delay);
    }

    /**
     * 处理连接错误
     */
    handleConnectionError(error) {
        if (this.reconnectAttempts === 0) {
            notificationUtils.warning('实时数据连接失败，正在尝试重�?..');
        }
    }

    /**
     * 手动关闭连接
     */
    disconnect() {
        this.isManualClose = true;
        this.stopHeartbeat();
        
        if (this.ws) {
            this.ws.close(1000, '手动关闭');
            this.ws = null;
        }
    }

    /**
     * 获取连接状�?
     */
    getConnectionState() {
        if (!this.ws) return 'disconnected';
        
        switch (this.ws.readyState) {
            case WebSocket.CONNECTING:
                return 'connecting';
            case WebSocket.OPEN:
                return 'connected';
            case WebSocket.CLOSING:
                return 'closing';
            case WebSocket.CLOSED:
                return 'disconnected';
            default:
                return 'unknown';
        }
    }

    /**
     * 检查是否已连接
     */
    isConnected() {
        return this.ws && this.ws.readyState === WebSocket.OPEN;
    }

    /**
     * 添加事件监听�?
     */
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }

    /**
     * 移除事件监听�?
     */
    off(event, callback) {
        if (this.listeners.has(event)) {
            const callbacks = this.listeners.get(event);
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
            }
        }
    }

    /**
     * 触发事件
     */
    emit(event, data) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error(`WebSocket事件处理器错�?(${event}):`, error);
                }
            });
        }
    }

    /**
     * 获取连接统计信息
     */
    getStats() {
        return {
            connectionState: this.getConnectionState(),
            reconnectAttempts: this.reconnectAttempts,
            isManualClose: this.isManualClose,
            listenerCount: Array.from(this.listeners.values()).reduce((sum, arr) => sum + arr.length, 0)
        };
    }
}

// 创建全局WebSocket服务实例
const webSocketService = new WebSocketService();

// 页面加载完成后自动连�?
document.addEventListener('DOMContentLoaded', () => {
    // 延迟连接，确保其他服务已初始�?
    setTimeout(() => {
        webSocketService.connect();
    }, 1000);
});

// 页面卸载时断开连接
window.addEventListener('beforeunload', () => {
    webSocketService.disconnect();
});
