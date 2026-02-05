# Vue Backend Template (Boilerplate)

這是一個基於 Vue 3 + Vite + TypeScript 的後端管理系統樣板專案 (Boilerplate)，旨在讓開發者能快速建置新的專案，減少重複配置的時間。

## 技術棧 (Tech Stack)

核心技術採用：

- **Frontend Framework**: [Vue 3](https://vuejs.org/) - 使用 Composition API 與 `<script setup>`
- **Build Tool**: [Vite](https://vitejs.dev/) - 極速的開發伺服器與打包工具
- **Language**: [TypeScript](https://www.typescriptlang.org/) - 提供強型別支援

## 快速開始 (Getting Started)

### 1. 安裝依賴 (Install Dependencies)

```bash
npm install
```

### 2. 啟動開發環境 (Development)

```bash
npm run dev
```

啟動後，請瀏覽終端機顯示的 Local URL (預設為 `http://localhost:5173`)。

### 3. 建置生產版本 (Build)

```bash
npm run build
```

此指令會執行型別檢查 (`vue-tsc`) 並透過 Vite 進行打包，產出的檔案位於 `dist` 目錄。

### 4. 預覽生產版本 (Preview)

```bash
npm run preview
```

用於在本地預覽打包後的結果。
