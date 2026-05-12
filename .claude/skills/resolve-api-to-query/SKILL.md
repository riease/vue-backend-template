---
name: resolve-api-to-query
description: Generate TypeScript QueryParameter classes from OpenAPI specifications for Vue Backend Template.
---

# resolve-api-to-query

This skill scans OpenAPI specification files (JSON/YAML) and generates a project-specific `QueryParameter` base class and endpoint-specific subclasses in a single TypeScript file.

## Prerequisites

This skill requires the following Node.js packages to be available in the project or globally:
- `js-yaml` (for parsing YAML specs)
- `lodash` (already in project)
- `glob` (for file matching)

You may need to install them:
```bash
npm install -D js-yaml glob
```

## Usage

```bash
node .claude/skills/resolve-api-to-query/scripts/generate-query-params.js --input doc/api --output src/model/ACQueryParameter.ts
```

### Arguments

- `--input, -i`: Directory containing OpenAPI specification files (default: `doc/api`).
- `--output, -o`: Path to the output TypeScript file (default: `src/model/ACQueryParameter.ts`).

## Behavior

1.  **Scans** the input directory for `.json`, `.yaml`, and `.yml` files.
2.  **Parses** each file as an OpenAPI specification, focusing on endpoints where the `operationId` ends with `Search` and does not contain the string `common`.
3.  **Identifies** GET endpoints with query parameters.
4.  **Generates** a single TypeScript file containing:
    -   Imports from `ch3chi-commons-vue`.
    -   A base class (e.g., `ACQueryParameter`) extending `QueryParameter`.
    -   Subclasses for each identified resource/endpoint, extending the base class.
    -   Properties for each query parameter (as `Optional`), explicitly ignoring `sort`, `page`, `size`, `offset`, `limit`, `keyword`, `sortBy`, and `sortOrder` (managed by base class).
    -   `toQueryStringParam` method using `pickAndAssign` and handling `super` calls.



    -   `clear` method resetting properties to `undefined` and resetting sort.
    -   Constructor initiating default sort if applicable.
5.  **Generates** a validation report at `doc/note/query.md` listing:
    -   Common Parameters (used across multiple endpoints).
    -   Specific Parameters (grouped by Class).


## Customization

腳本會根據 `src/model` 中現有的 DataModel 名稱與 API 路徑 (Path) 來決定類別名稱，不考慮 `operationId` 因素：
-   **operationId**: e.g., `getAccounts` -> removes `get`, `list`, `query` prefixes -> `Accounts` -> singularizes to `Account`.
-   **Path**: e.g., `/accounts` -> `Account`.
-   **DataModel Matching**: If `AccountDataModel.ts` exists in `src/model`, the script will use `AccountQueryParameter` to maintain consistency.
-   **Fallback**: If no matching DataModel is found, uses the derived name (e.g., `AccountQueryParameter`).

It creates a base class named based on the output filename prefix (e.g., `ACQueryParameter.ts` -> `ACQueryParameter`).

