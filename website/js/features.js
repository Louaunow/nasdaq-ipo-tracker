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

// 將HTML內容轉換為PDF
function convertToPdf(title, content) {
    // 在實際應用中，這裡會使用jsPDF或其他PDF生成庫
    // 這裡我們使用模擬功能
    console.log(`正在將 "${title}" 轉換為PDF...`);
    showNotification('PDF轉換', `正在將 "${title}" 轉換為PDF格式`, 'info');
    
    // 模擬PDF生成延遲
    setTimeout(() => {
        // 創建一個臨時鏈接來"下載"PDF
        const blob = new Blob([content], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title.replace(/\s+/g, '_')}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('PDF轉換', 'PDF已生成並開始下載', 'success');
    }, 1000);
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
    
    // 創建一個臨時鏈接來"下載"HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    showNotification('HTML轉換', 'HTML文件已生成並開始下載', 'success');
}

// 通過WhatsApp分享
function shareViaWhatsApp(title, url) {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' - ' + url)}`;
    window.open(whatsappUrl, '_blank');
}

// 通過微信分享
function shareViaWeChat(title, url) {
    // 由於微信網頁版API限制，我們顯示一個QR碼供用戶掃描
    showNotification('微信分享', '請使用微信掃描二維碼分享', 'info');
    
    // 創建一個模擬的QR碼彈出窗口
    const qrPopup = document.createElement('div');
    qrPopup.className = 'qr-popup';
    qrPopup.innerHTML = `
        <div class="qr-header">
            <h3>微信分享</h3>
            <button class="close-btn"><i class="fas fa-times"></i></button>
        </div>
        <div class="qr-body">
            <div class="qr-message">請使用微信掃描下方二維碼分享</div>
            <div class="qr-code">
                <i class="fas fa-qrcode fa-5x"></i>
                <div class="qr-loading">生成二維碼中...</div>
            </div>
            <div class="qr-title">${title}</div>
            <div class="qr-url">${url}</div>
        </div>
        <div class="qr-footer">
            <button class="btn btn-primary copy-link">複製鏈接</button>
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
        
        // 模擬QR碼加載
        setTimeout(() => {
            const qrLoading = qrPopup.querySelector('.qr-loading');
            if (qrLoading) {
                qrLoading.textContent = '掃描分享';
            }
        }, 1500);
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
    // 檢查是否在SEC規則詳情頁面
    const secRuleCard = document.querySelector('.dashboard-card .card-title .status-tag');
    
    if (secRuleCard) {
        const cardFooter = document.querySelector('.card-footer');
        if (cardFooter) {
            // 獲取規則標題
            const ruleTitle = document.querySelector('.card-title').textContent.trim();
            
            // 獲取規則內容
            const ruleContent = document.querySelector('.card-body').innerHTML;
            
            // 獲取當前頁面URL
            const pageUrl = window.location.href;
            
            // 創建分享容器
            const sharingContainer = addSharingFunctionality();
            
            // 插入到卡片底部
            cardFooter.appendChild(sharingContainer);
            
            // 添加事件監聽器
            const pdfShareBtn = cardFooter.querySelector('.pdf-share');
            if (pdfShareBtn) {
                pdfShareBtn.addEventListener('click', function() {
                    convertToPdf(ruleTitle, ruleContent);
                });
            }
            
            const htmlShareBtn = cardFooter.querySelector('.html-share');
            if (htmlShareBtn) {
                htmlShareBtn.addEventListener('click', function() {
                    convertToHtml(ruleTitle, ruleContent);
                });
            }
            
            const whatsappShareBtn = cardFooter.querySelector('.whatsapp-share');
            if (whatsappShareBtn) {
                whatsappShareBtn.addEventListener('click', function() {
                    shareViaWhatsApp(ruleTitle, pageUrl);
                });
            }
            
            const wechatShareBtn = cardFooter.querySelector('.wechat-share');
            if (wechatShareBtn) {
                wechatShareBtn.addEventListener('click', function() {
                    shareViaWeChat(ruleTitle, pageUrl);
                });
            }
            
            console.log('已添加SEC規則分享功能');
        }
    }
}

// 在頁面加載完成後初始化新功能
document.addEventListener('DOMContentLoaded', function() {
    // 初始化股票價格連結功能
    initializeStockPriceLinks();
    
    // 初始化SEC規則分享功能
    initializeSecRuleSharing();
});
