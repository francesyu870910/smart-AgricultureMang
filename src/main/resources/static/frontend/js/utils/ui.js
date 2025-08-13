/**
 * 智能温室环境监控系统 - UI工具
 * 提供用户界面交互和DOM操作功能
 */

class UIUtils {
    /**
     * 创建加载动画元素
     * @param {string} message - 加载消息
     * @param {string} size - 大小 (small, medium, large)
     * @returns {HTMLElement} 加载元素
     */
    static createLoader(message = '加载�?..', size = 'medium') {
        const loader = document.createElement('div');
        loader.className = `loader loader-${size}`;
        
        const sizeMap = {
            small: { width: '20px', height: '20px', fontSize: '12px' },
            medium: { width: '40px', height: '40px', fontSize: '14px' },
            large: { width: '60px', height: '60px', fontSize: '16px' }
        };
        
        const dimensions = sizeMap[size] || sizeMap.medium;
        
        loader.innerHTML = `
            <div class="loader-spinner" style="
                width: ${dimensions.width};
                height: ${dimensions.height};
                border: 3px solid var(--border-color);
                border-top: 3px solid var(--primary-color);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 10px;
            "></div>
            <div class="loader-text" style="
                font-size: ${dimensions.fontSize};
                color: var(--text-secondary);
                text-align: center;
            ">${message}</div>
        `;
        
        loader.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 20px;
        `;
        
        return loader;
    }

    /**
     * 创建空状态元�?
     * @param {string} message - 空状态消�?
     * @param {string} icon - 图标
     * @param {string} actionText - 操作按钮文本
     * @param {Function} actionCallback - 操作回调
     * @returns {HTMLElement} 空状态元�?
     */
    static createEmptyState(message = '暂无数据', icon = '📊', actionText = null, actionCallback = null) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        
        let actionButton = '';
        if (actionText && actionCallback) {
            actionButton = `
                <button class="btn btn-primary empty-state-action" style="margin-top: 15px;">
                    ${actionText}
                </button>
            `;
        }
        
        emptyState.innerHTML = `
            <div class="empty-state-icon" style="
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            ">${icon}</div>
            <div class="empty-state-message" style="
                font-size: 16px;
                color: var(--text-secondary);
                margin-bottom: 10px;
            ">${message}</div>
            ${actionButton}
        `;
        
        emptyState.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
        `;
        
        if (actionCallback) {
            const button = emptyState.querySelector('.empty-state-action');
            button.addEventListener('click', actionCallback);
        }
        
        return emptyState;
    }

    /**
     * 创建错误状态元�?
     * @param {string} message - 错误消息
     * @param {Function} retryCallback - 重试回调
     * @returns {HTMLElement} 错误状态元�?
     */
    static createErrorState(message = '加载失败', retryCallback = null) {
        const errorState = document.createElement('div');
        errorState.className = 'error-state';
        
        let retryButton = '';
        if (retryCallback) {
            retryButton = `
                <button class="btn btn-secondary error-state-retry" style="margin-top: 15px;">
                    🔄 重试
                </button>
            `;
        }
        
        errorState.innerHTML = `
            <div class="error-state-icon" style="
                font-size: 48px;
                margin-bottom: 15px;
                color: var(--danger-color);
            ">⚠️</div>
            <div class="error-state-message" style="
                font-size: 16px;
                color: var(--text-secondary);
                margin-bottom: 10px;
            ">${message}</div>
            ${retryButton}
        `;
        
        errorState.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px 20px;
            text-align: center;
        `;
        
        if (retryCallback) {
            const button = errorState.querySelector('.error-state-retry');
            button.addEventListener('click', retryCallback);
        }
        
        return errorState;
    }

    /**
     * 创建数据卡片
     * @param {Object} config - 卡片配置
     * @returns {HTMLElement} 卡片元素
     */
    static createDataCard(config) {
        const {
            title = '数据卡片',
            value = '--',
            unit = '',
            trend = null,
            status = 'normal',
            icon = '📊',
            onClick = null
        } = config;
        
        const card = document.createElement('div');
        card.className = `data-card data-card-${status}`;
        
        let trendElement = '';
        if (trend) {
            const trendIcon = trend.direction === 'up' ? '↗️' : trend.direction === 'down' ? '↘️' : '➡️';
            const trendColor = trend.direction === 'up' ? 'var(--success-color)' : 
                              trend.direction === 'down' ? 'var(--danger-color)' : 'var(--text-secondary)';
            
            trendElement = `
                <div class="card-trend" style="
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 12px;
                    color: ${trendColor};
                    margin-top: 5px;
                ">
                    <span>${trendIcon}</span>
                    <span>${trend.text}</span>
                </div>
            `;
        }
        
        card.innerHTML = `
            <div class="card-header" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 15px;
            ">
                <h3 class="card-title" style="
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin: 0;
                ">${title}</h3>
                <span class="card-icon" style="font-size: 20px;">${icon}</span>
            </div>
            <div class="card-content">
                <div class="card-value" style="
                    font-size: 28px;
                    font-weight: bold;
                    color: var(--text-primary);
                    line-height: 1;
                ">
                    ${value}<span class="card-unit" style="
                        font-size: 16px;
                        font-weight: normal;
                        color: var(--text-secondary);
                        margin-left: 5px;
                    ">${unit}</span>
                </div>
                ${trendElement}
            </div>
        `;
        
        card.style.cssText = `
            background: var(--card-bg);
            border-radius: 8px;
            padding: 20px;
            box-shadow: var(--shadow-light);
            transition: all 0.3s ease;
            cursor: ${onClick ? 'pointer' : 'default'};
        `;
        
        if (onClick) {
            card.addEventListener('click', onClick);
            card.addEventListener('mouseenter', () => {
                card.style.boxShadow = 'var(--shadow-hover)';
                card.style.transform = 'translateY(-2px)';
            });
            card.addEventListener('mouseleave', () => {
                card.style.boxShadow = 'var(--shadow-light)';
                card.style.transform = 'translateY(0)';
            });
        }
        
        return card;
    }

    /**
     * 创建进度�?
     * @param {number} value - 当前�?
     * @param {number} max - 最大�?
     * @param {Object} options - 选项
     * @returns {HTMLElement} 进度条元�?
     */
    static createProgressBar(value, max = 100, options = {}) {
        const {
            showValue = true,
            showPercentage = true,
            color = 'var(--primary-color)',
            height = '8px',
            animated = false
        } = options;
        
        const percentage = Math.min(100, Math.max(0, (value / max) * 100));
        
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        
        let valueDisplay = '';
        if (showValue || showPercentage) {
            const valueText = showValue ? `${value}/${max}` : '';
            const percentText = showPercentage ? `${percentage.toFixed(1)}%` : '';
            const displayText = [valueText, percentText].filter(Boolean).join(' - ');
            
            valueDisplay = `
                <div class="progress-value" style="
                    font-size: 12px;
                    color: var(--text-secondary);
                    margin-bottom: 5px;
                    text-align: right;
                ">${displayText}</div>
            `;
        }
        
        progressBar.innerHTML = `
            ${valueDisplay}
            <div class="progress-track" style="
                width: 100%;
                height: ${height};
                background-color: var(--border-color);
                border-radius: ${parseInt(height) / 2}px;
                overflow: hidden;
            ">
                <div class="progress-fill" style="
                    width: ${percentage}%;
                    height: 100%;
                    background-color: ${color};
                    transition: width 0.3s ease;
                    ${animated ? 'animation: progress-pulse 2s infinite;' : ''}
                "></div>
            </div>
        `;
        
        return progressBar;
    }

    /**
     * 创建标签
     * @param {string} text - 标签文本
     * @param {string} type - 标签类型
     * @param {boolean} closable - 是否可关�?
     * @returns {HTMLElement} 标签元素
     */
    static createTag(text, type = 'default', closable = false) {
        const tag = document.createElement('span');
        tag.className = `tag tag-${type}`;
        
        const typeColors = {
            default: { bg: 'var(--border-color)', color: 'var(--text-primary)' },
            primary: { bg: 'var(--primary-color)', color: '#fff' },
            success: { bg: 'var(--success-color)', color: '#fff' },
            warning: { bg: 'var(--warning-color)', color: '#fff' },
            danger: { bg: 'var(--danger-color)', color: '#fff' },
            info: { bg: 'var(--info-color)', color: '#fff' }
        };
        
        const colors = typeColors[type] || typeColors.default;
        
        let closeButton = '';
        if (closable) {
            closeButton = `
                <button class="tag-close" style="
                    background: none;
                    border: none;
                    color: inherit;
                    margin-left: 5px;
                    cursor: pointer;
                    font-size: 12px;
                    padding: 0;
                    width: 16px;
                    height: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                ">×</button>
            `;
        }
        
        tag.innerHTML = `
            <span class="tag-text">${text}</span>
            ${closeButton}
        `;
        
        tag.style.cssText = `
            display: inline-flex;
            align-items: center;
            padding: 4px 8px;
            font-size: 12px;
            border-radius: 4px;
            background-color: ${colors.bg};
            color: ${colors.color};
            white-space: nowrap;
        `;
        
        if (closable) {
            const closeBtn = tag.querySelector('.tag-close');
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                tag.remove();
            });
        }
        
        return tag;
    }

    /**
     * 创建分页�?
     * @param {Object} config - 分页配置
     * @returns {HTMLElement} 分页器元�?
     */
    static createPagination(config) {
        const {
            currentPage = 1,
            totalPages = 1,
            onPageChange = () => {},
            showInfo = true,
            maxButtons = 7
        } = config;
        
        const pagination = document.createElement('div');
        pagination.className = 'pagination';
        
        let infoElement = '';
        if (showInfo) {
            infoElement = `
                <div class="pagination-info" style="
                    font-size: 14px;
                    color: var(--text-secondary);
                    margin-right: 20px;
                ">
                    �?${currentPage} 页，�?${totalPages} �?
                </div>
            `;
        }
        
        // 计算显示的页码按�?
        const buttons = [];
        const half = Math.floor(maxButtons / 2);
        let start = Math.max(1, currentPage - half);
        let end = Math.min(totalPages, start + maxButtons - 1);
        
        if (end - start + 1 < maxButtons) {
            start = Math.max(1, end - maxButtons + 1);
        }
        
        // 上一页按�?
        if (currentPage > 1) {
            buttons.push(`
                <button class="pagination-btn" data-page="${currentPage - 1}">
                    �?上一�?
                </button>
            `);
        }
        
        // 页码按钮
        for (let i = start; i <= end; i++) {
            const isActive = i === currentPage;
            buttons.push(`
                <button class="pagination-btn ${isActive ? 'active' : ''}" data-page="${i}">
                    ${i}
                </button>
            `);
        }
        
        // 下一页按�?
        if (currentPage < totalPages) {
            buttons.push(`
                <button class="pagination-btn" data-page="${currentPage + 1}">
                    下一�?�?
                </button>
            `);
        }
        
        pagination.innerHTML = `
            <div class="pagination-container" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px 0;
            ">
                ${infoElement}
                <div class="pagination-buttons" style="
                    display: flex;
                    gap: 5px;
                ">
                    ${buttons.join('')}
                </div>
            </div>
        `;
        
        // 添加按钮样式和事�?
        const pageButtons = pagination.querySelectorAll('.pagination-btn');
        pageButtons.forEach(button => {
            button.style.cssText = `
                padding: 8px 12px;
                border: 1px solid var(--border-color);
                background: var(--card-bg);
                color: var(--text-primary);
                cursor: pointer;
                border-radius: 4px;
                font-size: 14px;
                transition: all 0.2s ease;
            `;
            
            if (button.classList.contains('active')) {
                button.style.backgroundColor = 'var(--primary-color)';
                button.style.color = '#fff';
                button.style.borderColor = 'var(--primary-color)';
            }
            
            button.addEventListener('click', () => {
                const page = parseInt(button.dataset.page);
                if (page && page !== currentPage) {
                    onPageChange(page);
                }
            });
            
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.backgroundColor = 'var(--hover-bg)';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.backgroundColor = 'var(--card-bg)';
                }
            });
        });
        
        return pagination;
    }

    /**
     * 显示工具提示
     * @param {HTMLElement} element - 目标元素
     * @param {string} text - 提示文本
     * @param {string} position - 位置 (top, bottom, left, right)
     */
    static showTooltip(element, text, position = 'top') {
        // 移除已存在的提示
        this.hideTooltip(element);
        
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';
        tooltip.textContent = text;
        
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            z-index: 1000;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s ease;
        `;
        
        document.body.appendChild(tooltip);
        
        // 计算位置
        const rect = element.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        
        let top, left;
        switch (position) {
            case 'top':
                top = rect.top - tooltipRect.height - 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'bottom':
                top = rect.bottom + 8;
                left = rect.left + (rect.width - tooltipRect.width) / 2;
                break;
            case 'left':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.left - tooltipRect.width - 8;
                break;
            case 'right':
                top = rect.top + (rect.height - tooltipRect.height) / 2;
                left = rect.right + 8;
                break;
        }
        
        tooltip.style.top = `${top + window.scrollY}px`;
        tooltip.style.left = `${left + window.scrollX}px`;
        
        // 显示动画
        setTimeout(() => {
            tooltip.style.opacity = '1';
        }, 10);
        
        // 存储引用以便清理
        element._tooltip = tooltip;
    }

    /**
     * 隐藏工具提示
     * @param {HTMLElement} element - 目标元素
     */
    static hideTooltip(element) {
        if (element._tooltip) {
            element._tooltip.remove();
            delete element._tooltip;
        }
    }

    /**
     * 平滑滚动到元�?
     * @param {HTMLElement|string} target - 目标元素或选择�?
     * @param {Object} options - 选项
     */
    static scrollToElement(target, options = {}) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;
        
        const { offset = 0, behavior = 'smooth' } = options;
        
        const elementTop = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetTop = elementTop - offset;
        
        window.scrollTo({
            top: offsetTop,
            behavior
        });
    }

    /**
     * 检查元素是否在视口�?
     * @param {HTMLElement} element - 目标元素
     * @param {number} threshold - 阈值（0-1�?
     * @returns {boolean} 是否在视口中
     */
    static isElementInViewport(element, threshold = 0) {
        const rect = element.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        const windowWidth = window.innerWidth || document.documentElement.clientWidth;
        
        const vertInView = (rect.top <= windowHeight * (1 - threshold)) && 
                          ((rect.top + rect.height) >= windowHeight * threshold);
        const horInView = (rect.left <= windowWidth * (1 - threshold)) && 
                         ((rect.left + rect.width) >= windowWidth * threshold);
        
        return vertInView && horInView;
    }
}

// 创建全局UI工具实例
const uiUtils = UIUtils;
