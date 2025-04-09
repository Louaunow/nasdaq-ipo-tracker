# 納斯達克IPO資訊系統 - Python腳本說明

本文檔提供納斯達克IPO資訊系統中所有Python腳本的詳細說明，幫助您了解每個腳本的功能和用途。

## 腳本概述

系統包含以下六個主要Python腳本：

1. **generate_pdf_report.py** - 生成PDF報告，包含IPO資訊、SEC規則變更和數據視覺化圖表
2. **generate_website.py** - 生成網站HTML頁面，顯示IPO資訊和SEC規則變更
3. **history_storage.py** - 管理歷史數據的儲存和檢索功能
4. **ipo_performance_analysis.py** - 分析上月IPO股票的表現並生成圖表
5. **monthly_report.py** - 生成月度綜合報表
6. **nasdaq_ipo_scraper.py** - 從納斯達克官方網站和SEC EDGAR系統收集IPO資訊和規則變更

## 腳本詳細說明

### 1. generate_pdf_report.py

**功能**：生成包含納斯達克IPO資訊、SEC規則變更和數據視覺化圖表的PDF報告。

**主要特點**：
- 支持繁體中文顯示（使用文鼎PL細明體）
- 創建專業的表格布局，自動處理文字換行
- 生成多種數據視覺化圖表
- 確保圖表標題和圖表保持在同一頁面
- 優化表格和文字框，避免內容溢出

**使用方法**：
```bash
python3 generate_pdf_report.py
```

### 2. generate_website.py

**功能**：生成網站HTML頁面，顯示納斯達克IPO資訊和SEC規則變更。

**主要特點**：
- 創建響應式網站設計，適配各種設備
- 生成首頁和每日更新頁面
- 提供PDF報告下載功能
- 顯示數據視覺化圖表
- 支持繁體中文顯示

**使用方法**：
```bash
python3 generate_website.py
```

### 3. history_storage.py

**功能**：管理歷史數據的儲存和檢索功能。

**主要特點**：
- 儲存每日IPO資訊和SEC規則變更
- 提供歷史數據檢索功能
- 支持按日期、公司名稱或代碼搜索
- 管理歷史圖表和PDF報告

**使用方法**：
```bash
# 作為模組被其他腳本導入使用
from history_storage import save_daily_data, get_historical_data
```

### 4. ipo_performance_analysis.py

**功能**：分析上月IPO股票的表現並生成圖表。

**主要特點**：
- 收集上月IPO股票的價格數據
- 計算漲跌幅、波動率等指標
- 生成股價走勢圖、漲跌幅對比圖等
- 創建整體表現統計和分析
- 生成專業的PDF分析報告

**使用方法**：
```bash
python3 ipo_performance_analysis.py
```

### 5. monthly_report.py

**功能**：生成月度綜合報表。

**主要特點**：
- 彙總一個月內的所有IPO資訊
- 分析月度IPO趨勢和特點
- 總結SEC規則變更的影響
- 生成月度綜合PDF報告
- 提供月度數據視覺化圖表

**使用方法**：
```bash
python3 monthly_report.py
```

### 6. nasdaq_ipo_scraper.py

**功能**：從納斯達克官方網站和SEC EDGAR系統收集IPO資訊和規則變更。

**主要特點**：
- 抓取納斯達克IPO日曆資訊
- 收集SEC規則變更
- 提取IPO詳細資訊（法律顧問、審計師、承銷商等）
- 處理和清洗數據
- 支持錯誤處理和重試機制

**使用方法**：
```bash
python3 nasdaq_ipo_scraper.py
```

## 系統整合

這些腳本可以單獨運行，也可以通過GitHub Actions工作流程自動化運行。完整的自動化流程如下：

1. `nasdaq_ipo_scraper.py` 收集最新的IPO資訊和SEC規則變更
2. `history_storage.py` 儲存收集到的數據
3. `generate_pdf_report.py` 生成當日的PDF報告
4. `ipo_performance_analysis.py` 分析上月IPO表現（每月執行一次）
5. `monthly_report.py` 生成月度綜合報表（每月執行一次）
6. `generate_website.py` 生成更新後的網站

## 依賴庫

這些腳本依賴以下Python庫：
- requests
- beautifulsoup4
- pandas
- matplotlib
- reportlab
- numpy

可以使用以下命令安裝所有依賴：
```bash
pip3 install requests beautifulsoup4 pandas matplotlib reportlab numpy
```

## 自定義配置

如需自定義系統配置，可以修改各腳本開頭的常量和參數，例如：
- 更改輸出目錄
- 調整圖表樣式和大小
- 修改數據來源URL
- 自定義PDF報告格式

## 故障排除

如果遇到問題，請檢查：
1. 所有依賴庫是否正確安裝
2. 網絡連接是否正常
3. 輸出目錄是否有寫入權限
4. 中文字體是否正確安裝（對於PDF生成）

如有其他問題，請參考GitHub Actions設置指南或聯繫開發者。
