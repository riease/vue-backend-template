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

## 🤖 Claude Code Skills

本專案內建一組 Claude Code Skills（放在 `.claude/skills/`），協助自動化常見的後台開發任務，包括專案初始化、由 OpenAPI 規格產生 TypeScript 程式碼、產生功能規格單等。

> 前置條件：請先安裝 [Claude Code](https://claude.com/claude-code)，並在專案根目錄啟動。Skills 會在啟動後自動載入，可直接以 `/<skill-name>` 觸發。

### Skills 一覽

| Skill | 用途 | 觸發指令 |
|---|---|---|
| `setup-vue-backend` | 安裝標準 Vue 3 依賴並設定 `package.json` 的 scripts/alias | `/setup-vue-backend` |
| `generate-feature-spec` | 由 `doc/api` 的 OpenAPI 規格產生功能規格單到 `doc/spec` | `/generate-feature-spec` |
| `resolve-api-to-enum` | 由 OpenAPI 規格產生 TypeScript 列舉至 `src/enums/` | `/resolve-api-to-enum` |
| `resolve-api-to-model` | 由 OpenAPI 規格產生 `BaseFormDataModel` 子類別至 `src/model/` | `/resolve-api-to-model` |
| `resolve-api-to-query` | 由 OpenAPI 規格產生 `QueryParameter` 子類別 | `/resolve-api-to-query` |

### 建議流程：從零初始化專案

1. **建立 Vue 後台樣板基礎建設**

   ```text
   /setup-vue-backend
   ```

   會安裝核心套件（Vue / Axios / Pinia / vee-validate / yup / Bootstrap / `ch3chi-commons-vue` 等），並設定 `vite.config.ts` 的 `@` alias 與 `tsconfig` 路徑。

2. **將 OpenAPI 規格放到 `doc/api/`**

   ```text
   doc/api/
   ├── account.yaml
   ├── hardware-configuration.yaml
   └── ...
   ```

   > 📦 範例：`doc/api/example/` 已附上一組可參考的去識別化 OpenAPI 規格（Accounts、Tenants、HardwareConfigurations 等），對應的功能規格單放在 `doc/spec/example/`，可作為 skills 產生流程的範本。

3. **產生功能規格單**

   ```text
   /generate-feature-spec
   ```

   - 互動模式：逐項詢問功能名稱、Actions、是否包含列表查詢等。
   - 批次模式：直接指定 `doc/api` 目錄，產生所有規格單到 `doc/spec/`。

4. **產生列舉型別（Enums）**

   ```text
   /resolve-api-to-enum
   ```

   會掃描 `doc/api/` 中所有具 `enum` 屬性的欄位，並輸出至 `src/enums/`（通用列舉放 `common.ts`，特定領域如 `user.ts`、`order.ts`）。

5. **產生 Data Model**

   ```text
   /resolve-api-to-model
   ```

   為每個資源產生 `XxxDataModel.ts`，繼承 `BaseFormDataModel`，並依 OpenAPI 約束自動產出 Yup 驗證與 `toPayloadMap()`。

6. **產生 Query Parameter**

   ```text
   /resolve-api-to-query
   ```

   或直接執行底層腳本：

   ```bash
   node .claude/skills/resolve-api-to-query/scripts/generate-query-params.js \
     --input doc/api \
     --output src/model/ACQueryParameter.ts
   ```

7. **格式化產生的程式碼**

   ```bash
   npm run format
   ```

### 預設輸出位置

| 產出 | 路徑 |
|---|---|
| 功能規格單 | `doc/spec/<feature>-spec.md` |
| 列舉型別 | `src/enums/<domain>.ts` |
| Data Model | `src/model/<Feature>DataModel.ts` |
| Query Parameter | `src/model/ACQueryParameter.ts` |
| 共用驗證 Pattern | `src/model/validationRule/CommonRegexPattern.ts` |

### 目錄結構參考

```text
.
├── .claude/
│   └── skills/                  # Claude Code 可用 skills
│       ├── setup-vue-backend/
│       ├── generate-feature-spec/
│       ├── resolve-api-to-enum/
│       ├── resolve-api-to-model/
│       └── resolve-api-to-query/
│           └── scripts/
├── doc/
│   ├── api/
│   │   └── example/             # 去識別化 OpenAPI 範例規格
│   └── spec/
│       └── example/             # 對應 example 規格的功能規格單
└── src/
    ├── enums/                   # 產生的列舉
    └── model/                   # 產生的 DataModel / QueryParameter
```

### 📦 內附範例 (Example Bundle)

`doc/api/example/` 與 `doc/spec/example/` 內附完整且已去識別化的範例集，示範一個典型的後台系統有哪些 API 與規格單：

| 主題 | OpenAPI 規格 | 功能規格單 |
|---|---|---|
| 共用查詢（角色、年度、租戶等） | `doc/api/example/Common.yaml` | — |
| 認證 / 個人資訊 | `Auth.yaml`, `Me.yaml` | — |
| 帳號管理 | `Accounts.yaml` | `accounts-spec.md` |
| 租戶管理 | `Tenants.yaml` | `tenants-spec.md` |
| 硬體 / 軟體 / 資訊組態 | `HardwareConfigurations.yaml`, `SoftwareConfigurations.yaml`, `InformationConfigurations.yaml`, `InfrastructureConfigurations.yaml`, `PeopleConfigurations.yaml` | 對應同名 `*-spec.md` |
| 資通系統與盤點 | `InformationSystems.yaml`, `SystemInventories.yaml`, `SystemChecklists.yaml` | 對應同名 `*-spec.md` |
| 防護等級評估 | `ProtectionLevelAssessments.yaml` | `protection-level-assessments-spec.md` |

**OperationId 命名慣例**：採 `{Resource}-{Action}` 形式，例如 `Accounts-Create`、`Tenants-Search`、`HardwareConfigurations-Update`。`AccountDataModel.ts` 中的 `toPayloadMap()` key 即對應這些 operationId。

**試跑流程**：可直接以 `doc/api/example/` 為輸入測試本專案內附 skills，例如：

```bash
node .claude/skills/resolve-api-to-query/scripts/generate-query-params.js \
  --input doc/api/example \
  --output src/model/ExampleQueryParameter.ts
```
