// 納斯達克行業估值表格 JavaScript
// 用於獲取、顯示和刷新行業估值數據，以及提供互動式估值方法說明

// 全局變量
let valuationData = {};
let explanationsData = {};
let isLoading = true;

// 頁面加載完成後執行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化
    initValuationTable();

    // 綁定刷新按鈕事件
    document.getElementById('refresh-valuation-data').addEventListener('click', function() {
        refreshValuationData();
    });

    // 綁定估值方法說明圖標點擊事件
    document.querySelectorAll('.info-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const metric = this.getAttribute('data-metric');
            showValuationExplanation(metric);
        });
    });

    // 綁定模態框關閉按鈕事件
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('valuation-modal').style.display = 'none';
    });

    // 點擊模態框外部關閉
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('valuation-modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // 設置自動刷新（每60秒）
    setInterval(function() {
        if (!isLoading) {
            refreshValuationData(true);
        }
    }, 60000);
});

/**
 * 初始化估值表格
 */
function initValuationTable() {
    isLoading = true;
    showLoading(true);

    // 加載估值方法說明數據
    loadExplanationsData()
        .then(() => {
            // 加載行業估值數據
            return loadValuationData();
        })
        .then(() => {
            renderValuationTable();
            isLoading = false;
            showLoading(false);
        })
        .catch(error => {
            console.error('初始化估值表格時出錯:', error);
            isLoading = false;
            showLoading(false);
            showErrorMessage('無法加載估值數據，請稍後再試。');
        });
}

/**
 * 加載行業估值數據
 */
function loadValuationData() {
    // 修正路徑，使用絕對路徑
    return fetch('/nasdaq-ipo-tracker/website/data/industry_valuation_data.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('無法獲取行業估值數據');
            }
            return response.json();
        })
        .then(data => {
            valuationData = data;
            updateLastUpdatedTime();
            return data;
        });
}

/**
 * 加載估值方法說明數據
 */
function loadExplanationsData() {
    // 修正路徑，使用絕對路徑
    return fetch('/nasdaq-ipo-tracker/website/data/valuation_explanations.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('無法獲取估值方法說明數據');
            }
            return response.json();
        })
        .then(data => {
            explanationsData = data;
            return data;
        });
}

/**
 * 渲染估值表格
 */
function renderValuationTable() {
    const tableBody = document.getElementById('industry-valuation-body');
    if (!tableBody) {
        console.error('找不到表格主體元素');
        return;
    }
    
    tableBody.innerHTML = '';

    // 遍歷行業數據
    for (const [industry, data] of Object.entries(valuationData)) {
        const metrics = data.metrics;
        const row = document.createElement('tr');

        // 行業名稱
        const industryCell = document.createElement('td');
        industryCell.className = 'industry-name';
        industryCell.textContent = industry;
        row.appendChild(industryCell);

        // 市盈率
        const peCell = document.createElement('td');
        peCell.className = 'metric-value';
        peCell.textContent = metrics.PE ? metrics.PE.toFixed(2) : 'N/A';
        row.appendChild(peCell);

        // 預期市盈率
        const forwardPeCell = document.createElement('td');
        forwardPeCell.className = 'metric-value';
        forwardPeCell.textContent = metrics.Forward_PE ? metrics.Forward_PE.toFixed(2) : 'N/A';
        row.appendChild(forwardPeCell);

        // PEG比率
        const pegCell = document.createElement('td');
        pegCell.className = 'metric-value';
        pegCell.textContent = metrics.PEG ? metrics.PEG.toFixed(2) : 'N/A';
        row.appendChild(pegCell);

        // 行業特定指標
        const specificMetricsCell = document.createElement('td');
        specificMetricsCell.className = 'industry-specific-metrics';

        // 獲取行業特定指標
        const specificMetrics = getIndustrySpecificMetrics(industry, metrics);
        specificMetricsCell.innerHTML = specificMetrics;
        row.appendChild(specificMetricsCell);

        tableBody.appendChild(row);
    }

    const container = document.getElementById('valuation-table-container');
    if (container) {
        container.classList.remove('hidden');
    }
}

/**
 * 獲取行業特定指標HTML
 */
function getIndustrySpecificMetrics(industry, metrics) {
    let html = '';

    // 根據行業選擇最重要的特定指標
    switch (industry) {
        case '科技':
            if (metrics.PS) {
                html += `<div><span class="metric-name">市銷率:</span> <span class="metric-value">${metrics.PS.toFixed(2)}</span> <span class="info-icon" data-metric="市銷率">?</span></div>`;
            }
            if (metrics.RD_Revenue) {
                html += `<div><span class="metric-name">研發/收入比:</span> <span class="metric-value">${metrics.RD_Revenue.toFixed(2)}%</span> <span class="info-icon" data-metric="研發支出佔收入比例">?</span></div>`;
            }
            break;
        case '金融':
            if (metrics.PB) {
                html += `<div><span class="metric-name">市淨率:</span> <span class="metric-value">${metrics.PB.toFixed(2)}</span> <span class="info-icon" data-metric="市淨率">?</span></div>`;
            }
            if (metrics.Dividend_Yield) {
                html += `<div><span class="metric-name">股息收益率:</span> <span class="metric-value">${metrics.Dividend_Yield.toFixed(2)}%</span> <span class="info-icon" data-metric="股息收益率">?</span></div>`;
            }
            break;
        case '醫療保健':
            if (metrics.EV_EBITDA) {
                html += `<div><span class="metric-name">EV/EBITDA:</span> <span class="metric-value">${metrics.EV_EBITDA.toFixed(2)}</span> <span class="info-icon" data-metric="企業價值倍數">?</span></div>`;
            }
            if (metrics.Pipeline_Value) {
                html += `<div><span class="metric-name">研發管線價值:</span> <span class="metric-value">${(metrics.Pipeline_Value / 1000000000).toFixed(2)}B</span> <span class="info-icon" data-metric="研發管線價值">?</span></div>`;
            }
            break;
        case '消費者服務':
            if (metrics.Same_Store_Growth) {
                html += `<div><span class="metric-name">同店銷售增長:</span> <span class="metric-value">${metrics.Same_Store_Growth.toFixed(2)}%</span> <span class="info-icon" data-metric="同店銷售增長">?</span></div>`;
            }
            if (metrics.Customer_Acquisition_Cost) {
                html += `<div><span class="metric-name">客戶獲取成本:</span> <span class="metric-value">$${metrics.Customer_Acquisition_Cost.toFixed(2)}</span> <span class="info-icon" data-metric="客戶獲取成本">?</span></div>`;
            }
            break;
        case '消費品':
            if (metrics.Brand_Value) {
                html += `<div><span class="metric-name">品牌價值:</span> <span class="metric-value">${(metrics.Brand_Value / 1000000000).toFixed(2)}B</span> <span class="info-icon" data-metric="品牌價值指標">?</span></div>`;
            }
            if (metrics.Inventory_Turnover) {
                html += `<div><span class="metric-name">存貨周轉率:</span> <span class="metric-value">${metrics.Inventory_Turnover.toFixed(2)}x</span> <span class="info-icon" data-metric="存貨周轉率">?</span></div>`;
            }
            break;
        case '工業':
            if (metrics.ROCE) {
                html += `<div><span class="metric-name">資本支出回報率:</span> <span class="metric-value">${metrics.ROCE.toFixed(2)}%</span> <span class="info-icon" data-metric="資本支出回報率">?</span></div>`;
            }
            if (metrics.Backlog_Ratio) {
                html += `<div><span class="metric-name">訂單積壓率:</span> <span class="metric-value">${metrics.Backlog_Ratio.toFixed(2)}x</span> <span class="info-icon" data-metric="訂單積壓率">?</span></div>`;
            }
            break;
        case '基礎材料':
            if (metrics.Commodity_Sensitivity) {
                html += `<div><span class="metric-name">商品價格敏感度:</span> <span class="metric-value">${metrics.Commodity_Sensitivity.toFixed(2)}</span> <span class="info-icon" data-metric="商品價格敏感度">?</span></div>`;
            }
            if (metrics.ROA) {
                html += `<div><span class="metric-name">資產回報率:</span> <span class="metric-value">${metrics.ROA.toFixed(2)}%</span> <span class="info-icon" data-metric="資產回報率">?</span></div>`;
            }
            break;
        case '能源':
            if (metrics.Reserve_Replacement) {
                html += `<div><span class="metric-name">儲量替代率:</span> <span class="metric-value">${metrics.Reserve_Replacement.toFixed(2)}%</span> <span class="info-icon" data-metric="儲量替代率">?</span></div>`;
            }
            if (metrics.FCF_Yield) {
                html += `<div><span class="metric-name">自由現金流收益率:</span> <span class="metric-value">${metrics.FCF_Yield.toFixed(2)}%</span> <span class="info-icon" data-metric="自由現金流收益率">?</span></div>`;
            }
            break;
        case '電信服務':
            if (metrics.EV_Subscriber) {
                html += `<div><span class="metric-name">EV/用戶數:</span> <span class="metric-value">$${metrics.EV_Subscriber.toFixed(2)}</span> <span class="info-icon" data-metric="企業價值/用戶數">?</span></div>`;
            }
            if (metrics.ARPU) {
                html += `<div><span class="metric-name">平均每用戶收入:</span> <span class="metric-value">$${metrics.ARPU.toFixed(2)}</span> <span class="info-icon" data-metric="平均每用戶收入">?</span></div>`;
            }
            break;
        case '公用事業':
            if (metrics.Dividend_Yield) {
                html += `<div><span class="metric-name">股息收益率:</span> <span class="metric-value">${metrics.Dividend_Yield.toFixed(2)}%</span> <span class="info-icon" data-metric="股息收益率">?</span></div>`;
            }
            if (metrics.Debt_EBITDA) {
                html += `<div><span class="metric-name">債務/EBITDA:</span> <span class="metric-value">${metrics.Debt_EBITDA.toFixed(2)}x</span> <span class="info-icon" data-metric="債務/EBITDA比率">?</span></div>`;
            }
            break;
        default:
            html = '<div>無特定指標</div>';
    }

    return html;
}

/**
 * 顯示估值方法說明
 */
function showValuationExplanation(metric) {
    if (!explanationsData[metric]) {
        console.error(`找不到 ${metric} 的說明數據`);
        return;
    }

    const data = explanationsData[metric];
    const modal = document.getElementById('valuation-modal');
    const title = document.getElementById('valuation-modal-title');
    const definition = document.getElementById('valuation-definition');
    const calculation = document.getElementById('valuation-calculation');
    const pros = document.getElementById('valuation-pros');
    const cons = document.getElementById('valuation-cons');
    const industryNotes = document.getElementById('valuation-industry-notes');

    title.textContent = metric;
    definition.textContent = data.definition;
    calculation.textContent = data.calculation;

    // 優點列表
    pros.innerHTML = '';
    data.pros.forEach(pro => {
        const li = document.createElement('li');
        li.textContent = pro;
        pros.appendChild(li);
    });

    // 缺點列表
    cons.innerHTML = '';
    data.cons.forEach(con => {
        const li = document.createElement('li');
        li.textContent = con;
        cons.appendChild(li);
    });

    // 行業特定說明
    industryNotes.innerHTML = '';
    if (data.industry_notes) {
        for (const [industry, note] of Object.entries(data.industry_notes)) {
            const div = document.createElement('div');
            div.className = 'industry-note';
            div.innerHTML = `<strong>${industry}:</strong> ${note}`;
            industryNotes.appendChild(div);
        }
    }

    modal.style.display = 'block';
}

/**
 * 刷新估值數據
 */
function refreshValuationData(silent = false) {
    if (isLoading) return;

    isLoading = true;
    if (!silent) {
        showLoading(true);
    }

    loadValuationData()
        .then(() => {
            renderValuationTable();
            isLoading = false;
            if (!silent) {
                showLoading(false);
            }
        })
        .catch(error => {
            console.error('刷新估值數據時出錯:', error);
            isLoading = false;
            if (!silent) {
                showLoading(false);
                showErrorMessage('無法刷新估值數據，請稍後再試。');
            }
        });
}

/**
 * 更新最後更新時間
 */
function updateLastUpdatedTime() {
    const lastUpdatedElement = document.getElementById('valuation-last-updated');
    if (!lastUpdatedElement) return;

    // 獲取最新的更新時間
    let latestTime = null;
    for (const industry in valuationData) {
        const lastUpdated = valuationData[industry].last_updated;
        if (lastUpdated && (!latestTime || lastUpdated > latestTime)) {
            latestTime = lastUpdated;
        }
    }

    if (latestTime) {
        lastUpdatedElement.textContent = latestTime;
    }
}

/**
 * 顯示加載狀態
 */
function showLoading(show) {
    const loadingElement = document.getElementById('valuation-loading');
    if (loadingElement) {
        loadingElement.style.display = show ? 'block' : 'none';
    }
}

/**
 * 顯示錯誤信息
 */
function showErrorMessage(message) {
    const errorElement = document.getElementById('valuation-error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 5000);
    }
}
