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
