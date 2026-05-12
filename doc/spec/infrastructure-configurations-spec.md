# 資訊服務基礎組態管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `InfrastructureConfigurations` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/資訊服務基礎組態管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`AR3-InfrastructureConfigurations.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/AR3-InfrastructureConfigurations.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/infrastructure-configurations`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 新增

| 項目 | 內容 |
|------|------|
| 名稱 | 新增資訊服務基礎組態 |
| 所需權限字串 | `infrastructureconfigurations:create` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/infrastructure-configurations/create` |
| 程式變數名稱 | `handleCreate`, `doCreateClick` |
| 對應 API Method | POST /api/{version}/infrastructure-configurations |
| 對應 OperationId | `createInfrastructureConfiguration` |

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢資訊服務基礎組態列表 |
| 所需權限字串 | `infrastructureconfigurations:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/infrastructure-configurations` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/infrastructure-configurations |
| 對應 OperationId | `searchInfrastructureConfigurations` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢資訊服務基礎組態 |
| 所需權限字串 | `infrastructureconfigurations:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/infrastructure-configurations/detail/:uid` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/infrastructure-configurations/{uid} |
| 對應 OperationId | `readInfrastructureConfiguration` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新資訊服務基礎組態 |
| 所需權限字串 | `infrastructureconfigurations:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/infrastructure-configurations/edit/:uid` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/infrastructure-configurations/{uid} |
| 對應 OperationId | `updateInfrastructureConfiguration` |

### 刪除

| 項目 | 內容 |
|------|------|
| 名稱 | 刪除資訊服務基礎組態 |
| 所需權限字串 | `infrastructureconfigurations:delete` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | 無（在當前頁面執行） |
| 程式變數名稱 | `handleDelete`, `doDeleteClick` |
| 對應 API Method | DELETE /api/{version}/infrastructure-configurations/{uid} |
| 對應 OperationId | `deleteInfrastructureConfiguration` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `InfrastructureConfigurationsQueryParameter`
- **支援的查詢條件**:
  - `configurationCode` (組態編號)
  - `name` (資產名稱)
  - `subcategory` (子類別)
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
| 組態編號 | `configurationCode` | `Text` | - |
| 資產名稱 | `name` | `Text` | - |
| 組態類別 | `categoryDisplayName` | `Text` | - |
| 組態子類別 | `subcategoryDisplayName` | `Text` | - |
| 狀態 | `status` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 更新時間 | `updatedAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit`, `Delete` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `InfrastructureConfigurationsDataModel` | `src/model/InfrastructureConfigurationsDataModel.ts` |
| 列表查詢 | `InfrastructureConfigurationsListDataModel` | `src/model/InfrastructureConfigurationsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `InfrastructureConfigurationsQueryParameter` | `src/query/InfrastructureConfigurationsQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 啟用狀態 | `ConfigurationStatus` | `src/enums/common.ts` |

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
| 組態編號 | `configurationCode` | 字串 | - | 是 | - |
| 資產名稱 | `name` | 字串 | - | 是 | - |
| 組態分類 | `category` | 字串 | - | 是 | - |
| 組態子分類 | `subcategory` | 字串 | - | 是 | - |
| 資產所在地點 | `location` | 字串 | - | 是 | - |
| 狀態 | `status` | Enum | - | 是 | - |
| 關聯資通系統 | `informationSystemUids` | 陣列 | - | 是 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/infrastructure-configurations`
- **新增頁面**: `/infrastructure-configurations/create`
- **編輯頁面**: `/infrastructure-configurations/edit/:uid`
- **詳細頁面**: `/infrastructure-configurations/detail/:uid`

### 頁面標題

- **標題**: 資訊服務基礎組態管理

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
