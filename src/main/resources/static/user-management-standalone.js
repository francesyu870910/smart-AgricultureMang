// 独立的用户管理模块 - 完全自包含
(function() {
    'use strict';
    
    console.log('🚀 Standalone user management loading...');
    
    // 用户数据
    const userData = [
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
    
    // 显示弹窗函数
    function showModal() {
        console.log('🎯 显示添加用户弹窗');
        
        // 移除已存在的弹窗
        const existingModal = document.getElementById('userModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // 创建弹窗HTML
        const modalHTML = `
            <div id="userModal" style="
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
                    padding: 0;
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                ">
                    <div style="
                        padding: 20px;
                        border-bottom: 1px solid #eee;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: #333;">添加新用户</h3>
                        <span onclick="closeModal()" style="
                            font-size: 24px;
                            cursor: pointer;
                            color: #999;
                        ">&times;</span>
                    </div>
                    <div style="padding: 20px;">
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">用户名 *</label>
                            <input type="text" id="modalUsername" placeholder="请输入用户名" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">姓名 *</label>
                            <input type="text" id="modalName" placeholder="请输入真实姓名" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">邮箱 *</label>
                            <input type="email" id="modalEmail" placeholder="请输入邮箱地址" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                box-sizing: border-box;
                            ">
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">角色 *</label>
                            <select id="modalRole" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                box-sizing: border-box;
                            ">
                                <option value="">请选择角色</option>
                                <option value="管理员">管理员</option>
                                <option value="操作员">操作员</option>
                                <option value="观察员">观察员</option>
                            </select>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-weight: bold;">密码 *</label>
                            <input type="password" id="modalPassword" placeholder="请输入密码" style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid #ddd;
                                border-radius: 6px;
                                box-sizing: border-box;
                            ">
                        </div>
                    </div>
                    <div style="
                        padding: 20px;
                        border-top: 1px solid #eee;
                        text-align: right;
                    ">
                        <button onclick="closeModal()" style="
                            padding: 10px 20px;
                            margin-right: 10px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            background: #95a5a6;
                            color: white;
                        ">取消</button>
                        <button onclick="saveUser()" style="
                            padding: 10px 20px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            background: #3498db;
                            color: white;
                        ">保存</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('✅ 弹窗创建成功');
    }
    
    // 关闭弹窗
    function closeModal() {
        console.log('关闭弹窗');
        const modal = document.getElementById('userModal');
        if (modal) {
            modal.remove();
        }
    }
    
    // 保存用户
    function saveUser() {
        console.log('保存用户');
        
        const username = document.getElementById('modalUsername').value.trim();
        const name = document.getElementById('modalName').value.trim();
        const email = document.getElementById('modalEmail').value.trim();
        const role = document.getElementById('modalRole').value;
        const password = document.getElementById('modalPassword').value;
        
        if (!username || !name || !email || !role || !password) {
            alert('请填写所有必填字段');
            return;
        }
        
        // 检查用户名是否已存在
        if (userData.some(user => user.username === username)) {
            alert('用户名已存在');
            return;
        }
        
        // 检查邮箱是否已存在
        if (userData.some(user => user.email === email)) {
            alert('邮箱已存在');
            return;
        }
        
        // 创建新用户
        const newUser = {
            id: Math.max(...userData.map(u => u.id)) + 1,
            username: username,
            name: name,
            email: email,
            role: role,
            status: '正常',
            createTime: new Date().toLocaleString(),
            lastLogin: '从未登录'
        };
        
        userData.push(newUser);
        console.log('新用户已添加:', newUser);
        
        // 重新渲染用户列表
        renderUserList();
        
        // 关闭弹窗
        closeModal();
        
        // 显示成功消息
        showMessage('用户添加成功！', 'success');
    }
    
    // 渲染用户列表
    function renderUserList() {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        userData.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="padding: 12px;">${user.id}</td>
                <td style="padding: 12px;">${user.username}</td>
                <td style="padding: 12px;">${user.name}</td>
                <td style="padding: 12px;">${user.email}</td>
                <td style="padding: 12px;">${user.role}</td>
                <td style="padding: 12px;">${user.status}</td>
                <td style="padding: 12px;">${user.createTime}</td>
                <td style="padding: 12px;">${user.lastLogin}</td>
                <td style="padding: 12px;">
                    <button onclick="deleteUser(${user.id})" style="
                        padding: 4px 8px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        background: #dc3545;
                        color: white;
                    ">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        // 更新统计
        updateStats();
    }
    
    // 更新统计数据
    function updateStats() {
        const totalUsers = document.getElementById('totalUsers');
        const activeUsers = document.getElementById('activeUsers');
        const adminUsers = document.getElementById('adminUsers');
        const disabledUsers = document.getElementById('disabledUsers');
        
        if (totalUsers) totalUsers.textContent = userData.length;
        if (activeUsers) activeUsers.textContent = userData.filter(u => u.status === '正常').length;
        if (adminUsers) adminUsers.textContent = userData.filter(u => u.role === '管理员').length;
        if (disabledUsers) disabledUsers.textContent = userData.filter(u => u.status === '禁用').length;
    }
    
    // 删除用户
    function deleteUser(userId) {
        if (confirm('确定要删除这个用户吗？')) {
            const index = userData.findIndex(u => u.id === userId);
            if (index > -1) {
                userData.splice(index, 1);
                renderUserList();
                showMessage('用户删除成功', 'success');
            }
        }
    }
    
    // 显示消息
    function showMessage(message, type = 'info') {
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            info: '#17a2b8'
        };
        
        const msgDiv = document.createElement('div');
        msgDiv.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            padding: 15px 20px;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 6px;
            z-index: 99999;
            font-weight: 500;
        `;
        msgDiv.textContent = message;
        
        document.body.appendChild(msgDiv);
        
        setTimeout(() => {
            if (msgDiv.parentNode) {
                msgDiv.parentNode.removeChild(msgDiv);
            }
        }, 3000);
    }
    
    // 加载用户管理内容
    function loadUsersContent(container) {
        console.log('🎯 加载用户管理内容');
        
        const html = `
            <div style="background: white; border-radius: 12px; padding: 25px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; padding-bottom: 20px; border-bottom: 1px solid #eee;">
                    <div>
                        <button onclick="showAddUserModal()" style="
                            padding: 10px 16px;
                            border: none;
                            border-radius: 6px;
                            cursor: pointer;
                            background: #3498db;
                            color: white;
                            font-size: 14px;
                        ">➕ 添加用户</button>
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: #2c3e50;" id="totalUsers">${userData.length}</div>
                        <div style="color: #666; font-size: 14px;">总用户数</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: #2c3e50;" id="activeUsers">${userData.filter(u => u.status === '正常').length}</div>
                        <div style="color: #666; font-size: 14px;">活跃用户</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: #2c3e50;" id="adminUsers">${userData.filter(u => u.role === '管理员').length}</div>
                        <div style="color: #666; font-size: 14px;">管理员</div>
                    </div>
                    <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center;">
                        <div style="font-size: 28px; font-weight: bold; color: #2c3e50;" id="disabledUsers">${userData.filter(u => u.status === '禁用').length}</div>
                        <div style="color: #666; font-size: 14px;">禁用用户</div>
                    </div>
                </div>
                
                <div style="overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">ID</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">用户名</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">姓名</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">邮箱</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">角色</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">状态</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">创建时间</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">最后登录</th>
                                <th style="padding: 12px; text-align: left; border-bottom: 1px solid #eee; background: #f8f9fa;">操作</th>
                            </tr>
                        </thead>
                        <tbody id="usersTableBody">
                        </tbody>
                    </table>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        renderUserList();
    }
    
    // 暴露函数到全局作用域
    window.loadUsersContent = loadUsersContent;
    window.showAddUserModal = showModal;
    window.closeModal = closeModal;
    window.saveUser = saveUser;
    window.deleteUser = deleteUser;
    
    console.log('✅ 独立用户管理模块加载完成');
    console.log('Functions available:', {
        loadUsersContent: typeof window.loadUsersContent,
        showAddUserModal: typeof window.showAddUserModal
    });
    
})();