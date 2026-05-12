/**
 * 角色類型
 * - SUPER_ADMIN: 超級管理員
 * - ADMIN: 管理員
 * - OPERATOR: 一般操作員
 */
export const RoleType = {
  SuperAdmin: "SUPER_ADMIN",
  Admin: "ADMIN",
  Operator: "OPERATOR",
} as const;

export type RoleType = (typeof RoleType)[keyof typeof RoleType];

export const RoleTypeDisplayName: Record<RoleType, string> = {
  [RoleType.SuperAdmin]: "超級管理員",
  [RoleType.Admin]: "管理員",
  [RoleType.Operator]: "一般操作員",
};

/**
 * 通用 Enable/Disable 狀態
 * 包含 ENABLED/DISABLED 與 enable/disable
 */
export const EnableDisableStatus = {
  Enabled: "ENABLED",
  Disabled: "DISABLED",
  Enable: "enable",
  Disable: "disable",
} as const;

export type EnableDisableStatus =
  (typeof EnableDisableStatus)[keyof typeof EnableDisableStatus];

export const EnableDisableStatusDisplayName: Record<
  EnableDisableStatus,
  string
> = {
  [EnableDisableStatus.Enabled]: "啟用",
  [EnableDisableStatus.Disabled]: "停用",
  [EnableDisableStatus.Enable]: "啟用",
  [EnableDisableStatus.Disable]: "停用",
};

/**
 * 通用 Boolean 狀態
 */
export const BooleanStatus = {
  True: true,
  False: false,
} as const;

export type BooleanStatus = (typeof BooleanStatus)[keyof typeof BooleanStatus];

export const BooleanStatusDisplayName: Record<string, string> = {
  true: "是",
  false: "否",
};

/**
 * 通用 Yes/No 狀態
 */
export const YesNoStatus = {
  Yes: "Y",
  No: "N",
} as const;

export type YesNoStatus = (typeof YesNoStatus)[keyof typeof YesNoStatus];

export const YesNoStatusDisplayName: Record<YesNoStatus, string> = {
  [YesNoStatus.Yes]: "是",
  [YesNoStatus.No]: "否",
};

/**
 * 年度資料來源
 */
export const YearSource = {
  ProtectionLevelAssessment: "PROTECTION_LEVEL_ASSESSMENT",
  SystemChecklist: "SYSTEM_CHECKLIST",
  SystemInventory: "SYSTEM_INVENTORY",
  CustomRange: "CUSTOM_RANGE",
} as const;

export type YearSource = (typeof YearSource)[keyof typeof YearSource];

export const YearSourceDisplayName: Record<YearSource, string> = {
  [YearSource.ProtectionLevelAssessment]: "防護等級評估",
  [YearSource.SystemChecklist]: "系統檢核表",
  [YearSource.SystemInventory]: "系統清冊",
  [YearSource.CustomRange]: "自訂範圍",
};

/**
 * 防護需求等級
 */
export const ProtectionLevel = {
  High: "HIGH",
  Medium: "MEDIUM",
  Low: "LOW",
} as const;

export type ProtectionLevel =
  (typeof ProtectionLevel)[keyof typeof ProtectionLevel];

export const ProtectionLevelDisplayName: Record<ProtectionLevel, string> = {
  [ProtectionLevel.High]: "高",
  [ProtectionLevel.Medium]: "中",
  [ProtectionLevel.Low]: "普",
};
