/**
 * 智能温室环境监控系统 - 历史记录组件
 */

class HistoryComponent {
    constructor() {
        this.refreshInterval = null;
    }

    async render() {
        return `
            <div class="history-container">
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">历史记录模块</h3>
                    </div>
                    <div class="card-body">
                        <p>历史记录功能正在开发中...</p>
                        <div class="data-display">
                            <div class="data-label">记录总数</div>
                            <div class="data-value">25,678</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    async ini   <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">历史数据查询</h3>
                        <div class="card-actions">
                            <button class="btn btn-primary" onclick="historyComponent.exportData()">
                                📊 导出数据
                            </button>
                            <button class="btn btn-secondary" onclick="historyComponent.refresh()">
                                🔄 刷新
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="filter-section">
                            <div class="grid grid-4">
                                <!-- 时间范围选择 -->
                                <div class="form-group">
                                    <label class="form-label">时间范围</label>
                                    <select class="form-select" id="dateRangeSelect" onchange="historyComponent.onFilterChange()">
                                        <option value="today">今天</option>
                                        <option value="yesterday">昨天</option>
                                        <option value="week">最近一�?/option>
                                        <option value="month">最近一�?/option>
                                        <option value="custom">自定�?/option>
                                    </select>
                                </div>
                                
                                <!-- 数据类型筛�?-->
                                <div class="form-group">
                                    <label class="form-label">数据类型</label>
                                    <select class="form-select" id="dataTypeSelect" onchange="historyComponent.onFilterChange()">
                                        <option value="all">全部数据</option>
                                        <option value="temperature">温度</option>
                                        <option value="humidity">湿度</option>
                                        <option value="light_intensity">光照强度</option>
                                        <option value="soil_humidity">土壤湿度</option>
                                        <option value="co2_level">CO2浓度</option>
                                    </select>
                                </div>
                                
                                <!-- 数值范�?-->
                                <div class="form-group">
                                    <label class="form-label">最小�?/label>
                                    <input type="number" class="form-input" id="minValueInput" 
                                           placeholder="最小�? onchange="historyComponent.onFilterChange()">
                                </div>
                                
                                <div class="form-group">
                                    <label class="form-label">最大�?/label>
                                    <input type="number" class="form-input" id="maxValueInput" 
                                           placeholder="最大�? onchange="historyComponent.onFilterChange()">
                                </div>
                            </div>
                            
                            <!-- 自定义日期范�?-->
                            <div id="customDateRange" class="grid grid-2" style="display: none; margin-top: 15px;">
                                <div class="form-group">
                                    <label class="form-label">开始日�?/label>
                                    <input type="datetime-local" class="form-input" id="startDateInput" 
                                           onchange="historyComponent.onFilterChange()">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">结束日期</label>
                                    <input type="datetime-local" class="form-input" id="endDateInput" 
                                           onchange="historyComponent.onFilterChange()">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 数据统计概览 -->
                <div class="grid grid-4">
                    <div class="data-card">
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">总记录数</div>
                                <div class="data-value" id="totalRecordsCount">--</div>
                            </div>
                        </div>
                    </div>
                    <div class="data-card">
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">时间跨度</div>
                                <div class="data-value" id="timeSpanDisplay">--</div>
                            </div>
                        </div>
                    </div>
                    <div class="data-card">
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">数据完整�?/div>
                                <div class="data-value" id="dataIntegrityDisplay">--</div>
                            </div>
                        </div>
                    </div>
                    <div class="data-card">
                        <div class="card-body">
                            <div class="data-display">
                                <div class="data-label">异常记录</div>
                                <div class="data-value" id="anomalyCountDisplay">--</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 历史数据图表展示 -->
                <div class="data-card chart-card">
                    <div class="card-header">
                        <h3 class="card-title">历史数据趋势�?/h3>
                        <div class="chart-controls">
                            <div class="period-buttons">
                                <button class="period-btn active" data-period="1h" onclick="historyComponent.changeChartPeriod('1h')">1小时</button>
                                <button class="period-btn" data-period="6h" onclick="historyComponent.changeChartPeriod('6h')">6小时</button>
                                <button class="period-btn" data-period="24h" onclick="historyComponent.changeChartPeriod('24h')">24小时</button>
                                <button class="period-btn" data-period="7d" onclick="historyComponent.changeChartPeriod('7d')">7�?/button>
                            </div>
                            <select class="form-select" id="chartDataTypeSelect" onchange="historyComponent.updateChart()">
                                <option value="temperature">温度</option>
                                <option value="humidity">湿度</option>
                                <option value="light_intensity">光照强度</option>
                                <option value="soil_humidity">土壤湿度</option>
                                <option value="co2_level">CO2浓度</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="chart-container">
                            <canvas id="historyChart" width="800" height="300"></canvas>
                        </div>
                    </div>
                </div>

                <!-- 数据对比分析 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">数据对比分析</h3>
                        <div class="card-actions">
                            <button class="btn btn-secondary" onclick="historyComponent.showComparisonModal()">
                                📈 设置对比
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="comparisonChartContainer" style="display: none;">
                            <div class="chart-container">
                                <canvas id="comparisonChart" width="800" height="300"></canvas>
                            </div>
                        </div>
                        <div id="comparisonPlaceholder" class="empty-state">
                            <div class="empty-state-icon">📊</div>
                            <div class="empty-state-title">暂无对比数据</div>
                            <div class="empty-state-description">点击"设置对比"按钮选择要对比的时间段和参数</div>
                        </div>
                    </div>
                </div>

                <!-- 历史数据表格 -->
                <div class="data-card">
                    <div class="card-header">
                        <h3 class="card-title">历史数据记录</h3>
                        <div class="card-actions">
                            <select class="form-select" id="pageSizeSelect" onchange="historyComponent.changePageSize()">
                                <option value="10">10�?�?/option>
                                <option value="20" selected>20�?�?/option>
                                <option value="50">50�?�?/option>
                                <option value="100">100�?�?/option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body">
                        <div id="historyTableContainer">
                            <div class="loading">
                                <div class="loading-spinner"></div>
                                <div>正在加载历史数据...</div>
                            </div>
                        </div>
                        
                        <!-- 分页控件 -->
                        <div class="pagination" id="historyPagination">
                            <button onclick="historyComponent.goToPage(1)" id="firstPageBtn">首页</button>
                            <button onclick="historyComponent.goToPage(historyComponent.currentPage - 1)" id="prevPageBtn">上一�?/button>
                            <span id="pageInfo">�?1 页，�?1 �?/span>
                            <button onclick="historyComponent.goToPage(historyComponent.currentPage + 1)" id="nextPageBtn">下一�?/button>
                            <button onclick="historyComponent.goToPage(historyComponent.totalPages)" id="lastPageBtn">末页</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 数据对比设置模态框 -->
            <div id="comparisonModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>数据对比设置</h3>
                        <button class="btn-close" onclick="historyComponent.closeComparisonModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">对比参数</label>
                            <select class="form-select" id="comparisonParameter">
                                <option value="temperature">温度</option>
                                <option value="humidity">湿度</option>
                                <option value="light_intensity">光照强度</option>
                                <option value="soil_humidity">土壤湿度</option>
                                <option value="co2_level">CO2浓度</option>
                            </select>
                        </div>
                        
                        <div class="grid grid-2">
                            <div class="form-group">
                                <label class="form-label">第一时间�?/label>
                                <select class="form-select" id="period1Select">
                                    <option value="today">今天</option>
                                    <option value="yesterday">昨天</option>
                                    <option value="week">本周</option>
                                    <option value="lastWeek">上周</option>
                                    <option value="month">本月</option>
                                    <option value="lastMonth">上月</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">第二时间�?/label>
                                <select class="form-select" id="period2Select">
                                    <option value="today">今天</option>
                                    <option value="yesterday" selected>昨天</option>
                                    <option value="week">本周</option>
                                    <option value="lastWeek">上周</option>
                                    <option value="month">本月</option>
                                    <option value="lastMonth">上月</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="historyComponent.closeComparisonModal()">取消</button>
                        <button class="btn btn-primary" onclick="historyComponent.generateComparison()">生成对比</button>
                    </div>
                </div>
            </div>

            <!-- 数据导出模态框 -->
            <div id="exportModal" class="modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>数据导出设置</h3>
                        <button class="btn-close" onclick="historyComponent.closeExportModal()">×</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label class="form-label">导出格式</label>
                            <select class="form-select" id="exportFormat">
                                <option value="csv">CSV格式</option>
                                <option value="excel">Excel格式</option>
                                <option value="json">JSON格式</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">导出范围</label>
                            <select class="form-select" id="exportRange">
                                <option value="current">当前筛选结�?/option>
                                <option value="all">全部历史数据</option>
                                <option value="custom">自定义范�?/option>
                            </select>
                        </div>
                        
                        <div id="customExportRange" style="display: none;">
                            <div class="grid grid-2">
                                <div class="form-group">
                                    <label class="form-label">开始时�?/label>
                                    <input type="datetime-local" class="form-input" id="exportStartDate">
                                </div>
                                <div class="form-group">
                                    <label class="form-label">结束时间</label>
                                    <input type="datetime-local" class="form-input" id="exportEndDate">
                                </div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">包含字段</label>
                            <div class="grid grid-2">
                                <label><input type="checkbox" checked id="includeTemperature"> 温度</label>
                                <label><input type="checkbox" checked id="includeHumidity"> 湿度</label>
                                <label><input type="checkbox" checked id="includeLightIntensity"> 光照强度</label>
                                <label><input type="checkbox" checked id="includeSoilHumidity"> 土壤湿度</label>
                                <label><input type="checkbox" checked id="includeCO2Level"> CO2浓度</label>
                                <label><input type="checkbox" checked id="includeTimestamp"> 记录时间</label>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" onclick="historyComponent.closeExportModal()">取消</button>
                        <button class="btn btn-primary" onclick="historyComponent.performExport()">开始导�?/button>
                    </div>
                </div>
            </div>
        `;
    }    async in
it() {
        console.log('历史记录组件已初始化');
        
        // 初始化日期范�?
        this.initializeDateRange();
        
        // 加载初始数据
        await this.loadHistoryData();
        
        // 加载图表数据
        await this.loadChartData();
        
        // 设置自动刷新
        this.startAutoRefresh();
        
        // 绑定事件监听�?
        this.bindEventListeners();
    }

    /**
     * 初始化日期范�?
     */
    initializeDateRange() {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        // 设置默认的开始和结束时间
        document.getElementById('startDateInput').value = this.formatDateTimeLocal(today);
        document.getElementById('endDateInput').value = this.formatDateTimeLocal(now);
    }

    /**
     * 格式化日期时间为本地输入格式
     */
    formatDateTimeLocal(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    /**
     * 绑定事件监听�?
     */
    bindEventListeners() {
        // 监听导出范围变化
        const exportRangeSelect = document.getElementById('exportRange');
        if (exportRangeSelect) {
            exportRangeSelect.addEventListener('change', (e) => {
                const customRange = document.getElementById('customExportRange');
                if (customRange) {
                    customRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
                }
            });
        }

        // 监听日期范围选择变化
        const dateRangeSelect = document.getElementById('dateRangeSelect');
        if (dateRangeSelect) {
            dateRangeSelect.addEventListener('change', (e) => {
                const customRange = document.getElementById('customDateRange');
                if (customRange) {
                    customRange.style.display = e.target.value === 'custom' ? 'block' : 'none';
                }
            });
        }
    }

    /**
     * 筛选条件变化处�?
     */
    async onFilterChange() {
        // 更新筛选条�?
        this.updateFilters();
        
        // 重置到第一�?
        this.currentPage = 1;
        
        // 重新加载数据
        await this.loadHistoryData();
        
        // 更新图表
        await this.loadChartData();
    }

    /**
     * 更新筛选条�?
     */
    updateFilters() {
        this.filters.dateRange = document.getElementById('dateRangeSelect').value;
        this.filters.dataType = document.getElementById('dataTypeSelect').value;
        this.filters.minValue = document.getElementById('minValueInput').value;
        this.filters.maxValue = document.getElementById('maxValueInput').value;
        
        if (this.filters.dateRange === 'custom') {
            this.filters.startDate = document.getElementById('startDateInput').value;
            this.filters.endDate = document.getElementById('endDateInput').value;
        } else {
            // 根据预设范围计算日期
            const dateRange = this.calculateDateRange(this.filters.dateRange);
            this.filters.startDate = dateRange.start;
            this.filters.endDate = dateRange.end;
        }
    }

    /**
     * 计算预设日期范围
     */
    calculateDateRange(range) {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        
        switch (range) {
            case 'today':
                return {
                    start: this.formatDateTimeLocal(today),
                    end: this.formatDateTimeLocal(now)
                };
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                const yesterdayEnd = new Date(yesterday);
                yesterdayEnd.setHours(23, 59, 59);
                return {
                    start: this.formatDateTimeLocal(yesterday),
                    end: this.formatDateTimeLocal(yesterdayEnd)
                };
            case 'week':
                const weekStart = new Date(today);
                weekStart.setDate(weekStart.getDate() - 7);
                return {
                    start: this.formatDateTimeLocal(weekStart),
                    end: this.formatDateTimeLocal(now)
                };
            case 'month':
                const monthStart = new Date(today);
                monthStart.setDate(monthStart.getDate() - 30);
                return {
                    start: this.formatDateTimeLocal(monthStart),
                    end: this.formatDateTimeLocal(now)
                };
            default:
                return {
                    start: this.formatDateTimeLocal(today),
                    end: this.formatDateTimeLocal(now)
                };
        }
    }

    /**
     * 加载历史数据
     */
    async loadHistoryData() {
        try {
            // 显示加载状�?
            this.showTableLoading();
            
            // 构建查询参数
            const params = {
                page: this.currentPage,
                pageSize: this.pageSize,
                startDate: this.filters.startDate,
                endDate: this.filters.endDate,
                dataType: this.filters.dataType,
                minValue: this.filters.minValue,
                maxValue: this.filters.maxValue,
                sortBy: this.sortBy,
                sortOrder: this.sortOrder
            };

            // 调用API获取数据
            const response = await apiService.getHistoryData(params);
            
            if (response.success) {
                this.totalRecords = response.data.total;
                this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
                
                // 渲染数据表格
                this.renderHistoryTable(response.data.records);
                
                // 更新分页控件
                this.updatePagination();
                
                // 更新统计信息
                this.updateStatistics(response.data.statistics);
            } else {
                this.showTableError('加载历史数据失败');
            }
        } catch (error) {
            console.error('加载历史数据失败:', error);
            this.showTableError('网络错误，请稍后重试');
        }
    }

    /**
     * 显示表格加载状�?
     */
    showTableLoading() {
        const container = document.getElementById('historyTableContainer');
        if (container) {
            container.innerHTML = `
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <div>正在加载历史数据...</div>
                </div>
            `;
        }
    }

    /**
     * 显示表格错误状�?
     */
    showTableError(message) {
        const container = document.getElementById('historyTableContainer');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⚠️</div>
                    <div class="empty-state-title">加载失败</div>
                    <div class="empty-state-description">${message}</div>
                    <button class="btn btn-primary" onclick="historyComponent.loadHistoryData()">重试</button>
                </div>
            `;
        }
    }

    /**
     * 渲染历史数据表格
     */
    renderHistoryTable(records) {
        const container = document.getElementById('historyTableContainer');
        if (!container) return;

        if (!records || records.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📊</div>
                    <div class="empty-state-title">暂无数据</div>
                    <div class="empty-state-description">当前筛选条件下没有找到历史记录</div>
                </div>
            `;
            return;
        }

        const tableHtml = `
            <table class="data-table">
                <thead>
                    <tr>
                        <th onclick="historyComponent.sortBy('recorded_at')">
                            记录时间 ${this.getSortIcon('recorded_at')}
                        </th>
                        <th onclick="historyComponent.sortBy('temperature')">
                            温度(°C) ${this.getSortIcon('temperature')}
                        </th>
                        <th onclick="historyComponent.sortBy('humidity')">
                            湿度(%) ${this.getSortIcon('humidity')}
                        </th>
                        <th onclick="historyComponent.sortBy('light_intensity')">
                            光照强度(lux) ${this.getSortIcon('light_intensity')}
                        </th>
                        <th onclick="historyComponent.sortBy('soil_humidity')">
                            土壤湿度(%) ${this.getSortIcon('soil_humidity')}
                        </th>
                        <th onclick="historyComponent.sortBy('co2_level')">
                            CO2浓度(ppm) ${this.getSortIcon('co2_level')}
                        </th>
                        <th>状�?/th>
                    </tr>
                </thead>
                <tbody>
                    ${records.map(record => this.renderTableRow(record)).join('')}
                </tbody>
            </table>
        `;

        container.innerHTML = tableHtml;
    }

    /**
     * 渲染表格�?
     */
    renderTableRow(record) {
        const isAnomalous = this.checkAnomalousData(record);
        const statusClass = isAnomalous ? 'status-warning' : 'status-normal';
        const statusText = isAnomalous ? '异常' : '正常';

        return `
            <tr class="${isAnomalous ? 'anomalous-row' : ''}">
                <td>${formatUtils.formatDateTime(record.recorded_at, 'full')}</td>
                <td>${formatUtils.formatTemperature(record.temperature)}</td>
                <td>${formatUtils.formatHumidity(record.humidity)}</td>
                <td>${formatUtils.formatLightIntensity(record.light_intensity)}</td>
                <td>${formatUtils.formatHumidity(record.soil_humidity)}</td>
                <td>${formatUtils.formatCO2Level(record.co2_level)}</td>
                <td><span class="data-status ${statusClass}">${statusText}</span></td>
            </tr>
        `;
    }

    /**
     * 检查数据是否异�?
     */
    checkAnomalousData(record) {
        // 简单的异常检测逻辑
        return (
            record.temperature < 10 || record.temperature > 40 ||
            record.humidity < 20 || record.humidity > 90 ||
            record.light_intensity < 100 || record.light_intensity > 5000 ||
            record.soil_humidity < 10 || record.soil_humidity > 80 ||
            record.co2_level < 300 || record.co2_level > 1000
        );
    }

    /**
     * 获取排序图标
     */
    getSortIcon(field) {
        if (this.sortBy !== field) return '↕️';
        return this.sortOrder === 'asc' ? '�? : '�?;
    }

    /**
     * 排序处理
     */
    async sortBy(field) {
        if (this.sortBy === field) {
            this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortBy = field;
            this.sortOrder = 'desc';
        }
        
        await this.loadHistoryData();
    }

    /**
     * 更新分页控件
     */
    updatePagination() {
        const pageInfo = document.getElementById('pageInfo');
        const firstPageBtn = document.getElementById('firstPageBtn');
        const prevPageBtn = document.getElementById('prevPageBtn');
        const nextPageBtn = document.getElementById('nextPageBtn');
        const lastPageBtn = document.getElementById('lastPageBtn');

        if (pageInfo) {
            pageInfo.textContent = `�?${this.currentPage} 页，�?${this.totalPages} �?(总计 ${this.totalRecords} 条记�?`;
        }

        if (firstPageBtn) firstPageBtn.disabled = this.currentPage === 1;
        if (prevPageBtn) prevPageBtn.disabled = this.currentPage === 1;
        if (nextPageBtn) nextPageBtn.disabled = this.currentPage === this.totalPages;
        if (lastPageBtn) lastPageBtn.disabled = this.currentPage === this.totalPages;
    }

    /**
     * 跳转到指定页�?
     */
    async goToPage(page) {
        if (page < 1 || page > this.totalPages) return;
        
        this.currentPage = page;
        await this.loadHistoryData();
    }

    /**
     * 改变每页显示数量
     */
    async changePageSize() {
        const pageSizeSelect = document.getElementById('pageSizeSelect');
        if (pageSizeSelect) {
            this.pageSize = parseInt(pageSizeSelect.value);
            this.currentPage = 1;
            await this.loadHistoryData();
        }
    }

    /**
     * 更新统计信息
     */
    updateStatistics(statistics) {
        // 更新总记录数
        const totalRecordsElement = document.getElementById('totalRecordsCount');
        if (totalRecordsElement) {
            totalRecordsElement.textContent = formatUtils.formatNumber(statistics.totalRecords, 0);
        }

        // 更新时间跨度
        const timeSpanElement = document.getElementById('timeSpanDisplay');
        if (timeSpanElement && statistics.timeSpan) {
            timeSpanElement.textContent = formatUtils.formatDuration(statistics.timeSpan);
        }

        // 更新数据完整�?
        const dataIntegrityElement = document.getElementById('dataIntegrityDisplay');
        if (dataIntegrityElement && statistics.dataIntegrity !== undefined) {
            dataIntegrityElement.textContent = formatUtils.formatPercentage(statistics.dataIntegrity, 100);
        }

        // 更新异常记录�?
        const anomalyCountElement = document.getElementById('anomalyCountDisplay');
        if (anomalyCountElement) {
            anomalyCountElement.textContent = formatUtils.formatNumber(statistics.anomalyCount || 0, 0);
        }
    }

    /**
     * 加载图表数据
     */
    async loadChartData() {
        try {
            const params = {
                startDate: this.filters.startDate,
                endDate: this.filters.endDate,
                dataType: document.getElementById('chartDataTypeSelect')?.value || 'temperature',
                period: document.querySelector('.period-btn.active')?.dataset.period || '24h'
            };

            // 模拟图表数据
            this.chartData = this.generateMockChartData(params);
            this.updateChart();
        } catch (error) {
            console.error('加载图表数据失败:', error);
        }
    }

    /**
     * 生成模拟图表数据
     */
    generateMockChartData(params) {
        const dataPoints = params.period === '1h' ? 12 : 
                          params.period === '6h' ? 24 : 
                          params.period === '24h' ? 24 : 30;
        
        const baseValue = params.dataType === 'temperature' ? 25 :
                         params.dataType === 'humidity' ? 60 :
                         params.dataType === 'light_intensity' ? 1500 :
                         params.dataType === 'soil_humidity' ? 45 :
                         params.dataType === 'co2_level' ? 450 : 25;
        
        const variation = params.dataType === 'temperature' ? 8 :
                         params.dataType === 'humidity' ? 20 :
                         params.dataType === 'light_intensity' ? 800 :
                         params.dataType === 'soil_humidity' ? 15 :
                         params.dataType === 'co2_level' ? 100 : 8;

        return Array.from({length: dataPoints}, (_, i) => {
            const timeOffset = params.period === '1h' ? i * 5 * 60 * 1000 :
                              params.period === '6h' ? i * 15 * 60 * 1000 :
                              params.period === '24h' ? i * 60 * 60 * 1000 :
                              i * 24 * 60 * 60 * 1000;
            
            return {
                time: new Date(Date.now() - (dataPoints - 1 - i) * timeOffset).toISOString(),
                value: baseValue + (Math.random() - 0.5) * variation
            };
        });
    }

    /**
     * 更新图表
     */
    updateChart() {
        if (!this.chartData || this.chartData.length === 0) return;

        const dataType = document.getElementById('chartDataTypeSelect')?.value || 'temperature';
        const unit = this.getDataUnit(dataType);
        
        ChartUtils.drawLineChart('historyChart', this.chartData, {
            lineColor: '#2E7D32',
            pointColor: '#2E7D32',
            showGrid: true,
            showPoints: true,
            title: `${this.getDataTypeName(dataType)}历史趋势`,
            unit: unit
        });
    }

    /**
     * 获取数据类型名称
     */
    getDataTypeName(dataType) {
        const names = {
            temperature: '温度',
            humidity: '湿度',
            light_intensity: '光照强度',
            soil_humidity: '土壤湿度',
            co2_level: 'CO2浓度'
        };
        return names[dataType] || dataType;
    }

    /**
     * 获取数据单位
     */
    getDataUnit(dataType) {
        const units = {
            temperature: '°C',
            humidity: '%',
            light_intensity: 'lux',
            soil_humidity: '%',
            co2_level: 'ppm'
        };
        return units[dataType] || '';
    }

    /**
     * 改变图表时间周期
     */
    async changeChartPeriod(period) {
        // 更新按钮状�?
        document.querySelectorAll('.period-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-period="${period}"]`)?.classList.add('active');

        // 重新加载图表数据
        await this.loadChartData();
    }

    /**
     * 显示数据对比模态框
     */
    showComparisonModal() {
        const modal = document.getElementById('comparisonModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * 关闭数据对比模态框
     */
    closeComparisonModal() {
        const modal = document.getElementById('comparisonModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * 生成数据对比
     */
    async generateComparison() {
        try {
            const parameter = document.getElementById('comparisonParameter').value;
            const period1 = document.getElementById('period1Select').value;
            const period2 = document.getElementById('period2Select').value;

            // 生成对比数据
            this.comparisonData = this.generateMockComparisonData(parameter, period1, period2);
            
            // 显示对比图表
            this.showComparisonChart();
            
            // 关闭模态框
            this.closeComparisonModal();
            
            notificationUtils.success('数据对比生成成功');
        } catch (error) {
            console.error('生成数据对比失败:', error);
            notificationUtils.error('生成数据对比失败');
        }
    }

    /**
     * 生成模拟对比数据
     */
    generateMockComparisonData(parameter, period1, period2) {
        const dataPoints = 24;
        const baseValue = parameter === 'temperature' ? 25 :
                         parameter === 'humidity' ? 60 :
                         parameter === 'light_intensity' ? 1500 :
                         parameter === 'soil_humidity' ? 45 :
                         parameter === 'co2_level' ? 450 : 25;
        
        const variation = parameter === 'temperature' ? 6 :
                         parameter === 'humidity' ? 15 :
                         parameter === 'light_intensity' ? 600 :
                         parameter === 'soil_humidity' ? 12 :
                         parameter === 'co2_level' ? 80 : 6;

        const period1Data = Array.from({length: dataPoints}, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            value: baseValue + (Math.random() - 0.5) * variation
        }));

        const period2Data = Array.from({length: dataPoints}, (_, i) => ({
            time: `${String(i).padStart(2, '0')}:00`,
            value: baseValue + (Math.random() - 0.5) * variation + (Math.random() - 0.5) * 3
        }));

        return {
            parameter,
            period1: { name: this.getPeriodName(period1), data: period1Data },
            period2: { name: this.getPeriodName(period2), data: period2Data }
        };
    }

    /**
     * 获取时间段名�?
     */
    getPeriodName(period) {
        const names = {
            today: '今天',
            yesterday: '昨天',
            week: '本周',
            lastWeek: '上周',
            month: '本月',
            lastMonth: '上月'
        };
        return names[period] || period;
    }

    /**
     * 显示对比图表
     */
    showComparisonChart() {
        const container = document.getElementById('comparisonChartContainer');
        const placeholder = document.getElementById('comparisonPlaceholder');
        
        if (container && placeholder) {
            container.style.display = 'block';
            placeholder.style.display = 'none';
            
            // 绘制对比图表
            this.drawComparisonChart();
        }
    }

    /**
     * 绘制对比图表
     */
    drawComparisonChart() {
        const canvas = document.getElementById('comparisonChart');
        if (!canvas || !this.comparisonData) return;

        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        
        canvas.width = rect.width;
        canvas.height = rect.height;

        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const padding = 50;
        const chartWidth = canvas.width - padding * 2;
        const chartHeight = canvas.height - padding * 2;

        // 获取数据范围
        const allValues = [
            ...this.comparisonData.period1.data.map(d => d.value),
            ...this.comparisonData.period2.data.map(d => d.value)
        ];
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        const valueRange = maxValue - minValue || 1;

        // 绘制网格
        this.drawComparisonGrid(ctx, padding, chartWidth, chartHeight);

        // 绘制两条数据�?
        this.drawComparisonLine(ctx, this.comparisonData.period1.data, padding, chartWidth, chartHeight, minValue, valueRange, '#2E7D32');
        this.drawComparisonLine(ctx, this.comparisonData.period2.data, padding, chartWidth, chartHeight, minValue, valueRange, '#FF9800');

        // 绘制图例
        this.drawComparisonLegend(ctx, canvas.width, padding);
    }

    /**
     * 绘制对比图表网格
     */
    drawComparisonGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#E0E0E0';
        ctx.lineWidth = 1;
        
        // 水平网格�?
        for (let i = 0; i <= 5; i++) {
            const y = padding + (chartHeight / 5) * i;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }

        // 垂直网格�?
        for (let i = 0; i <= 6; i++) {
            const x = padding + (chartWidth / 6) * i;
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
    }

    /**
     * 绘制对比数据�?
     */
    drawComparisonLine(ctx, data, padding, chartWidth, chartHeight, minValue, valueRange, color) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.beginPath();

        data.forEach((point, index) => {
            const x = padding + (chartWidth / (data.length - 1)) * index;
            const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });

        ctx.stroke();
    }

    /**
     * 绘制对比图表图例
     */
    drawComparisonLegend(ctx, canvasWidth, padding) {
        const legendY = padding - 20;
        
        // 第一条线图例
        ctx.fillStyle = '#2E7D32';
        ctx.fillRect(canvasWidth - 200, legendY, 15, 3);
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.fillText(this.comparisonData.period1.name, canvasWidth - 180, legendY + 10);
        
        // 第二条线图例
        ctx.fillStyle = '#FF9800';
        ctx.fillRect(canvasWidth - 100, legendY, 15, 3);
        ctx.fillStyle = '#333';
        ctx.fillText(this.comparisonData.period2.name, canvasWidth - 80, legendY + 10);
    }

    /**
     * 显示数据导出模态框
     */
    exportData() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.style.display = 'flex';
        }
    }

    /**
     * 关闭数据导出模态框
     */
    closeExportModal() {
        const modal = document.getElementById('exportModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    /**
     * 执行数据导出
     */
    async performExport() {
        try {
            const format = document.getElementById('exportFormat').value;
            const range = document.getElementById('exportRange').value;
            
            // 收集导出参数
            const exportParams = {
                format: format,
                range: range,
                fields: this.getSelectedFields()
            };

            if (range === 'custom') {
                exportParams.startDate = document.getElementById('exportStartDate').value;
                exportParams.endDate = document.getElementById('exportEndDate').value;
            } else if (range === 'current') {
                exportParams.startDate = this.filters.startDate;
                exportParams.endDate = this.filters.endDate;
                exportParams.dataType = this.filters.dataType;
                exportParams.minValue = this.filters.minValue;
                exportParams.maxValue = this.filters.maxValue;
            }

            // 调用导出API
            const response = await apiService.exportHistoryData(exportParams);
            
            if (response.success) {
                // 创建下载链接
                this.downloadExportedFile(response.data.downloadUrl, response.data.filename);
                notificationUtils.success('数据导出成功');
                this.closeExportModal();
            } else {
                notificationUtils.error('数据导出失败');
            }
        } catch (error) {
            console.error('数据导出失败:', error);
            notificationUtils.error('数据导出失败');
        }
    }

    /**
     * 获取选中的导出字�?
     */
    getSelectedFields() {
        const fields = [];
        
        if (document.getElementById('includeTemperature').checked) fields.push('temperature');
        if (document.getElementById('includeHumidity').checked) fields.push('humidity');
        if (document.getElementById('includeLightIntensity').checked) fields.push('light_intensity');
        if (document.getElementById('includeSoilHumidity').checked) fields.push('soil_humidity');
        if (document.getElementById('includeCO2Level').checked) fields.push('co2_level');
        if (document.getElementById('includeTimestamp').checked) fields.push('recorded_at');
        
        return fields;
    }

    /**
     * 下载导出的文�?
     */
    downloadExportedFile(url, filename) {
        // 模拟文件下载
        const link = document.createElement('a');
        link.href = url || '#';
        link.download = filename || `历史数据_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * 开始自动刷�?
     */
    startAutoRefresh() {
        // �?分钟自动刷新一次数�?
        this.refreshInterval = setInterval(() => {
            this.refresh();
        }, 5 * 60 * 1000);
    }

    /**
     * 刷新数据
     */
    async refresh() {
        console.log('刷新历史数据');
        await this.loadHistoryData();
        await this.loadChartData();
        notificationUtils.info('历史数据已刷�?);
    }

    /**
     * 销毁组�?
     */
    destroy() {
        if (this.refreshInterval) {
            clearInterval(this.refreshInterval);
            this.refreshInterval = null;
        }
        
        // 清理事件监听�?
        this.unbindEventListeners();
        
        console.log('历史记录组件已销�?);
    }

    /**
     * 解绑事件监听�?
     */
    unbindEventListeners() {
        // 移除事件监听�?
        const exportRangeSelect = document.getElementById('exportRange');
        if (exportRangeSelect) {
            exportRangeSelect.removeEventListener('change', this.handleExportRangeChange);
        }

        const dateRangeSelect = document.getElementById('dateRangeSelect');
        if (dateRangeSelect) {
            dateRangeSelect.removeEventListener('change', this.handleDateRangeChange);
        }
    }
}

