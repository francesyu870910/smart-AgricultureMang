# 温室数字化监控系统 - 前端JavaScript工具库

本文档描述了温室数字化监控系统前端JavaScript工具库的使用方法和API接口。

## 目录结构

```
js/
├── app.js                    # 主应用控制器
├── components/               # 功能组件
│   ├── dashboard.js         # 仪表盘组件
│   ├── temperature.js       # 温度监控组件
│   ├── humidity.js          # 湿度控制组件
│   ├── lighting.js          # 光照管理组件
│   ├── ventilation.js       # 通风系统组件
│   ├── alerts.js            # 报警通知组件
│   ├── analytics.js         # 数据分析组件
│   ├── control.js           # 远程控制组件
│   └── history.js           # 历史记录组件
├── services/                # 服务层
│   ├── api.js              # API调用服务
│   └── storage.js          # 本地存储服务
└── utils/                  # 工具类
    ├── chart.js            # 图表工具
    ├── data.js             # 数据处理工具
    ├── error.js            # 错误处理工具
    ├── format.js           # 数据格式化工具
    ├── helpers.js          # 辅助工具函数
    ├── notification.js     # 通知工具
    ├── realtime.js         # 实时数据工具
    ├── storage.js          # 存储工具
    ├── ui.js               # UI工具
    └── validation.js       # 数据验证工具
```

## 核心服务

### API服务 (apiService)

提供统一的后端API调用接口，包含错误处理、重试机制和缓存功能。

#### 基本用法

```javascript
// 获取当前环境数据
const envData = await apiService.getCurrentEnvironmentData();

// 控制设备
await apiService.controlDevice('heater_01', { 
    isRunning: true, 
    powerLevel: 75 
});

// 获取历史数据
const history = await apiService.getHistoryData({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
    page: 1,
    pageSize: 20
});
```

#### 高级功能

```javascript
// 批量设备控制
const commands = [
    { deviceId: 'heater_01', controlData: { isRunning: true } },
    { deviceId: 'fan_01', controlData: { powerLevel: 50 } }
];
const result = await apiService.batchControlDevices(commands);

// 轮询数据更新
const stopPolling = apiService.startPolling(
    () => apiService.getCurrentEnvironmentData(),
    (error, data) => {
        if (error) {
            console.error('数据更新失败:', error);
        } else {
            updateUI(data);
        }
    },
    30000 // 30秒间隔
);

// 停止轮询
stopPolling();
```

### 存储服务 (storageService)

提供本地数据存储、缓存和用户设置管理功能。

#### 基本用法

```javascript
// 存储数据
storageService.set('user_preference', { theme: 'dark' });

// 获取数据
const preference = storageService.get('user_preference', { theme: 'light' });

// 缓存API数据
storageService.setCache('environment_data', data, 5 * 60 * 1000); // 5分钟缓存

// 获取缓存
const cachedData = storageService.getCache('environment_data');
```

#### 高级功能

```javascript
// 版本化数据存储
storageService.setVersionedData('config', configData, '2.0.0');
const config = storageService.getVersionedData('config', '2.0.0');

// 批量操作
storageService.setBatch({
    'setting1': 'value1',
    'setting2': 'value2'
});

// 数据导出/导入
const exportData = storageService.exportData();
storageService.importData(exportData, true);
```

## 工具类

### 数据处理工具 (DataUtils)

提供数据处理、分析和转换功能。

```javascript
// 数据插值
const interpolatedData = DataUtils.interpolateData(
    rawData, 
    'timestamp', 
    'temperature', 
    60000 // 1分钟间隔
);

// 异常值检测
const dataWithAnomalies = DataUtils.detectAnomalies(data, 'value', 2);

// 数据聚合
const hourlyData = DataUtils.aggregateData(
    data, 
    'timestamp', 
    'temperature', 
    'hour', 
    'avg'
);

// 趋势计算
const trend = DataUtils.calculateTrend(data, 'temperature');
console.log(`趋势方向: ${trend.direction}, 强度: ${trend.strength}`);
```

### UI工具 (UIUtils)

提供UI组件创建和交互功能。

```javascript
// 创建数据卡片
const card = UIUtils.createDataCard({
    title: '当前温度',
    value: '24.5',
    unit: '°C',
    trend: { direction: 'up', text: '上升 2.1%' },
    status: 'normal',
    icon: '🌡️',
    onClick: () => console.log('卡片被点击')
});
document.getElementById('container').appendChild(card);

// 创建进度条
const progressBar = UIUtils.createProgressBar(75, 100, {
    showValue: true,
    showPercentage: true,
    color: 'var(--success-color)',
    animated: true
});

// 创建分页器
const pagination = UIUtils.createPagination({
    currentPage: 1,
    totalPages: 10,
    onPageChange: (page) => loadData(page)
});
```

### 图表工具 (ChartUtils)

提供图表绘制功能。

```javascript
// 绘制折线图
ChartUtils.drawLineChart('temperatureChart', data, {
    lineColor: '#2E7D32',
    showGrid: true,
    showPoints: true
});

// 绘制柱状图
ChartUtils.drawBarChart('humidityChart', data, {
    barColor: '#4CAF50',
    showValues: true
});

// 绘制仪表盘
ChartUtils.drawGauge('gaugeChart', 75, 0, 100, {
    colors: ['#4CAF50', '#FF9800', '#F44336']
});
```

### 格式化工具 (FormatUtils)

提供数据格式化功能。

```javascript
// 格式化温度
const tempStr = FormatUtils.formatTemperature(24.567); // "24.6°C"

// 格式化日期时间
const dateStr = FormatUtils.formatDateTime(new Date(), 'full');

// 格式化相对时间
const relativeTime = FormatUtils.formatRelativeTime(new Date(Date.now() - 300000)); // "5分钟前"

// 格式化文件大小
const sizeStr = FormatUtils.formatFileSize(1024000); // "1.0 MB"
```

### 验证工具 (ValidationUtils)

提供数据验证功能。

```javascript
// 验证温度值
const tempValidation = ValidationUtils.validateTemperature(25.5);
if (!tempValidation.valid) {
    console.error(tempValidation.message);
}

// 验证表单
const formValidation = ValidationUtils.validateForm(formData, {
    temperature: {
        required: true,
        type: 'number',
        min: -50,
        max: 80,
        label: '温度'
    },
    email: {
        required: true,
        type: 'email',
        label: '邮箱地址'
    }
});

if (!formValidation.valid) {
    console.error('表单验证失败:', formValidation.errors);
}
```

### 通知工具 (notificationUtils)

提供用户通知功能。

```javascript
// 显示不同类型的通知
notificationUtils.success('操作成功');
notificationUtils.warning('请注意检查设置');
notificationUtils.error('操作失败，请重试');
notificationUtils.info('系统信息更新');

// 显示确认对话框
notificationUtils.showConfirm(
    '确定要删除这条记录吗？',
    () => console.log('用户确认'),
    () => console.log('用户取消')
);

// 显示系统通知
notificationUtils.showSystemNotification(
    '温室报警',
    '温度过高，请及时处理'
);
```

### 实时数据工具 (realtimeUtils)

提供WebSocket连接和实时数据处理功能。

```javascript
// 建立WebSocket连接
const connection = await realtimeUtils.connect('ws://localhost:8080/ws', {
    autoReconnect: true,
    heartbeat: true,
    onMessage: (data) => console.log('收到消息:', data),
    onError: (error) => console.error('连接错误:', error)
});

// 订阅特定消息类型
realtimeUtils.subscribe(connection.connectionId, 'temperature_update', (data) => {
    updateTemperatureDisplay(data);
});

// 发送消息
realtimeUtils.send(connection.connectionId, {
    type: 'subscribe',
    topics: ['temperature', 'humidity']
});
```

### 错误处理工具 (errorUtils)

提供统一的错误处理和日志记录功能。

```javascript
// 安全执行函数
const result = await errorUtils.safeExecute(async () => {
    return await apiService.getCurrentEnvironmentData();
}, { operation: '获取环境数据' });

// 处理API错误
try {
    await apiService.controlDevice('invalid_device', {});
} catch (error) {
    const userMessage = errorUtils.handleApiError(error, {
        url: '/api/devices/invalid_device/control',
        method: 'POST'
    });
    notificationUtils.error(userMessage);
}

// 获取错误日志
const recentErrors = errorUtils.getErrorLogs(10);
console.log('最近的错误:', recentErrors);
```

## 最佳实践

### 1. 错误处理

始终使用try-catch包装异步操作，并使用错误处理工具：

```javascript
async function loadData() {
    try {
        const data = await apiService.getCurrentEnvironmentData();
        updateUI(data);
    } catch (error) {
        errorUtils.handleApiError(error);
        notificationUtils.error('数据加载失败，请重试');
    }
}
```

### 2. 数据缓存

合理使用缓存减少API调用：

```javascript
async function getEnvironmentData() {
    // 先尝试从缓存获取
    let data = storageService.getCache('environment_data');
    
    if (!data) {
        // 缓存未命中，从API获取
        data = await apiService.getCurrentEnvironmentData();
        storageService.setCache('environment_data', data, 30000); // 30秒缓存
    }
    
    return data;
}
```

### 3. 用户体验

使用加载状态和友好的错误提示：

```javascript
async function performAction() {
    const loading = notificationUtils.showLoading('正在处理...');
    
    try {
        await apiService.controlDevice('heater_01', { isRunning: true });
        notificationUtils.success('设备控制成功');
    } catch (error) {
        notificationUtils.error('设备控制失败，请重试');
    } finally {
        notificationUtils.hideLoading(loading);
    }
}
```

### 4. 数据验证

在发送数据前进行验证：

```javascript
function submitForm(formData) {
    const validation = ValidationUtils.validateForm(formData, validationRules);
    
    if (!validation.valid) {
        errorUtils.handleValidationError(validation.errors, formElement);
        return;
    }
    
    // 验证通过，提交数据
    apiService.updateSystemConfig(formData);
}
```

## 配置选项

### API服务配置

```javascript
// 在app.js中配置API服务
apiService.baseUrl = '/api';
apiService.timeout = 10000;
```

### 存储服务配置

```javascript
// 配置默认过期时间
storageService.defaultExpiry = 24 * 60 * 60 * 1000; // 24小时
```

### 通知配置

```javascript
// 配置通知显示时间
notificationUtils.defaultDuration = 3000; // 3秒
```

## 调试和监控

### 启用调试模式

```javascript
// 在浏览器控制台中启用调试
window.DEBUG = true;

// 查看API调用统计
console.log(await apiService.getApiStats());

// 查看存储使用情况
console.log(storageService.getStatistics());

// 查看错误日志
console.log(errorUtils.getErrorLogs());
```

### 性能监控

```javascript
// 监控组件渲染时间
const startTime = performance.now();
await component.render();
const renderTime = performance.now() - startTime;
console.log(`组件渲染耗时: ${renderTime}ms`);
```

## 扩展开发

### 添加新的工具类

1. 在`utils/`目录下创建新的工具文件
2. 遵循现有的命名约定和代码风格
3. 提供完整的JSDoc注释
4. 创建全局实例（如果需要）

### 添加新的API接口

1. 在`apiService`中添加新的方法
2. 包含适当的错误处理和验证
3. 提供模拟数据支持
4. 更新文档

### 自定义组件

```javascript
class CustomComponent {
    constructor() {
        this.data = null;
    }
    
    async render() {
        try {
            this.data = await apiService.getCustomData();
            return this.generateHTML();
        } catch (error) {
            return uiUtils.createErrorState('数据加载失败', () => this.render());
        }
    }
    
    generateHTML() {
        // 生成组件HTML
        return '<div>自定义组件内容</div>';
    }
    
    destroy() {
        // 清理资源
        this.data = null;
    }
}
```

## 故障排除

### 常见问题

1. **API调用失败**
   - 检查网络连接
   - 验证API端点是否正确
   - 查看浏览器控制台错误信息

2. **数据不更新**
   - 检查缓存设置
   - 验证数据刷新间隔
   - 确认WebSocket连接状态

3. **UI组件不显示**
   - 检查DOM元素是否存在
   - 验证CSS样式是否正确加载
   - 查看JavaScript错误

### 调试技巧

```javascript
// 启用详细日志
localStorage.setItem('debug', 'true');

// 查看实时连接状态
console.log(realtimeUtils.getAllConnectionStatus());

// 监控数据流
realtimeDataManager.onDataUpdate('environment', (data) => {
    console.log('环境数据更新:', data);
});
```

## 更新日志

### v1.0.0
- 初始版本发布
- 包含所有核心工具类和服务
- 支持实时数据和WebSocket连接
- 完整的错误处理和用户通知系统