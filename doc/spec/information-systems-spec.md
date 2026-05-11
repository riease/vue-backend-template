# 資通系統基本資料維護 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `InformationSystems` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/資通系統基本資料維護.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`AR3-InformationSystems.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/AR3-InformationSystems.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/information-systems`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢資通系統列表 |
| 所需權限字串 | `informationsystems:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/information-systems` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/information-systems |
| 對應 OperationId | `AR3-InformationSystems-Search` |

### 新增

| 項目 | 內容 |
|------|------|
| 名稱 | 新增資通系統 |
| 所需權限字串 | `informationsystems:create` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/information-systems/create` |
| 程式變數名稱 | `handleCreate`, `doCreateClick` |
| 對應 API Method | POST /api/{version}/information-systems |
| 對應 OperationId | `AR3-InformationSystems-Create` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢資通系統 |
| 所需權限字串 | `informationsystems:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/information-systems/detail/:systemId` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/information-systems/{systemId} |
| 對應 OperationId | `AR3-InformationSystems-Read` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新資通系統 |
| 所需權限字串 | `informationsystems:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/information-systems/edit/:systemId` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/information-systems/{systemId} |
| 對應 OperationId | `AR3-InformationSystems-Update` |

### 刪除

| 項目 | 內容 |
|------|------|
| 名稱 | 刪除資通系統 |
| 所需權限字串 | `informationsystems:delete` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | 無（在當前頁面執行） |
| 程式變數名稱 | `handleDelete`, `doDeleteClick` |
| 對應 API Method | DELETE /api/{version}/information-systems/{systemId} |
| 對應 OperationId | `AR3-InformationSystems-Delete` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `InformationSystemsQueryParameter`
- **支援的查詢條件**:
  - `name` (系統名稱)
  - `code` (系統代碼)
  - `isSharedSystem` (是否為共同性系統)
  - `vendorName` (廠商名稱)
  - `status` (狀態)
  - `limit` (筆數)
  - `offset` (位移)
  - `sortBy` (排序)
  - `sortOrder` (排序方向)

### 列表欄位 (Columns)

> [!NOTE]
> 欄位類型請參考 `CTableColumnType` 列舉定義。

| 顯示文字 | Property 名稱 | 資料格式 (CTableColumnType) | 動作欄位 (CTableColumnActionType) |
|---------|--------------|---------------------------|----------------------------------|
| 代號 | `code` | `Text` | - |
| 名稱 | `name` | `Text` | - |
| 共同性系統 | `isSharedSystem` | `Text` | - |
| 廠商 | `vendorName` | `Text` | - |
| 狀態 | `status` | `Text` | - |
| 防護等級 | `protectionLevel` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 更新時間 | `updatedAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit`, `Delete` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `InformationSystemsDataModel` | `src/model/InformationSystemsDataModel.ts` |
| 列表查詢 | `InformationSystemsListDataModel` | `src/model/InformationSystemsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `InformationSystemsQueryParameter` | `src/query/InformationSystemsQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 啟用狀態 | `SystemStatus` | `src/enums/common.ts` |

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
| 系統名稱 | `name` | 字串 | - | 是 | - |
| 系統代號 | `code` | 字串 | - | 否 | - |
| 共同性系統 | `isSharedSystem` | 布林 | - | 是 | - |
| 狀態 | `status` | Enum | - | 是 | - |
| 承辦單位 | `handlingUnit` | 字串 | - | 是 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/information-systems`
- **新增頁面**: `/information-systems/create`
- **編輯頁面**: `/information-systems/edit/:systemId`
- **詳細頁面**: `/information-systems/detail/:systemId`

### 頁面標題

- **標題**: 資通系統基本資料維護

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
