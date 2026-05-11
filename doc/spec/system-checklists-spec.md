# 資通系統防護基準檢核表管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `SystemChecklists` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/資通系統防護基準檢核表管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`AR3-SystemChecklists.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/AR3-SystemChecklists.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/system-checklists`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢資通系統防護基準檢核表列表 |
| 所需權限字串 | `systemchecklists:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/system-checklists` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/system-checklists |
| 對應 OperationId | `AR3-SystemChecklists-Search` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢單一資通系統的防護基準檢核表 |
| 所需權限字串 | `systemchecklists:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/system-checklists/detail/:checklistUid` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/system-checklists/{checklistUid} |
| 對應 OperationId | `AR3-SystemChecklists-Read` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新資通系統防護基準檢核表 |
| 所需權限字串 | `systemchecklists:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/system-checklists/edit/:checklistUid` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/system-checklists/{checklistUid} |
| 對應 OperationId | `AR3-SystemChecklists-Update` |

### 匯出

| 項目 | 內容 |
|------|------|
| 名稱 | 匯出資通系統防護基準檢核表 |
| 所需權限字串 | `systemchecklists:export` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | 無（觸發下載） |
| 程式變數名稱 | `handleExport`, `doExportClick` |
| 對應 API Method | GET /api/{version}/system-checklists/export |
| 對應 OperationId | `AR3-SystemChecklists-Export` |

### 匯出統計

| 項目 | 內容 |
|------|------|
| 名稱 | 匯出資通系統防護基準評鑑結果分析 |
| 所需權限字串 | `systemchecklists:export` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | 無（觸發下載） |
| 程式變數名稱 | `handleExportSummary`, `doExportSummaryClick` |
| 對應 API Method | GET /api/{version}/system-checklists/export-summary |
| 對應 OperationId | `AR3-SystemChecklists-ExportSummary` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `SystemChecklistsQueryParameter`
- **支援的查詢條件**:
  - `assessmentYear` (評估年度)
  - `systemName` (資通系統名稱)
  - `protectionLevel` (防護等級)
  - `formNumber` (表單編號)
  - `assessmentStatus` (評估狀態)
  - `limit` (筆數)
  - `offset` (位移)
  - `sortBy` (排序)
  - `sortOrder` (排序方向)

### 列表欄位 (Columns)

> [!NOTE]
> 欄位類型請參考 `CTableColumnType` 列舉定義。

| 顯示文字 | Property 名稱 | 資料格式 (CTableColumnType) | 動作欄位 (CTableColumnActionType) |
|---------|--------------|---------------------------|----------------------------------|
| 表單編號 | `formNumber` | `Text` | - |
| 評估年度 | `assessmentYear` | `Text` | - |
| 評估日期 | `assessmentDate` | `Date` | - |
| 評估狀態 | `assessmentStatusDisplayName` | `Text` | - |
| 資通系統名稱 | `informationSystem.name` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 更新時間 | `updatedAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `SystemChecklistsDataModel` | `src/model/SystemChecklistsDataModel.ts` |
| 列表查詢 | `SystemChecklistsListDataModel` | `src/model/SystemChecklistsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `SystemChecklistsQueryParameter` | `src/query/SystemChecklistsQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 評估狀態 | `AssessmentStatus` | `src/enums/common.ts` |
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
| 評估日期 | `assessmentDate` | 字串 | - | 否 | - |
| 承辦單位 | `handlingUnit` | 字串 | - | 否 | - |
| 承辦人姓名 | `handlerName` | 字串 | - | 否 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/system-checklists`
- **新增頁面**: `/system-checklists/create`
- **編輯頁面**: `/system-checklists/edit/:checklistUid`
- **詳細頁面**: `/system-checklists/detail/:checklistUid`

### 頁面標題

- **標題**: 資通系統防護基準檢核表管理

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
