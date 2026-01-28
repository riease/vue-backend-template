---
name: resolve_api_to_model
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
    *   Example: `create` -> `POST /users`, `edit` -> `PUT /users/{id}`, `me` -> `PUT /me`

## Steps

### 1. Read and Analyze OpenAPI Spec

Read the provided OpenAPI spec file. Locate the request body schemas for the specified operations.

### 2. Determine Class Properties

*   Identify the union of all fields from the request bodies of *all* mapped modes.
*   For each field, determine:
    *   **Type**: `string`, `number`, `boolean`, `Date`, or nested object (create sub-models if needed).
    *   **Required**: Check if the field is required in *at least one* mode.
    *   **Description**: Use the `description` from the spec as a JSDoc comment.
    *   **Default Value**: Initialize with sensible defaults (empty string, null, false).

### 3. Generate TypeScript Class

Create a new file (e.g., `src/model/UserDataModel.ts`). Structure the class as follows:

```typescript
import { BaseFormDataModel } from 'ch3chi-commons-vue';
import { object, string, number, boolean } from 'yup';

export class UserDataModel extends BaseFormDataModel {
  // Properties
  username: string = '';
  email: string = '';
  // ... other properties

  constructor(data?: Partial<UserDataModel>) {
    super();
    if (data) {
        Object.assign(this, data);
    }
  }

  // Define which fields are used in each mode
  dataFieldNameList(): string[] {
    if (this.formMode === 'create') {
      return ['username', 'email', 'password'];
    }
    else if (this.formMode === 'edit') {
      return ['email', 'displayName'];
    }
    return [];
  }

  // Define validation rules for each mode
  initFormSchema(): any {
    if (this.formMode === 'create') {
      return object({
        username: string().required().min(4),
        email: string().required().email(),
      });
    }
    // ... schemas for other modes
    return object({});
  }

  // Map local properties to API payload structure
  toPayloadMap(): Record<string, Record<string, any>> {
    return {
      'API-Operation-ID-For-Create': {
        username: this.username,
        email: this.email,
      },
      'API-Operation-ID-For-Edit': {
        email: this.email,
      },
    };
  }
}
```

### 4. Implementation Details

*   **Validation (`initFormSchema`)**: Map OpenAPI constraints to Yup validators:
    *   `required` -> `.required()`
    *   `minLength`/`maxLength` -> `.min()`/`.max()`
    *   `pattern` -> `.matches()`
*   **Payload Mapping (`toPayloadMap`)**: The keys should be the unique identifier for the API call (often the specific Operation ID or a key used by the API client wrapper).
*   **Imports**: Ensure `BaseFormDataModel` and `yup` are imported.

### 5. Verification

Check the generated code for:
*   Correct inheritance.
*   All required fields present in `dataFieldNameList` for their respective modes.
*   Validation logic matches spec constraints.
*   Payload mapping correctly constructs the request body expected by the API.
