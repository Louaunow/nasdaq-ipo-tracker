#!/usr/bin/env python3
"""
納斯達克IPO資訊網站生成腳本
用於收集納斯達克新上市股票的資訊並生成網站
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import datetime
import os
import sys
from urllib.parse import urljoin
import time

# 設定請求頭，模擬瀏覽器訪問
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Connection': 'keep-alive',
    'Referer': 'https://www.nasdaq.com/'
}

# 納斯達克IPO日曆URL
NASDAQ_IPO_URL = 'https://www.nasdaq.com/market-activity/ipos'

# SEC EDGAR搜索URL
SEC_EDGAR_URL = 'https://www.sec.gov/edgar/search/'

# SEC最新規則變更URL
SEC_RULES_URL = 'https://www.sec.gov/rules/proposed.shtml'
SEC_FINAL_RULES_URL = 'https://www.sec.gov/rules/final.shtml'

def get_nasdaq_ipo_data():
    """
    從納斯達克官方網站獲取IPO日曆資訊
    返回即將上市的IPO列表
    """
    print("正在獲取納斯達克IPO日曆資訊...")
    
    try:
        response = requests.get(NASDAQ_IPO_URL, headers=HEADERS)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # 尋找IPO表格
        upcoming_ipos = []
        
        # 找到表格行
        table_rows = soup.select('table tbody tr')
        
        if not table_rows:
            print("未找到IPO表格，可能網站結構已變更")
            return []
        
        for row in table_rows:
            try:
                columns = row.find_all('td')
                if len(columns) >= 6:  # 確保有足夠的列
                    symbol = columns[0].text.strip()
                    company_name = columns[1].text.strip()
                    exchange = columns[2].text.strip()
                    price = columns[3].text.strip()
                    shares = columns[4].text.strip()
                    expected_date = columns[5].text.strip()
                    offer_amount = columns[6].text.strip() if len(columns) > 6 else "N/A"
                    
                    ipo_info = {
                        'symbol': symbol,
                        'company_name': company_name,
                        'exchange': exchange,
                        'price': price,
                        'shares': shares,
                        'expected_date': expected_date,
                        'offer_amount': offer_amount,
                        'legal_firm': "需從SEC文件獲取",
                        'auditor': "需從SEC文件獲取",
                        'underwriter': "需從SEC文件獲取"
                    }
                    
                    upcoming_ipos.append(ipo_info)
            except Exception as e:
                print(f"處理IPO行時出錯: {e}")
                continue
        
        print(f"找到 {len(upcoming_ipos)} 個即將上市的IPO")
        return upcoming_ipos
    
    except Exception as e:
        print(f"獲取納斯達克IPO資訊時出錯: {e}")
        return []

def get_sec_filing_info(symbol, company_name):
    """
    從SEC EDGAR系統獲取公司的S-1文件資訊
    返回法律顧問、審計師和承銷商資訊
    """
    print(f"正在獲取 {symbol} ({company_name}) 的SEC文件資訊...")
    
    try:
        # 構建搜索查詢
        search_term = f"{company_name} S-1"
        search_url = f"{SEC_EDGAR_URL}#/q={search_term}"
        
        response = requests.get(search_url, headers=HEADERS)
        response.raise_for_status()
        
        # 這裡需要更複雜的解析邏輯來從SEC網站獲取資訊
        # 由於SEC網站使用JavaScript動態加載內容，可能需要使用Selenium等工具
        # 這裡僅作為示例，返回模擬數據
        
        return {
            'legal_firm': "需手動查詢S-1文件",
            'auditor': "需手動查詢S-1文件",
            'underwriter': "需手動查詢S-1文件"
        }
    
    except Exception as e:
        print(f"獲取SEC文件資訊時出錯: {e}")
        return {
            'legal_firm': "獲取失敗",
            'auditor': "獲取失敗",
            'underwriter': "獲取失敗"
        }

def get_sec_rule_changes():
    """
    獲取SEC關於IPO的規則和法規變更
    返回最近的規則變更列表
    """
    print("正在獲取SEC規則變更資訊...")
    
    rule_changes = []
    
    try:
        # 獲取提議中的規則
        proposed_response = requests.get(SEC_RULES_URL, headers=HEADERS)
        proposed_response.raise_for_status()
        proposed_soup = BeautifulSoup(proposed_response.text, 'html.parser')
        
        # 獲取最終規則
        final_response = requests.get(SEC_FINAL_RULES_URL, headers=HEADERS)
        final_response.raise_for_status()
        final_soup = BeautifulSoup(final_response.text, 'html.parser')
        
        # 解析提議中的規則
        proposed_rules = parse_sec_rules(proposed_soup, "提議中")
        rule_changes.extend(proposed_rules)
        
        # 解析最終規則
        final_rules = parse_sec_rules(final_soup, "最終")
        rule_changes.extend(final_rules)
        
        # 過濾與IPO相關的規則
        ipo_related_rules = [
            rule for rule in rule_changes 
            if any(keyword in rule['title'].lower() for keyword in ['ipo', 'initial public offering', 'securities offering', 'registration', 'form s-1'])
        ]
        
        print(f"找到 {len(ipo_related_rules)} 個與IPO相關的SEC規則變更")
        return ipo_related_rules
    
    except Exception as e:
        print(f"獲取SEC規則變更時出錯: {e}")
        return []

def parse_sec_rules(soup, rule_type):
    """
    解析SEC規則頁面，提取規則變更資訊
    """
    rules = []
    
    try:
        # 尋找規則表格或列表
        rule_items = soup.select('ul.list-unstyled li') or soup.select('table tbody tr')
        
        for item in rule_items:
            try:
                # 提取規則標題和日期
                title_elem = item.find('a') or item.find('td')
                if not title_elem:
                    continue
                
                title = title_elem.text.strip()
                
                # 提取日期
                date_text = item.text
                date_match = re.search(r'(\d{1,2}/\d{1,2}/\d{4})', date_text)
                date = date_match.group(1) if date_match else "日期未知"
                
                # 提取鏈接
                link = title_elem.get('href', '')
                if link and not link.startswith('http'):
                    link = urljoin('https://www.sec.gov/', link)
                
                rules.append({
                    'title': title,
                    'date': date,
                    'type': rule_type,
                    'link': link
                })
            except Exception as e:
                print(f"解析規則項目時出錯: {e}")
                continue
    
    except Exception as e:
        print(f"解析SEC規則頁面時出錯: {e}")
    
    return rules

def generate_html(ipos, rule_changes, output_dir):
    """
    生成HTML網站
    """
    today = datetime.datetime.now()
    today_str = today.strftime("%Y年%m月%d日")
    today_file = today.strftime("%Y-%m-%d")
    
    # 創建index.html
    index_html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>納斯達克IPO每日更新</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><i class="fas fa-chart-line"></i> 納斯達克IPO每日更新</h1>
            <p>每日更新納斯達克新上市股票資訊和SEC規則變更</p>
        </div>
    </header>
    
    <main class="container">
        <section class="latest-update">
            <h2>最新更新: {today_str}</h2>
            <a href="archives/{today_file}.html" class="btn">查看今日更新</a>
        </section>
        
        <section class="archives">
            <h2>歷史記錄</h2>
            <ul class="archive-list">
                <li><a href="archives/{today_file}.html">{today_str}</a></li>
            </ul>
        </section>
    </main>
    
    <footer>
        <div class="container">
            <p>&copy; {today.year} 納斯達克IPO更新. 資料來源: 納斯達克官方網站和SEC EDGAR系統.</p>
        </div>
    </footer>
</body>
</html>
"""
    
    # 創建當日更新頁面
    daily_html = f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>納斯達克IPO更新 - {today_str}</title>
    <link rel="stylesheet" href="../css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css">
</head>
<body>
    <header>
        <div class="container">
            <h1><i class="fas fa-chart-line"></i> 納斯達克IPO每日更新</h1>
            <p>每日更新納斯達克新上市股票資訊和SEC規則變更</p>
        </div>
    </header>
    
    <main class="container">
        <div class="back-link">
            <a href="../index.html"><i class="fas fa-arrow-left"></i> 返回首頁</a>
        </div>
        
        <section class="update-date">
            <h2>{today_str}更新</h2>
            <p>更新時間: {today.strftime("%H:%M:%S")}</p>
        </section>
        
        <section class="ipo-list">
            <h2><i class="fas fa-rocket"></i> 即將上市的股票</h2>
"""
    
    if ipos:
        for ipo in ipos:
            daily_html += f"""
            <div class="ipo-card">
                <h3>{ipo['company_name']} ({ipo['symbol']})</h3>
                <div class="ipo-details">
                    <p><strong>交易所:</strong> {ipo['exchange']}</p>
                    <p><strong>預期上市日期:</strong> {ipo['expected_date']}</p>
                    <p><strong>發行價格:</strong> {ipo['price']}</p>
                    <p><strong>發行股數:</strong> {ipo['shares']}</p>
                    <p><strong>募資金額:</strong> {ipo['offer_amount']}</p>
                    <p><strong>法律顧問:</strong> {ipo['legal_firm']}</p>
                    <p><strong>審計師:</strong> {ipo['auditor']}</p>
                    <p><strong>承銷商:</strong> {ipo['underwriter']}</p>
                </div>
            </div>
"""
    else:
        daily_html += """
            <div class="no-data">
                <p>暫無新上市股票</p>
            </div>
"""
    
    daily_html += """
        </section>
        
        <section class="sec-rules">
            <h2><i class="fas fa-gavel"></i> SEC規則變更</h2>
"""
    
    if rule_changes:
        for rule in rule_changes:
            daily_html += f"""
            <div class="rule-card">
                <h3>{rule['title']}</h3>
                <div class="rule-details">
                    <p><strong>類型:</strong> {rule['type']}規則</p>
                    <p><strong>日期:</strong> {rule['date']}</p>
                    {f'<p><a href="{rule["link"]}" target="_blank" class="btn">查看詳情 <i class="fas fa-external-link-alt"></i></a></p>' if rule['link'] else ''}
                </div>
            </div>
"""
    else:
        daily_html += """
            <div class="no-data">
                <p>暫無新規則變更</p>
            </div>
"""
    
    daily_html += """
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
    
    # 創建CSS樣式
    css = """
:root {
    --primary-color: #0a66c2;
    --secondary-color: #1e88e5;
    --accent-color: #00a651;
    --text-color: #333;
    --light-text: #666;
    --bg-color: #f8f9fa;
    --card-bg: #fff;
    --border-color: #e0e0e0;
    --shadow: 0 2px 5px rgba(0,0,0,0.1);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background-color: var(--bg-color);
}

.container {
    width: 90%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

header {
    background-color: var(--primary-color);
    color: white;
    padding: 2rem 0;
    margin-bottom: 2rem;
    box-shadow: var(--shadow);
}

header h1 {
    margin-bottom: 0.5rem;
}

header p {
    opacity: 0.9;
}

h1, h2, h3 {
    line-height: 1.3;
}

h2 {
    margin-bottom: 1.5rem;
    color: var(--primary-color);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: 0.5rem;
}

section {
    margin-bottom: 3rem;
}

.latest-update {
    background-color: var(--card-bg);
    padding: 2rem;
    border-radius: 5px;
    box-shadow: var(--shadow);
    text-align: center;
}

.btn {
    display: inline-block;
    background-color: var(--accent-color);
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    margin-top: 1rem;
    transition: background-color 0.3s;
}

.btn:hover {
    background-color: #008c44;
}

.archive-list {
    list-style: none;
}

.archive-list li {
    margin-bottom: 0.5rem;
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 0.5rem;
}

.archive-list a {
    color: var(--secondary-color);
    text-decoration: none;
    transition: color 0.3s;
}

.archive-list a:hover {
    color: var(--primary-color);
}

.back-link {
    margin-bottom: 2rem;
}

.back-link a {
    color: var(--secondary-color);
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    transition: color 0.3s;
}

.back-link a:hover {
    color: var(--primary-color);
}

.back-link i {
    margin-right: 0.5rem;
}

.update-date {
    margin-bottom: 2rem;
}

.update-date p {
    color: var(--light-text);
}

.ipo-card, .rule-card {
    background-color: var(--card-bg);
    border-radius: 5px;
    box-shadow: var(--shadow);
    padding: 1.5rem;
    margin-bottom: 1.5rem;
}

.ipo-card h3, .rule-card h3 {
    color: var(--primary-color);
    margin-bottom: 1rem;
}

.ipo-details, .rule-details {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
}

.no-data {
    background-color: var(--card-bg);
    border-radius: 5px;
    box-shadow: var(--shadow);
    padding: 2rem;
    text-align: center;
    color: var(--light-text);
}

footer {
    background-color: var(--primary-color);
    color: white;
    padding: 1.5rem 0;
    text-align: center;
    margin-top: 3rem;
}

@media (max-width: 768px) {
    .ipo-details, .rule-details {
        grid-template-columns: 1fr;
    }
}
"""
    
    # 創建目錄結構
    os.makedirs(os.path.join(output_dir, 'archives'), exist_ok=True)
    os.makedirs(os.path.join(output_dir, 'css'), exist_ok=True)
    
    # 寫入文件
    with open(os.path.join(output_dir, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(index_html)
    
    with open(os.path.join(output_dir, 'archives', f'{today_file}.html'), 'w', encoding='utf-8') as f:
        f.write(daily_html)
    
    with open(os.path.join(output_dir, 'css', 'style.css'), 'w', encoding='utf-8') as f:
        f.write(css)
    
    print(f"網站已生成到 {output_dir} 目錄")

def main():
    """
    主函數
    """
    print("開始收集納斯達克IPO資訊並生成網站...")
    
    # 創建輸出目錄
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "website")
    os.makedirs(output_dir, exist_ok=True)
    
    # 獲取納斯達克IPO資訊
    ipos = get_nasdaq_ipo_data()
    
    # 獲取SEC規則變更
    rule_changes = get_sec_rule_changes()
    
    # 對於每個IPO，獲取更多詳細資訊
    for ipo in ipos:
        sec_info = get_sec_filing_info(ipo['symbol'], ipo['company_name'])
        ipo.update(sec_info)
        # 添加延遲以避免過多請求
        time.sleep(1)
    
    # 生成網站
    generate_html(ipos, rule_changes, output_dir)
    
    print(f"納斯達克IPO資訊網站生成完成，網站文件位於 {output_dir} 目錄")
    print("您可以部署這個網站到任何靜態網站託管服務")

if __name__ == "__main__":
    main()
