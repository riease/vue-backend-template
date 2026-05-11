# 帳號管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `Accounts` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/帳號管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`AR3-Accounts.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/AR3-Accounts.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/accounts`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。
> 常見項目包括：
> - `Edit` (編輯)
> - `Delete` (刪除)
> - `Review` (審核)
> - `Vote` (投票)
> - `Check` (勾選/確認)
> - `Export` (匯出)

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢帳號清單 |
| 所需權限字串 | `accounts:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/accounts` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/accounts |
| 對應 OperationId | `AR3-Accounts-Search` |

### 新增

| 項目 | 內容 |
|------|------|
| 名稱 | 新增帳號 |
| 所需權限字串 | `accounts:create` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/accounts/create` |
| 程式變數名稱 | `handleCreate`, `doCreateClick` |
| 對應 API Method | POST /api/{version}/accounts |
| 對應 OperationId | `AR3-Accounts-Create` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢帳號 |
| 所需權限字串 | `accounts:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/accounts/detail/:accountId` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/accounts/{accountId} |
| 對應 OperationId | `AR3-Accounts-Read` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新帳號 |
| 所需權限字串 | `accounts:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/accounts/edit/:accountId` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/accounts/{accountId} |
| 對應 OperationId | `AR3-Accounts-Update` |

### 刪除

| 項目 | 內容 |
|------|------|
| 名稱 | 刪除帳號 |
| 所需權限字串 | `accounts:delete` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | 無（在當前頁面執行） |
| 程式變數名稱 | `handleDelete`, `doDeleteClick` |
| 對應 API Method | DELETE /api/{version}/accounts/{accountId} |
| 對應 OperationId | `AR3-Accounts-Delete` |

### 變更密碼

| 項目 | 內容 |
|------|------|
| 名稱 | 管理員變更帳號密碼 |
| 所需權限字串 | `accounts:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 / 編輯頁面 |
| 網址路由 | 無（彈出視窗） |
| 程式變數名稱 | `handleChangePassword`, `doChangePasswordClick` |
| 對應 API Method | POST /api/{version}/accounts/{accountId}/password |
| 對應 OperationId | `AR3-Accounts-ChangePassword` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `AccountsQueryParameter`
- **支援的查詢條件**:
  - `roleUid` (角色識別碼)
  - `username` (帳號代號)
  - `status` (啟用狀態)
  - `limit` (回傳筆數上限)
  - `offset` (查詢位移量)
  - `sortBy` (排序欄位)
  - `sortOrder` (排序方向)

### 列表欄位 (Columns)

> [!NOTE]
> 欄位類型請參考 `CTableColumnType` 列舉定義。
> 常見項目包括：
> - `Text` (文字)
> - `Date` (日期時間)
> - `RowNumber` (序號)
> - `Action` (操作欄位)

| 顯示文字 | Property 名稱 | 資料格式 (CTableColumnType) | 動作欄位 (CTableColumnActionType) |
|---------|--------------|---------------------------|----------------------------------|
| 序號 | - | `RowNumber` | - |
| 帳號 | `username` | `Text` | - |
| 姓名 | `displayName` | `Text` | - |
| Email | `email` | `Text` | - |
| 狀態 | `status` | `Text` | - |
| 角色 | `role.name` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit`, `Delete`, `ChangePassword` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `AccountsDataModel` | `src/model/AccountsDataModel.ts` |
| 列表查詢 | `AccountsListDataModel` | `src/model/AccountsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `AccountsQueryParameter` | `src/query/AccountsQueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| 啟用狀態 | `AccountsStatus` | `src/enums/common.ts` |
| 排序方向 | `SortOrderParam` | `src/enums/common.ts` |

### 相依共用元件

**列表頁面元件：**
- `CTable`

**表單欄位元件：**
- `CTextInputFormField`
- `CSelectFormField`
- `CChangePasswordFormField`

**權限控制元件：**
- `HasPermission`

---

## 📝 表單規格

> [!NOTE]
> 此功能包含新增/編輯表單

### 表單欄位定義

| 欄位名稱 | Property | 驗證規則 | 預設值 | 必填 | 說明 |
|---------|---------|---------|-------|------|------|
| 帳號代號 | `username` | 字串 4-64 碼 | - | 是 | - |
| 密碼 | `password` | 密碼格式 | - | 是 | 新增時必填 |
| 確認密碼 | `passwordConfirm` | 須與密碼一致 | - | 是 | 新增時必填 |
| 角色 | `roleUid` | UUID | - | 是 | - |
| 姓名 | `displayName` | 字串 | - | 是 | - |
| Email | `email` | Email 格式 | - | 是 | - |
| 狀態 | `status` | Enum | `ENABLED` | 是 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/accounts`
- **新增頁面**: `/accounts/create`
- **編輯頁面**: `/accounts/edit/:accountId`
- **詳細頁面**: `/accounts/detail/:accountId`

### 頁面標題

- **標題**: 帳號管理

---

##  變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
