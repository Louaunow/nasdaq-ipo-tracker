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
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

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
        
    def generate_monthly_report(self, year_month):
        """
        生成月度綜合報表
        
        參數:
            year_month: 年月字符串，格式為YYYY-MM
        
        返回:
            str: 月度報表路徑
        """
        print(f"正在生成{year_month}月度報表...")
        
        # 解析年月
        year, month = map(int, year_month.split('-'))
        
        # 獲取該月的IPO資訊
        ipos = self.get_ipos_by_month(year, month)
        
        if not ipos:
            print(f"沒有找到{year_month}的IPO資訊")
            return None
        
        # 創建月度報表目錄
        monthly_dir = os.path.join(self.base_dir, "website", "monthly")
        os.makedirs(monthly_dir, exist_ok=True)
        
        # 設置報表路徑
        report_path = os.path.join(monthly_dir, f"monthly_report_{year_month}.pdf")
        
        # 生成PDF報表
        self._generate_monthly_pdf(ipos, report_path, year_month)
        
        print(f"月度報表已生成: {report_path}")
        return report_path
    
    def _generate_monthly_pdf(self, ipos, report_path, year_month):
        """
        生成月度PDF報表
        
        參數:
            ipos: IPO資訊列表
            report_path: 報表路徑
            year_month: 年月字符串，格式為YYYY-MM
        """
        # 設置中文字體
        try:
            # 嘗試加載微軟正黑體
            pdfmetrics.registerFont(TTFont('Microsoft JhengHei', '/usr/share/fonts/truetype/msttcorefonts/msjh.ttc'))
            font_name = 'Microsoft JhengHei'
        except:
            try:
                # 嘗試加載文鼎PL細明體
                pdfmetrics.registerFont(TTFont('UMing', '/usr/share/fonts/truetype/arphic/uming.ttc'))
                font_name = 'UMing'
            except:
                try:
                    # 嘗試加載Noto Sans CJK TC
                    pdfmetrics.registerFont(TTFont('Noto Sans CJK TC', '/usr/share/fonts/opentype/noto/NotoSansCJK-Regular.ttc'))
                    font_name = 'Noto Sans CJK TC'
                except:
                    print("警告：無法加載中文字體，PDF中的中文可能無法正確顯示")
                    font_name = 'Helvetica'
        
        # 創建PDF文檔
        doc = SimpleDocTemplate(
            report_path,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # 獲取樣式
        styles = getSampleStyleSheet()
        
        # 創建自定義樣式
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Title'],
            fontName=font_name,
            fontSize=24,
            alignment=1,
            spaceAfter=12
        )
        
        heading_style = ParagraphStyle(
            'Heading',
            parent=styles['Heading1'],
            fontName=font_name,
            fontSize=18,
            spaceAfter=12
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontName=font_name,
            fontSize=12,
            spaceAfter=6
        )
        
        # 創建內容
        content = []
        
        # 添加標題
        year, month = year_month.split('-')
        month_name = {
            '01': '一月', '02': '二月', '03': '三月', '04': '四月',
            '05': '五月', '06': '六月', '07': '七月', '08': '八月',
            '09': '九月', '10': '十月', '11': '十一月', '12': '十二月'
        }[month]
        
        title = Paragraph(f"{year}年{month_name} 納斯達克IPO月度報表", title_style)
        content.append(title)
        content.append(Spacer(1, 12))
        
        # 添加摘要
        content.append(Paragraph("月度摘要", heading_style))
        content.append(Paragraph(f"本月共有 {len(ipos)} 家公司在納斯達克上市。", normal_style))
        content.append(Spacer(1, 12))
        
        # 添加IPO列表
        content.append(Paragraph("本月IPO列表", heading_style))
        
        # 創建表格數據
        table_data = [["公司代碼", "公司名稱", "交易所", "發行價格", "發行股數", "上市日期", "募資金額"]]
        
        for ipo in ipos:
            table_data.append([
                ipo.get("symbol", ""),
                ipo.get("company_name", ""),
                ipo.get("exchange", ""),
                f"${ipo.get('price', 0):.2f}",
                f"{ipo.get('shares', 0):,}",
                ipo.get("date", ""),
                f"${ipo.get('amount', 0):,}"
            ])
        
        # 創建表格
        table = Table(table_data, repeatRows=1)
        
        # 設置表格樣式
        table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
            ('FONTNAME', (0, 0), (-1, 0), font_name),
            ('FONTSIZE', (0, 0), (-1, 0), 12),
            ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
            ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        content.append(table)
        content.append(Spacer(1, 24))
        
        # 添加行業分析
        content.append(Paragraph("行業分析", heading_style))
        
        # 簡單的行業分析
        industries = {}
        for ipo in ipos:
            industry = ipo.get("industry", "其他")
            if industry in industries:
                industries[industry] += 1
            else:
                industries[industry] = 1
        
        industry_text = "行業分佈：\n"
        for industry, count in industries.items():
            industry_text += f"- {industry}: {count} 家公司\n"
        
        content.append(Paragraph(industry_text, normal_style))
        content.append(Spacer(1, 12))
        
        # 添加結論
        content.append(Paragraph("結論", heading_style))
        content.append(Paragraph(f"{year}年{month_name}納斯達克IPO市場總結：共有{len(ipos)}家公司上市，總募資金額約{sum(ipo.get('amount', 0) for ipo in ipos):,}美元。", normal_style))
        
        # 生成PDF
        doc.build(content)
        
        return report_path
