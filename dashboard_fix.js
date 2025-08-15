// Dashboard 修复脚本 - 确保 showPage 函数正确定义

// 全局变量
let currentPage = 'dashboard';
let currentGreenhouse = 1;
let currentDeviceGreenhouse = 1;
let currentAlertGreenhouse = 1;
let currentHistoryGreenhouse = 1;

// 页面切换函数
function showPage(pageId) {
    console.log('showPage called with:', pageId);
    
    // 隐藏所有页面
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });

    // 显示目标页面
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    } else {
        console.error('Target page not found:', pageId + '-page');
    }

    // 更新菜单状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 找到被点击的菜单项并设为活跃状态
    if (event && event.target) {
        const clickedMenuItem = event.target.closest('.menu-item');
        if (clickedMenuItem) {
            clickedMenuItem.classList.add('active');
        }
    }

    // 更新当前页面
    currentPage = pageId;

    // 加载页面内容
    loadPageContent(pageId);
}

// 加载页面内容
function loadPageContent(pageId) {
    const contentContainer = document.getElementById(pageId + '-content');
    if (!contentContainer) {
        console.warn('Content container not found for page:', pageId);
        return;
    }

    // 显示加载中状态
    contentContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">正在加载' + getPageTitle(pageId) + '...</div>';

    // 根据页面类型加载不同内容
    switch (pageId) {
        case 'environment':
            if (typeof loadEnvironmentContent === 'function') {
                loadEnvironmentContent(contentContainer);
            }
            break;
        case 'devices':
            if (typeof loadDevicesContent === 'function') {
                loadDevicesContent(contentContainer);
            }
            break;
        case 'alerts':
            if (typeof loadAlertsContent === 'function') {
                loadAlertsContent(contentContainer);
            }
            break;
        case 'tasks':
            if (typeof loadTasksContent === 'function') {
                loadTasksContent(contentContainer);
            }
            break;
        case 'analytics':
            if (typeof loadAnalyticsContent === 'function') {
                loadAnalyticsContent(contentContainer);
            }
            break;
        case 'history':
            if (typeof loadHistoryContent === 'function') {
                loadHistoryContent(contentContainer);
            }
            break;
        case 'users':
            if (typeof loadUsersContent === 'function') {
                loadUsersContent(contentContainer);
            }
            break;
        default:
            contentContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">页面内容加载中...</div>';
            break;
    }
}

// 获取页面标题
function getPageTitle(pageId) {
    const titles = {
        'dashboard': '系统概览',
        'environment': '环境监控',
        'devices': '设备控制',
        'alerts': '报警管理',
        'tasks': '定时任务',
        'analytics': '数据分析',
        'history': '历史记录',
        'users': '用户管理'
    };
    return titles[pageId] || '页面';
}

// 退出系统函数
function logoutSystem() {
    if (confirm('确定要退出系统吗？')) {
        alert('退出系统成功');
        // 这里可以添加实际的退出逻辑
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard fix script loaded');
    
    // 确保默认页面是激活状态
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage) {
        dashboardPage.classList.add('active');
    }
    
    // 确保默认菜单项是激活状态
    const firstMenuItem = document.querySelector('.menu-item');
    if (firstMenuItem) {
        firstMenuItem.classList.add('active');
    }
});

// 导出函数到全局作用域（确保在HTML中可以访问）
window.showPage = showPage;
window.loadPageContent = loadPageContent;
window.logoutSystem = logoutSystem;

console.log('Dashboard functions defined:', {
    showPage: typeof showPage,
    loadPageContent: typeof loadPageContent,
    logoutSystem: typeof logoutSystem
});