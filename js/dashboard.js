// 納斯達克IPO追蹤網站 - 儀表板互動功能

document.addEventListener('DOMContentLoaded', function() {
    // 移動端導航切換
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileNavToggle) {
        mobileNavToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
            
            // 切換圖標
            const icon = this.querySelector('i');
            if (sidebar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // 添加淡入動畫
    const fadeElements = document.querySelectorAll('.dashboard-card, .metric-card, .notification-card');
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('fade-in');
                }, entry.target.dataset.delay || 0);
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // 為每個元素添加延遲，創建級聯效果
    fadeElements.forEach((element, index) => {
        element.dataset.delay = index * 100; // 每個元素延遲100ms
        fadeInObserver.observe(element);
    });
    
    // 主題切換功能
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
        // 檢查本地存儲中的主題偏好
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
        
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            
            // 切換圖標
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
                localStorage.setItem('theme', 'light');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
                localStorage.setItem('theme', 'dark');
            }
        });
    }
    
    // 搜索功能
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        // 添加焦點效果
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('search-focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('search-focused');
        });
        
        searchInput.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.toLowerCase();
                if (searchTerm.trim() !== '') {
                    // 實現搜索邏輯
                    searchIPOData(searchTerm);
                }
            }
        });
    }
    
    // 篩選按鈕功能
    const filterButtons = document.querySelectorAll('.btn-secondary');
    filterButtons.forEach(button => {
        if (button.querySelector('i.fa-filter')) {
            button.addEventListener('click', function() {
                // 實現篩選邏輯
                showFilterOptions();
            });
        }
    });
    
    // 添加卡片懸停效果
    const cards = document.querySelectorAll('.dashboard-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
            
            // 獲取卡片的邊框顏色並增強其發光效果
            const computedStyle = window.getComputedStyle(this);
            const borderColor = computedStyle.getPropertyValue('border-top-color');
            
            if (borderColor.includes('rgb(0, 200, 255)') || borderColor.includes('#00c8ff')) {
                this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 200, 255, 0.5)';
            } else if (borderColor.includes('rgb(162, 107, 250)') || borderColor.includes('#a26bfa')) {
                this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(162, 107, 250, 0.5)';
            } else if (borderColor.includes('rgb(0, 230, 118)') || borderColor.includes('#00e676')) {
                this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 230, 118, 0.5)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // 模擬搜索功能
    function searchIPOData(term) {
        console.log('搜索IPO資訊:', term);
        // 在實際應用中，這裡會實現搜索邏輯
        
        // 使用更現代的通知方式替代alert
        showNotification('搜索功能', '正在搜索 "' + term + '"', 'info');
    }
    
    // 模擬篩選功能
    function showFilterOptions() {
        console.log('顯示篩選選項');
        // 在實際應用中，這裡會顯示篩選選項
        
        // 創建一個模擬的篩選選項彈出窗口
        const filterPopup = document.createElement('div');
        filterPopup.className = 'filter-popup';
        filterPopup.innerHTML = `
            <div class="filter-header">
                <h3>篩選選項</h3>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="filter-body">
                <div class="filter-group">
                    <label>行業</label>
                    <select>
                        <option value="">全部</option>
                        <option value="tech">科技</option>
                        <option value="health">醫療健康</option>
                        <option value="finance">金融</option>
                        <option value="energy">能源</option>
                        <option value="consumer">消費品</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>募資金額</label>
                    <select>
                        <option value="">全部</option>
                        <option value="<50">< $50M</option>
                        <option value="50-100">$50M - $100M</option>
                        <option value="100-500">$100M - $500M</option>
                        <option value=">500"> > $500M</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>承銷商</label>
                    <select>
                        <option value="">全部</option>
                        <option value="morgan">Morgan Stanley</option>
                        <option value="goldman">Goldman Sachs</option>
                        <option value="jpmorgan">JP Morgan</option>
                        <option value="bofa">Bank of America</option>
                        <option value="citi">Citigroup</option>
                    </select>
                </div>
            </div>
            <div class="filter-footer">
                <button class="btn btn-secondary">重置</button>
                <button class="btn btn-primary">應用篩選</button>
            </div>
        `;
        
        document.body.appendChild(filterPopup);
        
        // 添加關閉按鈕功能
        const closeBtn = filterPopup.querySelector('.close-btn');
        closeBtn.addEventListener('click', function() {
            document.body.removeChild(filterPopup);
        });
        
        // 添加應用篩選按鈕功能
        const applyBtn = filterPopup.querySelector('.btn-primary');
        applyBtn.addEventListener('click', function() {
            showNotification('篩選功能', '已應用篩選條件', 'success');
            document.body.removeChild(filterPopup);
        });
        
        // 添加動畫效果
        setTimeout(() => {
            filterPopup.classList.add('show');
        }, 10);
    }
    
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
    
    // 初始化圖表（如果有Chart.js）
    initializeCharts();
    
    // 添加頁面載入完成的動畫效果
    document.body.classList.add('loaded');
});

// 初始化圖表
function initializeCharts() {
    // 檢查是否已加載Chart.js
    if (typeof Chart !== 'undefined') {
        // 設置全局配置
        Chart.defaults.color = getComputedStyle(document.documentElement).getPropertyValue('--secondary-text');
        Chart.defaults.borderColor = 'rgba(255, 255, 255, 0.05)';
        
        // 行業分佈圖表
        const industryChartElement = document.getElementById('industry-chart');
        if (industryChartElement) {
            const industryChart = new Chart(industryChartElement, {
                type: 'doughnut',
                data: {
                    labels: ['科技', '醫療健康', '金融', '能源', '消費品', '其他'],
                    datasets: [{
                        data: [35, 20, 15, 10, 10, 10],
                        backgroundColor: [
                            'rgba(0, 200, 255, 0.7)',
                            'rgba(162, 107, 250, 0.7)',
                            'rgba(255, 61, 154, 0.7)',
                            'rgba(0, 230, 118, 0.7)',
                            'rgba(255, 159, 67, 0.7)',
                            'rgba(108, 117, 125, 0.7)'
                        ],
                        borderWidth: 0,
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text'),
                                padding: 15,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            padding: 10,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    animation: {
                        animateScale: true,
                        animateRotate: true,
                        duration: 2000,
                        easing: 'easeOutQuart'
                    }
                }
            });
        }
        
        // 募資金額趨勢圖表
        const fundingChartElement = document.getElementById('funding-chart');
        if (fundingChartElement) {
            const fundingChart = new Chart(fundingChartElement, {
                type: 'line',
                data: {
                    labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
                    datasets: [{
                        label: '募資金額 (百萬美元)',
                        data: [250, 320, 280, 500, 420, 380],
                        borderColor: 'rgba(0, 200, 255, 1)',
                        backgroundColor: 'rgba(0, 200, 255, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4,
                        pointBackgroundColor: 'rgba(0, 200, 255, 1)',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(0, 200, 255, 1)',
                        pointHoverBorderWidth: 3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text'),
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                            titleColor: '#fff',
                            bodyColor: '#fff',
                            padding: 10,
                            cornerRadius: 8,
                            displayColors: false
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text'),
                                padding: 10
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)',
                                drawBorder: false
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text'),
                                padding: 10
                            },
                            beginAtZero: true
                        }
                    },
                    animation: {
                        duration: 2000,
                        easing: 'easeOutQuart'
                    },
                    interaction: {
                        mode: 'index',
                        intersect: false
                    },
                    elements: {
                        line: {
                            borderJoinStyle: 'round'
                        }
                    }
                }
            });
        }
    }
}

// 添加CSS樣式
const style = document.createElement('style');
style.textContent = `
    /* 通知樣式 */
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        display: flex;
        align-items: center;
        background-color: var(--card-bg);
        border-radius: 8px;
        padding: 15px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transform: translateX(120%);
        transition: transform 0.3s ease, opacity 0.3s ease;
        opacity: 0;
        max-width: 350px;
    }
    
    .notification-show {
        transform: translateX(0);
        opacity: 1;
    }
    
    .notification-hiding {
        transform: translateX(120%);
        opacity: 0;
    }
    
    .notification-icon {
        margin-right: 15px;
        font-size: 1.5rem;
    }
    
    .notification-success .notification-icon {
        color: var(--success);
    }
    
    .notification-error .notification-icon {
        color: var(--danger);
    }
    
    .notification-info .notification-icon {
        color: var(--info);
    }
    
    .notification-content {
        flex: 1;
    }
    
    .notification-title {
        font-weight: 600;
        margin-bottom: 5px;
    }
    
    .notification-message {
        font-size: 0.9rem;
        color: var(--secondary-text);
    }
    
    .notification-close {
        background: none;
        border: none;
        color: var(--muted-text);
        cursor: pointer;
        padding: 5px;
        margin-left: 10px;
        font-size: 0.9rem;
    }
    
    .notification-close:hover {
        color: var(--primary-text);
    }
    
    /* 篩選彈窗樣式 */
    .filter-popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background-color: var(--card-bg);
        border-radius: 12px;
        padding: 20px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        width: 400px;
        max-width: 90vw;
        opacity: 0;
        transition: all 0.3s ease;
    }
    
    .filter-popup.show {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
    }
    
    .filter-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        padding-bottom: 10px;
        border-bottom: 1px solid var(--border-color);
    }
    
    .filter-header h3 {
        margin: 0;
        font-size: 1.2rem;
    }
    
    .close-btn {
        background: none;
        border: none;
        color: var(--muted-text);
        cursor: pointer;
        font-size: 1rem;
    }
    
    .close-btn:hover {
        color: var(--primary-text);
    }
    
    .filter-body {
        margin-bottom: 20px;
    }
    
    .filter-group {
        margin-bottom: 15px;
    }
    
    .filter-group label {
        display: block;
        margin-bottom: 5px;
        font-size: 0.9rem;
        color: var(--secondary-text);
    }
    
    .filter-group select {
        width: 100%;
        padding: 10px;
        border-radius: 6px;
        border: 1px solid var(--border-color);
        background-color: var(--secondary-bg);
        color: var(--primary-text);
        font-size: 0.9rem;
    }
    
    .filter-footer {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    /* 頁面載入動畫 */
    body:not(.loaded) .dashboard-card,
    body:not(.loaded) .metric-card,
    body:not(.loaded) .notification-card {
        opacity: 0;
        transform: translateY(20px);
    }
    
    body.loaded .dashboard-card,
    body.loaded .metric-card,
    body.loaded .notification-card {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    /* 搜索框焦點效果 */
    .search-bar.search-focused .search-input {
        box-shadow: 0 0 0 2px var(--accent-blue), inset 0 0 5px rgba(0, 0, 0, 0.2);
    }
    
    .search-bar.search-focused .search-icon {
        color: var(--accent-blue);
    }
`;

document.head.appendChild(style);
