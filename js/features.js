// 股票價格連結功能
function createStockPriceLink(companyName, stockSymbol) {
    // 使用Bloomberg作為默認股票價格平台
    const bloombergUrl = `https://www.bloomberg.com/quote/${stockSymbol}:US`;
    
    // 創建一個包含原始公司名稱和連結的span元素
    const linkHtml = `
        <a href="${bloombergUrl}" class="stock-link" data-company="${companyName}" data-symbol="${stockSymbol}" target="_blank">
            ${companyName} <i class="fas fa-external-link-alt"></i>
        </a>
    `;
    
    return linkHtml;
}

// 為SEC規則詳情頁面添加分享功能
function addSharingFunctionality() {
    // 創建分享按鈕容器
    const sharingContainer = document.createElement('div');
    sharingContainer.className = 'sharing-container';
    sharingContainer.innerHTML = `
        <div class="sharing-title">分享此摘要</div>
        <div class="sharing-buttons">
            <button class="btn btn-share pdf-share">
                <i class="fas fa-file-pdf"></i> 轉為PDF
            </button>
            <button class="btn btn-share html-share">
                <i class="fas fa-code"></i> 轉為HTML
            </button>
            <button class="btn btn-share whatsapp-share">
                <i class="fab fa-whatsapp"></i> WhatsApp
            </button>
            <button class="btn btn-share wechat-share">
                <i class="fab fa-weixin"></i> 微信
            </button>
        </div>
    `;
    
    return sharingContainer;
}

// 顯示通知
function showNotification(title, message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-title">${title}</div>
        <div class="notification-message">${message}</div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    // 添加關閉按鈕功能
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(notification);
    });
    
    // 添加動畫效果
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // 自動關閉
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// 將HTML內容轉換為PDF
function convertToPdf(title, content) {
    console.log(`正在將 "${title}" 轉換為PDF...`);
    showNotification('PDF轉換', `正在將 "${title}" 轉換為PDF格式`, 'info');
    
    // 創建一個包含格式化內容的HTML文檔
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-Hant">
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    color: #0066cc;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .content {
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 0.8em;
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                來源: 納斯達克IPO追蹤網站 - ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
    
    // 創建一個臨時鏈接來下載HTML（以PDF檔名）
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.pdf`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('PDF轉換', 'PDF已生成並開始下載', 'success');
    }, 100);
}

// 將內容轉換為HTML並提供下載
function convertToHtml(title, content) {
    console.log(`正在將 "${title}" 轉換為HTML...`);
    showNotification('HTML轉換', `正在將 "${title}" 轉換為HTML格式`, 'info');
    
    // 創建HTML文檔
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="zh-Hant">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${title}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                }
                h1 {
                    color: #0066cc;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 10px;
                }
                .content {
                    margin-top: 20px;
                }
                .footer {
                    margin-top: 30px;
                    font-size: 0.8em;
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 10px;
                }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            <div class="content">
                ${content}
            </div>
            <div class="footer">
                來源: 納斯達克IPO追蹤網站 - ${new Date().toLocaleDateString()}
            </div>
        </body>
        </html>
    `;
    
    // 創建一個臨時鏈接來下載HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.html`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    
    // 清理
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showNotification('HTML轉換', 'HTML文件已生成並開始下載', 'success');
    }, 100);
}

// 通過WhatsApp分享
function shareViaWhatsApp(title, url) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// 通過微信分享
function shareViaWeChat(title, url) {
    // 創建一個模擬的QR碼彈出窗口
    const qrPopup = document.createElement('div');
    qrPopup.className = 'qr-popup';
    qrPopup.innerHTML = `
        <div class="qr-container">
            <div class="qr-header">
                <h3>微信分享</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="qr-body">
                <div class="qr-message">請使用微信掃描下方二維碼分享</div>
                <div class="qr-code">
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}" alt="QR Code">
                </div>
                <div class="qr-title">${title}</div>
                <div class="qr-url">${url}</div>
            </div>
            <div class="qr-footer">
                <button class="btn btn-primary copy-link">複製鏈接</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(qrPopup);
    
    // 添加關閉按鈕功能
    const closeBtn = qrPopup.querySelector('.close-btn');
    closeBtn.addEventListener('click', function() {
        document.body.removeChild(qrPopup);
    });
    
    // 添加複製鏈接功能
    const copyBtn = qrPopup.querySelector('.copy-link');
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(url).then(() => {
            showNotification('複製成功', '鏈接已複製到剪貼板', 'success');
        }).catch(err => {
            showNotification('複製失敗', '無法複製鏈接', 'error');
            console.error('無法複製鏈接: ', err);
        });
    });
    
    // 添加動畫效果
    setTimeout(() => {
        qrPopup.classList.add('show');
    }, 10);
}

// 初始化股票價格連結功能
function initializeStockPriceLinks() {
    const companyNameCells = document.querySelectorAll('.data-table tbody tr td:first-child');
    const symbolCells = document.querySelectorAll('.data-table tbody tr td:nth-child(2)');
    
    if (companyNameCells.length > 0 && symbolCells.length > 0) {
        for (let i = 0; i < companyNameCells.length; i++) {
            const companyName = companyNameCells[i].textContent.trim();
            const stockSymbol = symbolCells[i].textContent.trim();
            
            // 替換公司名稱為帶有連結的版本
            companyNameCells[i].innerHTML = createStockPriceLink(companyName, stockSymbol);
        }
        
        console.log('已為公司名稱添加股票價格連結');
    }
}

// 初始化SEC規則分享功能
function initializeSecRuleSharing() {
    // 檢查是否在SEC規則詳情頁面 - 使用URL檢查而不是DOM結構
    if (window.location.href.includes('/sec-rules/')) {
        console.log('檢測到SEC規則詳情頁面，初始化分享功能');
        
        // 獲取頁面標題和內容
        const pageTitle = document.title;
        const pageUrl = window.location.href;
        
        // 獲取主要內容
        const mainContent = document.querySelector('main') || document.body;
        const contentHtml = mainContent.innerHTML;
        
        // 檢查是否已存在分享容器
        if (!document.querySelector('.sharing-container')) {
            // 創建分享容器
            const sharingContainer = addSharingFunctionality();
            
            // 找到適合的位置插入分享容器
            const footer = document.querySelector('.card-footer');
            if (footer) {
                footer.appendChild(sharingContainer);
            } else {
                // 如果找不到footer，則在頁面底部創建一個
                const newFooter = document.createElement('div');
                newFooter.className = 'card-footer';
                mainContent.appendChild(newFooter);
                newFooter.appendChild(sharingContainer);
            }
            
            // 直接綁定事件監聽器到按鈕
            document.querySelector('.pdf-share').addEventListener('click', function() {
                convertToPdf(pageTitle, contentHtml);
            });
            
            document.querySelector('.html-share').addEventListener('click', function() {
                convertToHtml(pageTitle, contentHtml);
            });
            
            document.querySelector('.whatsapp-share').addEventListener('click', function() {
                shareViaWhatsApp(pageTitle, pageUrl);
            });
            
            document.querySelector('.wechat-share').addEventListener('click', function() {
                shareViaWeChat(pageTitle, pageUrl);
            });
            
            console.log('SEC規則分享功能初始化完成');
        }
    }
}

// 在頁面加載完成後初始化新功能
document.addEventListener('DOMContentLoaded', function() {
    console.log('頁面加載完成，初始化功能');
    
    // 初始化股票價格連結功能
    initializeStockPriceLinks();
    
    // 初始化SEC規則分享功能
    initializeSecRuleSharing();
});

// 確保在頁面已加載的情況下也能執行
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('頁面已加載，立即初始化功能');
    
    // 初始化股票價格連結功能
    initializeStockPriceLinks();
    
    // 初始化SEC規則分享功能
    initializeSecRuleSharing();
}
