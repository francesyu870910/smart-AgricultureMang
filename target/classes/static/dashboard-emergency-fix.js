// Dashboard 紧急修复脚本
// 此脚本确保 showPage 函数在页面加载时立即可用

console.log('Dashboard emergency fix script loading...');

// 立即定义全局变量（避免重复声明错误）
window.currentPage = window.currentPage || 'dashboard';
window.currentGreenhouse = window.currentGreenhouse || 1;
window.currentDeviceGreenhouse = window.currentDeviceGreenhouse || 1;
window.currentAlertGreenhouse = window.currentAlertGreenhouse || 1;
window.currentHistoryGreenhouse = window.currentHistoryGreenhouse || 1;

// 立即定义 showPage 函数
window.showPage = function(pageId) {
    console.log('Emergency showPage called with:', pageId);
    
    try {
        // 隐藏所有页面
        const pages = document.querySelectorAll('.content-page');
        pages.forEach(page => {
            page.classList.remove('active');
        });

        // 显示目标页面
        const targetPage = document.getElementById(pageId + '-page');
        if (targetPage) {
            targetPage.classList.add('active');
            console.log('Switched to page:', pageId);
        
        // 立即处理用户管理页面
        if (pageId === 'users') {
            console.log('🎯 检测到用户页面，准备加载内容');
            setTimeout(() => {
                const usersContainer = document.getElementById('users-content');
                console.log('用户容器:', usersContainer);
                console.log('loadUsersContent函数:', typeof window.loadUsersContent);
                
                if (usersContainer && typeof window.loadUsersContent === 'function') {
                    console.log('🎯 立即调用 loadUsersContent');
                    window.loadUsersContent(usersContainer);
                    
                    // 再次检查按钮是否创建
                    setTimeout(() => {
                        const addBtn = document.getElementById('addUserBtn');
                        console.log('添加用户按钮:', addBtn);
                        if (!addBtn) {
                            console.error('❌ 按钮未创建，手动创建按钮');
                            // 如果按钮没有创建，手动创建一个
                            const btn = document.createElement('button');
                            btn.innerHTML = '➕ 添加用户';
                            btn.style.cssText = 'padding: 10px 16px; background: #3498DB; color: white; border: none; border-radius: 6px; cursor: pointer;';
                            btn.onclick = function() {
                                console.log('手动按钮点击');
                                window.showAddUserModal();
                            };
                            usersContainer.insertBefore(btn, usersContainer.firstChild);
                        }
                    }, 300);
                } else {
                    console.error('❌ 用户容器或函数未找到', {
                        container: !!usersContainer,
                        function: typeof window.loadUsersContent
                    });
                }
            }, 200);
        }
        } else {
            console.error('Target page not found:', pageId + '-page');
            // 如果找不到目标页面，至少显示dashboard
            const dashboardPage = document.getElementById('dashboard-page');
            if (dashboardPage) {
                dashboardPage.classList.add('active');
            }
        }

        // 更新菜单状态
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.classList.remove('active');
        });
        
        // 找到被点击的菜单项并设为活跃状态
        if (window.event && window.event.target) {
            const clickedMenuItem = window.event.target.closest('.menu-item');
            if (clickedMenuItem) {
                clickedMenuItem.classList.add('active');
            }
        }

        // 更新当前页面
        window.currentPage = pageId;

        // 尝试加载页面内容
        const contentContainer = document.getElementById(pageId + '-content');
        if (contentContainer) {
            // 显示加载状态
            contentContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">正在加载' + getPageTitle(pageId) + '...</div>';
            
            // 特殊处理用户管理页面
            if (pageId === 'users') {
                setTimeout(() => {
                    if (typeof window.loadUsersContent === 'function') {
                        console.log('🎯 强制调用 loadUsersContent');
                        window.loadUsersContent(contentContainer);
                    } else {
                        contentContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">用户管理功能加载失败</div>';
                    }
                }, 100);
            } else {
                // 其他页面的处理逻辑
                const loadFunctionName = 'load' + pageId.charAt(0).toUpperCase() + pageId.slice(1) + 'Content';
                if (typeof window[loadFunctionName] === 'function') {
                    setTimeout(() => {
                        window[loadFunctionName](contentContainer);
                    }, 100);
                } else {
                    // 如果没有找到加载函数，显示默认内容
                    setTimeout(() => {
                        contentContainer.innerHTML = '<div style="text-align: center; padding: 50px; color: #666;">该功能正在开发中...</div>';
                    }, 500);
                }
            }
        }
        
        return true;
    } catch (error) {
        console.error('Error in emergency showPage:', error);
        return false;
    }
};

// 获取页面标题的辅助函数
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

// 立即定义 logoutSystem 函数
window.logoutSystem = function() {
    if (confirm('确定要退出系统吗？')) {
        alert('退出系统成功');
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 1000);
    }
};

// 页面加载完成后的初始化
function initializeDashboard() {
    console.log('Initializing dashboard...');
    
    // 确保默认页面是激活状态
    const dashboardPage = document.getElementById('dashboard-page');
    if (dashboardPage && !document.querySelector('.content-page.active')) {
        dashboardPage.classList.add('active');
    }
    
    // 确保默认菜单项是激活状态
    const firstMenuItem = document.querySelector('.menu-item');
    if (firstMenuItem && !document.querySelector('.menu-item.active')) {
        firstMenuItem.classList.add('active');
    }
    
    console.log('Dashboard initialized successfully');
}

// 立即执行初始化（如果DOM已经加载）
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDashboard);
} else {
    initializeDashboard();
}

// 确保函数在全局作用域中可用
console.log('Emergency fix functions defined:', {
    showPage: typeof window.showPage,
    logoutSystem: typeof window.logoutSystem,
    currentPage: window.currentPage
});

console.log('Dashboard emergency fix script loaded successfully!');