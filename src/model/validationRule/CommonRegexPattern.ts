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
