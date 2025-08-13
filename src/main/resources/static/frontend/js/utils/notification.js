/**
 * 智能温室环境监控系统 - 通知工具
 * 提供各种用户通知功能
 */

class NotificationUtils {
    constructor() {
        this.toastContainer = null;
        this.init();
    }

    /**
     * 初始化通知系统
     */
    init() {
        // 创建toast容器
        this.createToastContainer();
    }

    /**
     * 创建toast容器
     */
    createToastContainer() {
        if (this.toastContainer) return;

        this.toastContainer = document.createElement('div');
        this.toastContainer.id = 'toast-container';
        this.toastContainer.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 1001;
            max-width: 350px;
        `;
        document.body.appendChild(this.toastContainer);
    }

    /**
     * 显示toast通知
     * @param {string} message - 消息内容
     * @param {string} type - 消息类型 (success, warning, error, info)
     * @param {number} duration - 显示时长(毫秒)
     */
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // 设置toast样式
        toast.style.cssText = `
            background-color: var(--card-bg);
            border-left: 4px solid ${this.getTypeColor(type)};
            box-shadow: var(--shadow-hover);
            border-radius: 4px;
            padding: 15px 20px;
            margin-bottom: 10px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            position: relative;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        // 添加图标和消�?
        toast.innerHTML = `
            <div class="toast-icon">${this.getTypeIcon(type)}</div>
            <div class="toast-message" style="flex: 1; font-size: 14px; color: var(--text-primary);">${message}</div>
            <button class="toast-close" style="background: none; border: none; font-size: 18px; cursor: pointer; color: var(--text-secondary); padding: 0; width: 20px; height: 20px;">×</button>
        `;

        // 添加到容�?
        this.toastContainer.appendChild(toast);

        // 显示动画
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
        }, 10);

        // 绑定关闭按钮事件
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hideToast(toast);
        });

        // 自动隐藏
        if (duration > 0) {
            setTimeout(() => {
                this.hideToast(toast);
            }, duration);
        }

        return toast;
    }

    /**
     * 隐藏toast
     */
    hideToast(toast) {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }

    /**
     * 获取类型对应的颜�?
     */
    getTypeColor(type) {
        const colors = {
            success: '#4CAF50',
            warning: '#FF9800',
            error: '#F44336',
            info: '#2196F3'
        };
        return colors[type] || colors.info;
    }

    /**
     * 获取类型对应的图�?
     */
    getTypeIcon(type) {
        const icons = {
            success: '�?,
            warning: '�?,
            error: '�?,
            info: '�?
        };
        return icons[type] || icons.info;
    }

    /**
     * 显示成功消息
     */
    success(message, title = '') {
        const fullMessage = title ? `${title}: ${message}` : message;
        return this.showToast(fullMessage, 'success');
    }

    /**
     * 显示警告消息
     */
    warning(message, title = '') {
        const fullMessage = title ? `${title}: ${message}` : message;
        return this.showToast(fullMessage, 'warning');
    }

    /**
     * 显示错误消息
     */
    error(message, title = '') {
        const fullMessage = title ? `${title}: ${message}` : message;
        return this.showToast(fullMessage, 'error', 5000); // 错误消息显示更长时间
    }

    /**
     * 显示信息消息
     */
    info(message, title = '') {
        const fullMessage = title ? `${title}: ${message}` : message;
        return this.showToast(fullMessage, 'info');
    }

    /**
     * 显示加载提示
     */
    showLoading(message = '加载�?..') {
        const loading = document.createElement('div');
        loading.className = 'loading-toast';
        loading.style.cssText = `
            background-color: var(--card-bg);
            border-left: 4px solid var(--primary-color);
            box-shadow: var(--shadow-hover);
            border-radius: 4px;
            padding: 15px 20px;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 10px;
        `;

        loading.innerHTML = `
            <div class="loading-spinner" style="
                width: 16px;
                height: 16px;
                border: 2px solid var(--border-color);
                border-top: 2px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
            "></div>
            <div style="font-size: 14px; color: var(--text-primary);">${message}</div>
        `;

        this.toastContainer.appendChild(loading);
        return loading;
    }

    /**
     * 隐藏加载提示
     */
    hideLoading(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    }

    /**
     * 显示确认对话�?
     */
    showConfirm(message, onConfirm, onCancel = null, title = '确认操作') {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1002;
        `;

        modal.innerHTML = `
            <div class="modal-content" style="
                background-color: var(--card-bg);
                border-radius: 8px;
                box-shadow: var(--shadow-hover);
                max-width: 400px;
                width: 90%;
            ">
                <div class="modal-header" style="
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 20px;
                    border-bottom: 1px solid var(--border-color);
                ">
                    <h3 style="margin: 0; color: var(--primary-color);">${title}</h3>
                    <button class="modal-close" style="
                        background: none;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: var(--text-secondary);
                        padding: 0;
                        width: 30px;
                        height: 30px;
                    ">×</button>
                </div>
                <div class="modal-body" style="padding: 20px;">
                    <p style="margin: 0; color: var(--text-primary); line-height: 1.5;">${message}</p>
                </div>
                <div class="modal-footer" style="
                    display: flex;
                    gap: 10px;
                    justify-content: flex-end;
                    padding: 20px;
                    border-top: 1px solid var(--border-color);
                ">
                    <button class="btn btn-secondary modal-cancel">取消</button>
                    <button class="btn btn-primary modal-confirm">确认</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        const closeBtn = modal.querySelector('.modal-close');
        const cancelBtn = modal.querySelector('.modal-cancel');
        const confirmBtn = modal.querySelector('.modal-confirm');

        const closeModal = () => {
            document.body.removeChild(modal);
        };

        closeBtn.addEventListener('click', () => {
            closeModal();
            if (onCancel) onCancel();
        });

        cancelBtn.addEventListener('click', () => {
            closeModal();
            if (onCancel) onCancel();
        });

        confirmBtn.addEventListener('click', () => {
            closeModal();
            if (onConfirm) onConfirm();
        });

        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
                if (onCancel) onCancel();
            }
        });

        return modal;
    }

    /**
     * 显示API错误
     */
    showApiError(error, operation = '操作') {
        const message = error.message || '未知错误';
        this.error(`${operation}失败: ${message}`);
    }

    /**
     * 清除所有通知
     */
    clearAll() {
        if (this.toastContainer) {
            this.toastContainer.innerHTML = '';
        }
    }

    /**
     * 显示系统通知（如果浏览器支持�?
     */
    showSystemNotification(title, message, options = {}) {
        if (!('Notification' in window)) {
            console.warn('浏览器不支持系统通知');
            return;
        }

        if (Notification.permission === 'granted') {
            return new Notification(title, {
                body: message,
                icon: '/favicon.ico',
                ...options
            });
        } else if (Notification.permission !== 'denied') {
            Notification.requestPermission().then(permission => {
                if (permission === 'granted') {
                    return new Notification(title, {
                        body: message,
                        icon: '/favicon.ico',
                        ...options
                    });
                }
            });
        }
    }
}

// 创建全局通知工具实例
const notificationUtils = new NotificationUtils();
