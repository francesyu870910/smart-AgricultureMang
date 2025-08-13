/**
 * 智能温室环境监控系统 - API测试工具
 * 提供API接口测试和调试功�?
 */

class ApiTestUtils {
    constructor() {
        this.testResults = [];
        this.isRunning = false;
    }

    /**
     * 运行所有API测试
     * @returns {Promise<Object>} 测试结果
     */
    async runAllTests() {
        if (this.isRunning) {
            console.warn('测试正在运行�?..');
            return;
        }

        this.isRunning = true;
        this.testResults = [];
        
        console.log('开始API测试...');
        notificationUtils.info('开始API接口测试', 'API测试');

        const testSuites = [
            { name: '环境数据接口', tests: this.testEnvironmentApis.bind(this) },
            { name: '设备控制接口', tests: this.testDeviceApis.bind(this) },
            { name: '报警管理接口', tests: this.testAlertApis.bind(this) },
            { name: '数据分析接口', tests: this.testAnalyticsApis.bind(this) },
            { name: '历史数据接口', tests: this.testHistoryApis.bind(this) }
        ];

        let totalTests = 0;
        let passedTests = 0;

        for (const suite of testSuites) {
            console.log(`\n=== ${suite.name} ===`);
            try {
                const results = await suite.tests();
                results.forEach(result => {
                    totalTests++;
                    if (result.passed) passedTests++;
                    this.testResults.push({
                        suite: suite.name,
                        ...result
                    });
                });
            } catch (error) {
                console.error(`测试套件 ${suite.name} 执行失败:`, error);
                this.testResults.push({
                    suite: suite.name,
                    name: '套件执行',
                    passed: false,
                    error: error.message,
                    duration: 0
                });
                totalTests++;
            }
        }

        this.isRunning = false;
        
        const summary = {
            total: totalTests,
            passed: passedTests,
            failed: totalTests - passedTests,
            passRate: totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : 0,
            results: this.testResults
        };

        console.log('\n=== 测试总结 ===');
        console.log(`总测试数: ${summary.total}`);
        console.log(`通过: ${summary.passed}`);
        console.log(`失败: ${summary.failed}`);
        console.log(`通过�? ${summary.passRate}%`);

        if (summary.passRate >= 80) {
            notificationUtils.success(`API测试完成，通过�? ${summary.passRate}%`, 'API测试');
        } else {
            notificationUtils.warning(`API测试完成，通过�? ${summary.passRate}%`, 'API测试');
        }

        return summary;
    }

    /**
     * 测试环境数据接口
     */
    async testEnvironmentApis() {
        const results = [];

        // 测试获取当前环境数据
        results.push(await this.runTest('获取当前环境数据', async () => {
            const data = await apiService.getCurrentEnvironmentData();
            this.assertNotNull(data, '返回数据不能为空');
            this.assertNotNull(data.data, '数据字段不能为空');
            this.assertNumber(data.data.temperature, '温度必须是数�?);
            this.assertNumber(data.data.humidity, '湿度必须是数�?);
            return data;
        }));

        // 测试获取历史环境数据
        results.push(await this.runTest('获取历史环境数据', async () => {
            const params = {
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString(),
                limit: 10
            };
            const data = await apiService.getEnvironmentHistory(params);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        // 测试设置环境阈�?
        results.push(await this.runTest('设置环境阈�?, async () => {
            const thresholds = {
                temperature: { min: 18, max: 30 },
                humidity: { min: 40, max: 80 }
            };
            const data = await apiService.setEnvironmentThreshold(thresholds, { showError: false });
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        return results;
    }

    /**
     * 测试设备控制接口
     */
    async testDeviceApis() {
        const results = [];

        // 测试获取设备列表
        results.push(await this.runTest('获取设备列表', async () => {
            const data = await apiService.getDevices();
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        // 测试获取设备状�?
        results.push(await this.runTest('获取设备状�?, async () => {
            const deviceId = 'heater_01';
            const data = await apiService.getDeviceStatus(deviceId);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        // 测试设备控制
        results.push(await this.runTest('设备控制', async () => {
            const deviceId = 'heater_01';
            const controlData = {
                action: 'start',
                powerLevel: 50
            };
            const data = await apiService.controlDevice(deviceId, controlData, { showError: false });
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        return results;
    }

    /**
     * 测试报警管理接口
     */
    async testAlertApis() {
        const results = [];

        // 测试获取报警列表
        results.push(await this.runTest('获取报警列表', async () => {
            const params = { limit: 10 };
            const data = await apiService.getAlerts(params);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        // 测试获取报警统计
        results.push(await this.runTest('获取报警统计', async () => {
            const params = { period: '24h' };
            const data = await apiService.getAlertStatistics(params);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        return results;
    }

    /**
     * 测试数据分析接口
     */
    async testAnalyticsApis() {
        const results = [];

        // 测试获取数据摘要
        results.push(await this.runTest('获取数据摘要', async () => {
            const params = { period: '24h' };
            const data = await apiService.getAnalyticsSummary(params);
            this.assertNotNull(data, '返回数据不能为空');
            this.assertNotNull(data.data, '数据字段不能为空');
            return data;
        }));

        // 测试获取趋势分析
        results.push(await this.runTest('获取趋势分析', async () => {
            const params = { period: '24h' };
            const data = await apiService.getAnalyticsTrends(params);
            this.assertNotNull(data, '返回数据不能为空');
            this.assertNotNull(data.data, '数据字段不能为空');
            this.assertArray(data.data.timePoints, '时间点必须是数组');
            return data;
        }));

        // 测试获取分析报告
        results.push(await this.runTest('获取分析报告', async () => {
            const params = { period: '24h' };
            const data = await apiService.getAnalyticsReports(params);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        return results;
    }

    /**
     * 测试历史数据接口
     */
    async testHistoryApis() {
        const results = [];

        // 测试获取历史数据
        results.push(await this.runTest('获取历史数据', async () => {
            const params = {
                page: 1,
                pageSize: 10,
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString()
            };
            const data = await apiService.getHistoryData(params);
            this.assertNotNull(data, '返回数据不能为空');
            this.assertNotNull(data.data, '数据字段不能为空');
            return data;
        }));

        // 测试导出历史数据
        results.push(await this.runTest('导出历史数据', async () => {
            const params = {
                format: 'csv',
                startDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
                endDate: new Date().toISOString()
            };
            const data = await apiService.exportHistoryData(params);
            this.assertNotNull(data, '返回数据不能为空');
            return data;
        }));

        return results;
    }

    /**
     * 运行单个测试
     * @param {string} name - 测试名称
     * @param {Function} testFn - 测试函数
     * @returns {Promise<Object>} 测试结果
     */
    async runTest(name, testFn) {
        const startTime = Date.now();
        
        try {
            console.log(`运行测试: ${name}`);
            const result = await testFn();
            const duration = Date.now() - startTime;
            
            console.log(`�?${name} (${duration}ms)`);
            return {
                name,
                passed: true,
                duration,
                result
            };
        } catch (error) {
            const duration = Date.now() - startTime;
            console.error(`�?${name} (${duration}ms):`, error.message);
            return {
                name,
                passed: false,
                duration,
                error: error.message
            };
        }
    }

    /**
     * 断言不为�?
     */
    assertNotNull(value, message = '值不能为�?) {
        if (value === null || value === undefined) {
            throw new Error(message);
        }
    }

    /**
     * 断言为数�?
     */
    assertNumber(value, message = '值必须是数字') {
        if (typeof value !== 'number' || isNaN(value)) {
            throw new Error(message);
        }
    }

    /**
     * 断言为数�?
     */
    assertArray(value, message = '值必须是数组') {
        if (!Array.isArray(value)) {
            throw new Error(message);
        }
    }

    /**
     * 断言为字符串
     */
    assertString(value, message = '值必须是字符�?) {
        if (typeof value !== 'string') {
            throw new Error(message);
        }
    }

    /**
     * 断言为布尔�?
     */
    assertBoolean(value, message = '值必须是布尔�?) {
        if (typeof value !== 'boolean') {
            throw new Error(message);
        }
    }

    /**
     * 断言相等
     */
    assertEqual(actual, expected, message = '值不相等') {
        if (actual !== expected) {
            throw new Error(`${message}: 期望 ${expected}, 实际 ${actual}`);
        }
    }

    /**
     * 生成测试报告
     * @returns {string} HTML格式的测试报�?
     */
    generateReport() {
        if (this.testResults.length === 0) {
            return '<p>暂无测试结果</p>';
        }

        const groupedResults = {};
        this.testResults.forEach(result => {
            if (!groupedResults[result.suite]) {
                groupedResults[result.suite] = [];
            }
            groupedResults[result.suite].push(result);
        });

        let html = '<div class="test-report">';
        html += '<h3>API测试报告</h3>';

        Object.keys(groupedResults).forEach(suite => {
            const results = groupedResults[suite];
            const passed = results.filter(r => r.passed).length;
            const total = results.length;
            const passRate = total > 0 ? (passed / total * 100).toFixed(1) : 0;

            html += `<div class="test-suite">`;
            html += `<h4>${suite} (${passed}/${total}, ${passRate}%)</h4>`;
            html += `<ul class="test-list">`;

            results.forEach(result => {
                const status = result.passed ? '�? : '�?;
                const statusClass = result.passed ? 'passed' : 'failed';
                html += `<li class="test-item ${statusClass}">`;
                html += `<span class="test-status">${status}</span>`;
                html += `<span class="test-name">${result.name}</span>`;
                html += `<span class="test-duration">${result.duration}ms</span>`;
                if (!result.passed && result.error) {
                    html += `<div class="test-error">${result.error}</div>`;
                }
                html += `</li>`;
            });

            html += `</ul></div>`;
        });

        html += '</div>';
        return html;
    }

    /**
     * 显示测试报告
     */
    showReport() {
        const reportHtml = this.generateReport();
        
        // 创建报告窗口
        const modal = document.createElement('div');
        modal.className = 'test-report-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        `;

        modal.innerHTML = `
            <div class="test-report-content" style="
                background: var(--card-bg);
                border-radius: 8px;
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                padding: 20px;
                position: relative;
            ">
                <button class="close-btn" style="
                    position: absolute;
                    top: 10px;
                    right: 15px;
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                ">×</button>
                ${reportHtml}
                <div style="margin-top: 20px; text-align: right;">
                    <button class="btn btn-primary export-btn">导出报告</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 绑定事件
        modal.querySelector('.close-btn').addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modal.querySelector('.export-btn').addEventListener('click', () => {
            this.exportReport();
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    /**
     * 导出测试报告
     */
    exportReport() {
        const reportData = {
            timestamp: new Date().toISOString(),
            summary: {
                total: this.testResults.length,
                passed: this.testResults.filter(r => r.passed).length,
                failed: this.testResults.filter(r => !r.passed).length
            },
            results: this.testResults
        };

        const dataStr = JSON.stringify(reportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `api-test-report-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        notificationUtils.success('测试报告已导�?);
    }

    /**
     * 清除测试结果
     */
    clearResults() {
        this.testResults = [];
        console.log('测试结果已清�?);
    }
}

// 创建全局API测试工具实例
const apiTestUtils = new ApiTestUtils();

// 添加到全局作用域以便在控制台中使用
window.apiTestUtils = apiTestUtils;
