# Query Parameters Note

## Common Parameters

| Name | Type | Description |
| :--- | :--- | :--- |
| status | string | 依啟用狀態篩選，映射 `tenants.enabled`。 |

## Specific Parameters

### AccountsSearchQueryParameter

**Summary**: 查詢帳號清單

| Name | Type | Description |
| :--- | :--- | :--- |
| roleUid | string | 依角色篩選帳號，對應 `roles.uid`。 |
| username | string | 模糊比對帳號（`accounts.username`）。 |

### InformationSystemsSearchQueryParameter

**Summary**: 查詢資通系統列表

| Name | Type | Description |
| :--- | :--- | :--- |
| name | string | 模糊比對資通系統名稱。 |
| code | string | 完整比對資通系統代碼。 |
| isSharedSystem | boolean | 是否為共同性系統。 |
| vendorName | string | 維護/開發商名稱 (支援模糊查詢)。 |

### ProtectionLevelAssessmentsSearchQueryParameter

**Summary**: 查詢防護需求等級評估表清單

| Name | Type | Description |
| :--- | :--- | :--- |
| year | number | 依評估年度篩選，對應 `protection_level_assessments.assessment_year` (西元年，例 2025)。 |
| systemName | string | 依資通系統名稱模糊查詢，對應 `protection_level_assessments.snapshot_system_name`。 |
| overallLevel | string | 依整體防護需求等級篩選。 |
| formNumber | string | 依表單編號完全比對，對應 `protection_level_assessments.form_number`。 |

### SystemChecklistsSearchQueryParameter

**Summary**: 查詢資通系統防護基準檢核表列表

| Name | Type | Description |
| :--- | :--- | :--- |
| assessmentYear | number | 依檢核年度 (西元年) 篩選，對應 `system_checklists.assessment_year`。 |
| systemName | string | 依資通系統名稱模糊查詢，對應 `system_checklists.snapshot_system_name`。 |
| protectionLevel | string | 依資通系統防護等級篩選，來源 `information_systems.protection_level`。 對應原型下拉選項：普(LOW)、中(MEDIUM)、高(HIGH)。  |
| formNumber | string | 依表單編號完全比對，對應 `system_checklists.form_number`。 |
| assessmentStatus | string | 評估狀態，對應 `system_checklists.assessment_status`。 |

