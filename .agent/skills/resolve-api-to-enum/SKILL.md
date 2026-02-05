---
name: resolve-api-to-enum
description: Reads an OpenAPI specification (YAML/JSON) and generates TypeScript enum or type definitions for parameters with fixed value sets (e.g., status: 'enable' | 'disable'). Supports both enum and union type declarations.
---

# Resolve API to Enum Skill

This skill guides the agent to generate TypeScript enum or type definitions from an OpenAPI specification. It identifies parameters with fixed value sets and creates reusable type definitions.

## Usage

Use this skill when you need to extract and generate enum/type definitions from API specifications (e.g., status codes, user roles, account types).

**Required Inputs:**
1.  **OpenAPI Spec File**: Path to the `.yaml` or `.json` file in `doc/api` directory.
2.  **Target Enum/Type Name** (Optional): Name for the generated enum/type (e.g., `UserStatus`, `AccountType`).
3.  **Declaration Style** (Optional): `enum` or `type` (defaults to `type` for union types).

**預設值 (Defaults):**
*   **API 規格檔案路徑**: 預設從 `doc/api` 目錄下尋找所有 `.yaml` 檔案。
*   **Declaration Style**: 預設使用 `type` (union type),除非明確指定使用 `enum`。
*   **Output Path**: 預設輸出到 `src/enums` 資料夾:
    *   常用的通用列舉: `src/enums/common.ts` (例如: Status, Priority, Role 等)
    *   特定領域列舉: `src/enums/[Domain].ts` (例如: `order.ts`, `user.ts`, `payment.ts`)
    *   系統相關列舉: `src/enums/system.ts` (例如: HttpStatus, ErrorCode 等)

## Steps

### 1. Read and Analyze OpenAPI Spec

**處理預設值:**
*   掃描 `doc/api/` 目錄下的所有 `.yaml` 或 `.json` 檔案。
*   識別所有具有 `enum` 屬性的 schema 定義。
*   識別所有具有固定值集合的參數(例如: `oneOf`, `anyOf` 等)。

Read the provided OpenAPI spec file(s) and locate:
*   Schema definitions with `enum` property
*   Parameters with fixed value sets
*   Response/Request body fields with limited options

### 2. Identify Enum Candidates

For each identified field, extract:
*   **Name**: Field name or schema name (convert to PascalCase for type name)
*   **Values**: List of allowed values
*   **Type**: String, number, or mixed
*   **Description**: Documentation from the spec

**常見狀態屬性合併原則 (Common Status Consolidation):**
若狀態屬性 (`status` 或類似欄位) 的值符合以下情境,視為全 Model 共用,統一定義在 `src/enums/common.ts`,不需要為每個 Model 產生獨立列舉:
1.  **Boolean 型別**: `true` / `false`
    *   通常對應到 `EnableDisable` 或 `ActiveInactive` 概念
    *   若 API 定義為 Enum `[true, false]`,建議映射到 `src/enums/common.ts` 中的 `BooleanStatus` 或直接使用 `boolean` 型別但搭配 DisplayName
2.  **String 型別**:
    *   `['Yes', 'No']` 或 `['Y', 'N']` -> 統一映射為 `YesNoStatus`
    *   `['Enable', 'Disable']` 或 `['Enabled', 'Disabled']` -> 統一映射為 `EnableDisableStatus`

**避免重複建立列舉 (Avoid Redundant Enums):**
*   若某個欄位的列舉值集合與 `src/enums/common.ts` 中的通用列舉完全一致 (例如: `AccountStatus` 的值只有 `enable`, `disable`),則 **不應** 產生新的列舉。在 `common.ts` 內部亦然，應避免定義值集合重複的列舉。
*   應直接在 DataModel 中引用現有的 `EnableDisableStatus`。
*   只有當列舉值包含特定領域的額外狀態(例如: `pending`, `suspended`)時,才建立新的領域特定列舉。

**排除規則 (Exclusions):**
*   **排序欄位**: 查詢參數中用於排序的欄位 (例如: `sort`, `orderBy`, `sortBy`),即使 API 定義了 enum,也直接使用 `string` 型別,不產生列舉定義。

**範例識別:**
```yaml
# OpenAPI Spec
components:
  schemas:
    User:
      properties:
        status:
          type: string
          enum: [enable, disable, pending]
          description: User account status
        role:
          type: string
          enum: [admin, user, guest]
```

### 3. Check Existing Enums in ch3chi-commons-vue

**重要**: 在產生 `src/enums/common.ts` 之前,先檢查 `ch3chi-commons-vue` 套件是否已有相關列舉。

**檢查步驟:**
1. 查看 `node_modules/ch3chi-commons-vue` 套件的型別定義或文件
2. 尋找是否已有類似的列舉定義 (例如: `Status`, `Priority`, `YesNo` 等)
3. 若套件中已有定義,則直接使用套件提供的列舉,不需要重複撰寫
4. 若套件中沒有,才在 `src/enums/common.ts` 中新增

**重複使用原則:**
```typescript
// ✅ 優先使用套件提供的列舉
import { Status, Priority } from 'ch3chi-commons-vue';

// ❌ 避免重複定義已存在的列舉
// export const Status = { ... }  // 若套件已提供則不需要
```

**常見可能已存在的通用列舉:**
- `Status` (Active/Inactive)
- `YesNo` (Yes/No)
- `EnableDisable` (Enable/Disable)
- `Priority` (Low/Medium/High)

### 4. Generate TypeScript Definitions

Create or update enum files in `src/enums/`. Generate definitions based on the chosen style:

#### Style 1: Union Type (Default)

```typescript
/**
 * User account status
 * - enable: Account is active
 * - disable: Account is disabled
 * - pending: Account is pending activation
 */
export type UserStatus = 'enable' | 'disable' | 'pending';

/**
 * User role
 */
export type UserRole = 'admin' | 'user' | 'guest';

/**
 * Account type
 */
export type AccountType = 'personal' | 'business' | 'enterprise';
```

#### Style 2: Enum Declaration

```typescript
/**
 * User account status
 */
export enum UserStatus {
  Enable = 'enable',
  Disable = 'disable',
  Pending = 'pending',
}

/**
 * User role
 */
export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Guest = 'guest',
}
```

#### Style 3: Const Object with Type and DisplayName (Recommended)

```typescript
/**
 * User account status values
 */
export const UserStatus = {
  Enable: 'enable',
  Disable: 'disable',
  Pending: 'pending',
} as const;

export type UserStatus = typeof UserStatus[keyof typeof UserStatus];

/**
 * Display names for UserStatus
 * 開發者可依需求自行調整顯示文字
 */
export const UserStatusDisplayName: Record<UserStatus, string> = {
  [UserStatus.Enable]: '啟用',
  [UserStatus.Disable]: '停用',
  [UserStatus.Pending]: '待審核',
};

/**
 * User role values
 */
export const UserRole = {
  Admin: 'admin',
  User: 'user',
  Guest: 'guest',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

/**
 * Display names for UserRole
 * 開發者可依需求自行調整顯示文字
 */
export const UserRoleDisplayName: Record<UserRole, string> = {
  [UserRole.Admin]: '管理員',
  [UserRole.User]: '一般使用者',
  [UserRole.Guest]: '訪客',
};
```

### 4. Implementation Details

*   **Naming Convention**: 
    *   Type/Enum names use PascalCase (e.g., `UserStatus`, `AccountType`)
    *   DisplayName objects use `[TypeName]DisplayName` pattern (e.g., `UserStatusDisplayName`)
    *   For nested or specific contexts, use descriptive prefixes (e.g., `OrderStatus`, `PaymentStatus`)
*   **DisplayName Generation**:
    *   **自動產生規則**: 
        *   將 enum value 轉換為人類可讀的繁體中文文字
        *   使用常見的翻譯對應(例如: `enable` → `啟用`, `disable` → `停用`)
        *   若無明確對應,將 value 首字母大寫作為預設值(例如: `pending` → `Pending`)
    *   **開發者可自訂**: DisplayName 是獨立的 Record 物件,開發者可依需求修改顯示文字
    *   **型別安全**: 使用 `Record<EnumType, string>` 確保所有 enum 值都有對應的 displayName
*   **Documentation**: 
    *   Include JSDoc comments with descriptions from OpenAPI spec
    *   List all possible values with their meanings if available
    *   在 DisplayName 物件上註明「開發者可依需求自行調整顯示文字」
*   **Reusability Check**:
    *   **優先使用套件**: 產生 `common.ts` 之前,必須先檢查 `ch3chi-commons-vue` 套件
    *   **避免重複定義**: 若套件已提供相同的列舉,直接 import 使用,不要重複撰寫
    *   **文件記錄**: 在產生的檔案頂部註明哪些列舉來自套件,哪些是專案自訂
    *   **範例註解**:
        ```typescript
        // 以下列舉來自 ch3chi-commons-vue 套件,請直接使用:
        // - Status, Priority, YesNo
        // import { Status, Priority, YesNo } from 'ch3chi-commons-vue';
        
        // 以下為專案特定的通用列舉
        export const CustomEnum = { ... };
        ```
*   **File Organization**:
    *   **常用通用列舉** (`src/enums/common.ts`): 
        *   跨領域使用的通用列舉
        *   範例: `Status`, `Priority`, `YesNo`, `EnableDisable`, `ActiveInactive` 等
    *   **領域特定列舉** (`src/enums/[domain].ts`):
        *   `src/enums/user.ts`: 使用者相關 (UserRole, UserStatus, AccountType 等)
        *   `src/enums/order.ts`: 訂單相關 (OrderStatus, PaymentMethod, ShippingMethod 等)
        *   `src/enums/payment.ts`: 付款相關 (PaymentStatus, PaymentType, Currency 等)
        *   `src/enums/product.ts`: 產品相關 (ProductCategory, ProductStatus 等)
    *   **系統相關列舉** (`src/enums/system.ts`):
        *   系統層級的列舉
        *   範例: `HttpStatus`, `ErrorCode`, `LogLevel`, `Environment` 等
    *   **檔名規則**: 使用小寫加底線或 camelCase (例如: `user.ts`, `order.ts`, `payment.ts`)
*   **Value Mapping**:
    *   Preserve original API values as-is
    *   Use PascalCase for enum keys (if using enum style)
    *   For numeric enums, preserve the numeric values

### 5. Handle Special Cases

**Numeric Enums:**
```typescript
export enum HttpStatus {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
}
```

**Mixed Type Enums:**
```typescript
// Use union type for mixed types
export type MixedValue = 'auto' | 0 | 1 | true | false;
```

**Nested Enums:**
```typescript
export namespace Order {
  export type Status = 'pending' | 'processing' | 'completed' | 'cancelled';
  export type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'bank_transfer';
}
```

### 6. Format Generated Code

After generating all type/enum files, run Prettier to format the code:

```bash
npm run format
```

This ensures all generated TypeScript files follow the project's code formatting standards.

### 7. Verification

Check the generated code for:
*   All enum values match the OpenAPI specification
*   Type names are descriptive and follow PascalCase convention
*   JSDoc comments are present and accurate
*   No duplicate type/enum definitions
*   Code is properly formatted (after running `npm run format`)
*   Types can be imported and used in other files without errors

## Examples

### Example 1: Simple Status Enum

**OpenAPI Spec:**
```yaml
components:
  schemas:
    Account:
      properties:
        status:
          type: string
          enum: [active, inactive, suspended]
```

**Generated Type:**
```typescript
/**
 * Account status
 */
export type AccountStatus = 'active' | 'inactive' | 'suspended';
```

### Example 2: Multiple Enums with DisplayName

**OpenAPI Spec:**
```yaml
components:
  schemas:
    Order:
      properties:
        status:
          type: string
          enum: [pending, confirmed, shipped, delivered, cancelled]
        priority:
          type: string
          enum: [low, medium, high, urgent]
```

**Generated Types:**
```typescript
/**
 * Order status
 */
export const OrderStatus = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

/**
 * Display names for OrderStatus
 * 開發者可依需求自行調整顯示文字
 */
export const OrderStatusDisplayName: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: '待處理',
  [OrderStatus.Confirmed]: '已確認',
  [OrderStatus.Shipped]: '已出貨',
  [OrderStatus.Delivered]: '已送達',
  [OrderStatus.Cancelled]: '已取消',
};

/**
 * Order priority
 */
export const OrderPriority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
  Urgent: 'urgent',
} as const;

export type OrderPriority = typeof OrderPriority[keyof typeof OrderPriority];

/**
 * Display names for OrderPriority
 * 開發者可依需求自行調整顯示文字
 */
export const OrderPriorityDisplayName: Record<OrderPriority, string> = {
  [OrderPriority.Low]: '低',
  [OrderPriority.Medium]: '中',
  [OrderPriority.High]: '高',
  [OrderPriority.Urgent]: '緊急',
};
```

### Example 3: Using DisplayName in Components

```typescript
import { OrderStatus, OrderStatusDisplayName } from '@/enums/order';
import type { COptionItem } from 'ch3chi-commons-vue';

// 在下拉選單中使用 - 回傳 COptionItem 陣列
const statusOptions: COptionItem[] = Object.values(OrderStatus).map(status => ({
  id: status,
  text: OrderStatusDisplayName[status],
  value: status,
}));

// 在表格中顯示
const displayStatus = (status: OrderStatus) => {
  return OrderStatusDisplayName[status];
};

// 範例輸出
console.log(displayStatus(OrderStatus.Pending)); // 輸出: "待處理"
console.log(statusOptions);
// 輸出: [
//   { id: 'pending', text: '待處理', value: 'pending' },
//   { id: 'confirmed', text: '已確認', value: 'confirmed' },
//   { id: 'shipped', text: '已出貨', value: 'shipped' },
//   { id: 'delivered', text: '已送達', value: 'delivered' },
//   { id: 'cancelled', text: '已取消', value: 'cancelled' }
// ]
```

### Example 4: File Organization Structure

**檔案結構範例:**

```
src/enums/
├── common.ts          # 常用通用列舉
├── user.ts            # 使用者相關列舉
├── order.ts           # 訂單相關列舉
├── payment.ts         # 付款相關列舉
└── system.ts          # 系統相關列舉
```

**`src/enums/common.ts` - 常用通用列舉:**
```typescript
// ============================================================
// 重要: 產生此檔案前,請先檢查 ch3chi-commons-vue 套件
// 若套件已提供相同列舉,請直接使用套件的定義
// ============================================================

// 範例: 若套件已有 Status, Priority 等,則直接 import
// import { Status, Priority } from 'ch3chi-commons-vue';

/**
 * 通用狀態 (僅在套件未提供時才定義)
 */
export const Status = {
  Active: 'active',
  Inactive: 'inactive',
} as const;

export type Status = typeof Status[keyof typeof Status];

export const StatusDisplayName: Record<Status, string> = {
  [Status.Active]: '啟用',
  [Status.Inactive]: '停用',
};

/**
 * 優先級 (僅在套件未提供時才定義)
 */
export const Priority = {
  Low: 'low',
  Medium: 'medium',
  High: 'high',
} as const;

export type Priority = typeof Priority[keyof typeof Priority];

export const PriorityDisplayName: Record<Priority, string> = {
  [Priority.Low]: '低',
  [Priority.Medium]: '中',
  [Priority.High]: '高',
};

/**
 * 通用 Yes/No (Y/N, Yes/No)
 */
export const YesNoStatus = {
  Yes: 'Y',
  No: 'N',
} as const;

export type YesNoStatus = typeof YesNoStatus[keyof typeof YesNoStatus];

export const YesNoStatusDisplayName: Record<YesNoStatus, string> = {
  [YesNoStatus.Yes]: '是',
  [YesNoStatus.No]: '否',
};

/**
 * 通用 Enable/Disable
 */
export const EnableDisableStatus = {
  Enable: 'enable',
  Disable: 'disable',
} as const;

export type EnableDisableStatus = typeof EnableDisableStatus[keyof typeof EnableDisableStatus];

export const EnableDisableStatusDisplayName: Record<EnableDisableStatus, string> = {
  [EnableDisableStatus.Enable]: '啟用',
  [EnableDisableStatus.Disable]: '停用',
};
```

**`src/enums/order.ts` - 訂單相關列舉:**
```typescript
/**
 * 訂單狀態
 */
export const OrderStatus = {
  Pending: 'pending',
  Confirmed: 'confirmed',
  Shipped: 'shipped',
  Delivered: 'delivered',
  Cancelled: 'cancelled',
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export const OrderStatusDisplayName: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: '待處理',
  [OrderStatus.Confirmed]: '已確認',
  [OrderStatus.Shipped]: '已出貨',
  [OrderStatus.Delivered]: '已送達',
  [OrderStatus.Cancelled]: '已取消',
};
```

**使用範例:**
```typescript
// 從不同檔案引入
import { Status, StatusDisplayName } from '@/enums/common';
import { OrderStatus, OrderStatusDisplayName } from '@/enums/order';
import { UserRole, UserRoleDisplayName } from '@/enums/user';
```
