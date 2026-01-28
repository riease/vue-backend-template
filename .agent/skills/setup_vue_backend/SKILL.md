---
name: setup_vue_backend
description: Installs standard Vue 3 dependencies and configures scripts for the AutoRisk-365 compliant stack. This skill hydrates a package.json with the required dependencies and run scripts.
---

# Setup Vue Backend Skill

This skill installs the standard set of libraries and tools used in the Vue frontend projects (e.g., AutoRisk-365 web). It ensures that a project has the correct `dependencies`, `devDependencies`, and `scripts` configured.

## Usage

Use this skill when initializing a new Vue project or when updating an existing project to match the standard template.

## Steps

### 1. Install Dependencies

Run the following command to install the production dependencies:

```bash
npm install \
  @fortawesome/fontawesome-svg-core \
  @fortawesome/free-solid-svg-icons \
  @fortawesome/vue-fontawesome \
  axios \
  bootstrap \
  ch3chi-commons-vue \
  dayjs \
  dotenv \
  flatpickr \
  lodash \
  loglevel \
  mime-types \
  pinia \
  pinia-plugin-persistedstate \
  uuid \
  vee-validate \
  vue \
  vue-router \
  yup
```

### 2. Install Dev Dependencies

Run the following command to install the development dependencies:

```bash
npm install -D \
  @eslint/js \
  @types/bootstrap \
  @types/lodash \
  @types/node \
  @vitejs/plugin-vue \
  eslint \
  eslint-config-prettier \
  eslint-plugin-vue \
  globals \
  prettier \
  standard-version \
  typescript-eslint \
  vite \
  vite-plugin-vue-devtools \
  vue-eslint-parser
```

### 3. Create Directory Structure

Ensure the following project documentation directories exist:

```bash
mkdir -p doc/api doc/feature
```

### 4. Configure Scripts

Update your `package.json` to include the following scripts. 
*Note: If `package.json` already has scripts, merge these in, carefully resolving conflicts.*

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "build:prod": "vite build --mode production",
    "preview": "vite preview",
    "changelog:generate": "standard-version --skip.bump --skip.commit --skip.tag",
    "release": "standard-version",
    "release:first": "standard-version --first-release",
    "release:dry": "standard-version --dry-run",
    "release:major": "standard-version --release-as major",
    "release:minor": "standard-version --release-as minor",
    "release:patch": "standard-version --release-as patch"
  }
}
```

### 5. Verification

After running the above steps, run `npm run dev` to ensure the project starts correctly.
