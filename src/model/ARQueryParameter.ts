import {pickAndAssign, QueryParameter, QueryParamTool} from 'ch3chi-commons-vue';

// ~ ----------------------------------------------------------

/**
 * ARQueryParameter 繼承自 QueryParameter，增加 project-specific 通用查詢參數支援
 */
export class ARQueryParameter extends QueryParameter {
  status?: string; // 依啟用狀態篩選，映射 `tenants.enabled`。

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    // 專案通用參數可在此擴充
    return pickAndAssign(payload, {
      status: this.status,
      keyword: this.keyword,
    });
  }

  clear(): void {
    super.clear();
    this.status = undefined;
  }
}

/**
 * TenantsSearchQueryParameter 繼承自 ARQueryParameter
 * 查詢租戶列表
 */
export class TenantsSearchQueryParameter extends ARQueryParameter {

  constructor() {
    super();
    // 設定預設排序條件
    if (!this.sort) {
      this.sort = [];
    }
    this.sort.push(QueryParamTool.defSort('createdAt'));
  }

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    return pickAndAssign(payload, {
      ...QueryParamTool.firstSortObj(this.sort),
    });
  }

  clear(): void {
    super.clear();
    // 重設排序條件
    this.sort!.push(QueryParamTool.defSort('createdAt'));
  }
}

/**
 * SystemChecklistsSearchQueryParameter 繼承自 ARQueryParameter
 * 查詢資通系統防護基準檢核表列表
 */
export class SystemChecklistsSearchQueryParameter extends ARQueryParameter {
  assessmentYear?: number; // 依檢核年度 (西元年) 篩選，對應 `system_checklists.assessment_year`。
  systemName?: string; // 依資通系統名稱模糊查詢，對應 `system_checklists.snapshot_system_name`。
  protectionLevel?: string; // 依資通系統防護等級篩選，來源 `information_systems.protection_level`。 對應原型下拉選項：普(LOW)、中(MEDIUM)、高(HIGH)。 
  formNumber?: string; // 依表單編號完全比對，對應 `system_checklists.form_number`。
  assessmentStatus?: string; // 評估狀態，對應 `system_checklists.assessment_status`。

  constructor() {
    super();
    // 設定預設排序條件
    if (!this.sort) {
      this.sort = [];
    }
    this.sort.push(QueryParamTool.defSort('createdAt'));
  }

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    return pickAndAssign(payload, {
      assessmentYear: this.assessmentYear,
      systemName: this.systemName,
      protectionLevel: this.protectionLevel,
      formNumber: this.formNumber,
      assessmentStatus: this.assessmentStatus,
      ...QueryParamTool.firstSortObj(this.sort),
    });
  }

  clear(): void {
    super.clear();
    this.assessmentYear = undefined;
    this.systemName = undefined;
    this.protectionLevel = undefined;
    this.formNumber = undefined;
    this.assessmentStatus = undefined;
    // 重設排序條件
    this.sort!.push(QueryParamTool.defSort('createdAt'));
  }
}

/**
 * ProtectionLevelAssessmentsSearchQueryParameter 繼承自 ARQueryParameter
 * 查詢防護需求等級評估表清單
 */
export class ProtectionLevelAssessmentsSearchQueryParameter extends ARQueryParameter {
  year?: number; // 依評估年度篩選，對應 `protection_level_assessments.assessment_year` (西元年，例 2025)。
  systemName?: string; // 依資通系統名稱模糊查詢，對應 `protection_level_assessments.snapshot_system_name`。
  overallLevel?: string; // 依整體防護需求等級篩選。
  formNumber?: string; // 依表單編號完全比對，對應 `protection_level_assessments.form_number`。

  constructor() {
    super();
    // 設定預設排序條件
    if (!this.sort) {
      this.sort = [];
    }
    this.sort.push(QueryParamTool.defSort('createdAt'));
  }

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    return pickAndAssign(payload, {
      year: this.year,
      systemName: this.systemName,
      overallLevel: this.overallLevel,
      formNumber: this.formNumber,
      ...QueryParamTool.firstSortObj(this.sort),
    });
  }

  clear(): void {
    super.clear();
    this.year = undefined;
    this.systemName = undefined;
    this.overallLevel = undefined;
    this.formNumber = undefined;
    // 重設排序條件
    this.sort!.push(QueryParamTool.defSort('createdAt'));
  }
}

/**
 * InformationSystemsSearchQueryParameter 繼承自 ARQueryParameter
 * 查詢資通系統列表
 */
export class InformationSystemsSearchQueryParameter extends ARQueryParameter {
  name?: string; // 模糊比對資通系統名稱。
  code?: string; // 完整比對資通系統代碼。
  isSharedSystem?: boolean; // 是否為共同性系統。
  vendorName?: string; // 維護/開發商名稱 (支援模糊查詢)。

  constructor() {
    super();
    // 設定預設排序條件
    if (!this.sort) {
      this.sort = [];
    }
    this.sort.push(QueryParamTool.defSort('createdAt'));
  }

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    return pickAndAssign(payload, {
      name: this.name,
      code: this.code,
      isSharedSystem: this.isSharedSystem,
      vendorName: this.vendorName,
      ...QueryParamTool.firstSortObj(this.sort),
    });
  }

  clear(): void {
    super.clear();
    this.name = undefined;
    this.code = undefined;
    this.isSharedSystem = undefined;
    this.vendorName = undefined;
    // 重設排序條件
    this.sort!.push(QueryParamTool.defSort('createdAt'));
  }
}

/**
 * AccountsSearchQueryParameter 繼承自 ARQueryParameter
 * 查詢帳號清單
 */
export class AccountsSearchQueryParameter extends ARQueryParameter {
  roleUid?: string; // 依角色篩選帳號，對應 `roles.uid`。
  username?: string; // 模糊比對帳號（`accounts.username`）。

  constructor() {
    super();
    // 設定預設排序條件
    if (!this.sort) {
      this.sort = [];
    }
    this.sort.push(QueryParamTool.defSort('createdAt'));
  }

  toQueryStringParam(): Record<string, any> {
    const payload = super.toQueryStringParam();
    return pickAndAssign(payload, {
      roleUid: this.roleUid,
      username: this.username,
      ...QueryParamTool.firstSortObj(this.sort),
    });
  }

  clear(): void {
    super.clear();
    this.roleUid = undefined;
    this.username = undefined;
    // 重設排序條件
    this.sort!.push(QueryParamTool.defSort('createdAt'));
  }
}

// ~ ----------------------------------------------------------
