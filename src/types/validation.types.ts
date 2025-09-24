/**
 * Validation severity levels
 */
export enum ValidationSeverity {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info'
}

/**
 * Validation context for processing
 */
export interface ValidationContext {
  filePath: string;
  fileName: string;
  content: string;
  lines: string[];
}

/**
 * Complete validation result for a rule
 */
export interface ValidationResult {
  rule: string;
  severity: ValidationSeverity;
  message: string;
  source: string;
  line?: number;
  column?: number;
  suggestions?: string[];
}

/**
 * Complete validation report
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
    score: number;
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
  enabled: boolean;
  rules: ValidationRule[];
  failOnWarning: boolean;
  maxWarnings: number;
}

/**
 * Content validation rule
 */
export interface ValidationRule {
  id: string;
  name: string;
  description: string;
  level: 'error' | 'warning' | 'info';
  pattern?: string | RegExp;
  validator?: (content: string) => ValidationRuleResult;
}

/**
 * Validation result for a rule
 */
export interface ValidationRuleResult {
  valid: boolean;
  message?: string;
  line?: number;
  column?: number;
  suggestions?: string[];
}

/**
 * Content validation result
 */
export interface ContentValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  suggestions: ValidationIssue[];
  summary: {
    totalIssues: number;
    errorCount: number;
    warningCount: number;
    suggestionCount: number;
  };
}

/**
 * Validation issue details
 */
export interface ValidationIssue {
  ruleId: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  line?: number;
  column?: number;
  source?: string;
  suggestions?: string[];
}

/**
 * Default validation configuration
 */
export const DEFAULT_VALIDATION_CONFIG: ValidationConfig = {
  enabled: true,
  rules: [],
  failOnWarning: false,
  maxWarnings: 10
};
