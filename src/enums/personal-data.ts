/**
 * 個人資料項目
 */
export const PersonalDataItem = {
  Name: "姓名",
  Birthday: "生日",
  IdCardNumber: "身分證號",
  PassportNumber: "護照號碼",
  Characteristics: "特徵",
  Fingerprint: "指紋",
  Marriage: "婚姻",
  Family: "家庭",
  Education: "教育",
  Occupation: "職業",
  MedicalHistory: "病歷",
  MedicalTreatment: "醫療",
  Genetics: "基因",
  SexLife: "性生活",
  HealthCheck: "健康檢查",
  CriminalRecord: "犯罪前科",
  ContactInfo: "聯絡方式",
  FinancialStatus: "財務情況",
  SocialActivity: "社會活動",
} as const;

export type PersonalDataItem =
  (typeof PersonalDataItem)[keyof typeof PersonalDataItem];

export const PersonalDataItemDisplayName: Record<PersonalDataItem, string> = {
  [PersonalDataItem.Name]: "姓名",
  [PersonalDataItem.Birthday]: "生日",
  [PersonalDataItem.IdCardNumber]: "身分證號",
  [PersonalDataItem.PassportNumber]: "護照號碼",
  [PersonalDataItem.Characteristics]: "特徵",
  [PersonalDataItem.Fingerprint]: "指紋",
  [PersonalDataItem.Marriage]: "婚姻",
  [PersonalDataItem.Family]: "家庭",
  [PersonalDataItem.Education]: "教育",
  [PersonalDataItem.Occupation]: "職業",
  [PersonalDataItem.MedicalHistory]: "病歷",
  [PersonalDataItem.MedicalTreatment]: "醫療",
  [PersonalDataItem.Genetics]: "基因",
  [PersonalDataItem.SexLife]: "性生活",
  [PersonalDataItem.HealthCheck]: "健康檢查",
  [PersonalDataItem.CriminalRecord]: "犯罪前科",
  [PersonalDataItem.ContactInfo]: "聯絡方式",
  [PersonalDataItem.FinancialStatus]: "財務情況",
  [PersonalDataItem.SocialActivity]: "社會活動",
};
