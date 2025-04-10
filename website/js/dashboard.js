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
                entry.target.classList.add('fade-in');
                fadeInObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    fadeElements.forEach(element => {
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
    
    // 模擬搜索功能
    function searchIPOData(term) {
        console.log('搜索IPO資訊:', term);
        // 在實際應用中，這裡會實現搜索邏輯
        alert('搜索功能: 正在搜索 "' + term + '"');
    }
    
    // 模擬篩選功能
    function showFilterOptions() {
        console.log('顯示篩選選項');
        // 在實際應用中，這裡會顯示篩選選項
        alert('篩選功能: 顯示篩選選項');
    }
    
    // 初始化圖表（如果有Chart.js）
    initializeCharts();
});

// 初始化圖表
function initializeCharts() {
    // 檢查是否已加載Chart.js
    if (typeof Chart !== 'undefined') {
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
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'right',
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')
                            }
                        }
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
                        borderWidth: 2,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            labels: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')
                            }
                        }
                    },
                    scales: {
                        x: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')
                            }
                        },
                        y: {
                            grid: {
                                color: 'rgba(255, 255, 255, 0.05)'
                            },
                            ticks: {
                                color: getComputedStyle(document.documentElement).getPropertyValue('--secondary-text')
                            }
                        }
                    }
                }
            });
        }
    }
}
