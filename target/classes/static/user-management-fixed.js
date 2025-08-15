// 用户管理模块 - 修复版本
console.log('User management module (fixed) loading...');

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

// 加载用户管理内容
function loadUsersContent(container) {
    console.log('Loading users content...');
    
    const usersHTML = `
        <div class="users-management">
            <style>
                .users-management {
                    background: white;
                    border-radius: 12px;
                    padding: 25px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .users-toolbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 25px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #eee;
                }
                .toolbar-left {
                    display: flex;
                    gap: 10px;
                }
                .btn {
                    padding: 10px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: all 0.3s ease;
                }
                .btn-primary {
                    background: #3498DB;
                    color: white;
                }
                .btn-primary:hover {
                    background: #2980B9;
                    transform: translateY(-1px);
                }
                .btn-secondary {
                    background: #95A5A6;
                    color: white;
                }
                .btn-secondary:hover {
                    background: #7F8C8D;
                    transform: translateY(-1px);
                }
                .search-box {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .search-box input {
                    padding: 10px 40px 10px 12px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    width: 300px;
                    font-size: 14px;
                }
                .search-box input:focus {
                    outline: none;
                    border-color: #3498DB;
                    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
                }
                .search-icon {
                    position: absolute;
                    right: 12px;
                    color: #666;
                    pointer-events: none;
                }
                .users-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 20px;
                    margin-bottom: 25px;
                }
                .stat-item {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    text-align: center;
                    border: 1px solid #e9ecef;
                }
                .stat-value {
                    font-size: 28px;
                    font-weight: bold;
                    color: #2c3e50;
                    margin-bottom: 8px;
                }
                .stat-label {
                    color: #666;
                    font-size: 14px;
                }
                .users-table-container {
                    overflow-x: auto;
                }
                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-top: 10px;
                }
                .users-table th,
                .users-table td {
                    padding: 12px;
                    text-align: left;
                    border-bottom: 1px solid #eee;
                }
                .users-table th {
                    background: #f8f9fa;
                    font-weight: 600;
                    color: #555;
                    position: sticky;
                    top: 0;
                }
                .users-table tr:hover {
                    background: #f8f9fa;
                }
                .status-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .status-normal {
                    background: #d4edda;
                    color: #155724;
                }
                .status-disabled {
                    background: #f8d7da;
                    color: #721c24;
                }
                .role-badge {
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                .role-admin {
                    background: #fff3cd;
                    color: #856404;
                }
                .role-operator {
                    background: #d1ecf1;
                    color: #0c5460;
                }
                .role-viewer {
                    background: #e2e3e5;
                    color: #383d41;
                }
                .action-buttons {
                    display: flex;
                    gap: 5px;
                }
                .action-btn {
                    padding: 4px 8px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 12px;
                    transition: all 0.3s ease;
                }
                .action-btn.edit {
                    background: #ffc107;
                    color: #212529;
                }
                .action-btn.delete {
                    background: #dc3545;
                    color: white;
                }
                .action-btn.reset {
                    background: #17a2b8;
                    color: white;
                }
                .action-btn:hover {
                    transform: translateY(-1px);
                    opacity: 0.9;
                }
                .modal {
                    position: fixed;
                    z-index: 10000;
                    left: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-content {
                    background-color: white;
                    border-radius: 12px;
                    width: 90%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                    animation: slideIn 0.3s ease-out;
                }
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                .modal-header {
                    padding: 20px 25px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .modal-header h3 {
                    margin: 0;
                    color: #333;
                    font-size: 20px;
                }
                .close {
                    font-size: 28px;
                    font-weight: bold;
                    cursor: pointer;
                    color: #aaa;
                    line-height: 1;
                }
                .close:hover {
                    color: #333;
                }
                .modal-body {
                    padding: 25px;
                }
                .form-row {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 20px;
                    margin-bottom: 20px;
                }
                .form-group {
                    display: flex;
                    flex-direction: column;
                }
                .form-group label {
                    margin-bottom: 6px;
                    font-weight: 600;
                    color: #555;
                    font-size: 14px;
                }
                .form-group input,
                .form-group select {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.3s ease;
                }
                .form-group input:focus,
                .form-group select:focus {
                    outline: none;
                    border-color: #3498DB;
                    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
                }
                .modal-footer {
                    padding: 20px 25px;
                    border-top: 1px solid #eee;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
                @media (max-width: 768px) {
                    .form-row {
                        grid-template-columns: 1fr;
                    }
                    .users-toolbar {
                        flex-direction: column;
                        gap: 15px;
                        align-items: stretch;
                    }
                    .search-box input {
                        width: 100%;
                    }
                }
            </style>

            <!-- 操作工具栏 -->
            <div class="users-toolbar">
                <div class="toolbar-left">
                    <button class="btn btn-primary" onclick="showAddUserModal()">
                        <span class="icon">➕</span> 添加用户
                    </button>
                    <button class="btn btn-secondary" onclick="refreshUserList()">
                        <span class="icon">🔄</span> 刷新
                    </button>
                    <button class="btn btn-secondary" onclick="exportUserList()">
                        <span class="icon">📤</span> 导出
                    </button>
                </div>
                <div class="toolbar-right">
                    <div class="search-box">
                        <input type="text" id="userSearchInput" placeholder="搜索用户名、姓名或邮箱..." onkeyup="searchUsers(this.value)">
                        <span class="search-icon">🔍</span>
                    </div>
                </div>
            </div>

            <!-- 用户统计 -->
            <div class="users-stats">
                <div class="stat-item">
                    <div class="stat-value" id="totalUsers">${usersData.length}</div>
                    <div class="stat-label">总用户数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="activeUsers">${usersData.filter(u => u.status === '正常').length}</div>
                    <div class="stat-label">活跃用户</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="adminUsers">${usersData.filter(u => u.role === '管理员').length}</div>
                    <div class="stat-label">管理员</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value" id="disabledUsers">${usersData.filter(u => u.status === '禁用').length}</div>
                    <div class="stat-label">禁用用户</div>
                </div>
            </div>

            <!-- 用户列表 -->
            <div class="users-table-container">
                <table class="users-table" id="usersTable">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>用户名</th>
                            <th>姓名</th>
                            <th>邮箱</th>
                            <th>角色</th>
                            <th>状态</th>
                            <th>创建时间</th>
                            <th>最后登录</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody id="usersTableBody">
                        <!-- 用户数据将通过JavaScript动态填充 -->
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 添加用户弹窗 -->
        <div id="addUserModal" class="modal" style="display: none;">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>添加新用户</h3>
                    <span class="close" onclick="closeAddUserModal()">&times;</span>
                </div>
                <div class="modal-body">
                    <form id="addUserForm">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newUsername">用户名 *</label>
                                <input type="text" id="newUsername" name="username" required placeholder="请输入用户名">
                            </div>
                            <div class="form-group">
                                <label for="newName">姓名 *</label>
                                <input type="text" id="newName" name="name" required placeholder="请输入真实姓名">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newEmail">邮箱 *</label>
                                <input type="email" id="newEmail" name="email" required placeholder="请输入邮箱地址">
                            </div>
                            <div class="form-group">
                                <label for="newRole">角色 *</label>
                                <select id="newRole" name="role" required>
                                    <option value="">请选择角色</option>
                                    <option value="管理员">管理员</option>
                                    <option value="操作员">操作员</option>
                                    <option value="观察员">观察员</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newPassword">密码 *</label>
                                <input type="password" id="newPassword" name="password" required placeholder="请输入密码">
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">确认密码 *</label>
                                <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="请再次输入密码">
                            </div>
                        </div>
                        <div class="form-row">
                            <div class="form-group">
                                <label for="newStatus">状态</label>
                                <select id="newStatus" name="status">
                                    <option value="正常">正常</option>
                                    <option value="禁用">禁用</option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="closeAddUserModal()">取消</button>
                    <button type="button" class="btn btn-primary" onclick="saveNewUser()">保存</button>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = usersHTML;
    
    // 渲染用户列表
    renderUserList();
    
    console.log('Users content loaded successfully');
}
//
 渲染用户列表
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
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="role-badge role-${getRoleClass(user.role)}">${user.role}</span></td>
            <td><span class="status-badge status-${getStatusClass(user.status)}">${user.status}</span></td>
            <td>${user.createTime}</td>
            <td>${user.lastLogin}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit" onclick="editUser(${user.id})" title="编辑">✏️</button>
                    <button class="action-btn reset" onclick="resetPassword(${user.id})" title="重置密码">🔑</button>
                    <button class="action-btn delete" onclick="deleteUser(${user.id})" title="删除">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });

    // 更新统计数据
    updateUserStats();
}

// 获取角色样式类
function getRoleClass(role) {
    const roleMap = {
        '管理员': 'admin',
        '操作员': 'operator',
        '观察员': 'viewer'
    };
    return roleMap[role] || 'viewer';
}

// 获取状态样式类
function getStatusClass(status) {
    return status === '正常' ? 'normal' : 'disabled';
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

// 显示添加用户弹窗
function showAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'flex';
        // 清空表单
        document.getElementById('addUserForm').reset();
    }
}

// 关闭添加用户弹窗
function closeAddUserModal() {
    const modal = document.getElementById('addUserModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 保存新用户
function saveNewUser() {
    const form = document.getElementById('addUserForm');
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

// 导出用户列表
function exportUserList() {
    const csvContent = generateUserCSV();
    downloadCSV(csvContent, 'users_list.csv');
    showAlert('用户列表导出成功', 'success');
}

// 生成CSV内容
function generateUserCSV() {
    const headers = ['ID', '用户名', '姓名', '邮箱', '角色', '状态', '创建时间', '最后登录'];
    const csvRows = [headers.join(',')];

    usersData.forEach(user => {
        const row = [
            user.id,
            user.username,
            user.name,
            user.email,
            user.role,
            user.status,
            user.createTime,
            user.lastLogin
        ];
        csvRows.push(row.join(','));
    });

    return csvRows.join('\n');
}

// 下载CSV文件
function downloadCSV(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// 编辑用户
function editUser(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }
    
    showAlert('编辑用户功能开发中...', 'info');
}

// 重置密码
function resetPassword(userId) {
    const user = usersData.find(u => u.id === userId);
    if (!user) {
        showAlert('用户不存在', 'error');
        return;
    }

    if (confirm(`确定要重置用户 "${user.name}" 的密码吗？`)) {
        showAlert(`用户 "${user.name}" 的密码已重置为默认密码`, 'success');
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
    // 创建提示元素
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10001;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        animation: slideInRight 0.3s ease-out;
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
            alert.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                document.body.removeChild(alert);
            }, 300);
        }
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100%);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
`;
document.head.appendChild(style);

// 点击弹窗外部关闭弹窗
document.addEventListener('click', function(event) {
    const modal = document.getElementById('addUserModal');
    if (modal && event.target === modal) {
        closeAddUserModal();
    }
});

// 按ESC键关闭弹窗
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeAddUserModal();
    }
});

// 将函数暴露到全局作用域
window.loadUsersContent = loadUsersContent;
window.showAddUserModal = showAddUserModal;
window.closeAddUserModal = closeAddUserModal;
window.saveNewUser = saveNewUser;
window.searchUsers = searchUsers;
window.refreshUserList = refreshUserList;
window.exportUserList = exportUserList;
window.editUser = editUser;
window.resetPassword = resetPassword;
window.deleteUser = deleteUser;

console.log('User management module (fixed) loaded successfully!');