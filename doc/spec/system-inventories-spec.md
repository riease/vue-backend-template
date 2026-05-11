# 資通系統清冊管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `SystemInventories` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/資通系統清冊管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`AR3-SystemInventories.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/AR3-SystemInventories.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/system-inventories`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 匯出

| 項目 | 內容 |
|------|------|
| 名稱 | 匯出資通系統清冊 |
| 所需權限字串 | `systeminventories:export` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | 無（觸發下載） |
| 程式變數名稱 | `handleExport`, `doExportClick` |
| 對應 API Method | GET /api/{version}/system-inventories/export |
| 對應 OperationId | `AR3-SystemInventories-Export` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `SystemInventoriesQueryParameter`
- **支援的查詢條件**:
  - `inventoryYear` (清冊年份)
  - `systemName` (資通系統名稱)
  - `protectionLevel` (防護等級)
  - `formNumber` (表單編號)
  - `limit` (筆數)
  - `offset` (位移)
  - `sortBy` (排序)
  - `sortOrder` (排序方向)

### 列表欄位 (Columns)

> [!NOTE]
> 欄位類型請參考 `CTableColumnType` 列舉定義。

| 顯示文字 | Property 名稱 | 資料格式 (CTableColumnType) | 動作欄位 (CTableColumnActionType) |
|---------|--------------|---------------------------|----------------------------------|
| 操作 | - | `Action` | - |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `SystemInventoriesDataModel` | `src/model/SystemInventoriesDataModel.ts` |
| 列表查詢 | `SystemInventoriesListDataModel` | `src/model/SystemInventoriesListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `SystemInventoriesQueryParameter` | `src/query/SystemInventoriesQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 防護需求等級 | `ProtectionLevel` | `src/enums/common.ts` |

### 相依共用元件

**列表頁面元件：**
- `CTable`

**權限控制元件：**
- `HasPermission`

---

## 📝 表單規格

> [!NOTE]
> 此功能包含新增/編輯表單

### 表單欄位定義

| 欄位名稱 | Property | 驗證規則 | 預設值 | 必填 | 說明 |
|---------|---------|---------|-------|------|------|
| 盤點日期 | `inventoryDate` | 字串 | - | 否 | - |
| 資通系統識別碼 | `systemUid` | 字串 | - | 是 | - |
| 年度註記 | `notes` | 字串 | - | 否 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/system-inventories`
- **新增頁面**: `/system-inventories/create`
- **編輯頁面**: `/system-inventories/edit/:uid`
- **詳細頁面**: `/system-inventories/detail/:uid`

### 頁面標題

- **標題**: 資通系統清冊管理

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
