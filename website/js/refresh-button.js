// 刷新按鈕功能
function setupRefreshButton() {
    const refreshButton = document.querySelector('.btn-secondary i.fa-sync-alt')?.parentElement;
    
    if (refreshButton) {
        refreshButton.addEventListener('click', function() {
            // 顯示刷新中的通知
            showNotification('資料刷新', '正在更新資料...', 'info');
            
            // 更新最後更新時間戳
            updateLastUpdateTimestamp();
            
            // 延遲一下再重新載入頁面，讓用戶看到通知
            setTimeout(() => {
                location.reload();
            }, 1000);
        });
    }
}

// 更新最後更新時間戳
function updateLastUpdateTimestamp() {
    const now = new Date();
    const dateStr = now.getFullYear() + '-' + 
                   String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(now.getDate()).padStart(2, '0');
    const timeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                   String(now.getMinutes()).padStart(2, '0');
    
    // 將時間戳保存到本地存儲
    localStorage.setItem('lastUpdateTimestamp', `${dateStr} ${timeStr}`);
    localStorage.setItem('lastUpdateDate', dateStr);
    localStorage.setItem('lastUpdateTime', timeStr);
    
    // 直接更新頁面上的時間戳
    updateTopBarTimestamp(`${dateStr} ${timeStr}`);
    updateOverviewTimestamp(`${dateStr} ${timeStr}`);
    updatePdfLink(dateStr);
}

// 初始化時間戳顯示
function initializeTimestamp() {
    // 獲取當前日期作為默認值
    const now = new Date();
    const currentDateStr = now.getFullYear() + '-' + 
                          String(now.getMonth() + 1).padStart(2, '0') + '-' + 
                          String(now.getDate()).padStart(2, '0');
    const currentTimeStr = String(now.getHours()).padStart(2, '0') + ':' + 
                          String(now.getMinutes()).padStart(2, '0');
    
    // 檢查是否有保存的時間戳
    let savedTimestamp = localStorage.getItem('lastUpdateTimestamp');
    let savedDate = localStorage.getItem('lastUpdateDate');
    
    // 如果沒有保存的時間戳或日期不是今天，則使用當前日期時間
    if (!savedTimestamp || !savedDate || savedDate !== currentDateStr) {
        savedTimestamp = `${currentDateStr} ${currentTimeStr}`;
        savedDate = currentDateStr;
        
        // 保存新的時間戳
        localStorage.setItem('lastUpdateTimestamp', savedTimestamp);
        localStorage.setItem('lastUpdateDate', savedDate);
        localStorage.setItem('lastUpdateTime', currentTimeStr);
    }
    
    // 更新右上角的時間戳顯示
    updateTopBarTimestamp(savedTimestamp);
    
    // 更新今日IPO概覽中的時間戳
    updateOverviewTimestamp(savedTimestamp);
    
    // 更新PDF報告鏈接
    updatePdfLink(savedDate);
}

// 更新右上角的時間戳
function updateTopBarTimestamp(timestamp) {
    const topBarActions = document.querySelector('.top-bar-actions');
    if (topBarActions) {
        let topBarTimestamp = document.querySelector('.top-bar-timestamp');
        
        if (!topBarTimestamp) {
            topBarTimestamp = document.createElement('div');
            topBarTimestamp.className = 'top-bar-timestamp';
            topBarActions.prepend(topBarTimestamp);
        }
        
        topBarTimestamp.innerHTML = `<span class="badge badge-blue"><i class="fas fa-clock"></i> 最後更新: ${timestamp}</span>`;
    }
}

// 更新今日IPO概覽中的時間戳
function updateOverviewTimestamp(timestamp) {
    // 查找今日IPO概覽卡片中的時間戳
    const overviewCards = document.querySelectorAll('.dashboard-card');
    if (overviewCards && overviewCards.length > 0) {
        // 查找第一個卡片（今日IPO概覽）
        const overviewCard = overviewCards[0];
        const badgeBlue = overviewCard.querySelector('.badge.badge-blue');
        if (badgeBlue) {
            badgeBlue.innerHTML = `<i class="fas fa-clock"></i> 最後更新: ${timestamp}`;
        }
    }
}

// 更新PDF報告鏈接
function updatePdfLink(dateStr) {
    // 查找側邊欄中的PDF報告鏈接
    const pdfLink = document.querySelector('a.nav-link i.fa-file-pdf')?.parentElement;
    if (pdfLink) {
        pdfLink.href = `pdf/nasdaq_ipo_report_${dateStr}.pdf`;
    }
}

// 在文檔加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 設置刷新按鈕功能
    setupRefreshButton();
    
    // 初始化時間戳顯示
    initializeTimestamp();
});

// 通知功能
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
