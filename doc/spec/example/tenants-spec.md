# 租戶(客戶)管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `Tenants` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/租戶管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`Tenants.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/example/Tenants.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/tenants`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢租戶列表 |
| 所需權限字串 | `tenants:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/tenants` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/tenants |
| 對應 OperationId | `Tenants-Search` |

### 新增

| 項目 | 內容 |
|------|------|
| 名稱 | 新增租戶 |
| 所需權限字串 | `tenants:create` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/tenants/create` |
| 程式變數名稱 | `handleCreate`, `doCreateClick` |
| 對應 API Method | POST /api/{version}/tenants |
| 對應 OperationId | `Tenants-Create` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢租戶 |
| 所需權限字串 | `tenants:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/tenants/detail/:tenantId` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/tenants/{tenantId} |
| 對應 OperationId | `Tenants-Read` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新租戶 |
| 所需權限字串 | `tenants:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/tenants/edit/:tenantId` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/tenants/{tenantId} |
| 對應 OperationId | `Tenants-Update` |

### 刪除

| 項目 | 內容 |
|------|------|
| 名稱 | 刪除租戶 |
| 所需權限字串 | `tenants:delete` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | 無（在當前頁面執行） |
| 程式變數名稱 | `handleDelete`, `doDeleteClick` |
| 對應 API Method | DELETE /api/{version}/tenants/{tenantId} |
| 對應 OperationId | `Tenants-Delete` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `TenantsQueryParameter`
- **支援的查詢條件**:
  - `keyword` (模糊比對租戶代碼或名稱)
  - `status` (啟用狀態)
  - `limit` (回傳筆數上限)
  - `offset` (查詢位移量)

### 列表欄位 (Columns)

> [!NOTE]
> 欄位類型請參考 `CTableColumnType` 列舉定義。

| 顯示文字 | Property 名稱 | 資料格式 (CTableColumnType) | 動作欄位 (CTableColumnActionType) |
|---------|--------------|---------------------------|----------------------------------|
| 租戶代碼 | `code` | `Text` | - |
| 租戶名稱 | `name` | `Text` | - |
| 說明 | `description` | `Text` | - |
| 狀態 | `status` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 更新時間 | `updatedAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit`, `Delete` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `TenantsDataModel` | `src/model/TenantsDataModel.ts` |
| 列表查詢 | `TenantsListDataModel` | `src/model/TenantsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `TenantsQueryParameter` | `src/query/TenantsQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 啟用狀態 | `TenantStatus` | `src/enums/common.ts` |

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
| 租戶代碼 | `code` | 字串 | - | 否 | 若省略將由系統自動產生 |
| 租戶名稱 | `name` | 字串 | - | 是 | - |
| 描述 | `description` | 字串 | - | 否 | - |
| 狀態 | `status` | Enum | `ENABLED` | 否 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/tenants`
- **新增頁面**: `/tenants/create`
- **編輯頁面**: `/tenants/edit/:tenantId`
- **詳細頁面**: `/tenants/detail/:tenantId`

### 頁面標題

- **標題**: 租戶(客戶)管理

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
