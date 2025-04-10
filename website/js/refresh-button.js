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
    
    // 更新時間戳顯示
    const timestampElement = document.querySelector('.badge-blue');
    if (timestampElement) {
        timestampElement.innerHTML = `<i class="fas fa-clock"></i> 最後更新: ${dateStr} ${timeStr}`;
    }
    
    // 在右上角添加時間戳顯示（如果不存在）
    const topBarActions = document.querySelector('.top-bar-actions');
    if (topBarActions) {
        let topBarTimestamp = document.querySelector('.top-bar-timestamp');
        
        if (!topBarTimestamp) {
            topBarTimestamp = document.createElement('div');
            topBarTimestamp.className = 'top-bar-timestamp';
            topBarActions.prepend(topBarTimestamp);
        }
        
        topBarTimestamp.innerHTML = `<span class="badge badge-blue"><i class="fas fa-clock"></i> 最後更新: ${dateStr} ${timeStr}</span>`;
    }
    
    // 將時間戳保存到本地存儲
    localStorage.setItem('lastUpdateTimestamp', `${dateStr} ${timeStr}`);
}

// 初始化時間戳顯示
function initializeTimestamp() {
    // 檢查是否有保存的時間戳
    const savedTimestamp = localStorage.getItem('lastUpdateTimestamp');
    
    if (savedTimestamp) {
        // 在右上角添加時間戳顯示
        const topBarActions = document.querySelector('.top-bar-actions');
        if (topBarActions) {
            let topBarTimestamp = document.querySelector('.top-bar-timestamp');
            
            if (!topBarTimestamp) {
                topBarTimestamp = document.createElement('div');
                topBarTimestamp.className = 'top-bar-timestamp';
                topBarActions.prepend(topBarTimestamp);
            }
            
            topBarTimestamp.innerHTML = `<span class="badge badge-blue"><i class="fas fa-clock"></i> 最後更新: ${savedTimestamp}</span>`;
        }
    } else {
        // 如果沒有保存的時間戳，則創建一個新的
        updateLastUpdateTimestamp();
    }
}

// 在文檔加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
    // 設置刷新按鈕功能
    setupRefreshButton();
    
    // 初始化時間戳顯示
    initializeTimestamp();
});
