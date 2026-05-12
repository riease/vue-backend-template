---
name: generate-feature-spec
description: 產生功能需求規格單到 doc/spec 目錄，包含 API 文件、操作動作、列表欄位等完整規格定義
---

# generate-feature-spec Skill

此技能用於產生功能需求規格單，將功能規格以結構化的 Markdown 格式記錄到 `doc/spec` 目錄下。

## 使用時機

當需要為新功能或現有功能建立完整的規格文件時，使用此技能產生標準化的規格單範本。

## 使用模式

此技能支援兩種使用模式：

### 模式 1：互動式詢問（單一功能）
適用於單一功能的規格單產生，系統會逐步詢問使用者所需資訊。

### 模式 2：批次處理（多個 API 檔案）
適用於批次產生多個功能的規格單，使用者可以指定：
- 單一 API 檔案路徑
- 多個 API 檔案路徑（逗號分隔）
- 目錄路徑（處理該目錄下所有 `.yaml` 或 `.yml` 檔案）

**批次處理範例：**
```bash
# 處理單一檔案
doc/api/hardware-configuration.yaml

# 處理多個檔案
doc/api/hardware-configuration.yaml,doc/api/account.yaml,doc/api/risk-assessment.yaml

# 處理整個目錄
doc/api
```

## 輸入參數

### 互動式模式參數

執行此技能時，需要向使用者詢問以下資訊：

1. **需求功能名稱** (必填)
   - 功能的中文名稱，例如：「硬體配置管理」、「帳號管理」
   - 系統會根據中文名稱自動產生對應的英文前綴字（PascalCase），例如：
     - 「硬體配置管理」→ `HardwareConfiguration`
     - 「帳號管理」→ `Account`
     - 「風險評估記錄」→ `RiskAssessment`
   - 使用者可以確認或修改建議的英文前綴字

2. **對應的 API 文件路徑** (必填)
   - 相對於專案根目錄的路徑，例如：`doc/api/hardware-configuration.yaml`

3. **可進行的 Actions** (必填)
   - 以逗號分隔的動作列表，例如：`新增,編輯,刪除,匯出,查詢`

4. **是否包含列表查詢功能** (必填)
   - 回答 `是` 或 `否`

4.5 **Prototype HTML 檔案路徑** (選填)
   - 若提供，系統將優先從此 HTML 檔案解析列表欄位
   - 預設搜尋路徑：`doc/prototype/`
   - 例如：`doc/prototype/hardware_list.html`

5. **版本號碼** (選填，預設為 `1.0.0`)

6. **負責人員** (選填)

### 批次處理模式參數

當使用者指定要批次處理時，需要以下資訊：

1. **API 檔案來源** (必填)
   - 可以是以下任一格式：
     - 單一檔案路徑：`doc/api/hardware-configuration.yaml`
     - 多個檔案路徑（逗號分隔）：`doc/api/file1.yaml,doc/api/file2.yaml`
     - 目錄路徑：`doc/api`（處理目錄下所有 `.yaml` 和 `.yml` 檔案）

2. **版本號碼** (選填，預設為 `1.0.0`，套用到所有規格單)

3. **負責人員** (選填，套用到所有規格單)

4. **自動推斷功能名稱** (選填，預設為 `是`)
   - 若為 `是`，系統會從 API 檔案的 `info.title` 或檔案名稱推斷功能名稱
   - 若為 `否`，每個檔案都會詢問使用者功能名稱

5. **Prototype HTML 目錄** (選填，預設為 `doc/prototype`)
   - 系統會在此目錄下尋找與功能名稱匹配的 HTML 檔案（例如：`hardware_list.html`, `account_list.html`）
   - 若找到匹配檔案，將優先用於解析列表欄位

## 執行步驟

### 步驟 0：判斷使用模式

首先判斷使用者的使用模式：
- 如果使用者明確指定 API 檔案路徑或目錄 → 使用**批次處理模式**
- 否則 → 使用**互動式模式**

---

### 步驟 0.5：確認共用套件版本與定義

在產生規格單之前，請先確認 `ch3chi-commons-vue` 套件的版本，並檢查以下列舉中定義的項目：
1. `CTableColumnActionType`：列表操作按鈕類型
2. `CTableColumnType`：列表欄位顯示類型

**檢查方式：**
1. 檢查專案程式碼中對這些列舉的使用
   - 搜尋 `CTableColumnActionType.`
   - 搜尋 `CTableColumnType.`
2. 確認有哪些可用的類型（例如：`Text`, `Date`, `RowNumber`, `Action` 等）

---

## 互動式模式執行步驟

### 1. 確認目錄結構

確保 `doc/spec` 目錄存在：

```bash
mkdir -p doc/spec
```

### 2. 產生英文前綴字

根據使用者提供的中文功能名稱，自動產生對應的英文前綴字（PascalCase）：

**產生規則：**
1. 將中文名稱翻譯成英文
2. 移除「管理」、「系統」等通用後綴詞
3. 轉換為 PascalCase 格式
4. 向使用者確認或允許修改

**範例對照：**
- 「硬體配置管理」→ `HardwareConfiguration`
- 「帳號管理」→ `Account`
- 「風險評估記錄」→ `RiskAssessment`
- 「資產盤點」→ `AssetInventory`
- 「使用者權限設定」→ `UserPermission`

**注意事項：**
- 英文前綴字將用於：
  - Data Model 類別名稱：`{Prefix}DataModel`
  - Query Parameter 類別名稱：`{Prefix}QueryParameter`
  - 檔案命名：`{prefix}-spec.md`（kebab-case）
  - 路由路徑：`/{prefix-kebab-case}`

### 3. 產生規格單檔案

根據使用者提供的「需求功能名稱」，將其轉換為檔案名稱（使用 kebab-case），例如：
- 「硬體配置管理」 → `hardware-configuration-spec.md`
- 「帳號管理」 → `account-management-spec.md`

### 3. 填寫規格單範本

使用以下範本結構產生規格單內容：

```markdown
# [需求功能名稱] 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | [例如：`HardwareConfiguration`, `Account`] |
| 版本號碼 | [版本號碼，預設 1.0.0] |
| 建立日期 | [YYYY-MM-DD] |
| 最後更新日期 | [YYYY-MM-DD] |
| 負責人員 | [負責人員名稱] |
| 相關需求文件 | [連結或說明] |

## 🔗 API 文件

- **API 規格檔案**: [`[檔案名稱]`](file:///[絕對路徑])
- **API 版本**: [從 API 文件中讀取]

```markdown
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

### [Action 1 名稱，例如：新增]

| 項目 | 內容 |
|------|------|
| 名稱 | [例如：新增硬體配置] |
| 所需權限字串 | [例如：`hardware:create`] |
| 特殊啟用條件 | [例如：無 / 需管理員權限 / 特定狀態下可用] |
| 功能呈現位置 | [例如：列表頁面右上角 / 詳細頁面底部] |
| 網址路由 | [例如：`/hardware-configurations/create`] |
| 程式變數名稱 | [例如：`handleCreate`, `doCreateClick`] |
| 對應 API Method | [例如：POST /api/hardware-configurations] |
| 對應 OperationId | [從 API 文件中讀取] |

### [Action 2 名稱，例如：編輯]

| 項目 | 內容 |
|------|------|
| 名稱 | [例如：編輯硬體配置] |
| 所需權限字串 | [例如：`hardware:update`] |
| 特殊啟用條件 | [例如：僅可編輯自己建立的項目] |
| 功能呈現位置 | [例如：列表操作欄 / 詳細頁面] |
| 網址路由 | [例如：`/hardware-configurations/edit/:id`] |
| 程式變數名稱 | [例如：`handleEdit`, `doEditClick`] |
| 對應 API Method | [例如：PUT /api/hardware-configurations/{id}] |
| 對應 OperationId | [從 API 文件中讀取] |

### [Action 3 名稱，例如：刪除]

| 項目 | 內容 |
|------|------|
| 名稱 | [例如：刪除硬體配置] |
| 所需權限字串 | [例如：`hardware:delete`] |
| 特殊啟用條件 | [例如：需二次確認 / 僅可刪除未使用的項目] |
| 功能呈現位置 | [例如：列表操作欄] |
| 網址路由 | [例如：無（在當前頁面執行）/ `/hardware-configurations/delete/:id`] |
| 程式變數名稱 | [例如：`handleDelete`, `doDeleteClick`] |
| 對應 API Method | [例如：DELETE /api/hardware-configurations/{id}] |
| 對應 OperationId | [從 API 文件中讀取] |

### [其他 Actions...]

---

## 📊 列表查詢規格

> [!NOTE]
> 此區塊僅在功能包含列表查詢時填寫

### 查詢參數

- **Query Parameter 類別**: `[類別名稱]QueryParameter`
- **支援的查詢條件**: [列出可查詢的欄位]

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
| [例如：序號] | - | `RowNumber` | - |
| [例如：配置名稱] | `name` | `Text` | - |
| [例如：建立日期] | `createdAt` | `Date` | - |
| [例如：操作] | - | `Action` | `Edit`, `Delete` |

---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| [例如：新增/編輯表單] | `[ModelName]DataModel` | `src/model/[ModelName]DataModel.ts` |
| [例如：列表查詢] | `[ModelName]ListDataModel` | `src/model/[ModelName]ListDataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| [例如：列表查詢] | `[ModelName]QueryParameter` | `src/query/[ModelName]QueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| [例如：狀態] | `EnableDisableStatus` | `src/enums/common.ts` |

### 相依共用元件

**列表頁面元件：**
- `CTable`：列表查詢頁面使用的表格元件，支援分頁、排序功能

**表單欄位元件：**
- `CTextInputFormField`：文字輸入欄位元件
- `CTextAreaFormField`：多行文字輸入欄位元件
- `CSelectFormField`：下拉選單欄位元件
- `CRadioPlatFormField`：單選按鈕欄位元件
- `CCheckBoxPlatFormField`：多選核取方塊欄位元件
- `CDateFormField`：日期選擇欄位元件
- `CChangePasswordFormField`：密碼變更欄位元件（用於帳號管理）

**權限控制元件：**
- `HasPermission`：權限檢查元件，用於控制功能按鈕的顯示

---

## 📝 表單規格

> [!NOTE]
> 此區塊僅在功能包含新增/編輯表單時填寫

### 表單欄位定義

| 欄位名稱 | Property | 驗證規則 | 預設值 | 必填 | 說明 |
|---------|---------|---------|-------|------|------|
| [例如：配置名稱] | `name` | 字串，最大長度 100 | - | 是 | - |
| [例如：描述] | `description` | 字串，最大長度 500 | - | 否 | - |
| [例如：狀態] | `status` | Enum | `Enabled` | 是 | - |

### 表單佈局

[描述表單的佈局方式，例如：單欄、雙欄、分頁等]

### 欄位關聯邏輯

[描述欄位間的關聯，例如：]
- 當「類型」選擇「A」時，顯示「欄位 X」
- 當「狀態」為「停用」時，禁用「啟用日期」欄位

---

## ✅ 驗證與錯誤處理

### 前端驗證規則

- [列出前端驗證規則，例如：]
  - 配置名稱不可為空
  - Email 格式驗證
  - 日期範圍驗證

### 後端 API 錯誤碼

| 錯誤碼 | 錯誤訊息 | 處理方式 |
|-------|---------|---------|
| `400` | 參數驗證失敗 | 顯示後端回傳的錯誤訊息 |
| `403` | 權限不足 | 顯示「您沒有權限執行此操作」 |
| `404` | 資源不存在 | 顯示「找不到指定的資源」 |
| `409` | 資源衝突 | 顯示「該資源已存在或正在使用中」 |

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/[route-path]`
- **新增頁面**: `/[route-path]/create`
- **編輯頁面**: `/[route-path]/edit/:id`
- **詳細頁面**: `/[route-path]/detail/:id`

### 麵包屑導航

```
首頁 > [模組名稱] > [功能名稱]
```

### 頁面標題與說明

- **列表頁面標題**: [例如：硬體配置管理]
- **列表頁面說明**: [例如：管理系統中的硬體配置資訊]

### 特殊 UI 互動

[描述特殊的 UI 互動，例如：]
- 刪除前需顯示確認對話框
- 匯出功能會下載 Excel 檔案
- 批次操作需先勾選項目

---

## 📌 備註與限制

### 已知限制

- [列出已知的限制，例如：]
  - 單次匯出最多 1000 筆資料
  - 不支援批次刪除

### 特殊注意事項

- [列出特殊注意事項，例如：]
  - 刪除操作不可復原
  - 狀態變更會影響相關聯的資源

### 未來擴充方向

- [列出未來可能的擴充功能，例如：]
  - 支援批次匯入
  - 支援自訂欄位
  - 支援版本控制

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| 1.0.0 | [YYYY-MM-DD] | 初始版本 | [負責人員] |
```

### 4. 讀取 API 文件資訊

在產生規格單時，應該：

1. 讀取指定的 API YAML 檔案
2. 解析 API 版本、endpoints、operationId 等資訊
3. 自動填入對應的 API Method 和 OperationId 到 Actions 區塊
4. 如果 API 文件中有定義 schema，可以預填表單欄位定義

### 5. 產生檔案

將填寫完成的規格單內容寫入到 `doc/spec/[功能名稱-kebab-case]-spec.md`

---

## 批次處理模式執行步驟

### 1. 確認目錄結構

確保 `doc/spec` 目錄存在：

```bash
mkdir -p doc/spec
```

### 1.5 確認共用套件定義

掃描專案程式碼，確認以下列舉中定義的可用項目：

1. **`CTableColumnActionType`** (操作類型)
   - 常見定義：`Edit`, `Delete`, `Review`, `Vote`, `Check`, `Export`

2. **`CTableColumnType`** (欄位類型)
   - 常見定義：`Text`, `Date`, `RowNumber`, `Action`

### 2. 解析 API 檔案來源

根據使用者提供的來源，解析出所有需要處理的 API 檔案：

**情況 A：單一檔案**
```
輸入：doc/api/hardware-configuration.yaml
結果：[doc/api/hardware-configuration.yaml]
```

**情況 B：多個檔案（逗號分隔）**
```
輸入：doc/api/file1.yaml,doc/api/file2.yaml,doc/api/file3.yaml
結果：[doc/api/file1.yaml, doc/api/file2.yaml, doc/api/file3.yaml]
```

**情況 C：目錄路徑**
```
輸入：doc/api
動作：掃描目錄下所有 .yaml 和 .yml 檔案
結果：[doc/api/hardware-configuration.yaml, doc/api/account.yaml, ...]
```

### 3. 逐一處理每個 API 檔案

對於每個 API 檔案，執行以下步驟：

#### 3.1 讀取 API 檔案內容

解析 YAML 檔案，提取以下資訊：
- `info.title`：作為功能名稱的候選
- `info.version`：API 版本
- `paths`：所有 API endpoints
- `components.schemas`：資料結構定義

#### 3.2 推斷功能名稱和英文前綴字

**自動推斷規則：**

1. **從 API 檔案推斷功能名稱**：
   - 優先使用 `info.title`（如果存在）
   - 否則使用檔案名稱（移除 `.yaml` 或 `.yml` 副檔名）
   - 範例：
     - `info.title: "Hardware Configuration API"` → 功能名稱：`硬體配置`
     - 檔案名稱：`hardware-configuration.yaml` → 功能名稱：`硬體配置`

2. **從功能名稱推斷英文前綴字**：
   - 如果 `info.title` 是英文，直接轉換為 PascalCase
   - 如果是中文或從檔案名稱推斷，按照前述規則產生英文前綴字
   - 範例：
     - `hardware-configuration.yaml` → `HardwareConfiguration`
     - `account.yaml` → `Account`

3. **如果使用者設定「自動推斷功能名稱」為 `否`**：
   - 對每個檔案詢問使用者確認或輸入功能名稱

#### 3.3 分析 API Endpoints 推斷 Actions

從 `paths` 中分析所有 endpoints，自動推斷可用的 Actions：

| HTTP Method | Path Pattern | 推斷 Action |
|-------------|--------------|-------------|
| `POST` | `/api/{resource}` | 新增 |
| `PUT` | `/api/{resource}/{id}` | 編輯 |
| `DELETE` | `/api/{resource}/{id}` | 刪除 |
| `GET` | `/api/{resource}` (有 query params) | 查詢/列表 |
| `GET` | `/api/{resource}/{id}` | 詳細 |
| `GET` | `/api/{resource}/export` | 匯出 |

**自動填入 Action 資訊：**
- **名稱**：根據 HTTP Method 和 Path 推斷
- **對應 API Method**：直接從 API 文件讀取
- **對應 OperationId**：從 API 文件的 `operationId` 讀取
- **網址路由**：根據 endpoint 路徑轉換（例如：`/api/hardware-configurations` → `/hardware-configurations`）
- **程式變數名稱**：根據 operationId 或 action 類型產生（例如：`handleCreate`, `handleEdit`）

#### 3.4 判斷是否包含列表查詢

檢查是否存在符合以下條件的 endpoint：
- HTTP Method 為 `GET`
- Path 為資源集合路徑（例如：`/api/hardware-configurations`）
- 定義了 query parameters（例如：`offset`, `limit`, `search`）

如果符合，則自動設定「包含列表查詢功能」為 `是`。

#### 3.5 解析列表欄位（如果包含列表查詢）
 
 **優先順序**：Prototype HTML > API Response Schema
 
 **方法 A：從 Prototype HTML 解析（優先）**
 如果找得到對應的 Prototype HTML 檔案（由使用者指定或是自動匹配）：
 1. 讀取 HTML 檔案內容
 2. 解析 `<table>` 內的 `<thead>` 或 `<tr>` 中的 `<th>` 標籤
 3. 提取欄位名稱作為「顯示文字」
 4. 推斷欄位類型：
    - 如果欄位名稱包含「操作」、「Action」，設定為 `Action` 類型
    - 其他欄位預設為 `Text` 類型，或嘗試與 API schema 比對以獲得更精確類型
 
 **方法 B：從 API 文件解析（備案）**
 如果沒有 Prototype HTML，則從 API response schema 解析：
 
 1. 找到列表查詢 endpoint 的 response schema
 2. 解析 `items` 或 `data` 中的 properties
 3. 自動產生 Column 定義：
    - **顯示文字**：從 property 的 `description` 或 property 名稱推斷
    - **Property 名稱**：直接使用 property key
    - **資料格式**：根據 property 的 `type` 和 `format` 推斷
      - `type: string, format: date-time` → 日期時間 (YYYY-MM-DD HH:mm:ss)
      - `type: string, format: date` → 日期 (YYYY-MM-DD)
      - `type: number` → 數字
      - `type: boolean` → 布林值
      - `enum: [...]` → Enum
 
 #### 3.6 產生規格單檔案
 
 使用自動推斷和解析的資訊，產生規格單檔案到 `doc/spec/[prefix-kebab-case]-spec.md`

### 4. 產生批次處理報告

處理完所有檔案後，產生摘要報告：

```
批次處理完成！

處理結果：
✓ doc/api/hardware-configuration.yaml → doc/spec/hardware-configuration-spec.md
✓ doc/api/account.yaml → doc/spec/account-spec.md
✓ doc/api/risk-assessment.yaml → doc/spec/risk-assessment-spec.md

共處理 3 個 API 檔案，成功產生 3 個規格單。
```

---

## 輸出

### 互動式模式輸出

執行完成後，應該：

1. 顯示產生的規格單檔案路徑
2. 提示使用者檢視並補充規格單中的待填欄位
3. 建議使用者根據實際需求調整範本內容

### 批次處理模式輸出

執行完成後，應該：

1. 顯示批次處理摘要報告（包含成功/失敗的檔案清單）
2. 列出所有產生的規格單檔案路徑
3. 提示使用者檢視並補充規格單中的自動推斷欄位
4. 如果有任何檔案處理失敗，顯示錯誤訊息和原因

## 範例

### 範例 1：互動式模式

假設使用者提供以下資訊：

- 需求功能名稱: `硬體配置管理`
- 系統建議英文前綴字: `HardwareConfiguration`（使用者確認）
- API 文件路徑: `doc/api/hardware-configuration.yaml`
- Actions: `新增,編輯,刪除,查詢`
- 包含列表查詢: `是`
- 版本號碼: `1.0.0`
- 負責人員: `張三`

則會產生檔案：`doc/spec/hardware-configuration-spec.md`

規格單中會自動填入：
- 功能英文前綴字：`HardwareConfiguration`
- Data Model：`HardwareConfigurationDataModel`
- Query Parameter：`HardwareConfigurationQueryParameter`
- 路由路徑：`/hardware-configurations/*`

### 範例 2：批次處理模式（處理整個目錄）

假設使用者提供以下資訊：

- API 檔案來源: `doc/api`
- 版本號碼: `1.0.0`
- 負責人員: `李四`
- 自動推斷功能名稱: `是`

假設 `doc/api` 目錄下有以下檔案：
- `hardware-configuration.yaml`
- `account.yaml`
- `risk-assessment.yaml`

系統會：
1. 掃描目錄，找到 3 個 YAML 檔案
2. 逐一解析每個檔案，自動推斷功能名稱和英文前綴字
3. 分析 API endpoints，自動產生 Actions
4. 產生 3 個規格單檔案：
   - `doc/spec/hardware-configuration-spec.md`
   - `doc/spec/account-spec.md`
   - `doc/spec/risk-assessment-spec.md`

### 範例 3：批次處理模式（指定多個檔案）

假設使用者提供以下資訊：

- API 檔案來源: `doc/api/hardware-configuration.yaml,doc/api/account.yaml`
- 版本號碼: `1.0.0`
- 自動推斷功能名稱: `否`

系統會：
1. 解析出 2 個檔案
2. 對每個檔案詢問使用者確認功能名稱
3. 產生 2 個規格單檔案

## 注意事項

1. **英文前綴字命名規範**：
   - 使用 PascalCase 格式
   - 避免使用縮寫，除非是業界通用縮寫（如 `API`, `ID`）
   - 移除「管理」、「系統」等通用後綴詞
   - 確保與現有程式碼命名風格一致
   
2. 規格單範本中的 `[...]` 標記需要根據實際情況填寫

3. 如果 API 文件中有定義 schema，應盡可能自動填入相關資訊

4. 對於可選區塊（如表單規格、列表查詢規格），根據使用者輸入決定是否包含

5. 所有檔案路徑連結應使用絕對路徑格式：`file:///[絕對路徑]`

6. **日期與時間格式規範**：
   - 日期格式統一使用 `YYYY-MM-DD`
   - 日期時間格式統一使用 `YYYY-MM-DD HH:mm:ss`

7. 權限字串建議使用格式：`[模組]:[動作]`，例如：`hardware:create`

8. **英文前綴字的應用**：
   - Data Model 類別：`{Prefix}DataModel`, `{Prefix}ListDataModel`
   - Query Parameter 類別：`{Prefix}QueryParameter`
   - 檔案名稱：`{prefix-kebab-case}-spec.md`
   - 路由路徑：`/{prefix-kebab-case}/...`
   - 權限字串：`{prefix-lowercase}:action`
