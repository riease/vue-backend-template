# 系統防護需求等級評估表管理 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `ProtectionLevelAssessments` |
| 版本號碼 | 1.0.0 |
| 建立日期 | 2026-02-06 |
| 最後更新日期 | 2026-02-06 |
| 負責人員 | - |
| 相關需求文件 | `docs/features/系統防護需求等級評估表管理.feature` |

## 🔗 API 文件

- **API 規格檔案**: [`ProtectionLevelAssessments.yaml`](file:///Users/chi/Documents/ws_riease/ch3-library/vue-backend-template/doc/api/example/ProtectionLevelAssessments.yaml)
- **API 版本**: 1.0.0
- **Base URL**: `{baseUrl}/api/{version}/protection-level-assessments`

## 🎯 功能操作 (Actions)

> [!NOTE]
> 請參考 `ch3chi-commons-vue` 套件中的 `CTableColumnActionType` 列舉定義。

### 查詢

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢防護需求等級評估表清單 |
| 所需權限字串 | `protectionlevelassessments:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/protection-level-assessments` |
| 程式變數名稱 | `handleSearch`, `doSearchClick` |
| 對應 API Method | GET /api/{version}/protection-level-assessments |
| 對應 OperationId | `ProtectionLevelAssessments-Search` |

### 新增

| 項目 | 內容 |
|------|------|
| 名稱 | 新增防護需求等級評估表 |
| 所需權限字串 | `protectionlevelassessments:create` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `/protection-level-assessments/create` |
| 程式變數名稱 | `handleCreate`, `doCreateClick` |
| 對應 API Method | POST /api/{version}/protection-level-assessments |
| 對應 OperationId | `ProtectionLevelAssessments-Create` |

### 詳細

| 項目 | 內容 |
|------|------|
| 名稱 | 查詢防護需求等級評估表 |
| 所需權限字串 | `protectionlevelassessments:read` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/protection-level-assessments/detail/:assessmentId` |
| 程式變數名稱 | `handleRead`, `doReadClick` |
| 對應 API Method | GET /api/{version}/protection-level-assessments/{assessmentId} |
| 對應 OperationId | `ProtectionLevelAssessments-Read` |

### 編輯

| 項目 | 內容 |
|------|------|
| 名稱 | 更新防護需求等級評估表 |
| 所需權限字串 | `protectionlevelassessments:update` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | `/protection-level-assessments/edit/:assessmentId` |
| 程式變數名稱 | `handleUpdate`, `doUpdateClick` |
| 對應 API Method | PUT /api/{version}/protection-level-assessments/{assessmentId} |
| 對應 OperationId | `ProtectionLevelAssessments-Update` |

### 刪除

| 項目 | 內容 |
|------|------|
| 名稱 | 刪除防護需求等級評估表 |
| 所需權限字串 | `protectionlevelassessments:delete` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表操作欄 |
| 網址路由 | 無（在當前頁面執行） |
| 程式變數名稱 | `handleDelete`, `doDeleteClick` |
| 對應 API Method | DELETE /api/{version}/protection-level-assessments/{assessmentId} |
| 對應 OperationId | `ProtectionLevelAssessments-Delete` |

### 匯出

| 項目 | 內容 |
|------|------|
| 名稱 | 匯出防護需求等級評估表 |
| 所需權限字串 | `protectionlevelassessments:export` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | 無（觸發下載） |
| 程式變數名稱 | `handleExport`, `doExportClick` |
| 對應 API Method | GET /api/{version}/protection-level-assessments/export |
| 對應 OperationId | `ProtectionLevelAssessments-Export` |

---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `ProtectionLevelAssessmentsQueryParameter`
- **支援的查詢條件**:
  - `year` (評估年度)
  - `systemName` (資通系統名稱)
  - `overallLevel` (整體防護需求等級)
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
| 表單編號 | `formNumber` | `Text` | - |
| 評估年度 | `assessmentYear` | `Text` | - |
| 評估日期 | `assessmentDate` | `Date` | - |
| 評估狀態 | `assessmentStatusDisplayName` | `Text` | - |
| 整體防護等級 | `overallLevelDisplayName` | `Text` | - |
| 資通系統名稱 | `informationSystem.name` | `Text` | - |
| 建立時間 | `createdAt` | `Date` | - |
| 更新時間 | `updatedAt` | `Date` | - |
| 操作 | - | `Action` | `Detail`, `Edit`, `Delete` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `ProtectionLevelAssessmentsDataModel` | `src/model/ProtectionLevelAssessmentsDataModel.ts` |
| 列表查詢 | `ProtectionLevelAssessmentsListDataModel` | `src/model/ProtectionLevelAssessmentsListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `ProtectionLevelAssessmentsQueryParameter` | `src/query/ProtectionLevelAssessmentsQueryParameter.ts` |

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
| 評估日期 | `assessmentDate` | 字串 | - | 是 | - |
| 機密性等級 | `confidentialityLevel` | Enum | - | 是 | - |
| 機密性原因 | `confidentialityReason` | 字串 | - | 否 | - |
| 完整性等級 | `integrityLevel` | Enum | - | 是 | - |
| 完整性原因 | `integrityReason` | 字串 | - | 否 | - |
| 可用性等級 | `availabilityLevel` | Enum | - | 是 | - |
| 可用性原因 | `availabilityReason` | 字串 | - | 否 | - |
| 法律遵循性等級 | `legalLevel` | Enum | - | 是 | - |
| 法律遵循性原因 | `legalReason` | 字串 | - | 否 | - |
| 評估資通系統 | `systemUid` | 字串 | - | 否 | - |
| 評估人員 | `assessorUid` | 字串 | - | 否 | - |

---

## ✅ 驗證與錯誤處理

### 後端 API 錯誤碼

詳見 API 文件。

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/protection-level-assessments`
- **新增頁面**: `/protection-level-assessments/create`
- **編輯頁面**: `/protection-level-assessments/edit/:assessmentId`
- **詳細頁面**: `/protection-level-assessments/detail/:assessmentId`

### 頁面標題

- **標題**: 系統防護需求等級評估表管理

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | 2026-02-06 | 初始版本 | - |
