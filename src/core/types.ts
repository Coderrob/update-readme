/*
 *
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// Re-export all types from the organized type files in the types subfolder
export * from '../types/index.js';

// Keep any additional legacy type definitions that may be needed

/**
 *  InputEntry interface definition
 */
export interface IEntry<T> {
  id: T;
  default: string;
  deprecationMessage: string;
  description: string;
  required: boolean;
  value?: string;
}

/**
 * Execute interface definition
 */
export interface IExecute {
  execute(): Promise<void>;
}

export interface IRender {
  render(): Promise<string>;
}

export interface ILog {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string, error?: unknown): void;
  error(message: string, error: unknown): void;
  fatal(message: string, error?: unknown): void;
}

export enum NodeVersion {
  NODE20 = 'node20',
  NODE22 = 'node22'
}

/**
 * File or directory information
 */
export interface FileSystemItem {
  name: string;
  path: string;
  relativePath: string;
  type: 'file' | 'directory';
  size?: number;
  extension?: string;
  description?: string;
  language?: string;
  isImportant?: boolean;
  children?: FileSystemItem[];
  lineCount?: number;
  lastModified?: Date;
}

/**
 * Project structure analysis
 */
export interface ProjectStructure {
  root: FileSystemItem;
  summary: {
    totalFiles: number;
    totalDirectories: number;
    totalSize: number;
    fileTypes: Record<string, number>;
    languages: Record<string, number>;
    importantFiles: string[];
  };
  patterns: {
    configFiles: string[];
    sourceFiles: string[];
    testFiles: string[];
    buildFiles: string[];
    documentationFiles: string[];
  };
}

/**
 * Configuration for structure analysis
 */
export interface StructureAnalysisConfig {
  maxDepth: number;
  excludePatterns: string[];
  includeHidden: boolean;
  analyzeContent: boolean;
  detectLanguages: boolean;
  generateDescriptions: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_ANALYSIS_CONFIG: StructureAnalysisConfig = {
  maxDepth: 5,
  excludePatterns: [
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
    '.nyc_output',
    '*.log',
    '.DS_Store',
    'Thumbs.db'
  ],
  includeHidden: false,
  analyzeContent: true,
  detectLanguages: true,
  generateDescriptions: true
};

export const CompositeRun = 'composite';
export const DockerRun = 'docker';

export type RunType = typeof CompositeRun | typeof DockerRun | `${NodeVersion}`;

/**
 * Dependency information
 */
export interface DependencyInfo {
  name: string;
  version: string;
  type: 'production' | 'development' | 'peer' | 'optional';
  description?: string;
  homepage?: string;
  repository?: string;
  license?: string;
}

/**
 * File dependency relationship
 */
export interface FileDependency {
  source: string;
  target: string;
  type: 'import' | 'require' | 'include' | 'reference';
  line?: number;
  isExternal: boolean;
}

/**
 * Project dependency analysis result
 */
export interface DependencyAnalysis {
  packageDependencies: DependencyInfo[];
  fileDependencies: FileDependency[];
  dependencyTree: DependencyTree;
  summary: {
    totalPackages: number;
    totalFiles: number;
    externalDependencies: number;
    internalDependencies: number;
    circularDependencies: string[][];
  };
}

/**
 * Dependency tree node
 */
export interface DependencyTreeNode {
  name: string;
  type: 'package' | 'file';
  dependencies: DependencyTreeNode[];
  dependents: string[];
  level: number;
}

/**
 * Dependency tree structure
 */
export interface DependencyTree {
  root: DependencyTreeNode[];
  levels: DependencyTreeNode[][];
  cycles: string[][];
}

/**
 * Mermaid diagram configuration
 */
export interface MermaidConfig {
  direction: 'TD' | 'LR' | 'RL' | 'BT';
  showPackages: boolean;
  showFiles: boolean;
  showExternalOnly: boolean;
  maxDepth: number;
  groupByType: boolean;
}

/**
 * Default Mermaid configuration
 */
export const DEFAULT_MERMAID_CONFIG: MermaidConfig = {
  direction: 'TD',
  showPackages: true,
  showFiles: false,
  showExternalOnly: false,
  maxDepth: 3,
  groupByType: true
};

/**
 * Validation rule severity levels
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Validation result for a single check
 */
export interface ValidationResult {
  rule: string;
  severity: ValidationSeverity;
  message: string;
  source?: string;
  line?: number;
  column?: number;
  suggestion?: string;
}

/**
 * Overall validation report
 */
export interface ValidationReport {
  passed: boolean;
  errors: ValidationResult[];
  warnings: ValidationResult[];
  info: ValidationResult[];
  summary: {
    totalChecks: number;
    errorCount: number;
    warningCount: number;
    infoCount: number;
    score: number; // 0-100
  };
  metadata: {
    validatedAt: string;
    validator: string;
    version: string;
  };
}

/**
 * Content validation configuration
 */
export interface ValidationConfig {
  checkMarkdownSyntax: boolean;
  checkMermaidDiagrams: boolean;
  checkInternalLinks: boolean;
  checkExternalLinks: boolean;
  checkSpelling: boolean;
  checkGrammar: boolean;
  checkCodeBlocks: boolean;
  validateYamlFrontmatter: boolean;
  enforceStructure: boolean;
  customRules: ValidationRule[];
}

/**
 * Custom validation rule
 */
export interface ValidationRule {
  name: string;
  description: string;
  severity: ValidationSeverity;
  pattern?: RegExp;
  validator?: (
    content: string,
    context: ValidationContext
  ) => ValidationResult[];
}

/**
 * Validation context
 */
export interface ValidationContext {
  filePath: string;
  fileName: string;
  content: string;
  lines: string[];
  metadata?: Record<string, unknown>;
  projectType?: string;
  dependencies?: string[];
}

/**
 * Default validation configuration
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  checkMarkdownSyntax: true,
  checkMermaidDiagrams: true,
  checkInternalLinks: true,
  checkExternalLinks: false, // Can be slow
  checkSpelling: false, // Requires additional setup
  checkGrammar: false, // Requires additional setup
  checkCodeBlocks: true,
  validateYamlFrontmatter: true,
  enforceStructure: true,
  customRules: []
};

/**
 * Template variable context interface
 */
export interface TemplateContext {
  action: Action;
  repository: string;
  metadata: {
    generatedAt: string;
    generatorVersion: string;
    documentVersion: string;
  };
}

/**
 * Template configuration interface
 */
export interface TemplateConfig {
  sections: TemplateSection[];
  variables: Record<string, string>;
  formatting: TemplateFormatting;
}

/**
 * Template section configuration
 */
export interface TemplateSection {
  name: string;
  enabled: boolean;
  template: string;
  order: number;
  variables?: Record<string, string>;
}

/**
 * Template formatting configuration
 */
export interface TemplateFormatting {
  lineEndings: 'lf' | 'crlf';
  indentation: 'spaces' | 'tabs';
  indentSize: number;
  maxLineLength: number;
  trimTrailingWhitespace: boolean;
}

/**
 * Default template configuration
 */
export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  sections: [
    {
      name: 'header',
      enabled: true,
      order: 1,
      template: `# {{action.name}}

{{action.description}}`
    },
    {
      name: 'branding',
      enabled: true,
      order: 2,
      template: `{{#if action.branding}}
## Branding

| Attribute | Value |
| --------- | ----- |
| Color     | {{action.branding.color}} |
| Icon      | {{action.branding.icon}} |
{{/if}}`
    },
    {
      name: 'inputs',
      enabled: true,
      order: 3,
      template: `## Inputs

{{#if action.inputs}}
| Name | Description | Default | Required |
| ---- | ----------- | ------- | -------- |
{{#each action.inputs}}
| {{@key}} | {{this.description}} | {{this.default}} | {{#if this.required}}✅ Yes{{else}}❌ No{{/if}} |
{{/each}}
{{else}}
This action does not define any inputs.
{{/if}}`
    },
    {
      name: 'outputs',
      enabled: true,
      order: 4,
      template: `## Outputs

{{#if action.outputs}}
| Name | Description |
| ---- | ----------- |
{{#each action.outputs}}
| {{@key}} | {{this.description}} |
{{/each}}
{{else}}
This action does not define any outputs.
{{/if}}`
    },
    {
      name: 'runs',
      enabled: true,
      order: 5,
      template: `## Runs

**Execution Type:** {{action.runs.using}}

{{#if action.runs.steps}}
This diagram represents the steps of the GitHub Action.

\`\`\`mermaid
{{mermaid_flowchart}}
\`\`\`
{{/if}}`
    },
    {
      name: 'usage',
      enabled: true,
      order: 6,
      template: `## Example Usage

\`\`\`yaml
jobs:
  example:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source
        id: checkout-source
        uses: actions/checkout@v2

      - name: {{action.name}}
        uses: {{repository}}@v1
        with:
{{#each action.inputs}}
          {{@key}}: <value>
{{/each}}
\`\`\``
    },
    {
      name: 'acknowledgments',
      enabled: true,
      order: 7,
      template: `## Acknowledgments

This project leverages Markdown generation techniques from
[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.`
    }
  ],
  variables: {},
  formatting: {
    lineEndings: 'lf',
    indentation: 'spaces',
    indentSize: 2,
    maxLineLength: 80,
    trimTrailingWhitespace: true
  }
};
