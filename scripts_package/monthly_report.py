#!/usr/bin/env python3
"""
納斯達克IPO月度報表生成模組
用於生成納斯達克IPO月度綜合報表
"""

import os
import datetime
import calendar
from scripts.history_storage import IPOHistoryStorage

def generate_monthly_report(base_dir=None, year_month=None):
    """
    生成月度綜合報表
    
    Args:
        base_dir: 專案基礎目錄，如果為None則使用當前目錄的父目錄
        year_month: 年月字符串，格式為YYYY-MM，如果為None則使用上個月
    
    Returns:
        str: 月度報表路徑
    """
    if base_dir is None:
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    if year_month is None:
        # 獲取上個月的年月
        today = datetime.datetime.now()
        last_month = today.replace(day=1) - datetime.timedelta(days=1)
        year_month = last_month.strftime("%Y-%m")
    
    # 初始化歷史儲存
    storage = IPOHistoryStorage(base_dir)
    
    # 生成月度報表
    report_path = storage.generate_monthly_report(year_month)
    
    # 更新網站以包含月度報表
    update_website_for_monthly_report(base_dir, year_month, report_path)
    
    return report_path

def update_website_for_monthly_report(base_dir, year_month, report_path):
    """
    更新網站以包含月度報表
    
    Args:
        base_dir: 專案基礎目錄
        year_month: 年月字符串，格式為YYYY-MM
        report_path: 月度報表路徑
    """
    website_dir = os.path.join(base_dir, "website")
    monthly_dir = os.path.join(website_dir, "monthly")
    os.makedirs(monthly_dir, exist_ok=True)
    
    # 複製月度報表到網站目錄
    import shutil
    report_filename = os.path.basename(report_path)
    shutil.copy2(report_path, os.path.join(monthly_dir, report_filename))
    
    # 更新網站首頁以包含月度報表連結
    update_index_html(website_dir, monthly_dir)
    
    # 創建月度報表頁面
    create_monthly_reports_page(website_dir, monthly_dir)

def update_index_html(website_dir, monthly_dir):
    """
    更新網站首頁以包含月度報表連結
    
    Args:
        website_dir: 網站目錄
        monthly_dir: 月度報表目錄
    """
    index_path = os.path.join(website_dir, "index.html")
    
    if not os.path.exists(index_path):
        print(f"網站首頁不存在: {index_path}")
        return
    
    with open(index_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 檢查是否已經有月度報表連結
    if '<a href="monthly_reports.html"' in content:
        return
    
    # 在歷史記錄部分之前添加月度報表部分
    archives_section = '<section class="archives">'
    monthly_section = '''
        <section class="monthly-reports">
            <h2>月度綜合報表</h2>
            <div class="action-buttons">
                <a href="monthly_reports.html" class="btn">查看月度報表</a>
            </div>
        </section>
        
    '''
    
    content = content.replace(archives_section, monthly_section + archives_section)
    
    with open(index_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已更新網站首頁以包含月度報表連結: {index_path}")

def create_monthly_reports_page(website_dir, monthly_dir):
    """
    創建月度報表頁面
    
    Args:
        website_dir: 網站目錄
        monthly_dir: 月度報表目錄
    """
    # 獲取所有月度報表
    import glob
    report_files = glob.glob(os.path.join(monthly_dir, "monthly_report_*.pdf"))
    
    # 按日期排序
    report_files.sort(reverse=True)
    
    # 創建月度報表頁面
    monthly_reports_html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>納斯達克IPO月度報表</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><i class="fas fa-chart-line"></i> 納斯達克IPO月度報表</h1>
            <p>每月綜合分析納斯達克新上市股票資訊和SEC規則變更</p>
        </div>
    </header>
    
    <main class="container">
        <div class="back-link">
            <a href="index.html"><i class="fas fa-arrow-left"></i> 返回首頁</a>
        </div>
        
        <section class="monthly-reports-list">
            <h2>月度綜合報表</h2>
            <p>以下是納斯達克IPO的月度綜合報表，包含每月IPO趨勢分析和詳細資訊。</p>
            
            <div class="reports-grid">
"""
    
    # 添加月度報表
    for report_file in report_files:
        report_filename = os.path.basename(report_file)
        year_month = report_filename.replace("monthly_report_", "").replace(".pdf", "")
        year, month = year_month.split("-")
        
        # 獲取月份名稱
        month_name = {
            '01': '一月', '02': '二月', '03': '三月', '04': '四月',
            '05': '五月', '06': '六月', '07': '七月', '08': '八月',
            '09': '九月', '10': '十月', '11': '十一月', '12': '十二月'
        }[month]
        
        monthly_reports_html += f"""
                <div class="report-card">
                    <div class="report-icon">
                        <i class="fas fa-file-pdf"></i>
                    </div>
                    <div class="report-info">
                        <h3>{year}年{month_name}</h3>
                        <p>納斯達克IPO月度綜合報表</p>
                        <a href="monthly/{report_filename}" class="btn" download><i class="fas fa-download"></i> 下載報表</a>
                    </div>
                </div>
"""
    
    monthly_reports_html += """
            </div>
        </section>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; 2025 納斯達克IPO更新. 資料來源: 納斯達克官方網站和SEC EDGAR系統.</p>
        </div>
    </footer>
</body>
</html>
"""
    
    # 寫入月度報表頁面
    with open(os.path.join(website_dir, "monthly_reports.html"), 'w', encoding='utf-8') as f:
        f.write(monthly_reports_html)
    
    # 更新CSS以支持月度報表頁面
    update_css_for_monthly_reports(website_dir)
    
    print(f"已創建月度報表頁面: {os.path.join(website_dir, 'monthly_reports.html')}")

def update_css_for_monthly_reports(website_dir):
    """
    更新CSS以支持月度報表頁面
    
    Args:
        website_dir: 網站目錄
    """
    css_path = os.path.join(website_dir, "css", "style.css")
    
    if not os.path.exists(css_path):
        print(f"CSS文件不存在: {css_path}")
        return
    
    with open(css_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 檢查是否已經有月度報表樣式
    if '.reports-grid' in content:
        return
    
    # 添加月度報表樣式
    monthly_reports_css = """
/* 月度報表樣式 */
.monthly-reports {
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 5px;
    box-shadow: var(--shadow);
    text-align: center;
    margin-bottom: 2rem;
}

.reports-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 2rem;
}

.report-card {
    background-color: var(--card-bg);
    border-radius: 5px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
    display: flex;
    align-items: center;
    transition: transform 0.3s;
}

.report-card:hover {
    transform: translateY(-5px);
}

.report-icon {
    font-size: 2.5rem;
    color: var(--primary-color);
    margin-right: 1.5rem;
}

.report-info {
    flex: 1;
}

.report-info h3 {
    margin-bottom: 0.5rem;
    color: var(--primary-color);
}

.report-info p {
    color: var(--light-text);
    margin-bottom: 1rem;
}

@media (max-width: 768px) {
    .reports-grid {
        grid-template-columns: 1fr;
    }
}
"""
    
    content += monthly_reports_css
    
    with open(css_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已更新CSS以支持月度報表頁面: {css_path}")

if __name__ == "__main__":
    # 如果直接執行此腳本，生成上個月的月度報表
    report_path = generate_monthly_report()
    print(f"月度報表已生成: {report_path}")
