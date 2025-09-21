/*
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
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

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
 * Content validator for README and documentation
 */
export class ContentValidator {
  private config: ValidationConfig;
  private builtInRules: ValidationRule[];

  constructor(config: Partial<ValidationConfig> = {}) {
    this.config = { ...DEFAULT_VALIDATION_CONFIG, ...config };
    this.builtInRules = this.createBuiltInRules();
  }

  /**
   * Validate markdown content
   */
  validateContent(content: string, filePath: string): ValidationReport {
    const context: ValidationContext = {
      filePath,
      fileName: filePath.split('/').pop() || filePath,
      content,
      lines: content.split('\n')
    };

    const results: ValidationResult[] = [];
    let totalChecks = 0;

    // Run built-in validation rules
    for (const rule of this.builtInRules) {
      totalChecks++;
      const ruleResults = this.executeRule(rule, context);
      results.push(...ruleResults);
    }

    // Run custom validation rules
    for (const rule of this.config.customRules) {
      totalChecks++;
      const ruleResults = this.executeRule(rule, context);
      results.push(...ruleResults);
    }

    return this.generateReport(results, totalChecks);
  }

  /**
   * Validate file by path
   */
  validateFile(filePath: string): ValidationReport {
    const resolvedPath = resolve(filePath);

    if (!existsSync(resolvedPath)) {
      const error: ValidationResult = {
        rule: 'file-exists',
        severity: ValidationSeverity.ERROR,
        message: `File not found: ${resolvedPath}`,
        source: resolvedPath
      };

      return this.generateReport([error], 1);
    }

    try {
      const content = readFileSync(resolvedPath, 'utf8');
      return this.validateContent(content, resolvedPath);
    } catch (error) {
      const validationError: ValidationResult = {
        rule: 'file-readable',
        severity: ValidationSeverity.ERROR,
        message: `Cannot read file: ${error instanceof Error ? error.message : 'Unknown error'}`,
        source: resolvedPath
      };

      return this.generateReport([validationError], 1);
    }
  }

  /**
   * Validate multiple files
   */
  validateFiles(filePaths: string[]): ValidationReport {
    const allResults: ValidationResult[] = [];
    let totalChecks = 0;

    for (const filePath of filePaths) {
      const report = this.validateFile(filePath);
      allResults.push(...report.errors, ...report.warnings, ...report.info);
      totalChecks += report.summary.totalChecks;
    }

    return this.generateReport(allResults, totalChecks);
  }

  /**
   * Validate project documentation
   */
  validateProject(projectPath: string): ValidationReport {
    const documentationFiles = this.findDocumentationFiles(projectPath);
    return this.validateFiles(documentationFiles);
  }

  /**
   * Execute a validation rule
   */
  private executeRule(
    rule: ValidationRule,
    context: ValidationContext
  ): ValidationResult[] {
    try {
      if (rule.validator) {
        return rule.validator(context.content, context);
      }

      if (rule.pattern) {
        return this.executePatternRule(rule, context);
      }

      return [];
    } catch (error) {
      return [
        {
          rule: rule.name,
          severity: ValidationSeverity.ERROR,
          message: `Rule execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          source: context.filePath
        }
      ];
    }
  }

  /**
   * Execute pattern-based validation rule
   */
  private executePatternRule(
    rule: ValidationRule,
    context: ValidationContext
  ): ValidationResult[] {
    if (!rule.pattern) return [];

    const results: ValidationResult[] = [];
    const lines = context.lines;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (rule.pattern.test(line)) {
        results.push({
          rule: rule.name,
          severity: rule.severity,
          message: rule.description,
          source: context.filePath,
          line: i + 1
        });
      }
    }

    return results;
  }

  /**
   * Create built-in validation rules
   */
  private createBuiltInRules(): ValidationRule[] {
    const rules: ValidationRule[] = [];

    // Markdown syntax validation
    if (this.config.checkMarkdownSyntax) {
      rules.push(
        {
          name: 'markdown-headers',
          description: 'Headers should have proper spacing',
          severity: ValidationSeverity.WARNING,
          validator: this.validateMarkdownHeaders.bind(this)
        },
        {
          name: 'markdown-links',
          description: 'Links should have valid syntax',
          severity: ValidationSeverity.ERROR,
          validator: this.validateMarkdownLinks.bind(this)
        },
        {
          name: 'markdown-lists',
          description: 'Lists should have consistent formatting',
          severity: ValidationSeverity.WARNING,
          validator: this.validateMarkdownLists.bind(this)
        }
      );
    }

    // Code block validation
    if (this.config.checkCodeBlocks) {
      rules.push({
        name: 'code-blocks',
        description: 'Code blocks should have language specifications',
        severity: ValidationSeverity.INFO,
        validator: this.validateCodeBlocks.bind(this)
      });
    }

    // Mermaid diagram validation
    if (this.config.checkMermaidDiagrams) {
      rules.push({
        name: 'mermaid-syntax',
        description: 'Mermaid diagrams should have valid syntax',
        severity: ValidationSeverity.ERROR,
        validator: this.validateMermaidDiagrams.bind(this)
      });
    }

    // Internal link validation
    if (this.config.checkInternalLinks) {
      rules.push({
        name: 'internal-links',
        description: 'Internal links should point to existing files',
        severity: ValidationSeverity.ERROR,
        validator: this.validateInternalLinks.bind(this)
      });
    }

    // Structure validation
    if (this.config.enforceStructure) {
      rules.push({
        name: 'readme-structure',
        description: 'README should follow standard structure',
        severity: ValidationSeverity.WARNING,
        validator: this.validateReadmeStructure.bind(this)
      });
    }

    return rules;
  }

  /**
   * Validate markdown headers
   */
  private validateMarkdownHeaders(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const lines = context.lines;
    const headerLevels: number[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const headerMatch = line.match(/^(#+)\s*(.*)/);

      if (headerMatch) {
        const [, hashes, title] = headerMatch;
        const level = hashes.length;

        // Check for space after hashes
        if (!line.match(/^#+\s+/)) {
          results.push({
            rule: 'markdown-headers',
            severity: ValidationSeverity.WARNING,
            message: 'Headers should have a space after the hash symbols',
            source: context.filePath,
            line: i + 1,
            suggestion: `${hashes} ${title.trim()}`
          });
        }

        // Check for empty title
        if (!title.trim()) {
          results.push({
            rule: 'markdown-headers',
            severity: ValidationSeverity.ERROR,
            message: 'Headers should not be empty',
            source: context.filePath,
            line: i + 1
          });
        }

        // Check header hierarchy - should not skip levels
        const expectedLevel =
          headerLevels.length === 0 ? 1 : Math.min(...headerLevels) + 1;
        if (level > expectedLevel && !headerLevels.includes(level - 1)) {
          results.push({
            rule: 'markdown-headers',
            severity: ValidationSeverity.ERROR,
            message: `Header hierarchy violation: level ${level} header should be preceded by level ${level - 1}`,
            source: context.filePath,
            line: i + 1
          });
        }

        // Track this header level
        if (!headerLevels.includes(level)) {
          headerLevels.push(level);
        }
      }
    }

    return results;
  }

  /**
   * Validate markdown links
   */
  private validateMarkdownLinks(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const linkRegex = /\[([^\]]*)\]\(([^)]*)\)/g;
    const incompleteLinkRegex = /\[([^\]]*)\]\([^)]*$/;
    const lines = context.lines;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;

      // Check for complete links
      while ((match = linkRegex.exec(line)) !== null) {
        const [fullMatch, text, url] = match;

        // Check for empty link text
        if (!text.trim()) {
          results.push({
            rule: 'markdown-links',
            severity: ValidationSeverity.WARNING,
            message: 'Link text should not be empty',
            source: context.filePath,
            line: i + 1
          });
        }

        // Check for empty URL
        if (!url.trim()) {
          results.push({
            rule: 'markdown-links',
            severity: ValidationSeverity.ERROR,
            message: 'Link URL should not be empty',
            source: context.filePath,
            line: i + 1
          });
        }

        // Check for malformed URLs
        if (url.includes(' ') && !url.startsWith('#')) {
          results.push({
            rule: 'markdown-links',
            severity: ValidationSeverity.ERROR,
            message: 'URLs should not contain spaces (use %20 instead)',
            source: context.filePath,
            line: i + 1,
            suggestion: fullMatch.replace(url, url.replace(/\s+/g, '%20'))
          });
        }
      }

      // Check for incomplete links (missing closing parenthesis)
      const incompleteMatch = line.match(incompleteLinkRegex);
      if (incompleteMatch) {
        results.push({
          rule: 'markdown-links',
          severity: ValidationSeverity.ERROR,
          message: 'Link is missing closing parenthesis',
          source: context.filePath,
          line: i + 1
        });
      }
    }

    return results;
  }

  /**
   * Validate markdown lists
   */
  private validateMarkdownLists(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const lines = context.lines;
    let inList = false;
    let listType: 'ordered' | 'unordered' | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line is a list item
      const unorderedMatch = line.match(/^[-*+]\s/);
      const orderedMatch = line.match(/^\d+\.\s/);

      if (unorderedMatch || orderedMatch) {
        const currentType = unorderedMatch ? 'unordered' : 'ordered';

        if (!inList) {
          inList = true;
          listType = currentType;
        } else if (listType !== currentType) {
          results.push({
            rule: 'markdown-lists',
            severity: ValidationSeverity.WARNING,
            message: 'Mixed list types in the same list',
            source: context.filePath,
            line: i + 1
          });
        }
      } else if (line === '') {
        // Empty line might end the list
        continue;
      } else if (inList && !line.startsWith('  ')) {
        // Non-list item that's not indented - list has ended
        inList = false;
        listType = null;
      }
    }

    return results;
  }

  /**
   * Validate code blocks
   */
  private validateCodeBlocks(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const lines = context.lines;
    let inCodeBlock = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (!inCodeBlock) {
          // Starting a code block
          inCodeBlock = true;
          const language = line.slice(3).trim();

          if (!language) {
            results.push({
              rule: 'code-blocks',
              severity: ValidationSeverity.INFO,
              message:
                'Code blocks should specify a language for syntax highlighting',
              source: context.filePath,
              line: i + 1,
              suggestion: '```javascript (or appropriate language)'
            });
          }
        } else {
          // Ending a code block
          inCodeBlock = false;
        }
      }
    }

    // Check for unclosed code blocks
    if (inCodeBlock) {
      results.push({
        rule: 'code-blocks',
        severity: ValidationSeverity.ERROR,
        message: 'Unclosed code block detected',
        source: context.filePath
      });
    }

    return results;
  }

  /**
   * Validate Mermaid diagrams
   */
  private validateMermaidDiagrams(
    content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
    let match;

    while ((match = mermaidRegex.exec(content)) !== null) {
      const [, diagramCode] = match;
      const lineNumber = content.slice(0, match.index).split('\n').length;

      // Basic Mermaid syntax validation
      const diagramType = diagramCode.trim().split('\n')[0];

      if (!diagramType) {
        results.push({
          rule: 'mermaid-syntax',
          severity: ValidationSeverity.ERROR,
          message: 'Mermaid diagram is empty',
          source: context.filePath,
          line: lineNumber
        });
        continue;
      }

      const validTypes = [
        'graph',
        'flowchart',
        'sequenceDiagram',
        'classDiagram',
        'stateDiagram',
        'erDiagram',
        'pie',
        'gantt'
      ];
      const hasValidType = validTypes.some((type) =>
        diagramType.toLowerCase().includes(type.toLowerCase())
      );

      if (!hasValidType) {
        results.push({
          rule: 'mermaid-syntax',
          severity: ValidationSeverity.WARNING,
          message: 'Unknown Mermaid diagram type',
          source: context.filePath,
          line: lineNumber
        });
      }
    }

    return results;
  }

  /**
   * Validate internal links
   */
  private validateInternalLinks(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];
    const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
    const lines = context.lines;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match;

      while ((match = linkRegex.exec(line)) !== null) {
        const [, , url] = match;

        // Check internal links (relative paths)
        if (
          !url.startsWith('http') &&
          !url.startsWith('#') &&
          !url.startsWith('mailto:')
        ) {
          const targetPath = resolve(context.filePath, '..', url);

          if (!existsSync(targetPath)) {
            results.push({
              rule: 'internal-links',
              severity: ValidationSeverity.ERROR,
              message: `Internal link points to non-existent file: ${url}`,
              source: context.filePath,
              line: i + 1
            });
          }
        }
      }
    }

    return results;
  }

  /**
   * Validate README structure
   */
  private validateReadmeStructure(
    _content: string,
    context: ValidationContext
  ): ValidationResult[] {
    const results: ValidationResult[] = [];

    if (!context.fileName.toLowerCase().includes('readme')) {
      return results;
    }

    const expectedSections = [
      { name: 'title', pattern: /^#\s+/, required: true },
      {
        name: 'description',
        pattern: /^##?\s*(Description|About)/,
        required: false
      },
      {
        name: 'installation',
        pattern: /^##?\s*(Installation|Setup|Getting Started)/,
        required: false
      },
      { name: 'usage', pattern: /^##?\s*(Usage|Examples?)/, required: false },
      { name: 'license', pattern: /^##?\s*License/, required: false }
    ];

    const lines = context.lines;
    const foundSections = new Set<string>();

    for (const line of lines) {
      for (const section of expectedSections) {
        if (section.pattern.test(line)) {
          foundSections.add(section.name);
        }
      }
    }

    for (const section of expectedSections) {
      if (section.required && !foundSections.has(section.name)) {
        results.push({
          rule: 'readme-structure',
          severity: ValidationSeverity.WARNING,
          message: `Missing required section: ${section.name}`,
          source: context.filePath
        });
      }
    }

    return results;
  }

  /**
   * Find documentation files in a project
   */
  private findDocumentationFiles(projectPath: string): string[] {
    const files: string[] = [];
    const commonFiles = [
      'README.md',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'CODE_OF_CONDUCT.md',
      'SECURITY.md',
      'ARCHITECTURE.md'
    ];

    for (const file of commonFiles) {
      const filePath = join(projectPath, file);
      if (existsSync(filePath)) {
        files.push(filePath);
      }
    }

    return files;
  }

  /**
   * Generate validation report
   */
  private generateReport(
    results: ValidationResult[],
    totalChecks: number
  ): ValidationReport {
    const errors = results.filter(
      (r) => r.severity === ValidationSeverity.ERROR
    );
    const warnings = results.filter(
      (r) => r.severity === ValidationSeverity.WARNING
    );
    const info = results.filter((r) => r.severity === ValidationSeverity.INFO);

    const errorCount = errors.length;
    const warningCount = warnings.length;
    const infoCount = info.length;

    // Calculate score (0-100)
    const score = Math.max(
      0,
      Math.round(100 - (errorCount * 20 + warningCount * 5 + infoCount * 1))
    );

    return {
      passed: errorCount === 0,
      errors,
      warnings,
      info,
      summary: {
        totalChecks,
        errorCount,
        warningCount,
        infoCount,
        score
      },
      metadata: {
        validatedAt: new Date().toISOString(),
        validator: 'ContentValidator',
        version: '1.0.0'
      }
    };
  }
}
