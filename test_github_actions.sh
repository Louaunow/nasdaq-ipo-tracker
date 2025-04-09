#!/bin/bash
# 這個腳本用於在本地測試GitHub Actions工作流程

echo "開始測試GitHub Actions工作流程..."
echo "模擬GitHub Actions環境..."

# 確保所有必要的依賴已安裝
echo "安裝依賴..."
pip3 install requests beautifulsoup4 pandas matplotlib reportlab

# 執行PDF報告生成腳本
echo "生成IPO報告和網站..."
cd /home/ubuntu/nasdaq_ipo_project
python3 scripts/generate_pdf_report.py

echo "測試完成！"
echo "在實際的GitHub Actions環境中，接下來會執行部署步驟。"
echo "您可以查看生成的網站和PDF報告，確認它們是否符合預期。"
