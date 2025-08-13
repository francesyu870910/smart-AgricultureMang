/**
 * 温度监控组件功能验证脚本
 * 用于验证温度监控组件的所有功能是否正常工作
 */

// 模拟浏览器环境
global.window = global;
global.document = {
    createElement: () => ({ style: {}, innerHTML: '', addEventListener: () => {} }),
    getElementById: () => ({ textContent: '', style: {}, innerHTML: '' }),
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: () => {}
};
global.localStorage = {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
};

// 模拟Canvas API
global.HTMLCanvasElement = function() {};
global.HTMLCanvasElement.prototype.getContext = function() {
    return {
        clearRect: () => {},
        beginPath: () => {},
        arc: () => {},
        moveTo: () => {},
        lineTo: () => {},
        stroke: () => {},
        fill: () => {},
        fillText: () => {},
        setLineDash: () => {},
        fillRect: () => {}
    };
};

// 加载必要的工具类
const fs = require('fs');
const path = require('path');

function loadScript(scriptPath) {
    try {
        const content = fs.readFileSync(scriptPath, 'utf8');
        eval(content);
        return true;
    } catch (error) {
        console.error(`加载脚本失败: ${scriptPath}`, error.message);
        return false;
    }
}

// 验证函数
function verifyTemperatureComponent() {
    console.log('🧪 开始验证温度监控组件...\n');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    function test(name, testFn) {
        try {
            testFn();
            console.log(`✅ ${name}`);
            results.passed++;
            results.tests.push({ name, status: 'PASS' });
        } catch (error) {
            console.log(`❌ ${name}: ${error.message}`);
            results.failed++;
            results.tests.push({ name, status: 'FAIL', error: error.message });
        }
    }
    
    // 加载依赖脚本
    const scriptsToLoad = [
        'src/main/resources/static/frontend/js/utils/format.js',
        'src/main/resources/static/frontend/js/utils/validation.js',
        'src/main/resources/static/frontend/js/utils/notification.js',
        'src/main/resources/static/frontend/js/utils/error.js',
        'src/main/resources/static/frontend/js/services/storage.js',
        'src/main/resources/static/frontend/js/services/api.js',
        'src/main/resources/static/frontend/js/components/temperature.js'
    ];
    
    console.log('📦 加载依赖脚本...');
    let allLoaded = true;
    scriptsToLoad.forEach(script => {
        if (!loadScript(script)) {
            allLoaded = false;
        }
    });
    
    if (!allLoaded) {
        console.log('❌ 部分脚本加载失败，无法继续验证');
        return;
    }
    
    console.log('✅ 所有依赖脚本加载成功\n');
    
    // 测试1: 组件实例化
    test('组件实例化', () => {
        const component = new TemperatureComponent();
        if (!component) throw new Error('组件实例化失败');
        if (typeof component.render !== 'function') throw new Error('render方法不存在');
        if (typeof component.init !== 'function') throw new Error('init方法不存在');
    });
    
    // 测试2: 渲染功能
    test('HTML渲染功能', async () => {
        const component = new TemperatureComponent();
        const html = await component.render();
        if (typeof html !== 'string') throw new Error('render方法应返回字符串');
        if (!html.includes('temperature-container')) throw new Error('HTML结构不正确');
        if (!html.includes('当前温度')) throw new Error('缺少温度显示元素');
    });
    
    // 测试3: 数据更新功能
    test('数据更新功能', () => {
        const component = new TemperatureComponent();
        const mockData = {
            temperature: 25.5,
            recordedAt: new Date().toISOString()
        };
        
        component.updateEnvironmentData(mockData);
        if (!component.currentData) throw new Error('数据更新失败');
        if (component.currentData.temperature !== mockData.temperature) {
            throw new Error('温度数据不匹配');
        }
    });
    
    // 测试4: 阈值验证
    test('阈值验证功能', () => {
        const component = new TemperatureComponent();
        
        // 测试正常温度
        let status = component.getTemperatureStatus(25);
        if (status.class !== 'status-normal') throw new Error('正常温度状态判断错误');
        
        // 测试过低温度
        status = component.getTemperatureStatus(15);
        if (status.class !== 'status-danger') throw new Error('过低温度状态判断错误');
        
        // 测试过高温度
        status = component.getTemperatureStatus(35);
        if (status.class !== 'status-danger') throw new Error('过高温度状态判断错误');
    });
    
    // 测试5: 趋势计算
    test('趋势计算功能', () => {
        const component = new TemperatureComponent();
        
        // 测试上升趋势
        let trend = component.calculateTrend([20, 22, 24, 26, 28]);
        if (trend <= 0) throw new Error('上升趋势计算错误');
        
        // 测试下降趋势
        trend = component.calculateTrend([28, 26, 24, 22, 20]);
        if (trend >= 0) throw new Error('下降趋势计算错误');
        
        // 测试稳定趋势
        trend = component.calculateTrend([25, 25, 25, 25, 25]);
        if (Math.abs(trend) > 0.1) throw new Error('稳定趋势计算错误');
    });
    
    // 测试6: 阈值设置验证
    test('阈值设置验证', () => {
        const component = new TemperatureComponent();
        
        // 模拟DOM元素
        global.document.getElementById = (id) => {
            const mockValues = {
                'min-threshold': { value: '18' },
                'max-threshold': { value: '30' },
                'optimal-min-threshold': { value: '20' },
                'optimal-max-threshold': { value: '28' }
            };
            return mockValues[id] || { value: '' };
        };
        
        const isValid = component.validateThresholds();
        if (!isValid) throw new Error('有效阈值验证失败');
    });
    
    // 测试7: 历史数据生成
    test('历史数据生成', () => {
        const component = new TemperatureComponent();
        const historyData = component.generateMockHistoryData('24h');
        
        if (!Array.isArray(historyData)) throw new Error('历史数据应为数组');
        if (historyData.length === 0) throw new Error('历史数据不能为空');
        if (!historyData[0].temperature) throw new Error('历史数据缺少温度字段');
        if (!historyData[0].recordedAt) throw new Error('历史数据缺少时间字段');
    });
    
    // 测试8: 组件状态获取
    test('组件状态获取', () => {
        const component = new TemperatureComponent();
        component.currentData = { temperature: 25.5 };
        
        const status = component.getStatus();
        if (typeof status !== 'object') throw new Error('状态应为对象');
        if (status.currentTemperature !== 25.5) throw new Error('当前温度状态不正确');
        if (!status.thresholds) throw new Error('缺少阈值信息');
    });
    
    // 测试9: 组件重置功能
    test('组件重置功能', () => {
        const component = new TemperatureComponent();
        component.currentData = { temperature: 25.5 };
        component.historyData = [{ temperature: 24, recordedAt: new Date().toISOString() }];
        
        component.reset();
        if (component.currentData !== null) throw new Error('重置后当前数据应为null');
        if (component.historyData.length !== 0) throw new Error('重置后历史数据应为空');
    });
    
    // 测试10: 模拟数据生成
    test('模拟数据生成', () => {
        const component = new TemperatureComponent();
        const mockData = component.generateMockData();
        
        if (!mockData.temperature) throw new Error('模拟数据缺少温度字段');
        if (!mockData.recordedAt) throw new Error('模拟数据缺少时间字段');
        
        const temp = parseFloat(mockData.temperature);
        if (isNaN(temp) || temp < 0 || temp > 50) {
            throw new Error('模拟温度数据超出合理范围');
        }
    });
    
    // 输出测试结果
    console.log('\n📊 测试结果汇总:');
    console.log(`✅ 通过: ${results.passed}`);
    console.log(`❌ 失败: ${results.failed}`);
    console.log(`📈 成功率: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    
    if (results.failed === 0) {
        console.log('\n🎉 所有测试通过！温度监控组件功能完整。');
    } else {
        console.log('\n⚠️  部分测试失败，需要修复以下问题:');
        results.tests.filter(t => t.status === 'FAIL').forEach(test => {
            console.log(`   - ${test.name}: ${test.error}`);
        });
    }
    
    return results;
}

// 运行验证
if (require.main === module) {
    verifyTemperatureComponent();
}

module.exports = { verifyTemperatureComponent };