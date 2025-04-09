# GitHub Pages 設置詳細指南

本指南將幫助您設置 GitHub Pages，以便自動部署和更新您的納斯達克 IPO 資訊網站。

## 1. 創建 GitHub 帳戶（如果您還沒有）

1. 訪問 [GitHub 官網](https://github.com/)
2. 點擊右上角的「Sign up」（註冊）按鈕
3. 填寫用戶名、電子郵件和密碼
4. 完成驗證步驟
5. 選擇免費計劃
6. 完成設置過程

## 2. 創建新的存儲庫

1. 登錄您的 GitHub 帳戶
2. 點擊右上角的「+」圖標，然後選擇「New repository」（新存儲庫）
3. 在「Repository name」（存儲庫名稱）欄位中輸入：`nasdaq-ipo-info`
4. 選擇「Public」（公開）選項
5. 勾選「Add a README file」（添加 README 文件）
6. 點擊「Create repository」（創建存儲庫）按鈕

## 3. 上傳納斯達克 IPO 專案文件

### 方法一：使用網頁界面上傳（適合初學者）

1. 在您的存儲庫頁面，點擊「Add file」（添加文件）按鈕，然後選擇「Upload files」（上傳文件）
2. 將解壓後的 `scripts` 目錄中的所有文件拖放到上傳區域
   - 注意：GitHub 網頁界面一次只能上傳 100 個文件，如果您的文件較多，需要分批上傳
3. 在「Commit changes」（提交更改）部分，輸入描述，例如「上傳納斯達克 IPO 腳本文件」
4. 點擊「Commit changes」（提交更改）按鈕
5. 重複上述步驟，上傳 `website` 目錄中的所有文件

### 方法二：使用 Git 命令行（適合有經驗的用戶）

1. 在您的電腦上安裝 Git
2. 打開終端或命令提示符
3. 克隆您的存儲庫：
   ```
   git clone https://github.com/您的用戶名/nasdaq-ipo-info.git
   ```
4. 進入克隆的目錄：
   ```
   cd nasdaq-ipo-info
   ```
5. 複製納斯達克 IPO 專案文件到此目錄
6. 添加文件到 Git：
   ```
   git add .
   ```
7. 提交更改：
   ```
   git commit -m "上傳納斯達克 IPO 專案文件"
   ```
8. 推送到 GitHub：
   ```
   git push origin main
   ```

## 4. 創建 GitHub Actions 工作流程

1. 在您的存儲庫頁面，點擊「Actions」（操作）選項卡
2. 點擊「New workflow」（新工作流程）或「set up a workflow yourself」（自己設置工作流程）
3. 這將創建一個 `.github/workflows/main.yml` 文件
4. 刪除預設內容，將我提供的 `daily_update.yml` 文件內容複製粘貼到編輯器中
5. 點擊右上角的「Commit changes」（提交更改）按鈕

## 5. 設置 GitHub Pages

1. 在您的存儲庫頁面，點擊「Settings」（設置）選項卡
2. 在左側菜單中，找到並點擊「Pages」選項（通常在「Code and automation」部分下）
3. 在「Build and deployment」（構建和部署）部分：
   - 在「Source」（來源）下拉菜單中，選擇「Deploy from a branch」（從分支部署）
   - 在「Branch」（分支）下拉菜單中，選擇「gh-pages」分支（這是工作流程自動創建的分支）
   - 在分支選擇旁邊的文件夾選擇器中，保持「/ (root)」選項
   - 點擊「Save」（保存）按鈕

## 6. 手動觸發工作流程進行首次部署

1. 在您的存儲庫頁面，點擊「Actions」（操作）選項卡
2. 在左側找到「每日更新納斯達克IPO資訊」工作流程
3. 點擊「Run workflow」（運行工作流程）按鈕
4. 在彈出的下拉菜單中，確保選擇了「main」分支
5. 點擊「Run workflow」（運行工作流程）按鈕

## 7. 查看部署結果

1. 工作流程運行完成後（通常需要 1-2 分鐘），再次前往「Settings」>「Pages」
2. 在頂部，您應該能看到「Your site is published at https://您的用戶名.github.io/nasdaq-ipo-info/」的消息
3. 點擊該鏈接訪問您的網站

## 8. 自動更新設置完成

現在，您的納斯達克 IPO 資訊網站已經設置為每天香港時間上午 10:00（UTC+8）自動更新。工作流程將：

1. 收集最新的 IPO 資訊
2. 生成 PDF 報告
3. 更新網站內容
4. 自動部署更新後的網站

您不需要手動干預，只需訪問您的網站 URL 即可查看最新資訊。

## 故障排除

如果您遇到問題：

1. **工作流程失敗**：
   - 前往「Actions」選項卡查看錯誤日誌
   - 確保所有必要的文件都已上傳到正確的位置
   - 檢查 Python 腳本中的路徑是否正確

2. **網站未顯示**：
   - 確保 GitHub Pages 設置正確
   - 檢查是否已成功創建 gh-pages 分支
   - 等待幾分鐘，GitHub Pages 部署可能需要一些時間

3. **內容未更新**：
   - 檢查工作流程是否成功運行
   - 確認時區設置是否正確
   - 手動觸發工作流程測試更新過程

如有其他問題，請參考 GitHub 文檔或聯繫我獲取進一步協助。
