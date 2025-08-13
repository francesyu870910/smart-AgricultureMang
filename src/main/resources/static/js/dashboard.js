// 温室数字化监控系统 - 仪表板JavaScript

// 检查登录状态
function checkLogin() {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// 初始化页面
function initPage() {
    if (!checkLogin()) return;
    
    const username = localStorage.getItem('username') || 'Guest';
    document.getElementById('username').textContent = username;
    
    updateTime();
    setInterval(updateTime, 1000);
    
    // 加载默认页面内容
    loadDashboardContent();
}

// 更新时间
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleString('zh-CN');
    document.getElementById('currentTime').textContent = timeString;
}

// 显示指定页面
function showPage(pageId) {
    // 隐藏所有页面
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.remove('active');
    });
    
    // 更新菜单状态
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 显示指定页面
    const targetPage = document.getElementById(pageId + '-page');
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 激活对应菜单项
    event.target.classList.add('active');
    
    // 加载页面内容
    loadPageContent(pageId);
}

// 加载页面内容
function loadPageContent(pageId) {
    switch(pageId) {
        case 'dashboard':
            loadDashboardContent();
            break;
        case 'environment':
            loadEnvironmentContent();
            break;
        case 'devices':
            loadDevicesContent();
            break;
        case 'alerts':
            loadAlertsContent();
            break;
        case 'tasks':
            loadTasksContent();
            break;
        case 'analytics':
            loadAnalyticsContent();
            break;
        case 'history':
            loadHistoryContent();
            break;
    }
}

// 加载仪表板内容
function loadDashboardContent() {
    const content = document.getElementById('dashboard-content');
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px;">
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🌡️</div>
                <h3 style="color: #333; margin-bottom: 10px;">当前温度</h3>
                <div style="font-size: 32px; font-weight: bold; color: #4CAF50;">23.5°C</div>
                <div style="color: #666; margin-top: 10px;">正常范围</div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">💧</div>
                <h3 style="color: #333; margin-bottom: 10px;">当前湿度</h3>
                <div style="font-size: 32px; font-weight: bold; color: #2196F3;">65.8%</div>
                <div style="color: #666; margin-top: 10px;">正常范围</div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">⚙️</div>
                <h3 style="color: #333; margin-bottom: 10px;">在线设备</h3>
                <div style="font-size: 32px; font-weight: bold; color: #FF9800;">12/12</div>
                <div style="color: #666; margin-top: 10px;">全部正常</div>
            </div>
            
            <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); text-align: center;">
                <div style="font-size: 48px; margin-bottom: 15px;">🚨</div>
                <h3 style="color: #333; margin-bottom: 10px;">待处理报警</h3>
                <div style="font-size: 32px; font-weight: bold; color: #F44336;">3</div>
                <div style="color: #666; margin-top: 10px;">需要关注</div>
            </div>
        </div>
        
        <div style="margin-top: 30px; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom: 20px; color: #333;">系统状态</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px;">
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <div style="color: #28a745; font-size: 24px; font-weight: bold;">正常</div>
                    <div style="color: #666; font-size: 14px;">系统状态</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <div style="color: #28a745; font-size: 24px; font-weight: bold;">运行中</div>
                    <div style="color: #666; font-size: 14px;">定时任务</div>
                </div>
                <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
                    <div style="color: #17a2b8; font-size: 24px; font-weight: bold;">92.5%</div>
                    <div style="color: #666; font-size: 14px;">系统效率</div>
                </div>
            </div>
        </div>
    `;
}

// 退出登录
function logout() {
    if (confirm('确定要退出登录吗？')) {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userRole');
        window.location.href = '/login.html';
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initPage);