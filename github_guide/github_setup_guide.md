# GitHub 設置指南：實現納斯達克IPO資訊網站的全自動每日更新

本指南將幫助您從零開始設置GitHub，並配置自動化工作流程，使您的納斯達克IPO資訊網站能夠每天自動更新。即使您從未使用過GitHub，也能輕鬆完成所有步驟。

## 目錄

1. [創建GitHub帳戶](#1-創建github帳戶)
2. [創建新的存儲庫](#2-創建新的存儲庫)
3. [上傳納斯達克IPO專案文件](#3-上傳納斯達克ipo專案文件)
4. [設置GitHub Pages](#4-設置github-pages)
5. [配置GitHub Actions自動化工作流程](#5-配置github-actions自動化工作流程)
6. [測試自動化工作流程](#6-測試自動化工作流程)
7. [故障排除](#7-故障排除)

## 1. 創建GitHub帳戶

首先，您需要創建一個GitHub帳戶：

1. 訪問 [GitHub官網](https://github.com)
2. 點擊右上角的「Sign up」（註冊）按鈕
3. 填寫註冊表單：
   - 輸入您的電子郵件地址
   - 創建一個安全的密碼（至少15個字符或至少8個字符，包括數字和小寫字母）
   - 選擇一個用戶名（只能包含字母數字字符或單個連字符，且不能以連字符開頭或結尾）
   - 選擇您的國家/地區
   - 選擇是否接收產品更新和公告（可選）
   - 點擊「Continue」（繼續）按鈕
4. 完成驗證步驟（可能需要解決拼圖或其他驗證方式）
5. 點擊「Create account」（創建帳戶）按鈕
6. 檢查您的電子郵件，並點擊驗證鏈接以完成註冊

## 2. 創建新的存儲庫

註冊並登錄後，您需要創建一個新的存儲庫（repository）來存放您的納斯達克IPO專案：

1. 點擊GitHub頁面右上角的「+」圖標，然後選擇「New repository」（新存儲庫）
2. 在「Repository name」（存儲庫名稱）欄位中，輸入「nasdaq-ipo-tracker」或您喜歡的名稱
3. 添加描述（可選）：「納斯達克IPO資訊自動更新網站」
4. 選擇「Public」（公開）選項（這樣您可以使用GitHub Pages免費託管）
5. 勾選「Add a README file」（添加README文件）
6. 勾選「Add .gitignore」（添加.gitignore文件），並從下拉菜單中選擇「Python」
7. 點擊「Create repository」（創建存儲庫）按鈕

## 3. 上傳納斯達克IPO專案文件

現在您需要將納斯達克IPO專案的文件上傳到您的GitHub存儲庫：

1. 在您的存儲庫頁面，點擊「Add file」（添加文件）按鈕，然後選擇「Upload files」（上傳文件）
2. 將以下文件和目錄從您的電腦拖放到上傳區域：
   - `scripts/` 目錄（包含所有Python腳本）
   - `website/` 目錄（包含網站文件）
   - `.github/workflows/` 目錄（包含GitHub Actions工作流程配置）
3. 在「Commit changes」（提交更改）部分，添加提交消息：「初始上傳納斯達克IPO專案文件」
4. 點擊「Commit changes」（提交更改）按鈕

如果文件太多或太大，您可能需要分多次上傳。或者，您可以使用Git命令行工具進行上傳（如果您熟悉的話）。

## 4. 設置GitHub Pages

接下來，您需要設置GitHub Pages來託管您的網站：

1. 在您的存儲庫頁面，點擊「Settings」（設置）選項卡
2. 在左側菜單中，點擊「Pages」（頁面）
3. 在「Source」（源）部分，從下拉菜單中選擇「main」分支
4. 在旁邊的文件夾下拉菜單中，選擇「/website」（這是您的網站文件所在的目錄）
5. 點擊「Save」（保存）按鈕
6. 等待幾分鐘，GitHub會自動部署您的網站
7. 部署完成後，您會在頁面頂部看到您的網站URL（格式為：https://您的用戶名.github.io/nasdaq-ipo-tracker/）

## 5. 配置GitHub Actions自動化工作流程

現在，您需要配置GitHub Actions來自動執行您的腳本，以便每天更新網站內容：

1. 在您的存儲庫頁面，點擊「Actions」（操作）選項卡
2. 如果您已經上傳了`.github/workflows/daily_update.yml`文件，您會看到它列在工作流程列表中
3. 如果沒有，您需要創建一個新的工作流程：
   - 點擊「New workflow」（新工作流程）按鈕
   - 點擊「set up a workflow yourself」（自己設置工作流程）鏈接
   - 將以下內容複製到編輯器中：

```yaml
name: 每日更新納斯達克IPO資訊

on:
  schedule:
    # 每天香港時間上午10:00（UTC+8）運行，對應UTC時間02:00
    - cron: '0 2 * * *'
  workflow_dispatch:  # 允許手動觸發

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - name: 檢出代碼
        uses: actions/checkout@v2
        
      - name: 設置Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.10'
          
      - name: 安裝依賴
        run: |
          python -m pip install --upgrade pip
          pip install requests beautifulsoup4 pandas matplotlib reportlab
          sudo apt-get update
          sudo apt-get install -y fonts-arphic-uming
          
      - name: 運行更新腳本
        run: |
          cd $GITHUB_WORKSPACE
          python scripts/generate_pdf_report.py
          
      - name: 提交更新的文件
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add website/
          git commit -m "自動更新納斯達克IPO資訊 $(date +'%Y-%m-%d')" || echo "沒有更改需要提交"
          
      - name: 推送更改
        uses: ad-m/github-push-action@master
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          branch: main
```

   - 點擊「Start commit」（開始提交）按鈕
   - 添加提交消息：「添加每日更新工作流程」
   - 點擊「Commit new file」（提交新文件）按鈕

## 6. 測試自動化工作流程

您可以手動觸發工作流程來測試它是否正常工作：

1. 在您的存儲庫頁面，點擊「Actions」（操作）選項卡
2. 點擊左側的「每日更新納斯達克IPO資訊」工作流程
3. 點擊「Run workflow」（運行工作流程）按鈕
4. 在下拉菜單中，確保選擇了「main」分支
5. 點擊「Run workflow」（運行工作流程）按鈕
6. 等待工作流程完成（這可能需要幾分鐘）
7. 工作流程完成後，訪問您的網站URL（https://您的用戶名.github.io/nasdaq-ipo-tracker/）查看更新是否成功

## 7. 故障排除

如果您遇到任何問題，以下是一些常見問題的解決方法：

### 工作流程失敗

1. 在「Actions」（操作）選項卡中，點擊失敗的工作流程運行
2. 查看錯誤消息和日誌
3. 常見問題包括：
   - 依賴項安裝失敗：確保工作流程文件中列出了所有必要的依賴項
   - 腳本錯誤：檢查您的Python腳本是否有錯誤
   - 權限問題：確保GitHub Actions有權限推送到您的存儲庫

### 網站未更新

1. 檢查GitHub Pages設置是否正確
2. 確保工作流程成功完成並推送了更改
3. 等待幾分鐘，GitHub Pages可能需要一些時間來更新

### 中文字體問題

如果PDF中的中文字體顯示不正確：

1. 確保工作流程中包含了安裝中文字體的步驟：`sudo apt-get install -y fonts-arphic-uming`
2. 檢查您的Python腳本是否正確註冊和使用了中文字體

## 完成！

恭喜！您已經成功設置了GitHub存儲庫和自動化工作流程，現在您的納斯達克IPO資訊網站將每天自動更新。

每天香港時間上午10:00，GitHub Actions將自動運行您的腳本，收集最新的IPO資訊，生成PDF報告，並更新網站內容。您不需要手動干預，一切都是自動完成的。

您可以隨時訪問您的網站URL（https://您的用戶名.github.io/nasdaq-ipo-tracker/）查看最新的IPO資訊。

如果您有任何問題或需要進一步的協助，請隨時聯繫我們。
