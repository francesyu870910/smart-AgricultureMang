/**
 * 智能温室环境监控系统 - 实时数据工具
 * 提供WebSocket连接和实时数据处理功�?
 */

class RealtimeUtils {
    constructor() {
        this.connections = new Map();
        this.subscribers = new Map();
        this.reconnectAttempts = new Map();
        this.maxReconnectAttempts = 5;
        this.reconnectDelay = 1000;
        this.heartbeatInterval = 30000;
        this.heartbeatTimers = new Map();
    }

    /**
     * 创建WebSocket连接
     * @param {string} url - WebSocket URL
     * @param {Object} options - 连接选项
     * @returns {Promise} 连接Promise
     */
    connect(url, options = {}) {
        const {
            protocols = [],
            autoReconnect = true,
            heartbeat = true,
            onOpen = null,
            onMessage = null,
            onError = null,
            onClose = null
        } = options;

        return new Promise((resolve, reject) => {
            try {
                const ws = new WebSocket(url, protocols);
                const connectionId = this.generateConnectionId();
                
                // 存储连接信息
                this.connections.set(connectionId, {
                    ws,
                    url,
                    options,
                    status: 'connecting',
                    lastActivity: Date.now()
                });

                ws.onopen = (event) => {
                    console.log(`WebSocket连接已建�? ${url}`);
                    
                    const connection = this.connections.get(connectionId);
                    connection.status = 'connected';
                    connection.lastActivity = Date.now();
                    
                    // 重置重连计数
                    this.reconnectAttempts.set(connectionId, 0);
                    
                    // 启动心跳
                    if (heartbeat) {
                        this.startHeartbeat(connectionId);
                    }
                    
                    if (onOpen) onOpen(event);
                    resolve({ connectionId, ws });
                };

                ws.onmessage = (event) => {
                    const connection = this.connections.get(connectionId);
                    if (connection) {
                        connection.lastActivity = Date.now();
                    }

                    try {
                        const data = JSON.parse(event.data);
                        this.handleMessage(connectionId, data);
                        if (onMessage) onMessage(data, event);
                    } catch (error) {
                        console.warn('解析WebSocket消息失败:', error);
                        if (onMessage) onMessage(event.data, event);
                    }
                };

                ws.onerror = (event) => {
                    console.error(`WebSocket错误: ${url}`, event);
                    if (onError) onError(event);
                };

                ws.onclose = (event) => {
                    console.log(`WebSocket连接已关�? ${url}`, event);
                    
                    const connection = this.connections.get(connectionId);
                    if (connection) {
                        connection.status = 'disconnected';
                        this.stopHeartbeat(connectionId);
                    }

                    if (onClose) onClose(event);

                    // 自动重连
                    if (autoReconnect && !event.wasClean) {
                        this.attemptReconnect(connectionId);
                    }
                };

            } catch (error) {
                console.error('创建WebSocket连接失败:', error);
                reject(error);
            }
        });
    }

    /**
     * 断开连接
     * @param {string} connectionId - 连接ID
     */
    disconnect(connectionId) {
        const connection = this.connections.get(connectionId);
        if (connection && connection.ws) {
            this.stopHeartbeat(connectionId);
            connection.ws.close(1000, '主动断开连接');
            this.connections.delete(connectionId);
            this.subscribers.delete(connectionId);
            this.reconnectAttempts.delete(connectionId);
        }
    }

    /**
     * 发送消�?
     * @param {string} connectionId - 连接ID
     * @param {*} data - 消息数据
     * @returns {boolean} 是否发送成�?
     */
    send(connectionId, data) {
        const connection = this.connections.get(connectionId);
        if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket连接不可用，无法发送消�?);
            return false;
        }

        try {
            const message = typeof data === 'string' ? data : JSON.stringify(data);
            connection.ws.send(message);
            connection.lastActivity = Date.now();
            return true;
        } catch (error) {
            console.error('发送WebSocket消息失败:', error);
            return false;
        }
    }

    /**
     * 订阅消息类型
     * @param {string} connectionId - 连接ID
     * @param {string} messageType - 消息类型
     * @param {Function} callback - 回调函数
     */
    subscribe(connectionId, messageType, callback) {
        if (!this.subscribers.has(connectionId)) {
            this.subscribers.set(connectionId, new Map());
        }

        const connectionSubscribers = this.subscribers.get(connectionId);
        if (!connectionSubscribers.has(messageType)) {
            connectionSubscribers.set(messageType, []);
        }

        connectionSubscribers.get(messageType).push(callback);
    }

    /**
     * 取消订阅
     * @param {string} connectionId - 连接ID
     * @param {string} messageType - 消息类型
     * @param {Function} callback - 回调函数
     */
    unsubscribe(connectionId, messageType, callback) {
        const connectionSubscribers = this.subscribers.get(connectionId);
        if (!connectionSubscribers) return;

        const typeSubscribers = connectionSubscribers.get(messageType);
        if (!typeSubscribers) return;

        const index = typeSubscribers.indexOf(callback);
        if (index > -1) {
            typeSubscribers.splice(index, 1);
        }
    }

    /**
     * 处理接收到的消息
     * @param {string} connectionId - 连接ID
     * @param {Object} data - 消息数据
     */
    handleMessage(connectionId, data) {
        const connectionSubscribers = this.subscribers.get(connectionId);
        if (!connectionSubscribers) return;

        const messageType = data.type || 'default';
        const typeSubscribers = connectionSubscribers.get(messageType);
        
        if (typeSubscribers) {
            typeSubscribers.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('消息处理回调执行失败:', error);
                }
            });
        }

        // 通用订阅�?
        const allSubscribers = connectionSubscribers.get('*');
        if (allSubscribers) {
            allSubscribers.forEach(callback => {
                try {
                    callback(data);
                } catch (error) {
                    console.error('通用消息处理回调执行失败:', error);
                }
            });
        }
    }

    /**
     * 尝试重连
     * @param {string} connectionId - 连接ID
     */
    async attemptReconnect(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection) return;

        const attempts = this.reconnectAttempts.get(connectionId) || 0;
        if (attempts >= this.maxReconnectAttempts) {
            console.error('达到最大重连次数，停止重连');
            notificationUtils.error('网络连接已断开，请刷新页面重试', '连接失败');
            return;
        }

        this.reconnectAttempts.set(connectionId, attempts + 1);
        const delay = this.reconnectDelay * Math.pow(2, attempts); // 指数退�?

        console.log(`${delay}ms后尝试第${attempts + 1}次重�?..`);
        
        setTimeout(async () => {
            try {
                const newConnection = await this.connect(connection.url, connection.options);
                
                // 更新连接信息
                this.connections.set(connectionId, {
                    ...connection,
                    ws: newConnection.ws,
                    status: 'connected'
                });

                notificationUtils.success('网络连接已恢�?, '连接成功');
            } catch (error) {
                console.error('重连失败:', error);
                this.attemptReconnect(connectionId);
            }
        }, delay);
    }

    /**
     * 启动心跳
     * @param {string} connectionId - 连接ID
     */
    startHeartbeat(connectionId) {
        const timer = setInterval(() => {
            const connection = this.connections.get(connectionId);
            if (!connection || connection.ws.readyState !== WebSocket.OPEN) {
                this.stopHeartbeat(connectionId);
                return;
            }

            // 检查最后活动时�?
            const timeSinceLastActivity = Date.now() - connection.lastActivity;
            if (timeSinceLastActivity > this.heartbeatInterval * 2) {
                console.warn('WebSocket连接可能已断开，尝试重�?);
                connection.ws.close();
                return;
            }

            // 发送心�?
            this.send(connectionId, { type: 'ping', timestamp: Date.now() });
        }, this.heartbeatInterval);

        this.heartbeatTimers.set(connectionId, timer);
    }

    /**
     * 停止心跳
     * @param {string} connectionId - 连接ID
     */
    stopHeartbeat(connectionId) {
        const timer = this.heartbeatTimers.get(connectionId);
        if (timer) {
            clearInterval(timer);
            this.heartbeatTimers.delete(connectionId);
        }
    }

    /**
     * 获取连接状�?
     * @param {string} connectionId - 连接ID
     * @returns {Object} 连接状�?
     */
    getConnectionStatus(connectionId) {
        const connection = this.connections.get(connectionId);
        if (!connection) {
            return { status: 'not_found' };
        }

        return {
            status: connection.status,
            readyState: connection.ws.readyState,
            url: connection.url,
            lastActivity: connection.lastActivity,
            reconnectAttempts: this.reconnectAttempts.get(connectionId) || 0
        };
    }

    /**
     * 获取所有连接状�?
     * @returns {Object} 所有连接状�?
     */
    getAllConnectionStatus() {
        const status = {};
        this.connections.forEach((connection, connectionId) => {
            status[connectionId] = this.getConnectionStatus(connectionId);
        });
        return status;
    }

    /**
     * 生成连接ID
     * @returns {string} 连接ID
     */
    generateConnectionId() {
        return `ws_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * 清理所有连�?
     */
    cleanup() {
        this.connections.forEach((connection, connectionId) => {
            this.disconnect(connectionId);
        });
        
        this.connections.clear();
        this.subscribers.clear();
        this.reconnectAttempts.clear();
        this.heartbeatTimers.clear();
    }
}

/**
 * 实时数据管理�?
 */
class RealtimeDataManager {
    constructor() {
        this.dataStreams = new Map();
        this.updateCallbacks = new Map();
        this.bufferSize = 100;
        this.updateInterval = 1000;
        this.realtimeUtils = new RealtimeUtils();
    }

    /**
     * 创建数据�?
     * @param {string} streamId - 数据流ID
     * @param {Object} config - 配置
     */
    createDataStream(streamId, config = {}) {
        const {
            bufferSize = this.bufferSize,
            updateInterval = this.updateInterval,
            dataProcessor = null,
            onUpdate = null
        } = config;

        const stream = {
            id: streamId,
            buffer: [],
            bufferSize,
            updateInterval,
            dataProcessor,
            lastUpdate: Date.now(),
            timer: null
        };

        this.dataStreams.set(streamId, stream);

        if (onUpdate) {
            this.onDataUpdate(streamId, onUpdate);
        }

        // 启动定时更新
        stream.timer = setInterval(() => {
            this.processStreamData(streamId);
        }, updateInterval);

        return streamId;
    }

    /**
     * 添加数据到流
     * @param {string} streamId - 数据流ID
     * @param {*} data - 数据
     */
    addData(streamId, data) {
        const stream = this.dataStreams.get(streamId);
        if (!stream) return;

        // 处理数据
        const processedData = stream.dataProcessor ? 
            stream.dataProcessor(data) : data;

        // 添加时间�?
        const timestampedData = {
            ...processedData,
            timestamp: Date.now(),
            _streamId: streamId
        };

        // 添加到缓冲区
        stream.buffer.push(timestampedData);

        // 限制缓冲区大�?
        if (stream.buffer.length > stream.bufferSize) {
            stream.buffer.shift();
        }

        stream.lastUpdate = Date.now();
    }

    /**
     * 处理流数�?
     * @param {string} streamId - 数据流ID
     */
    processStreamData(streamId) {
        const stream = this.dataStreams.get(streamId);
        if (!stream || stream.buffer.length === 0) return;

        const callbacks = this.updateCallbacks.get(streamId) || [];
        const data = [...stream.buffer];

        callbacks.forEach(callback => {
            try {
                callback(data, streamId);
            } catch (error) {
                console.error('数据流更新回调执行失�?', error);
            }
        });
    }

    /**
     * 订阅数据更新
     * @param {string} streamId - 数据流ID
     * @param {Function} callback - 回调函数
     */
    onDataUpdate(streamId, callback) {
        if (!this.updateCallbacks.has(streamId)) {
            this.updateCallbacks.set(streamId, []);
        }
        this.updateCallbacks.get(streamId).push(callback);
    }

    /**
     * 取消数据更新订阅
     * @param {string} streamId - 数据流ID
     * @param {Function} callback - 回调函数
     */
    offDataUpdate(streamId, callback) {
        const callbacks = this.updateCallbacks.get(streamId);
        if (!callbacks) return;

        const index = callbacks.indexOf(callback);
        if (index > -1) {
            callbacks.splice(index, 1);
        }
    }

    /**
     * 获取流数�?
     * @param {string} streamId - 数据流ID
     * @param {number} limit - 数据限制
     * @returns {Array} 数据数组
     */
    getStreamData(streamId, limit = null) {
        const stream = this.dataStreams.get(streamId);
        if (!stream) return [];

        const data = [...stream.buffer];
        return limit ? data.slice(-limit) : data;
    }

    /**
     * 清空流数�?
     * @param {string} streamId - 数据流ID
     */
    clearStreamData(streamId) {
        const stream = this.dataStreams.get(streamId);
        if (stream) {
            stream.buffer = [];
        }
    }

    /**
     * 销毁数据流
     * @param {string} streamId - 数据流ID
     */
    destroyDataStream(streamId) {
        const stream = this.dataStreams.get(streamId);
        if (stream) {
            if (stream.timer) {
                clearInterval(stream.timer);
            }
            this.dataStreams.delete(streamId);
            this.updateCallbacks.delete(streamId);
        }
    }

    /**
     * 获取流统计信�?
     * @param {string} streamId - 数据流ID
     * @returns {Object} 统计信息
     */
    getStreamStats(streamId) {
        const stream = this.dataStreams.get(streamId);
        if (!stream) return null;

        return {
            id: streamId,
            bufferSize: stream.buffer.length,
            maxBufferSize: stream.bufferSize,
            lastUpdate: stream.lastUpdate,
            updateInterval: stream.updateInterval,
            subscriberCount: (this.updateCallbacks.get(streamId) || []).length
        };
    }

    /**
     * 清理所有数据流
     */
    cleanup() {
        this.dataStreams.forEach((stream, streamId) => {
            this.destroyDataStream(streamId);
        });
        this.realtimeUtils.cleanup();
    }
}

// 创建全局实例
const realtimeUtils = new RealtimeUtils();
const realtimeDataManager = new RealtimeDataManager();
