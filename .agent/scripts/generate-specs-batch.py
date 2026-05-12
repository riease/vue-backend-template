#!/usr/bin/env python3
"""
批次產生功能規格單腳本
根據 doc/api 目錄下的 API 檔案自動產生功能規格單到 doc/spec 目錄
"""

import os
import yaml
import re
from pathlib import Path
from datetime import datetime

# 專案根目錄
PROJECT_ROOT = Path(__file__).parent.parent.parent
API_DIR = PROJECT_ROOT / "doc" / "api"
SPEC_DIR = PROJECT_ROOT / "doc" / "spec"

# 排除的 API 檔案 (基礎設施 API)
EXCLUDED_FILES = [
    "Common.yaml",
    "Auth.yaml",
    "Me.yaml"
]

# HTTP Method 到 Action 的對應
METHOD_TO_ACTION = {
    "POST": "新增",
    "GET": "查詢",
    "PUT": "編輯",
    "DELETE": "刪除"
}

def to_kebab_case(text):
    """轉換為 kebab-case"""
    # 移除特殊字元
    text = re.sub(r'[^\w\s-]', '', text)
    # 轉換空格為連字號
    text = re.sub(r'[\s_]+', '-', text)
    return text.lower()

def extract_feature_name(api_title):
    """從 API title 提取功能名稱"""
    # 移除前綴和英文部分
    match = re.match(r'\w+\s+(.+)', api_title)
    if match:
        return match.group(1).strip()
    return api_title

def extract_prefix(api_title):
    """從 API title 提取英文前綴"""
    match = re.match(r'(\w+)', api_title)
    if match:
        return match.group(1)
    return "Unknown"

def analyze_endpoints(paths):
    """分析 API endpoints 並推斷 Actions"""
    actions = []
    has_list_query = False
    
    for path, methods in paths.items():
        for method, details in methods.items():
            if method.upper() not in ["GET", "POST", "PUT", "DELETE", "PATCH"]:
                continue
                
            operation_id = details.get("operationId", "")
            summary = details.get("summary", "")
            
            # 判斷是否為列表查詢
            if method.upper() == "GET" and path == "/" and "parameters" in details:
                has_list_query = True
            
            # 推斷 Action
            action_name = METHOD_TO_ACTION.get(method.upper(), method.upper())
            if "Search" in operation_id:
                action_name = "查詢"
            elif "Read" in operation_id:
                action_name = "詳細"
            elif "ChangePassword" in operation_id:
                action_name = "變更密碼"
            
            actions.append({
                "name": action_name,
                "method": method.upper(),
                "path": path,
                "operation_id": operation_id,
                "summary": summary
            })
    
    return actions, has_list_query

def parse_schema_fields(schema, components):
    """解析 schema 欄位定義"""
    fields = []
    
    if not schema:
        return fields
    
    # 處理 allOf
    if "allOf" in schema:
        for sub_schema in schema["allOf"]:
            if "$ref" in sub_schema:
                ref_name = sub_schema["$ref"].split("/")[-1]
                ref_schema = components.get("schemas", {}).get(ref_name, {})
                fields.extend(parse_schema_fields(ref_schema, components))
            else:
                fields.extend(parse_schema_fields(sub_schema, components))
    
    # 處理 properties
    if "properties" in schema:
        required_fields = schema.get("required", [])
        for prop_name, prop_def in schema["properties"].items():
            field_type = prop_def.get("type", "string")
            field_format = prop_def.get("format", "")
            description = prop_def.get("description", "")
            is_required = prop_name in required_fields
            
            # 判斷資料格式
            if field_format == "date-time":
                data_format = "日期時間 (YYYY-MM-DD HH:mm:ss)"
            elif field_format == "date":
                data_format = "日期 (YYYY-MM-DD)"
            elif field_format == "email":
                data_format = "Email"
            elif field_format == "uuid":
                data_format = "UUID"
            elif "enum" in prop_def:
                data_format = f"Enum ({'/'.join(prop_def['enum'])})"
            elif field_type == "boolean":
                data_format = "布林值"
            elif field_type == "integer" or field_type == "number":
                data_format = "數字"
            else:
                data_format = "文字"
            
            fields.append({
                "name": prop_name,
                "type": data_format,
                "required": is_required,
                "description": description
            })
    
    return fields

def generate_spec_content(api_file_path):
    """產生規格單內容"""
    with open(api_file_path, 'r', encoding='utf-8') as f:
        api_spec = yaml.safe_load(f)
    
    info = api_spec.get("info", {})
    title = info.get("title", "")
    version = info.get("version", "1.0.0")
    paths = api_spec.get("paths", {})
    components = api_spec.get("components", {})
    
    feature_name = extract_feature_name(title)
    prefix = extract_prefix(title)
    
    # 分析 endpoints
    actions, has_list_query = analyze_endpoints(paths)
    
    # 產生規格單內容
    today = datetime.now().strftime("%Y-%m-%d")
    
    spec_content = f"""# {feature_name} 功能規格單

## 📋 基本資訊

| 項目 | 內容 |
|------|------|
| 功能英文前綴字 | `{prefix}` |
| 版本號碼 | {version} |
| 建立日期 | {today} |
| 最後更新日期 | {today} |
| 負責人員 | - |
| 相關需求文件 | - |

## 🔗 API 文件

- **API 規格檔案**: [`{api_file_path.name}`](file://{api_file_path.absolute()})
- **API 版本**: {version}

## 🎯 功能操作 (Actions)

"""
    
    # 產生 Actions
    for action in actions:
        action_name = action["name"]
        method = action["method"]
        path = action["path"]
        operation_id = action["operation_id"]
        
        # 推斷權限字串
        permission = f"{prefix.lower()}:{action_name.lower()}"
        if action_name == "查詢" or action_name == "詳細":
            permission = f"{prefix.lower()}:read"
        elif action_name == "新增":
            permission = f"{prefix.lower()}:create"
        elif action_name == "編輯":
            permission = f"{prefix.lower()}:update"
        elif action_name == "刪除":
            permission = f"{prefix.lower()}:delete"
        
        # 推斷路由
        route_path = f"/{to_kebab_case(prefix)}"
        if action_name == "新增":
            route_path += "/create"
        elif action_name == "編輯":
            route_path += "/edit/:id"
        elif action_name == "詳細":
            route_path += "/detail/:id"
        
        spec_content += f"""### {action_name}

| 項目 | 內容 |
|------|------|
| 名稱 | {action_name}{feature_name.replace('管理', '')} |
| 所需權限字串 | `{permission}` |
| 特殊啟用條件 | 無 |
| 功能呈現位置 | 列表頁面 |
| 網址路由 | `{route_path}` |
| 程式變數名稱 | `handle{action_name.capitalize()}`, `do{action_name.capitalize()}Click` |
| 對應 API Method | {method} {path} |
| 對應 OperationId | `{operation_id}` |

"""
    
    # 列表查詢規格
    if has_list_query:
        spec_content += f"""---

## 📊 列表查詢規格

> [!NOTE]
> 此功能包含列表查詢功能

### 查詢參數

- **Query Parameter 類別**: `{prefix}QueryParameter`
- **支援的查詢條件**: [待補充]

### 列表欄位 (Columns)

| 顯示文字 | Property 名稱 | 資料格式 | 動作欄位 |
|---------|--------------|---------|---------|
| [待補充] | - | - | - |

"""
    
    # 技術規格
    spec_content += f"""---

## 🧩 技術規格

### Data Models

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 新增/編輯表單 | `{prefix}DataModel` | `src/model/{prefix}DataModel.ts` |

### Query Parameters

| 用途 | 類別名稱 | 檔案路徑 |
|------|---------|---------|
| 列表查詢 | `{prefix}QueryParameter` | `src/query/{prefix}QueryParameter.ts` |

### Enums

| 用途 | Enum 名稱 | 檔案路徑 |
|------|----------|---------|
| [待補充] | - | - |

### 相依共用元件

**列表頁面元件：**
- `CTable`：列表查詢頁面使用的表格元件，支援分頁、排序功能

**表單欄位元件：**
- `CTextInputFormField`：文字輸入欄位元件
- `CTextAreaFormField`：多行文字輸入欄位元件
- `CSelectFormField`：下拉選單欄位元件
- `CRadioPlatFormField`：單選按鈕欄位元件
- `CCheckBoxPlatFormField`：多選核取方塊欄位元件
- `CDateFormField`：日期選擇欄位元件

**權限控制元件：**
- `HasPermission`：權限檢查元件，用於控制功能按鈕的顯示

---

## 📝 表單規格

> [!NOTE]
> 此區塊需根據實際 API schema 補充

---

## ✅ 驗證與錯誤處理

### 前端驗證規則

- [待補充]

### 後端 API 錯誤碼

| 錯誤碼 | 錯誤訊息 | 處理方式 |
|-------|---------|---------|
| `400` | 參數驗證失敗 | 顯示後端回傳的錯誤訊息 |
| `401` | 未通過身分驗證 | 導向登入頁面 |
| `403` | 權限不足 | 顯示「您沒有權限執行此操作」 |
| `404` | 資源不存在 | 顯示「找不到指定的資源」 |
| `409` | 資源衝突 | 顯示「該資源已存在或正在使用中」 |
| `500` | 伺服器錯誤 | 顯示「系統發生錯誤，請稍後再試」 |

---

## 🎨 UI/UX 規格

### 頁面路由

- **列表頁面**: `/{to_kebab_case(prefix)}`
- **新增頁面**: `/{to_kebab_case(prefix)}/create`
- **編輯頁面**: `/{to_kebab_case(prefix)}/edit/:id`
- **詳細頁面**: `/{to_kebab_case(prefix)}/detail/:id`

### 麵包屑導航

```
首頁 > [模組名稱] > {feature_name}
```

### 頁面標題與說明

- **列表頁面標題**: {feature_name}
- **列表頁面說明**: 管理系統中的{feature_name.replace('管理', '')}資訊

---

## 📌 備註與限制

### 已知限制

- [待補充]

### 特殊注意事項

- [待補充]

### 未來擴充方向

- [待補充]

---

## 📅 變更歷史

| 版本 | 日期 | 變更內容 | 變更人員 |
|------|------|---------|---------|
| {version} | {today} | 初始版本 | - |
"""
    
    return spec_content, to_kebab_case(prefix)

def main():
    """主程式"""
    # 確保 spec 目錄存在
    SPEC_DIR.mkdir(parents=True, exist_ok=True)
    
    # 取得所有 API 檔案
    api_files = sorted(API_DIR.glob("*.yaml"))
    
    processed_files = []
    skipped_files = []
    
    for api_file in api_files:
        if api_file.name in EXCLUDED_FILES:
            skipped_files.append(api_file.name)
            continue
        
        try:
            print(f"處理: {api_file.name}")
            spec_content, prefix_kebab = generate_spec_content(api_file)
            
            # 產生規格單檔案
            spec_file = SPEC_DIR / f"{prefix_kebab}-spec.md"
            with open(spec_file, 'w', encoding='utf-8') as f:
                f.write(spec_content)
            
            processed_files.append((api_file.name, spec_file.name))
            print(f"  ✓ 產生: {spec_file.name}")
        
        except Exception as e:
            print(f"  ✗ 錯誤: {e}")
            skipped_files.append(api_file.name)
    
    # 產生報告
    print("\n" + "="*60)
    print("批次處理完成！")
    print("="*60)
    print(f"\n處理結果:")
    for api_file, spec_file in processed_files:
        print(f"✓ {api_file} → {spec_file}")
    
    if skipped_files:
        print(f"\n跳過的檔案:")
        for skipped in skipped_files:
            print(f"- {skipped}")
    
    print(f"\n共處理 {len(api_files)} 個 API 檔案，成功產生 {len(processed_files)} 個規格單。")

if __name__ == "__main__":
    main()
