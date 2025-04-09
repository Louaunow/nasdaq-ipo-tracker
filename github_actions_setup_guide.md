# GitHub Actions 自動化部署指南

這個文檔提供了如何設置 GitHub 存儲庫和 GitHub Actions 來自動更新納斯達克 IPO 資訊網站的詳細說明。

## 步驟 1: 創建 GitHub 存儲庫

1. 登錄您的 GitHub 帳戶，或者創建一個新帳戶（https://github.com/join）
2. 點擊右上角的 "+" 圖標，選擇 "New repository"
3. 填寫存儲庫名稱，例如 `nasdaq-ipo-tracker`
4. 添加描述（可選）：`納斯達克IPO資訊追蹤網站，每日自動更新`
5. 選擇 "Public"（如果您希望網站公開訪問）
6. 勾選 "Add a README file"
7. 點擊 "Create repository"

## 步驟 2: 上傳代碼到 GitHub 存儲庫

您可以使用命令行或 GitHub Desktop 應用程序將代碼上傳到存儲庫。以下是使用命令行的步驟：

```bash
# 克隆新創建的存儲庫
git clone https://github.com/您的用戶名/nasdaq-ipo-tracker.git
cd nasdaq-ipo-tracker

# 複製項目文件到存儲庫目錄
cp -r /home/ubuntu/nasdaq_ipo_project/* .
cp -r /home/ubuntu/nasdaq_ipo_project/.github .

# 添加、提交和推送文件
git add .
git commit -m "初始提交：納斯達克IPO追蹤網站"
git push origin main
```

## 步驟 3: 設置 GitHub Pages

1. 在您的存儲庫頁面，點擊 "Settings"
2. 在左側菜單中，點擊 "Pages"
3. 在 "Source" 部分，選擇 "gh-pages" 分支（這個分支將由 GitHub Actions 自動創建）
4. 點擊 "Save"
5. 等待幾分鐘，GitHub 將提供一個網站 URL（通常是 `https://您的用戶名.github.io/nasdaq-ipo-tracker/`）

## 步驟 4: 確認 GitHub Actions 工作流程

1. 在您的存儲庫頁面，點擊 "Actions" 選項卡
2. 您應該能看到 "每日納斯達克IPO更新" 工作流程
3. 這個工作流程已經設置為每天香港時間上午 10:00（UTC+8）自動運行
4. 您也可以點擊 "Run workflow" 按鈕手動觸發工作流程，測試它是否正常工作

## 步驟 5: 設置 GitHub Secrets（如果需要）

如果您的腳本需要訪問任何 API 密鑰或其他敏感信息，您應該將它們存儲為 GitHub Secrets：

1. 在您的存儲庫頁面，點擊 "Settings"
2. 在左側菜單中，點擊 "Secrets and variables" > "Actions"
3. 點擊 "New repository secret"
4. 添加您的密鑰（例如，名稱：`API_KEY`，值：您的 API 密鑰）
5. 在工作流程文件中，您可以使用 `${{ secrets.API_KEY }}` 來訪問這個密鑰

## 工作流程說明

我們已經為您創建了一個 GitHub Actions 工作流程文件（`.github/workflows/daily_update.yml`），它包含以下步驟：

1. 在每天香港時間上午 10:00（UTC+8）自動運行
2. 檢出存儲庫代碼
3. 設置 Python 環境
4. 安裝必要的依賴
5. 運行 `generate_pdf_report.py` 腳本生成 IPO 報告和網站
6. 將生成的網站部署到 GitHub Pages

## 自定義和故障排除

### 修改運行時間

如果您希望更改自動更新的時間，請編輯 `.github/workflows/daily_update.yml` 文件中的 `cron` 表達式：

```yaml
on:
  schedule:
    - cron: '0 2 * * *'  # UTC 時間 02:00，對應香港時間 10:00
```

cron 表達式格式為 `分鐘 小時 日 月 星期`。例如，如果您希望在香港時間下午 3:00（UTC+8，即 UTC 07:00）運行，應該使用 `0 7 * * *`。

### 查看運行日誌

如果工作流程運行失敗，您可以查看詳細的日誌來診斷問題：

1. 在您的存儲庫頁面，點擊 "Actions" 選項卡
2. 點擊失敗的工作流程運行
3. 展開失敗的步驟查看詳細日誌

### 更新腳本

如果您需要更新數據收集腳本或網站模板，只需編輯相應的文件並推送到 GitHub 存儲庫。下次工作流程運行時，它將使用更新後的腳本。

## 結論

通過這個設置，您的納斯達克 IPO 資訊網站將每天香港時間上午 10:00 自動更新，並部署到 GitHub Pages。用戶可以通過 GitHub Pages URL 訪問最新的 IPO 資訊和 PDF 報告。

如果您有任何問題或需要進一步的幫助，請隨時聯繫我們。
