import { BaseFormDataModel } from "ch3chi-commons-vue";
import { array, object, string } from "yup";
import type { EnableDisableStatus } from "@/enums/common";

/**
 * Hardware Configuration Data Model
 * 支援硬體組態的建立與編輯功能
 *
 * Form Modes:
 * - create: 新增硬體組態
 * - edit: 更新硬體組態
 */
export class HardwareConfigurationDataModel extends BaseFormDataModel {
  /** 組態分類 (例如：5 Hardware,HW) */
  category?: string;

  /** 組態子分類 (例如：Firewall) */
  subcategory?: string;

  /** 組態編號 (例如：HW-1-1-001) */
  configurationCode?: string;

  /** 資產名稱 */
  name?: string;

  /** 組態項目的詳細說明 */
  description?: string;

  /** 資產型號 */
  model?: string;

  /** 權責部門名稱 */
  responsibleDepartment?: string;

  /** 權責主管 */
  responsibleManager?: string;

  /** 資產擁有者 */
  assetOwner?: string;

  /** 財產編號或資產標籤 */
  assetTag?: string;

  /** 資產所在地點 */
  location?: string;

  /** 機櫃編號 */
  rackCode?: string;

  /** 機櫃 U 號 */
  rackUnit?: string;

  /** 設備 IP 位址 */
  ipAddress?: string;

  /** 韌體版本 */
  firmwareVersion?: string;

  /** 記憶體規格 */
  memorySpec?: string;

  /** CPU 規格 */
  cpuSpec?: string;

  /** 儲存容量(硬體空間) */
  storageCapacity?: string;

  /** 啟用狀態 */
  status?: EnableDisableStatus;

  /** 備註 */
  note?: string;

  /** 關聯的資通系統 UID 清單 */
  informationSystemUids?: string[];

  constructor(data?: Partial<HardwareConfigurationDataModel>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }

  /**
   * 根據 formMode 回傳對應的欄位清單
   */
  dataFieldNameList(): string[] {
    if (this.formMode === "create" || this.formMode === "edit") {
      return [
        "category",
        "subcategory",
        "configurationCode",
        "name",
        "description",
        "model",
        "responsibleDepartment",
        "responsibleManager",
        "assetOwner",
        "assetTag",
        "location",
        "rackCode",
        "rackUnit",
        "ipAddress",
        "firmwareVersion",
        "memorySpec",
        "cpuSpec",
        "storageCapacity",
        "status",
        "note",
        "informationSystemUids",
      ];
    }
    return [];
  }

  /**
   * 根據 formMode 初始化驗證規則
   * 使用 Yup native 方式定義
   */
  initFormSchema(): any {
    if (this.formMode === "create" || this.formMode === "edit") {
      return object({
        configurationCode: string()
          .required("組態編號為必填")
          .max(100, "組態編號最多 100 個字元"),
        name: string()
          .required("資產名稱為必填")
          .max(255, "資產名稱最多 255 個字元"),
        category: string()
          .required("組態分類為必填")
          .max(100, "組態分類最多 100 個字元"),
        subcategory: string()
          .required("組態子分類為必填")
          .max(100, "組態子分類最多 100 個字元"),
        location: string()
          .required("資產所在地點為必填")
          .max(255, "資產所在地點最多 255 個字元"),
        status: string()
          .required("啟用狀態為必填")
          .oneOf(["ENABLED", "DISABLED"], "啟用狀態必須為 ENABLED 或 DISABLED"),
        informationSystemUids: array()
          .of(string().required("資通系統 UID 不可為空"))
          .required("關聯的資通系統為必填")
          .min(1, "至少需要關聯一個資通系統"),
        description: string(),
        model: string().max(255, "資產型號最多 255 個字元"),
        responsibleDepartment: string().max(255, "權責部門名稱最多 255 個字元"),
        responsibleManager: string().max(255, "權責主管最多 255 個字元"),
        assetOwner: string().max(255, "資產擁有者最多 255 個字元"),
        assetTag: string().max(255, "財產編號或資產標籤最多 255 個字元"),
        rackCode: string().max(100, "機櫃編號最多 100 個字元"),
        rackUnit: string().max(50, "機櫃 U 號最多 50 個字元"),
        ipAddress: string().max(100, "設備 IP 位址最多 100 個字元"),
        firmwareVersion: string().max(100, "韌體版本最多 100 個字元"),
        memorySpec: string().max(100, "記憶體規格最多 100 個字元"),
        cpuSpec: string().max(100, "CPU 規格最多 100 個字元"),
        storageCapacity: string().max(100, "儲存容量最多 100 個字元"),
        note: string(),
      });
    }
    return object({});
  }

  /**
   * 將 model 屬性對應到 API payload 結構
   */
  toPayloadMap(): Record<string, Record<string, any>> {
    return {
      createHardwareConfiguration: {
        category: this.category,
        subcategory: this.subcategory,
        configurationCode: this.configurationCode,
        name: this.name,
        description: this.description,
        model: this.model,
        responsibleDepartment: this.responsibleDepartment,
        responsibleManager: this.responsibleManager,
        assetOwner: this.assetOwner,
        assetTag: this.assetTag,
        location: this.location,
        rackCode: this.rackCode,
        rackUnit: this.rackUnit,
        ipAddress: this.ipAddress,
        firmwareVersion: this.firmwareVersion,
        memorySpec: this.memorySpec,
        cpuSpec: this.cpuSpec,
        storageCapacity: this.storageCapacity,
        status: this.status,
        note: this.note,
        informationSystemUids: this.informationSystemUids,
      },
      updateHardwareConfiguration: {
        category: this.category,
        subcategory: this.subcategory,
        configurationCode: this.configurationCode,
        name: this.name,
        description: this.description,
        model: this.model,
        responsibleDepartment: this.responsibleDepartment,
        responsibleManager: this.responsibleManager,
        assetOwner: this.assetOwner,
        assetTag: this.assetTag,
        location: this.location,
        rackCode: this.rackCode,
        rackUnit: this.rackUnit,
        ipAddress: this.ipAddress,
        firmwareVersion: this.firmwareVersion,
        memorySpec: this.memorySpec,
        cpuSpec: this.cpuSpec,
        storageCapacity: this.storageCapacity,
        status: this.status,
        note: this.note,
        informationSystemUids: this.informationSystemUids,
      },
    };
  }
}
