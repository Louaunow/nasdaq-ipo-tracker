#!/usr/bin/env python3
"""
納斯達克IPO資訊收集腳本
用於收集納斯達克新上市股票的資訊，包括股票名稱、代碼、法律顧問、審計師、承銷商、募資金額和每股IPO價格
"""

import requests
from bs4 import BeautifulSoup
import json
import re
import datetime
import os
import sys
from urllib.parse import urljoin

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

def format_whatsapp_message(ipos, rule_changes):
    """
    將IPO資訊和SEC規則變更格式化為WhatsApp訊息
    返回格式化的訊息文本
    """
    today = datetime.datetime.now().strftime("%Y年%m月%d日")
    
    message = f"*納斯達克IPO更新* ({today})\n\n"
    
    # 添加IPO資訊
    if ipos:
        message += "*即將上市的股票:*\n\n"
        
        for ipo in ipos:
            message += f"• *{ipo['company_name']}* ({ipo['symbol']})\n"
            message += f"  • 交易所: {ipo['exchange']}\n"
            message += f"  • 預期上市日期: {ipo['expected_date']}\n"
            message += f"  • 發行價格: {ipo['price']}\n"
            message += f"  • 發行股數: {ipo['shares']}\n"
            message += f"  • 募資金額: {ipo['offer_amount']}\n"
            message += f"  • 法律顧問: {ipo['legal_firm']}\n"
            message += f"  • 審計師: {ipo['auditor']}\n"
            message += f"  • 承銷商: {ipo['underwriter']}\n\n"
    else:
        message += "*即將上市的股票:* 暫無新上市股票\n\n"
    
    # 添加SEC規則變更
    if rule_changes:
        message += "*SEC規則變更:*\n\n"
        
        for rule in rule_changes:
            message += f"• *{rule['title']}*\n"
            message += f"  • 類型: {rule['type']}規則\n"
            message += f"  • 日期: {rule['date']}\n"
            if rule['link']:
                message += f"  • 詳情: {rule['link']}\n\n"
    else:
        message += "*SEC規則變更:* 暫無新規則變更\n"
    
    return message

def save_message_to_file(message, output_file):
    """
    將訊息保存到文件
    """
    try:
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(message)
        print(f"訊息已保存到 {output_file}")
    except Exception as e:
        print(f"保存訊息到文件時出錯: {e}")

def main():
    """
    主函數
    """
    print("開始收集納斯達克IPO資訊...")
    
    # 創建輸出目錄
    output_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "output")
    os.makedirs(output_dir, exist_ok=True)
    
    # 獲取當前日期
    today = datetime.datetime.now().strftime("%Y-%m-%d")
    output_file = os.path.join(output_dir, f"ipo_update_{today}.txt")
    
    # 獲取納斯達克IPO資訊
    ipos = get_nasdaq_ipo_data()
    
    # 獲取SEC規則變更
    rule_changes = get_sec_rule_changes()
    
    # 對於每個IPO，獲取更多詳細資訊
    for ipo in ipos:
        sec_info = get_sec_filing_info(ipo['symbol'], ipo['company_name'])
        ipo.update(sec_info)
    
    # 格式化WhatsApp訊息
    message = format_whatsapp_message(ipos, rule_changes)
    
    # 保存訊息到文件
    save_message_to_file(message, output_file)
    
    print(f"納斯達克IPO資訊收集完成，結果已保存到 {output_file}")
    print(f"請將文件內容複製並發送到WhatsApp號碼: +85267500601")

if __name__ == "__main__":
    main()
