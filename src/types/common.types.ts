/**
 * Common output configuration
 */
export interface OutputConfig {
  format: 'markdown' | 'html' | 'json';
  destination: string;
  overwrite: boolean;
  backup: boolean;
  verbose: boolean;
}

/**
 * Error handling configuration
 */
export interface ErrorConfig {
  throwOnError: boolean;
  maxRetries: number;
  retryDelay: number;
  logErrors: boolean;
  errorFormat: 'simple' | 'detailed' | 'json';
}

/**
 * Processing options for various operations
 */
export interface ProcessingOptions {
  parallel: boolean;
  maxConcurrency: number;
  timeout: number;
  cache: boolean;
  cacheTimeout: number;
  debug: boolean;
}

/**
 * Common metadata structure
 */
export interface Metadata {
  version: string;
  generatedAt: string;
  source: string;
  checksum?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}

/**
 * Default output configuration
 */
export const DEFAULT_OUTPUT_CONFIG: OutputConfig = {
  format: 'markdown',
  destination: './README.md',
  overwrite: true,
  backup: false,
  verbose: false
};

/**
 * Default error configuration
 */
export const DEFAULT_ERROR_CONFIG: ErrorConfig = {
  throwOnError: true,
  maxRetries: 3,
  retryDelay: 1000,
  logErrors: true,
  errorFormat: 'simple'
};

/**
 * Default processing options
 */
export const DEFAULT_PROCESSING_OPTIONS: ProcessingOptions = {
  parallel: false,
  maxConcurrency: 4,
  timeout: 30000,
  cache: true,
  cacheTimeout: 300000,
  debug: false
};
