#!/usr/bin/env python3
"""
納斯達克IPO歷史資料儲存模組
用於儲存和檢索每日的IPO資訊
"""

import os
import json
import datetime
import calendar
import glob

class IPOHistoryStorage:
    """
    IPO歷史資料儲存類
    用於儲存和檢索每日的IPO資訊
    """
    
    def __init__(self, base_dir=None):
        """
        初始化IPO歷史資料儲存
        
        參數:
            base_dir: 基礎目錄，如果為None，則使用預設目錄
        """
        if base_dir is None:
            # 使用預設目錄
            self.base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        else:
            self.base_dir = base_dir
        
        self.history_dir = os.path.join(self.base_dir, "history")
        os.makedirs(self.history_dir, exist_ok=True)
    
    def store_ipos(self, ipos, date=None):
        """
        儲存IPO資訊
        
        參數:
            ipos: IPO資訊列表
            date: 日期，如果為None，則使用今天的日期
        """
        if date is None:
            date = datetime.datetime.now().date()
        elif isinstance(date, str):
            date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        
        # 創建日期目錄
        date_dir = os.path.join(self.history_dir, date.strftime("%Y-%m-%d"))
        os.makedirs(date_dir, exist_ok=True)
        
        # 儲存IPO資訊
        ipo_file = os.path.join(date_dir, "ipos.json")
        with open(ipo_file, 'w', encoding='utf-8') as f:
            json.dump(ipos, f, ensure_ascii=False, indent=2)
        
        return ipo_file
    
    def get_ipos_by_date(self, date):
        """
        獲取指定日期的IPO資訊
        
        參數:
            date: 日期，可以是日期對象或字符串 (YYYY-MM-DD)
        
        返回:
            IPO資訊列表，如果沒有找到，則返回空列表
        """
        if isinstance(date, str):
            date = datetime.datetime.strptime(date, "%Y-%m-%d").date()
        
        date_str = date.strftime("%Y-%m-%d")
        ipo_file = os.path.join(self.history_dir, date_str, "ipos.json")
        
        if os.path.exists(ipo_file):
            with open(ipo_file, 'r', encoding='utf-8') as f:
                return json.load(f)
        else:
            return []
    
    def get_ipos_by_month(self, year, month):
        """
        獲取指定月份的所有IPO資訊
        
        參數:
            year: 年份
            month: 月份
        
        返回:
            IPO資訊列表，如果沒有找到，則返回空列表
        """
        # 獲取該月的所有日期
        _, days_in_month = calendar.monthrange(year, month)
        
        all_ipos = []
        for day in range(1, days_in_month + 1):
            date = datetime.date(year, month, day)
            ipos = self.get_ipos_by_date(date)
            all_ipos.extend(ipos)
        
        return all_ipos
    
    def get_all_dates(self):
        """
        獲取所有有IPO資訊的日期
        
        返回:
            日期列表，按時間順序排序
        """
        date_dirs = glob.glob(os.path.join(self.history_dir, "????-??-??"))
        dates = []
        
        for date_dir in date_dirs:
            date_str = os.path.basename(date_dir)
            try:
                date = datetime.datetime.strptime(date_str, "%Y-%m-%d").date()
                dates.append(date)
            except ValueError:
                continue
        
        # 按時間順序排序
        dates.sort()
        
        return dates
    
    def get_all_months(self):
        """
        獲取所有有IPO資訊的月份
        
        返回:
            月份列表，格式為 (年, 月)，按時間順序排序
        """
        dates = self.get_all_dates()
        months = set()
        
        for date in dates:
            months.add((date.year, date.month))
        
        # 轉換為列表並按時間順序排序
        months = list(months)
        months.sort()
        
        return months
