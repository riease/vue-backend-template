import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Dynamic imports for optional dependencies check
let _;
let jsYaml;
let glob;

async function checkDeps() {
    try {
        const lodashModule = await import('lodash');
        _ = lodashModule.default || lodashModule;
    } catch (e) {
        console.error('Error: "lodash" is required. Please install it.');
        process.exit(1);
    }

    try {
        const jsYamlModule = await import('js-yaml');
        jsYaml = jsYamlModule.default || jsYamlModule;
    } catch (e) {
        console.error('Error: "js-yaml" is required. Please install it: npm install -D js-yaml');
        process.exit(1);
    }

    try {
        const globModule = await import('glob');
        glob = globModule.globSync || globModule.sync || globModule.default?.sync;
        if (!glob) {
            // Handle glob v10+ which is named export glob or globSync
            if (typeof globModule.glob === 'function') glob = globModule.glob.sync; // older v9?
            else glob = globModule.globSync;
        }
    } catch (e) {
        console.error('Error: "glob" is required. Please install it: npm install -D glob');
        // console.error(e);
        process.exit(1);
    }
}

const args = process.argv.slice(2);
const getArg = (name, alias) => {
    const index = args.findIndex(a => a === name || a === alias);
    return index !== -1 ? args[index + 1] : null;
};

const inputDir = getArg('--input', '-i') || 'doc/api';
const outputFile = getArg('--output', '-o') || 'src/model/ACQueryParameter.ts';

const PROJECT_NAME_REGEX = /([A-Z]+)QueryParameter/;
const DEFAULT_SORT_FIELD = 'createdAt';

function resolveType(param) {
    if (param.schema) {
        if (param.schema.type === 'integer' || param.schema.type === 'number') return 'number';
        if (param.schema.type === 'boolean') return 'boolean';
    }
    if (param.type === 'integer' || param.type === 'number') return 'number';
    if (param.type === 'boolean') return 'boolean';
    return 'string';
}

function normalizeName(name) {
    return _.camelCase(name);
}

// Cache for DataModel prefixes
let dataModelPrefixes = null;

function loadDataModelPrefixes() {
    if (dataModelPrefixes !== null) return dataModelPrefixes;

    dataModelPrefixes = new Set();
    const modelDir = 'src/model';

    try {
        if (fs.existsSync(modelDir)) {
            const files = fs.readdirSync(modelDir);
            files.forEach(file => {
                // Match pattern: XxxDataModel.ts or XxxListDataModel.ts
                const match = file.match(/^(.+?)(List)?DataModel\.ts$/);
                if (match) {
                    dataModelPrefixes.add(match[1]); // e.g., "Account", "InformationSystem"
                }
            });
        }
    } catch (e) {
        console.warn('Warning: Could not read src/model directory:', e.message);
    }

    return dataModelPrefixes;
}

function getClassName(operationId, pathStr) {
    let base = operationId;
    if (!base) {
        // Fallback to path
        const parts = pathStr.split('/').filter(Boolean);
        base = parts[parts.length - 1]; // last part
    }

    // Remove common prefixes
    base = base.replace(/^(get|list|query|search|find)/i, '');

    // Singularize implementation
    if (base.endsWith('s') && !base.endsWith('ss')) {
        base = base.slice(0, -1);
    }

    const candidateName = _.upperFirst(_.camelCase(base));

    // Try to match with existing DataModel prefixes
    const prefixes = loadDataModelPrefixes();

    // Direct match
    if (prefixes.has(candidateName)) {
        return candidateName + 'QueryParameter';
    }

    // Try case-insensitive match
    const lowerCandidate = candidateName.toLowerCase();
    for (const prefix of prefixes) {
        if (prefix.toLowerCase() === lowerCandidate) {
            return prefix + 'QueryParameter';
        }
    }

    // No match found, use candidate
    return candidateName + 'QueryParameter';
}


async function generate() {
    await checkDeps();

    let files = [];
    try {
        if (typeof glob === 'function') {
            files = glob(`${inputDir}/**/*.{json,yaml,yml}`);
        } else {
            console.error("Could not load glob function properly.");
            process.exit(1);
        }
    } catch (e) {
        console.error("Error running glob:", e);
        process.exit(1);
    }

    if (files.length === 0) {
        console.warn(`No API spec files found in ${inputDir}`);
    }

    const outputFileName = path.basename(outputFile, '.ts');
    const baseClassName = outputFileName; // e.g. ACQueryParameter

    // 1. First Pass: Scan to find common parameters
    const paramCounts = new Map(); // "name:type" -> count
    const paramDetails = new Map(); // "name:type" -> { name, type, description }

    const allOps = []; // Store ops for second pass

    files.forEach(file => {
        const fileContent = fs.readFileSync(file, 'utf8');
        let spec;
        try {
            spec = file.endsWith('.json') ? JSON.parse(fileContent) : jsYaml.load(fileContent);
        } catch (e) {
            console.error(`Failed to parse ${file}:`, e);
            return;
        }

        if (!spec.paths) return;

        Object.keys(spec.paths).forEach(pathKey => {
            const pathItem = spec.paths[pathKey];
            const method = 'get';
            if (pathItem[method]) {
                const op = pathItem[method];
                let params = op.parameters || [];

                // Resolve references
                params = params.map(p => {
                    if (p.$ref && p.$ref.startsWith('#/components/parameters/')) {
                        const refName = p.$ref.replace('#/components/parameters/', '');
                        if (spec.components && spec.components.parameters && spec.components.parameters[refName]) {
                            return { ...spec.components.parameters[refName], ...p }; // Merging, though $ref usually stands alone
                        }
                    }
                    return p;
                });

                const queryParams = params.filter(p => p.in === 'query');

                if (queryParams.length === 0 && !op.operationId) return;

                // Filter by operationId ending with "Search" as per SKILL.md
                if (!op.operationId || !op.operationId.endsWith('Search')) return;

                // Filter out operations containing "common" (case-insensitive check is safer, but instruction says "string 'common'")
                if (op.operationId.toLowerCase().includes('common')) return;

                const className = getClassName(op.operationId, pathKey);

                // Store for later
                allOps.push({
                    className,
                    op,
                    queryParams
                });

                // Count params
                queryParams.forEach(p => {
                    if (p.name !== 'sort' && p.name !== 'page' && p.name !== 'size' && p.name !== 'offset' && p.name !== 'limit' && p.name !== 'keyword' && p.name !== 'sortBy' && p.name !== 'sortOrder') {
                        const type = resolveType(p);
                        const key = `${p.name}:${type}`;
                        const current = paramCounts.get(key) || 0;
                        paramCounts.set(key, current + 1);
                        if (!paramDetails.has(key)) {
                            paramDetails.set(key, { ...p, type });
                        }
                    }
                });
            }
        });
    });

    // Determine common params (threshold: >= 3 occurrences)
    const COMMON_THRESHOLD = 3;
    const commonParams = [];
    for (const [key, count] of paramCounts.entries()) {
        if (count >= COMMON_THRESHOLD) {
            commonParams.push(paramDetails.get(key));
        }
    }

    // Sort common params by name for consistency
    commonParams.sort((a, b) => a.name.localeCompare(b.name));

    // Set of common param names for easy lookup
    const commonParamNames = new Set(commonParams.map(p => p.name));

    // 2. Generate Code
    let content = `import {pickAndAssign, QueryParameter, QueryParamTool} from 'ch3chi-commons-vue';\n\n`;
    content += `// ~ ----------------------------------------------------------\n\n`;

    // Generate Base Class
    content += `/**\n`;
    content += ` * ${baseClassName} 繼承自 QueryParameter，增加 project-specific 通用查詢參數支援\n`;
    content += ` */\n`;
    content += `export class ${baseClassName} extends QueryParameter {\n`;

    // Base Class Properties
    commonParams.forEach(p => {
        const comment = p.description ? ` // ${p.description.replace(/\n/g, ' ')}` : '';
        content += `  ${normalizeName(p.name)}?: ${p.type};${comment}\n`;
    });
    if (commonParams.length > 0) content += `\n`;

    // Base Class methods
    content += `  toQueryStringParam(): Record<string, any> {\n`;
    content += `    const payload = super.toQueryStringParam();\n`;
    content += `    // 專案通用參數可在此擴充\n`;
    content += `    return pickAndAssign(payload, {\n`;
    commonParams.forEach(p => {
        content += `      ${p.name}: this.${normalizeName(p.name)},\n`;
    });
    content += `      keyword: this.keyword,\n    });\n`;
    content += `  }\n\n`;

    content += `  clear(): void {\n`;
    content += `    super.clear();\n`;
    commonParams.forEach(p => {
        content += `    this.${normalizeName(p.name)} = undefined;\n`;
    });
    content += `  }\n`;
    content += `}\n\n`;

    const generatedClasses = new Set();

    allOps.forEach(({ className, op, queryParams }) => {
        if (generatedClasses.has(className)) return;
        generatedClasses.add(className);

        // Filter out params that are already in base class
        const specificParams = queryParams.filter(p => !commonParamNames.has(p.name) && p.name !== 'sort' && p.name !== 'page' && p.name !== 'size' && p.name !== 'offset' && p.name !== 'limit' && p.name !== 'keyword' && p.name !== 'sortBy' && p.name !== 'sortOrder');

        content += `/**\n`;
        content += ` * ${className} 繼承自 ${baseClassName}\n`;
        if (op.summary) content += ` * ${op.summary}\n`;
        content += ` */\n`;
        content += `export class ${className} extends ${baseClassName} {\n`;

        // Properties
        specificParams.forEach(p => {
            const type = resolveType(p);
            const comment = p.description ? ` // ${p.description.replace(/\n/g, ' ')}` : '';
            content += `  ${normalizeName(p.name)}?: ${type};${comment}\n`;
        });
        content += `\n`;

        // Constructor
        content += `  constructor() {\n`;
        content += `    super();\n`;
        content += `    // 設定預設排序條件\n`;
        content += `    if (!this.sort) {\n`;
        content += `      this.sort = [];\n`;
        content += `    }\n`;
        content += `    this.sort.push(QueryParamTool.defSort('${DEFAULT_SORT_FIELD}'));\n`;
        content += `  }\n\n`;

        // toQueryStringParam
        content += `  toQueryStringParam(): Record<string, any> {\n`;
        content += `    const payload = super.toQueryStringParam();\n`;
        content += `    return pickAndAssign(payload, {\n`;
        specificParams.forEach(p => {
            content += `      ${p.name}: this.${normalizeName(p.name)},\n`;
        });
        content += `      ...QueryParamTool.firstSortObj(this.sort),\n`;
        content += `    });\n`;
        content += `  }\n\n`;

        // clear
        content += `  clear(): void {\n`;
        content += `    super.clear();\n`;
        specificParams.forEach(p => {
            content += `    this.${normalizeName(p.name)} = undefined;\n`;
        });
        content += `    // 重設排序條件\n`;
        content += `    this.sort!.push(QueryParamTool.defSort('${DEFAULT_SORT_FIELD}'));\n`;
        content += `  }\n`;
        content += `}\n\n`;
    });

    content += `// ~ ----------------------------------------------------------\n`;

    // Ensure directory exists
    const dir = path.dirname(outputFile);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }


    // ... (existing code for TypeScript generation)

    fs.writeFileSync(outputFile, content);
    console.log(`Generated ${outputFile}`);

    // 3. Generate Documentation
    console.log('Generating documentation...');

    let mdContent = `# Query Parameters Note\n\n`;
    const docDir = 'doc/note';
    const docFile = path.join(docDir, 'query.md');

    // Common Params Table
    mdContent += `## Common Parameters\n\n`;
    if (commonParams.length > 0) {
        mdContent += `| Name | Type | Description |\n`;
        mdContent += `| :--- | :--- | :--- |\n`;
        commonParams.forEach(p => {
            const desc = p.description ? p.description.replace(/\n/g, ' ') : '';
            mdContent += `| ${p.name} | ${p.type} | ${desc} |\n`;
        });
    } else {
        mdContent += `No common parameters identified.\n`;
    }
    mdContent += `\n`;

    // Specific Params
    mdContent += `## Specific Parameters\n\n`;

    // Sort ops by ClassName for consistent output
    allOps.sort((a, b) => a.className.localeCompare(b.className));

    allOps.forEach(({ className, op, queryParams }) => {
        const specificParams = queryParams.filter(p => !commonParamNames.has(p.name) && p.name !== 'sort' && p.name !== 'page' && p.name !== 'size' && p.name !== 'offset' && p.name !== 'limit' && p.name !== 'keyword' && p.name !== 'sortBy' && p.name !== 'sortOrder');

        if (specificParams.length > 0) {
            mdContent += `### ${className}\n\n`;
            if (op.summary) mdContent += `**Summary**: ${op.summary}\n\n`;

            mdContent += `| Name | Type | Description |\n`;
            mdContent += `| :--- | :--- | :--- |\n`;
            specificParams.forEach(p => {
                const type = resolveType(p);
                const desc = p.description ? p.description.replace(/\n/g, ' ') : '';
                mdContent += `| ${p.name} | ${type} | ${desc} |\n`;
            });
            mdContent += `\n`;
        }
    });

    if (!fs.existsSync(docDir)) {
        fs.mkdirSync(docDir, { recursive: true });
    }
    fs.writeFileSync(docFile, mdContent);
    console.log(`Generated ${docFile}`);
}

generate();

