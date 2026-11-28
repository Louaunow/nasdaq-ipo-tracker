// 導出按鈕功能
document.addEventListener('DOMContentLoaded', function() {
    // 獲取導出按鈕
    const exportButton = document.querySelector('.btn-primary i.fa-download')?.parentElement;
    
    if (exportButton) {
        exportButton.addEventListener('click', function() {
            // 顯示導出選項彈窗
            showExportOptions();
        });
    }
});

// 顯示導出選項彈窗
function showExportOptions() {
    // 創建彈窗元素
    const exportPopup = document.createElement('div');
    exportPopup.className = 'export-popup';
    exportPopup.innerHTML = `
        <div class="export-header">
            <h3>選擇導出格式</h3>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="export-body">
            <div class="export-option" data-format="pdf">
                <i class="fas fa-file-pdf"></i>
                <span>PDF 文件</span>
                <p>導出為高質量PDF文檔</p>
            </div>
            <div class="export-option" data-format="excel">
                <i class="fas fa-file-excel"></i>
                <span>Excel 表格</span>
                <p>導出為可編輯的Excel表格</p>
            </div>
            <div class="export-option" data-format="csv">
                <i class="fas fa-file-csv"></i>
                <span>CSV 文件</span>
                <p>導出為通用CSV格式</p>
            </div>
            <div class="export-option" data-format="image">
                <i class="fas fa-file-image"></i>
                <span>圖片</span>
                <p>導出為PNG圖片格式</p>
            </div>
        </div>
    `;
    
    // 添加到頁面
    document.body.appendChild(exportPopup);
    
    // 添加動畫效果
    setTimeout(() => {
        exportPopup.classList.add('show');
    }, 10);
    
    // 關閉按鈕功能
    const closeBtn = exportPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        closeExportPopup(exportPopup);
    });
    
    // 點擊外部區域關閉
    document.addEventListener('click', function(e) {
        if (!exportPopup.contains(e.target) && e.target !== exportButton) {
            closeExportPopup(exportPopup);
        }
    }, { once: true });
    
    // 導出選項點擊事件
    const exportOptions = exportPopup.querySelectorAll('.export-option');
    exportOptions.forEach(option => {
        option.addEventListener('click', function() {
            const format = this.getAttribute('data-format');
            exportData(format);
            closeExportPopup(exportPopup);
        });
    });
}

// 關閉導出選項彈窗
function closeExportPopup(popup) {
    popup.classList.remove('show');
    popup.classList.add('hide');
    
    setTimeout(() => {
        if (document.body.contains(popup)) {
            document.body.removeChild(popup);
        }
    }, 300);
}

// 導出數據
function exportData(format) {
    // 顯示導出中通知
    showNotification('導出數據', `正在準備 ${format.toUpperCase()} 格式的數據...`, 'info');
    
    // 模擬導出過程
    setTimeout(() => {
        let fileName = '';
        let successMessage = '';
        
        // 根據不同格式設置文件名和成功消息
        switch(format) {
            case 'pdf':
                fileName = `納斯達克IPO資訊_${getCurrentDate()}.pdf`;
                successMessage = `已成功導出為PDF文件: ${fileName}`;
                break;
            case 'excel':
                fileName = `納斯達克IPO資訊_${getCurrentDate()}.xlsx`;
                successMessage = `已成功導出為Excel表格: ${fileName}`;
                break;
            case 'csv':
                fileName = `納斯達克IPO資訊_${getCurrentDate()}.csv`;
                successMessage = `已成功導出為CSV文件: ${fileName}`;
                break;
            case 'image':
                fileName = `納斯達克IPO資訊_${getCurrentDate()}.png`;
                successMessage = `已成功導出為圖片: ${fileName}`;
                break;
        }
        
        // 顯示成功通知
        showNotification('導出完成', successMessage, 'success');
        
        // 模擬下載
        simulateDownload(fileName, format);
    }, 1500);
}

// 獲取當前日期字符串 (YYYY-MM-DD)
function getCurrentDate() {
    const now = new Date();
    return now.getFullYear() + '-' + 
           String(now.getMonth() + 1).padStart(2, '0') + '-' + 
           String(now.getDate()).padStart(2, '0');
}

// 模擬文件下載
function simulateDownload(fileName, format) {
    // 創建一個臨時的a標籤來模擬下載
    const downloadLink = document.createElement('a');
    
    // 根據不同格式設置不同的模擬數據
    let content = '';
    let type = '';
    
    switch(format) {
        case 'pdf':
            // 對於PDF，我們只能模擬下載行為
            downloadLink.href = 'pdf/nasdaq_ipo_report_2025-04-10.pdf';
            type = 'application/pdf';
            break;
        case 'excel':
        case 'csv':
            // 創建一個簡單的CSV內容
            content = 'Company,Symbol,Legal Advisor,Auditor,Underwriter,Amount,Price\n';
            content += 'TechVision Inc.,TVSI,Latham & Watkins,Deloitte,Morgan Stanley,$220M,$22.00\n';
            content += 'GreenEnergy Solutions,GESO,Skadden Arps,PwC,Goldman Sachs,$92.5M,$18.50\n';
            content += 'HealthTech Innovations,HTIV,Davis Polk,KPMG,JP Morgan,$77.25M,$15.00\n';
            
            type = format === 'excel' ? 'application/vnd.ms-excel' : 'text/csv';
            downloadLink.href = 'data:' + type + ';charset=utf-8,' + encodeURIComponent(content);
            break;
        case 'image':
            // 對於圖片，我們只能模擬下載行為
            // 使用一個空白的1x1像素透明PNG
            downloadLink.href = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
            type = 'image/png';
            break;
    }
    
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// 通知功能 (如果已存在則使用現有的)
if (typeof showNotification !== 'function') {
    function showNotification(title, message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            </div>
            <div class="notification-content">
                <div class="notification-title">${title}</div>
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;
        
        document.body.appendChild(notification);
        
        // 添加關閉按鈕功能
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', function() {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // 添加動畫效果
        setTimeout(() => {
            notification.classList.add('notification-show');
        }, 10);
        
        // 自動關閉
        setTimeout(() => {
            notification.classList.add('notification-hiding');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
}
