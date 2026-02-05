/**
 * 檢核狀態
 */
export const ControlStatus = {
  Compliant: "COMPLIANT",
  NonCompliant: "NON_COMPLIANT",
  PartiallyCompliant: "PARTIALLY_COMPLIANT",
  NotApplicable: "NOT_APPLICABLE",
  Other: "OTHER",
} as const;

export type ControlStatus = (typeof ControlStatus)[keyof typeof ControlStatus];

export const ControlStatusDisplayName: Record<ControlStatus, string> = {
  [ControlStatus.Compliant]: "符合",
  [ControlStatus.NonCompliant]: "不符合",
  [ControlStatus.PartiallyCompliant]: "部分符合",
  [ControlStatus.NotApplicable]: "不適用",
  [ControlStatus.Other]: "其他",
};
