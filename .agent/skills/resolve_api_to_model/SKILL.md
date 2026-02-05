---
name: resolve-api-to-model
description: Reads an OpenAPI specification (YAML/JSON) and generates a TypeScript Data Model class for Vue forms. The generated class inherits from BaseFormDataModel and handles multiple form modes (create, edit, etc.) with proper Yup validation and payload mapping.
---

# Resolve API to Model Skill

This skill guides the agent to generate a TypeScript Data Model class from an OpenAPI specification. The model is designed for Vue applications using `BaseFormDataModel` and `yup` for validation.

## Usage

Use this skill when you need to create a new Data Model for a feature (e.g., "Create/Edit User", "Create/Edit Order") based on backend API definitions.

**Required Inputs:**

1.  **OpenAPI Spec File**: Path to the `.yaml` or `.json` file.
2.  **Target Model Name**: Class name (e.g., `UserDataModel`).
3.  **Form Modes Mapping**: Map of `formMode` string to `Operation ID` or `Path + Method`.
    - Example: `create` -> `POST /users`, `edit` -> `PUT /users/{id}`, `me` -> `PUT /me`

**預設值 (Defaults):**

- **API 規格檔案路徑**: 若未指定完整路徑，預設從 `doc/api` 目錄下尋找。
- **Model Name**: 若未明確指定，預設使用 API endpoint 名稱或 path 作為 Model 名稱（例如：`/users` -> `UserDataModel`）。
- **API Method 對應**:
  - `create` 模式預設對應 `POST` 方法
  - `edit` 模式預設對應 `PUT` 方法

## Steps

### 1. Read and Analyze OpenAPI Spec

**處理預設值:**

- 如果 OpenAPI Spec File 預設路徑為相對於專案根目錄的 `doc/api/` 目錄下。
- 如果未提供 Target Model Name，則從主要 API endpoint path 推導：
  - 移除路徑參數（例如：`/users/{id}` -> `/users`）
  - 取最後一個路徑段落並轉為 PascalCase（例如：`/users` -> `User`）
  - 加上 `DataModel` 後綴（例如：`User` -> `UserDataModel`）
- 如果 Form Modes Mapping 未明確指定 HTTP 方法，則套用預設對應：
  - `create` 模式 -> `POST` 方法
  - `edit` 模式 -> `PUT` 方法

Read the provided OpenAPI spec file. Locate the request body schemas for the specified operations.

### 2. Determine Class Properties

- Identify the union of all fields from the request bodies of _all_ mapped modes.
- For each field, determine:
  - **Type**:
    - **優先檢查列舉**: 若欄位值符合已產生的列舉定義(在 `src/enums/` 中),使用該列舉型別
    - **基本型別**: `string`, `number`, `boolean`, `Date`
    - **複雜型別**: nested object (create sub-models if needed)
    - **範例**: 若 `status` 欄位的值為 `['active', 'inactive']`,且已有 `Status` 列舉,則使用 `Status` 型別
  - **Optional**: All properties should be declared as optional using `?:` syntax.
  - **Required**: Check if the field is required in _at least one_ mode (this affects validation, not property declaration).
  - **Description**: Use the `description` from the spec as a JSDoc comment.
  - **Default Value**: Do not initialize optional properties with default values in declaration.

### 3. Generate Validation Rules (First Time Only)

**重要**: 驗證規則應定義在 `src/model/validationRule` 資料夾下。

如果專案中尚未建立 `CommonRegexPattern`,請先建立 `src/model/validationRule/CommonRegexPattern.ts`:

```typescript
/**
 * 常用的 Regex Pattern 集合
 * 用於 Yup 驗證規則中的 matches() 方法
 */
export const CommonRegexPattern = {
  // 常用的正規表達式 Pattern
  EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE_PATTERN: /^09\d{8}$/,
  USERNAME_PATTERN: /^[a-zA-Z0-9_]{4,20}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  ALPHANUMERIC_PATTERN: /^[a-zA-Z0-9]+$/,
  NUMERIC_PATTERN: /^\d+$/,
  URL_PATTERN: /^https?:\/\/.+/,
} as const;
```

**注意**: `src/model/validationRule` 資料夾用來放置所有驗證規則相關的檔案。未來可以在此資料夾下新增其他特定領域的 Pattern 檔案。

### 4. Generate TypeScript Data Model Class

Create a new file (e.g., `src/model/UserDataModel.ts`). Structure the class as follows:

```typescript
import { BaseFormDataModel } from "ch3chi-commons-vue";
import { object, string, number, boolean } from "yup";
import { CommonRegexPattern } from "./validationRule/CommonRegexPattern";
// 引入列舉型別 (若欄位符合列舉定義)
import type { UserRole, UserStatus } from "@/enums/user";

export class UserDataModel extends BaseFormDataModel {
  // Properties - 全部使用 Optional 宣告
  // 若欄位符合列舉定義,使用列舉型別
  username?: string;
  email?: string;
  password?: string;
  displayName?: string;
  age?: number;
  isActive?: boolean;
  role?: UserRole; // 使用列舉型別
  status?: UserStatus; // 使用列舉型別
  // ... other properties

  constructor(data?: Partial<UserDataModel>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  // Define which fields are used in each mode
  dataFieldNameList(): string[] {
    if (this.formMode === "create") {
      return ["username", "email", "password"];
    } else if (this.formMode === "edit") {
      return ["email", "displayName"];
    }
    return [];
  }

  // Define validation rules for each mode
  // 使用 Yup native 方式定義,需要 Pattern 時引用 CommonRegexPattern
  initFormSchema(): any {
    if (this.formMode === "create") {
      return object({
        username: string()
          .required("使用者名稱為必填")
          .min(4, "使用者名稱至少需要 4 個字元")
          .matches(
            CommonRegexPattern.USERNAME_PATTERN,
            "使用者名稱只能包含英文、數字和底線",
          ),
        email: string()
          .required("電子郵件為必填")
          .email("請輸入有效的電子郵件"),
        password: string()
          .required("密碼為必填")
          .min(8, "密碼至少需要 8 個字元")
          .matches(
            CommonRegexPattern.PASSWORD_PATTERN,
            "密碼必須包含大小寫字母和數字",
          ),
      });
    } else if (this.formMode === "edit") {
      return object({
        email: string()
          .required("電子郵件為必填")
          .email("請輸入有效的電子郵件"),
        displayName: string().required("顯示名稱為必填"),
      });
    }
    return object({});
  }

  // Map local properties to API payload structure
  // Key 使用 OpenAPI 規格中的 OperationId
  toPayloadMap(): Record<string, Record<string, any>> {
    return {
      "AR3-Users-Create": {
        username: this.username,
        email: this.email,
        password: this.password,
      },
      "AR3-Users-Update": {
        email: this.email,
        displayName: this.displayName,
      },
    };
  }
}
```

### 5. Implementation Details

- **Optional Properties**: 所有 class 屬性皆使用 `?:` 宣告為 Optional,不在宣告時初始化預設值。
- **Enum Type Usage**:
  - **優先使用列舉型別**: 若欄位值符合 `src/enums/` 中已定義的列舉,使用該列舉型別宣告
  - **Import 列舉**: 從對應的 enum 檔案 import 型別 (使用 `import type`)
  - **範例**:

    ```typescript
    import type { UserRole, UserStatus } from '@/enums/user';

    role?: UserRole;      // 而非 role?: string;
    status?: UserStatus;  // 而非 status?: string;
    ```

  - **好處**: 提供型別安全,避免使用無效的值,IDE 可提供自動完成

- **Validation Rules Organization**:
  - `CommonRegexPattern` 只負責管理常用的 **Regex Pattern**,定義在 `src/model/validationRule/CommonRegexPattern.ts`。
  - `validationRule` 資料夾用來放置所有 Pattern 相關的檔案。
  - 未來可在此資料夾下新增其他特定領域的 Pattern 檔案(例如: `OrderPattern.ts`, `ProductPattern.ts`)。
- **Validation (`initFormSchema`)**:
  - 使用 **Yup native 方式**定義驗證規則,直接使用 `string()`, `number()`, `boolean()` 等方法。
  - 需要正規表達式驗證時,使用 `.matches(CommonRegexPattern.PATTERN_NAME, 'error message')`。
  - Map OpenAPI constraints to Yup validators:
    - `required` -> `.required('錯誤訊息')`
    - `minLength`/`maxLength` -> `.min(n, '錯誤訊息')` / `.max(n, '錯誤訊息')`
    - `pattern` -> `.matches(CommonRegexPattern.PATTERN_NAME, '錯誤訊息')`
    - `email` -> `.email('錯誤訊息')`
    - `minimum`/`maximum` (number) -> `.min(n, '錯誤訊息')` / `.max(n, '錯誤訊息')`
- **Payload Mapping (`toPayloadMap`)**:
  - **Key 使用 OperationId**: 必須使用 OpenAPI 規格中定義的 `operationId` 作為 Key。
  - 範例: `AR3-Users-Create`, `AR3-Users-Update`, `AR3-Accounts-Create` 等。
  - 這些 Key 會被 API client wrapper 用來識別對應的 API 端點。
  - 每個 Key 對應的 Value 是該 API 端點所需的 request body 結構。
- **Imports**:
  - Import `BaseFormDataModel` from `ch3chi-commons-vue`.
  - Import `object, string, number, boolean` from `yup`.
  - Import `CommonRegexPattern` from `./validationRule/CommonRegexPattern` (只在需要使用 Pattern 時).

### 6. Format Generated Code

After generating all code files, run Prettier to format the code:

```bash
npm run format
```

This ensures all generated TypeScript files follow the project's code formatting standards.

### 7. Verification

Check the generated code for:

- Correct inheritance.
- All required fields present in `dataFieldNameList` for their respective modes.
- Validation logic matches spec constraints.
- Payload mapping correctly constructs the request body expected by the API.
- Code is properly formatted (after running `npm run format`).
