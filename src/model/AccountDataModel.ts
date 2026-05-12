import { BaseFormDataModel } from "ch3chi-commons-vue";
import { object, string, ref } from "yup";
import { CommonRegexPattern } from "./validationRule/CommonRegexPattern";
import type { EnableDisableStatus } from "@/enums/common";

/**
 * Account Data Model
 * 支援帳號的建立、編輯與密碼變更功能
 *
 * Form Modes:
 * - create: 新增帳號
 * - edit: 更新帳號
 * - changePassword: 變更密碼
 */
export class AccountDataModel extends BaseFormDataModel {
  /** 角色識別碼 */
  roleUid?: string;

  /** 聯絡人姓名 */
  displayName?: string;

  /** Email */
  email?: string;

  /** 帳號狀態 */
  status?: EnableDisableStatus;

  /** 帳號代號 (僅用於 create mode) */
  username?: string;

  /** 密碼 (僅用於 create mode) */
  password?: string;

  /** 確認密碼 (僅用於 create mode) */
  passwordConfirm?: string;

  /** 新密碼 (僅用於 changePassword mode) */
  newPassword?: string;

  /** 確認新密碼 (僅用於 changePassword mode) */
  newPasswordConfirm?: string;

  constructor(data?: Partial<AccountDataModel>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * 根據 formMode 回傳對應的欄位清單
   */
  dataFieldNameList(): string[] {
    if (this.formMode === "create") {
      return [
        "roleUid",
        "displayName",
        "email",
        "status",
        "username",
        "password",
        "passwordConfirm",
      ];
    } else if (this.formMode === "edit") {
      return ["roleUid", "displayName", "email", "status"];
    } else if (this.formMode === "changePassword") {
      return ["newPassword", "newPasswordConfirm"];
    }
    return [];
  }

  /**
   * 根據 formMode 初始化驗證規則
   * 使用 Yup native 方式定義，需要 Pattern 時引用 CommonRegexPattern
   */
  initFormSchema(): any {
    if (this.formMode === "create") {
      return object({
        username: string()
          .required("帳號代號為必填")
          .min(4, "帳號代號至少需要 4 個字元")
          .max(64, "帳號代號最多 64 個字元")
          .matches(
            CommonRegexPattern.USERNAME_PATTERN,
            "帳號代號只能包含英文、數字和底線",
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
        passwordConfirm: string()
          .required("確認密碼為必填")
          .oneOf([ref("password")], "確認密碼必須與密碼相同"),
        roleUid: string().required("角色為必填"),
        displayName: string().required("聯絡人姓名為必填"),
        status: string()
          .required("帳號狀態為必填")
          .oneOf(["ENABLED", "DISABLED"], "帳號狀態必須為 ENABLED 或 DISABLED"),
      });
    } else if (this.formMode === "edit") {
      return object({
        email: string()
          .required("電子郵件為必填")
          .email("請輸入有效的電子郵件"),
        roleUid: string().required("角色為必填"),
        displayName: string().required("聯絡人姓名為必填"),
        status: string()
          .required("帳號狀態為必填")
          .oneOf(["ENABLED", "DISABLED"], "帳號狀態必須為 ENABLED 或 DISABLED"),
      });
    } else if (this.formMode === "changePassword") {
      return object({
        newPassword: string()
          .required("新密碼為必填")
          .min(8, "新密碼至少需要 8 個字元")
          .matches(
            CommonRegexPattern.PASSWORD_PATTERN,
            "密碼必須包含大小寫字母和數字",
          ),
        newPasswordConfirm: string()
          .required("確認新密碼為必填")
          .oneOf([ref("newPassword")], "確認新密碼必須與新密碼相同"),
      });
    }
    return object({});
  }

  /**
   * 將 model 屬性對應到 API payload 結構
   */
  toPayloadMap(): Record<string, Record<string, any>> {
    return {
      "Accounts-Create": {
        roleUid: this.roleUid,
        displayName: this.displayName,
        email: this.email,
        status: this.status,
        username: this.username,
        password: this.password,
        passwordConfirm: this.passwordConfirm,
      },
      "Accounts-Update": {
        roleUid: this.roleUid,
        displayName: this.displayName,
        email: this.email,
        status: this.status,
      },
      "Accounts-ChangePassword": {
        newPassword: this.newPassword,
        newPasswordConfirm: this.newPasswordConfirm,
      },
    };
  }
}
