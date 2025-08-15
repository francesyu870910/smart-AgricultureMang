// 用户管理模块 - 最终修复版本
console.log('User manager final version loading...');

// 用户数据存储
let usersData = [
    {
        id: 1,
        username: 'admin',
        name: '系统管理员',
        email: 'admin@greenhouse.com',
        role: '管理员',
        status: '正常',
        createTime: '2024-01-01 10:00:00',
        lastLogin: '2025-08-14 09:30:00'
    },
    {
        id: 2,
        username: 'operator1',
        name: '操作员张三',
        email: 'zhangsan@greenhouse.com',
        role: '操作员',
        status: '正常',
        createTime: '2024-02-15 14:20:00',
        lastLogin: '2025-08-13 16:45:00'
    },
    {
        id: 3,
        username: 'viewer1',
        name: '观察员李四',
        email: 'lisi@greenhouse.com',
        role: '观察员',
        status: '禁用',
        createTime: '2024-03-10 11:15:00',
        lastLogin: '2025-08-10 08:20:00'
    }
];

// 生成下一个用户ID
function getNextUserId() {
    return Math.max(...usersData.map(user => user.id)) + 1;
}

// 格式化当前时间
function getCurrentDateTime() {
    const now = new Date();
    return now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0');
}

// 显示添加用户弹窗 - 最终版本
function showAddUserModal() {
    console.log('🚀 showAddUserModal called - 开始显示弹窗');
    console.log('Function type:', typeof showAddUserModal);
    console.log('Window function type:', typeof window.showAddUserModal);

    // 先尝试找到现有的弹窗
    let modal = document.getElementById('addUserModal');

    if (!modal) {
        console.log('Modal not found, creating new one');
        // 如果不存在，直接创建一个新的弹窗
        modal = document.createElement('div');
        modal.id = 'addUserModal';
        modal.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                z-index: 99999;
                display: flex;
                align-items: center;
                justify-content: center;
            ">
                <div style="
                    background: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease-out;
                ">
                    <div style="
                        padding: 20px 25px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: #333; font-size: 20px;">添加新用户</h3>
                        <span onclick="closeAddUserModal()" style="
                            font-size: 28px;
                            font-weight: bold;
                            cursor: pointer;
                            color: #aaa;
                            line-height: 1;
                        ">&times;</span>
                    </div>
                    <div style="padding: 25px;">
                        <form id="addUserForm">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">用户名 *</label>
                                    <input type="text" id="newUsername" name="username" required placeholder="请输入用户名" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">姓名 *</label>
                                    <input type="text" id="newName" name="name" required placeholder="请输入真实姓名" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">邮箱 *</label>
                                    <input type="email" id="newEmail" name="email" required placeholder="请输入邮箱地址" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">角色 *</label>
                                    <select id="newRole" name="role" required style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                        <option value="">请选择角色</option>
                                        <option value="管理员">管理员</option>
                                        <option value="操作员">操作员</option>
                                        <option value="观察员">观察员</option>
                                    </select>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">密码 *</label>
                                    <input type="password" id="newPassword" name="password" required placeholder="请输入密码" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">确认密码 *</label>
                                    <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="请再次输入密码" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div>
                                    <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">状态</label>
                                    <select id="newStatus" name="status" style="
                                        width: 100%;
                                        padding: 10px;
                                        border: 1px solid #ddd;
                                        border-radius: 6px;
                                        font-size: 14px;
                                        box-sizing: border-box;
                                    ">
                                        <option value="正常">正常</option>
                                        <option value="禁用">禁用</option>
                                    </select>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div style="
                        padding: 20px 25px;
                        border-top: 1px solid #eee;
                        display: flex;
                        justify-content: flex-end;
                        gap: 10px;
                    ">
                        <button type="button" onclick="closeAddUserModal()" style="
                            padding: 10px 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 500;
                            background: #95A5A6;
                            color: white;
                        ">取消</button>
                        <button type="button" onclick="saveNewUser()" style="
                            padding: 10px 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            font-size: 14px;
                            font-weight: 500;
                            background: #3498DB;
                            color: white;
                        ">保存</button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        console.log('New modal created and added to body');
    } else {
        console.log('Using existing modal');
        modal.style.display = 'block';
    }

    // 清空表单
    const form = document.getElementById('addUserForm');
    if (form) {
        form.reset();
    }

    console.log('Modal should be visible now');
}

// 关闭添加用户弹窗
function closeAddUserModal() {
    console.log('closeAddUserModal called');
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.remove();
        console.log('Modal removed');
    }
}

// 加载用户管理内容
function loadUsersContent(container) {
    console.log('🎯 loadUsersContent called!');
    console.log('Container:', container);
    console.log('Users data length:', usersData.length);
    
    try {

    const usersHTML = `
        <div class="users-management" style="
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        ">
            <!-- 操作工具栏 -->
            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 25px;
                padding-bottom: 20px;
                border-bottom: 1px solid #eee;
            ">
                <div style="display: flex; gap: 10px;">
                    <button id="addUserBtn" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        background: #3498DB;
                        color: white;
                        transition: all 0.3s ease;
                    ">
                        <span>➕</span> 添加用户
                    </button>
                    <button onclick="refreshUserList()" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        gap: 6px;
                        background: #95A5A6;
                        color: white;
                        transition: all 0.3s ease;
                    ">
                        <span>🔄</span> 刷新
                    </button>
                </div>
                <div>
                    <input type="text" id="userSearchInput" placeholder="搜索用户名、姓名或邮箱..." onkeyup="searchUsers(this.value)" style="
                        padding: 10px 40px 10px 12px;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        width: 300px;
                        font-size: 14px;
                    ">
                </div>
            </div>

            <!-- 用户统计 -->
            <div style="
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin-bottom: 25px;
            ">
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                ">
                    <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;" id="totalUsers">${usersData.length}</div>
                    <div style="color: #666; font-size: 14px;">总用户数</div>
                </div>
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                ">
                    <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;" id="activeUsers">${usersData.filter(u => u.status === '正常').length}</div>
                    <div style="color: #666; font-size: 14px;">活跃用户</div>
                </div>
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                ">
                    <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;" id="adminUsers">${usersData.filter(u => u.role === '管理员').length}</div>
                    <div style="color: #666; font-size: 14px;">管理员</div>
                </div>
                <div style="
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                ">
                    <div style="font-size: 28px; font-weight: bold; color: #2c3e50; margin-bottom: 8px;" id="disabledUsers">${usersData.filter(u => u.status === '禁用').length}</div>
                    <div style="color: #666; font-size: 14px;">禁用用户</div>
                </div>
            </div>

            <!-- 用户列表 -->
            <div style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; margin-top: 10px;" id="usersTable">
                    <thead>
                        <tr>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">ID</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">用户名</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">姓名</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">邮箱</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">角色</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">状态</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">创建时间</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">最后登录</th>
                            <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa; font-weight: 600; color: #555;">操作</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- 用户数据将通过JavaScript动态填充 -->
                    </tbody>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = usersHTML;

    // 渲染用户列表
    renderUserList();

    // 手动绑定添加用户按钮事件
    setTimeout(() => {
        const addUserBtn = document.getElementById('addUserBtn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', function () {
                console.log('Add user button clicked via event listener');
                showAddUserModal();
            });
            console.log('Add user button event listener bound successfully');
        } else {
            console.error('Add user button not found for event binding');
        }
    }, 100);

    console.log('Users content loaded successfully');
    
    } catch (error) {
        console.error('❌ loadUsersContent 执行出错:', error);
        // 创建一个简化的界面
        container.innerHTML = `
            <div style="background: white; padding: 20px; border-radius: 8px;">
                <h2>用户管理</h2>
                <button id="addUserBtn" onclick="showAddUserModal()" style="
                    padding: 10px 20px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-bottom: 20px;
                ">➕ 添加用户</button>
                <div id="userListContainer">
                    <p>用户列表加载中...</p>
                </div>
            </div>
        `;
        
        // 手动渲染用户列表
        setTimeout(() => {
            renderSimpleUserList();
        }, 100);
    }
}

// 渲染简化的用户列表
function renderSimpleUserList() {
    const container = document.getElementById('userListContainer');
    if (!container) return;
    
    let html = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 10px;">
            <thead>
                <tr style="background: #f8f9fa;">
                    <th style="padding: 12px; border: 1px solid #ddd;">ID</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">用户名</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">姓名</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">邮箱</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">角色</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">状态</th>
                    <th style="padding: 12px; border: 1px solid #ddd;">操作</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    usersData.forEach(user => {
        html += `
            <tr>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.id}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.username}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.name}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.email}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.role}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">${user.status}</td>
                <td style="padding: 12px; border: 1px solid #ddd;">
                    <button onclick="editUser(${user.id})" style="padding: 4px 8px; margin: 2px; background: #ffc107; border: none; border-radius: 4px; cursor: pointer;">编辑</button>
                    <button onclick="resetPassword(${user.id})" style="padding: 4px 8px; margin: 2px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer;">重置密码</button>
                    <button onclick="deleteUser(${user.id})" style="padding: 4px 8px; margin: 2px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;">删除</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    container.innerHTML = html;
    console.log('✅ 简化用户列表渲染完成');
}

// 渲染用户列表
function renderUserList(filteredUsers = null) {
    const users = filteredUsers || usersData;
    const tbody = document.getElementById('usersTableBody');

    if (!tbody) {
        console.error('Users table body not found');
        return;
    }

    tbody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        row.style.cssText = 'border-bottom: 1px solid #eee;';
        row.innerHTML = `
            <td style="padding: 12px;">${user.id}</td>
            <td style="padding: 12px;">${user.username}</td>
            <td style="padding: 12px;">${user.name}</td>
            <td style="padding: 12px;">${user.email}</td>
            <td style="padding: 12px;"><span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: #d1ecf1; color: #0c5460;">${user.role}</span></td>
            <td style="padding: 12px;"><span style="padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500; background: ${user.status === '正常' ? '#d4edda' : '#f8d7da'}; color: ${user.status === '正常' ? '#155724' : '#721c24'};">${user.status}</span></td>
            <td style="padding: 12px;">${user.createTime}</td>
            <td style="padding: 12px;">${user.lastLogin}</td>
            <td style="padding: 12px;">
                <div style="display: flex; gap: 5px;">
                    <button onclick="editUser(${user.id})" style="padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; background: #ffc107; color: #212529;" title="编辑">✏️</button>
                    <button onclick="resetPassword(${user.id})" style="padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; background: #17a2b8; color: white;" title="重置密码">🔑</button>
                    <button onclick="deleteUser(${user.id})" style="padding: 4px 8px; border: none; border-radius: 4px; cursor: pointer; font-size: 12px; background: #dc3545; color: white;" title="删除">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // 更新统计数据
    updateUserStats();
}

// 更新用户统计
function updateUserStats() {
    const totalUsers = document.getElementById('totalUsers');
    const activeUsers = document.getElementById('activeUsers');
    const adminUsers = document.getElementById('adminUsers');
    const disabledUsers = document.getElementById('disabledUsers');

    if (totalUsers) totalUsers.textContent = usersData.length;
    if (activeUsers) activeUsers.textContent = usersData.filter(u => u.status === '正常').length;
    if (adminUsers) adminUsers.textContent = usersData.filter(u => u.role === '管理员').length;
    if (disabledUsers) disabledUsers.textContent = usersData.filter(u => u.status === '禁用').length;
}

// 保存新用户
function saveNewUser() {
    console.log('saveNewUser called');

    const form = document.getElementById('addUserForm');
    if (!form) {
        console.error('Form not found!');
        showAlert('表单未找到', 'error');
        return;
    }

    const formData = new FormData(form);

    // 获取表单数据
    const userData = {
        username: formData.get('username').trim(),
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        role: formData.get('role'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        status: formData.get('status') || '正常'
    };

    console.log('Form data:', userData);

    // 验证表单数据
    if (!validateUserData(userData)) {
        return;
    }

    // 检查用户名是否已存在
    if (usersData.some(user => user.username === userData.username)) {
        showAlert('用户名已存在，请选择其他用户名', 'error');
        return;
    }

    // 检查邮箱是否已存在
    if (usersData.some(user => user.email === userData.email)) {
        showAlert('邮箱已存在，请使用其他邮箱', 'error');
        return;
    }

    // 创建新用户对象
    const newUser = {
        id: getNextUserId(),
        username: userData.username,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        status: userData.status,
        createTime: getCurrentDateTime(),
        lastLogin: '从未登录'
    };

    console.log('New user created:', newUser);

    // 添加到用户数据
    usersData.push(newUser);

    // 重新渲染列表
    renderUserList();

    // 关闭弹窗
    closeAddUserModal();

    // 显示成功消息
    showAlert('用户添加成功！', 'success');
}

// 验证用户数据
function validateUserData(userData) {
    console.log('Validating user data:', userData);

    // 检查必填字段
    if (!userData.username) {
        showAlert('请输入用户名', 'error');
        return false;
    }

    if (!userData.name) {
        showAlert('请输入姓名', 'error');
        return false;
    }

    if (!userData.email) {
        showAlert('请输入邮箱', 'error');
        return false;
    }

    if (!userData.role) {
        showAlert('请选择角色', 'error');
        return false;
    }

    if (!userData.password) {
        showAlert('请输入密码', 'error');
        return false;
    }

    // 验证用户名格式
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(userData.username)) {
        showAlert('用户名只能包含字母、数字和下划线，长度3-20位', 'error');
        return false;
    }

    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        showAlert('请输入有效的邮箱地址', 'error');
        return false;
    }

    // 验证密码
    if (userData.password.length < 6) {
        showAlert('密码长度至少6位', 'error');
        return false;
    }

    // 验证密码确认
    if (userData.password !== userData.confirmPassword) {
        showAlert('两次输入的密码不一致', 'error');
        return false;
    }

    console.log('Validation passed');
    return true;
}

// 搜索用户
function searchUsers(keyword) {
    if (!keyword.trim()) {
        renderUserList();
        return;
    }

    const filteredUsers = usersData.filter(user =>
        user.username.toLowerCase().includes(keyword.toLowerCase()) ||
        user.name.toLowerCase().includes(keyword.toLowerCase()) ||
        user.email.toLowerCase().includes(keyword.toLowerCase())
    );

    renderUserList(filteredUsers);
}

// 刷新用户列表
function refreshUserList() {
    renderUserList();
    showAlert('用户列表已刷新', 'success');
}

// 编辑用户
function editUser(userId) {
    console.log('编辑用户:', userId);
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }
    
    showEditUserModal(user);
}

// 显示编辑用户弹窗
function showEditUserModal(user) {
    console.log('显示编辑用户弹窗:', user);
    
    // 移除已存在的弹窗
    const existingModal = document.getElementById('editUserModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建编辑用户弹窗
    const modal = document.createElement('div');
    modal.id = 'editUserModal';
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 600px;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    padding: 20px 25px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; color: #333; font-size: 20px;">编辑用户</h3>
                    <span onclick="closeEditUserModal()" style="
                        font-size: 28px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #aaa;
                        line-height: 1;
                    ">&times;</span>
                </div>
                <div style="padding: 25px;">
                    <form id="editUserForm">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">用户名 *</label>
                                <input type="text" id="editUsername" name="username" required placeholder="请输入用户名" value="${user.username}" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">姓名 *</label>
                                <input type="text" id="editName" name="name" required placeholder="请输入真实姓名" value="${user.name}" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">邮箱 *</label>
                                <input type="email" id="editEmail" name="email" required placeholder="请输入邮箱地址" value="${user.email}" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">角色 *</label>
                                <select id="editRole" name="role" required style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                                    <option value="">请选择角色</option>
                                    <option value="管理员" ${user.role === '管理员' ? 'selected' : ''}>管理员</option>
                                    <option value="操作员" ${user.role === '操作员' ? 'selected' : ''}>操作员</option>
                                    <option value="观察员" ${user.role === '观察员' ? 'selected' : ''}>观察员</option>
                                </select>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 20px; margin-bottom: 20px;">
                            <div>
                                <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">状态</label>
                                <select id="editStatus" name="status" style="
                                    width: 100%;
                                    padding: 10px;
                                    border: 1px solid #ddd;
                                    border-radius: 6px;
                                    font-size: 14px;
                                    box-sizing: border-box;
                                ">
                                    <option value="正常" ${user.status === '正常' ? 'selected' : ''}>正常</option>
                                    <option value="禁用" ${user.status === '禁用' ? 'selected' : ''}>禁用</option>
                                </select>
                            </div>
                        </div>
                        <input type="hidden" id="editUserId" value="${user.id}">
                    </form>
                </div>
                <div style="
                    padding: 20px 25px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                ">
                    <button type="button" onclick="closeEditUserModal()" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        background: #95A5A6;
                        color: white;
                    ">取消</button>
                    <button type="button" onclick="saveEditUser()" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        background: #3498DB;
                        color: white;
                    ">保存</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('编辑用户弹窗创建成功');
}

// 关闭编辑用户弹窗
function closeEditUserModal() {
    console.log('关闭编辑用户弹窗');
    const modal = document.getElementById('editUserModal');
    if (modal) {
        modal.remove();
    }
}

// 保存编辑的用户
function saveEditUser() {
    console.log('保存编辑的用户');
    
    const form = document.getElementById('editUserForm');
    if (!form) {
        showAlert('表单未找到', 'error');
        return;
    }
    
    const formData = new FormData(form);
    const userId = parseInt(document.getElementById('editUserId').value);
    
    // 获取表单数据
    const userData = {
        username: formData.get('username').trim(),
        name: formData.get('name').trim(),
        email: formData.get('email').trim(),
        role: formData.get('role'),
        status: formData.get('status')
    };

    console.log('编辑用户数据:', userData);

    // 验证表单数据
    if (!userData.username || !userData.name || !userData.email || !userData.role) {
        showAlert('请填写所有必填字段', 'error');
        return;
    }

    // 验证邮箱格式
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
        showAlert('请输入有效的邮箱地址', 'error');
        return;
    }

    // 检查用户名是否已被其他用户使用
    const existingUser = usersData.find(user => user.username === userData.username && user.id !== userId);
    if (existingUser) {
        showAlert('用户名已被其他用户使用', 'error');
        return;
    }

    // 检查邮箱是否已被其他用户使用
    const existingEmailUser = usersData.find(user => user.email === userData.email && user.id !== userId);
    if (existingEmailUser) {
        showAlert('邮箱已被其他用户使用', 'error');
        return;
    }

    // 更新用户数据
    const userIndex = usersData.findIndex(u => u.id === userId);
    if (userIndex > -1) {
        usersData[userIndex] = {
            ...usersData[userIndex],
            username: userData.username,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            status: userData.status
        };

        // 重新渲染列表
        renderUserList();

        // 关闭弹窗
        closeEditUserModal();

        // 显示成功消息
        showAlert('用户信息更新成功！', 'success');
    } else {
        showAlert('用户不存在', 'error');
    }
}

// 重置密码
function resetPassword(userId) {
    console.log('重置密码:', userId);
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }

    showResetPasswordModal(user);
}

// 显示重置密码弹窗
function showResetPasswordModal(user) {
    console.log('显示重置密码弹窗:', user);
    
    // 移除已存在的弹窗
    const existingModal = document.getElementById('resetPasswordModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // 创建重置密码弹窗
    const modal = document.createElement('div');
    modal.id = 'resetPasswordModal';
    modal.innerHTML = `
        <div style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 99999;
            display: flex;
            align-items: center;
            justify-content: center;
        ">
            <div style="
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            ">
                <div style="
                    padding: 20px 25px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h3 style="margin: 0; color: #333; font-size: 20px;">重置密码</h3>
                    <span onclick="closeResetPasswordModal()" style="
                        font-size: 28px;
                        font-weight: bold;
                        cursor: pointer;
                        color: #aaa;
                        line-height: 1;
                    ">&times;</span>
                </div>
                <div style="padding: 25px;">
                    <div style="margin-bottom: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px; border-left: 4px solid #17a2b8;">
                        <strong>用户信息：</strong><br>
                        用户名：${user.username}<br>
                        姓名：${user.name}<br>
                        邮箱：${user.email}
                    </div>
                    <form id="resetPasswordForm">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">新密码 *</label>
                            <input type="password" id="newPassword" name="newPassword" required placeholder="请输入新密码" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                font-size: 14px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 6px; font-weight: 600; color: #555; font-size: 14px;">确认新密码 *</label>
                            <input type="password" id="confirmNewPassword" name="confirmNewPassword" required placeholder="请再次输入新密码" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                font-size: 14px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <input type="hidden" id="resetUserId" value="${user.id}">
                    </form>
                </div>
                <div style="
                    padding: 20px 25px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                ">
                    <button type="button" onclick="closeResetPasswordModal()" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        background: #95A5A6;
                        color: white;
                    ">取消</button>
                    <button type="button" onclick="saveResetPassword()" style="
                        padding: 10px 16px;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                        background: #e74c3c;
                        color: white;
                    ">重置密码</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    console.log('重置密码弹窗创建成功');
}

// 关闭重置密码弹窗
function closeResetPasswordModal() {
    console.log('关闭重置密码弹窗');
    const modal = document.getElementById('resetPasswordModal');
    if (modal) {
        modal.remove();
    }
}

// 保存重置的密码
function saveResetPassword() {
    console.log('保存重置的密码');
    
    const userId = parseInt(document.getElementById('resetUserId').value);
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    // 验证密码
    if (!newPassword) {
        showAlert('请输入新密码', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showAlert('密码长度至少6位', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showAlert('两次输入的密码不一致', 'error');
        return;
    }
    
    // 找到用户
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }
    
    // 确认重置
    if (confirm(`确定要重置用户 "${user.name}" 的密码吗？`)) {
        // 在实际应用中，这里应该调用后端API来重置密码
        // 这里只是模拟重置成功
        
        // 关闭弹窗
        closeResetPasswordModal();
        
        // 显示成功消息
        showAlert(`用户 "${user.name}" 的密码已重置成功！`, 'success');
        
        console.log(`用户 ${user.name} 的密码已重置`);
    }
}

// 删除用户
function deleteUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }

    if (user.role === '管理员' && usersData.filter(u => u.role === '管理员').length === 1) {
        showAlert('不能删除最后一个管理员账户', 'error');
        return;
    }

    if (confirm(`确定要删除用户 "${user.name}" 吗？此操作不可恢复！`)) {
        usersData = usersData.filter(u => u.id !== userId);
        renderUserList();
        showAlert('用户删除成功', 'success');
    }
}

// 显示提示消息
function showAlert(message, type = 'info') {
    console.log('Showing alert:', message, type);

    // 创建提示元素
    const alert = document.createElement('div');
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 99999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    `;

    // 设置背景色
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    alert.style.backgroundColor = colors[type] || colors.info;

    alert.textContent = message;

    // 添加到页面
    document.body.appendChild(alert);

    // 3秒后自动移除
    setTimeout(() => {
        if (alert.parentNode) {
            document.body.removeChild(alert);
        }
    }, 3000);
}

// 将函数暴露到全局作用域
window.loadUsersContent = loadUsersContent;
window.showAddUserModal = showAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.saveNewUser = saveNewUser;
window.searchUsers = searchUsers;
window.refreshUserList = refreshUserList;
window.editUser = editUser;
window.showEditUserModal = showEditUserModal;
window.closeEditUserModal = closeEditUserModal;
window.saveEditUser = saveEditUser;
window.resetPassword = resetPassword;
window.showResetPasswordModal = showResetPasswordModal;
window.closeResetPasswordModal = closeResetPasswordModal;
window.saveResetPassword = saveResetPassword;
window.deleteUser = deleteUser;

// 强制绑定函数，防止被覆盖
setTimeout(() => {
    window.loadUsersContent = loadUsersContent;
    window.showAddUserModal = showAddUserModal;
    window.closeAddUserModal = closeAddUserModal;
    window.saveNewUser = saveNewUser;
    window.searchUsers = searchUsers;
    window.refreshUserList = refreshUserList;
    window.deleteUser = deleteUser;
    console.log('Functions forcefully bound to window object');
    console.log('loadUsersContent type:', typeof window.loadUsersContent);
    console.log('showAddUserModal type:', typeof window.showAddUserModal);
}, 100);

// 再次强制绑定，确保不被覆盖
setTimeout(() => {
    window.loadUsersContent = loadUsersContent;
    window.showAddUserModal = showAddUserModal;
    console.log('Functions re-bound to prevent override');
}, 500);

console.log('User manager final version loaded successfully!');
console.log('Available functions:', {
    loadUsersContent: typeof loadUsersContent,
    showAddUserModal: typeof showAddUserModal,
    closeAddUserModal: typeof closeAddUserModal,
    saveNewUser: typeof saveNewUser
});

// 创建一个测试函数来验证绑定
window.testUserManagement = function () {
    console.log('🧪 Testing user management functions:');
    console.log('window.loadUsersContent:', typeof window.loadUsersContent);
    console.log('window.showAddUserModal:', typeof window.showAddUserModal);

    if (typeof window.loadUsersContent === 'function') {
        console.log('✅ loadUsersContent is properly bound');
    } else {
        console.error('❌ loadUsersContent is NOT bound to window');
    }

    if (typeof window.showAddUserModal === 'function') {
        console.log('✅ showAddUserModal is properly bound');
    } else {
        console.error('❌ showAddUserModal is NOT bound to window');
    }
};

// 5秒后自动测试绑定状态
setTimeout(() => {
    console.log('🔍 Auto-testing function bindings after 5 seconds...');
    window.testUserManagement();
}, 5000);// 将所有函数暴
露到全局作用域
window.loadUsersContent = loadUsersContent;
window.showAddUserModal = showAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.saveNewUser = saveNewUser;
window.searchUsers = searchUsers;
window.refreshUserList = refreshUserList;
window.renderSimpleUserList = renderSimpleUserList;
window.renderUserList = renderUserList;
window.editUser = editUser;
window.showEditUserModal = showEditUserModal;
window.closeEditUserModal = closeEditUserModal;
window.saveEditUser = saveEditUser;
window.resetPassword = resetPassword;
window.showResetPasswordModal = showResetPasswordModal;
window.closeResetPasswordModal = closeResetPasswordModal;
window.saveResetPassword = saveResetPassword;
window.deleteUser = deleteUser;

console.log('🎯 所有用户管理函数已暴露到全局作用域');
console.log('函数检查:', {
    editUser: typeof window.editUser,
    resetPassword: typeof window.resetPassword,
    showAddUserModal: typeof window.showAddUserModal
});