import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import { relative, basename, join, extname } from 'path/posix';
import {
  StructureAnalysisConfig,
  DEFAULT_ANALYSIS_CONFIG,
  ProjectStructure,
  FileSystemItem
} from '../types/index.js';

/**
 * Enhanced folder structure analyzer
 */

export class StructureAnalyzer {
  private config: StructureAnalysisConfig;
  private languageMap: Record<string, string> = {
    '.ts': 'TypeScript',
    '.js': 'JavaScript',
    '.tsx': 'TypeScript React',
    '.jsx': 'JavaScript React',
    '.py': 'Python',
    '.java': 'Java',
    '.cpp': 'C++',
    '.c': 'C',
    '.cs': 'C#',
    '.go': 'Go',
    '.rs': 'Rust',
    '.php': 'PHP',
    '.rb': 'Ruby',
    '.swift': 'Swift',
    '.kt': 'Kotlin',
    '.scala': 'Scala',
    '.dart': 'Dart',
    '.vue': 'Vue',
    '.svelte': 'Svelte',
    '.html': 'HTML',
    '.css': 'CSS',
    '.scss': 'SCSS',
    '.sass': 'Sass',
    '.less': 'Less',
    '.json': 'JSON',
    '.xml': 'XML',
    '.yaml': 'YAML',
    '.yml': 'YAML',
    '.toml': 'TOML',
    '.ini': 'INI',
    '.cfg': 'Config',
    '.conf': 'Config',
    '.env': 'Environment',
    '.md': 'Markdown',
    '.txt': 'Text',
    '.sql': 'SQL',
    '.sh': 'Shell',
    '.bat': 'Batch',
    '.ps1': 'PowerShell',
    '.dockerfile': 'Docker',
    '.gitignore': 'Git',
    '.editorconfig': 'EditorConfig'
  };

  private importantFilePatterns: string[] = [
    'package.json',
    'action.yml',
    'action.yaml',
    'README.md',
    'LICENSE',
    'CHANGELOG.md',
    'CONTRIBUTING.md',
    'tsconfig.json',
    'jest.config.js',
    'jest.config.mjs',
    'webpack.config.js',
    'rollup.config.js',
    'rollup.config.ts',
    'vite.config.js',
    'vite.config.ts',
    '.gitignore',
    '.eslintrc.js',
    '.eslintrc.json',
    'eslint.config.mjs',
    '.prettierrc',
    '.prettierrc.yml',
    'Dockerfile',
    'docker-compose.yml',
    'Makefile'
  ];

  constructor(config: Partial<StructureAnalysisConfig> = {}) {
    this.config = { ...DEFAULT_ANALYSIS_CONFIG, ...config };
  }

  /**
   * Analyze project structure
   */
  analyzeStructure(rootPath: string): ProjectStructure {
    const root = this.analyzeDirectory(rootPath, rootPath, 0);
    const summary = this.generateSummary(root);
    const patterns = this.detectPatterns(root);

    return {
      root,
      summary,
      patterns
    };
  }

  /**
   * Generate directory tree string
   */
  generateDirectoryTree(
    structure: ProjectStructure,
    options?: {
      showFiles?: boolean;
      showSizes?: boolean;
      maxDepth?: number;
      annotateImportant?: boolean;
    }
  ): string {
    const opts = {
      showFiles: true,
      showSizes: false,
      maxDepth: 3,
      annotateImportant: true,
      ...options
    };

    return this.buildTreeString(structure.root, '', true, 0, opts);
  }

  /**
   * Generate file type summary
   */
  generateFileTypeSummary(summary: ProjectStructure['summary']): string {
    let result = '## File Types\n\n';
    result += '| Extension | Language | Count |\n';
    result += '| --------- | -------- | ----- |\n';

    const sortedTypes = Object.entries(summary.fileTypes).sort(
      ([, a], [, b]) => b - a
    );

    for (const [ext, count] of sortedTypes) {
      const language = this.languageMap[ext] || 'Unknown';
      result += `| ${ext || '(no extension)'} | ${language} | ${count} |\n`;
    }

    result += '\n';
    return result;
  }

  /**
   * Generate project statistics
   */
  generateProjectStats(summary: ProjectStructure['summary']): string {
    let result = '## Project Statistics\n\n';
    result += `- **Total Files**: ${summary.totalFiles.toLocaleString()}\n`;
    result += `- **Total Directories**: ${summary.totalDirectories.toLocaleString()}\n`;
    result += `- **Total Size**: ${this.formatFileSize(summary.totalSize)}\n`;
    result += `- **File Types**: ${Object.keys(summary.fileTypes).length}\n`;
    result += `- **Programming Languages**: ${Object.keys(summary.languages).length}\n\n`;

    if (summary.importantFiles.length > 0) {
      result += '### Important Files\n\n';
      for (const file of summary.importantFiles) {
        result += `- \`${file}\`\n`;
      }
      result += '\n';
    }

    return result;
  }

  /**
   * Generate detailed structure documentation
   */
  generateStructureDocumentation(structure: ProjectStructure): string {
    let result = '# Project Structure\n\n';

    result += this.generateProjectStats(structure.summary);
    result += this.generateDirectoryTree(structure);
    result += '\n';
    result += this.generateFileTypeSummary(structure.summary);
    result += this.generatePatternsDocumentation(structure.patterns);

    return result;
  }

  /**
   * Analyze a directory recursively
   */
  private analyzeDirectory(
    dirPath: string,
    rootPath: string,
    depth: number
  ): FileSystemItem {
    const relativePath = relative(rootPath, dirPath);
    const name = basename(dirPath);

    // Check if directory exists
    if (!existsSync(dirPath)) {
      return {
        name: name || basename(rootPath),
        path: dirPath,
        relativePath: relativePath || '.',
        type: 'file', // Treat non-existent as file for counting purposes
        isImportant: false,
        description: 'Path does not exist'
      };
    }

    const item: FileSystemItem = {
      name: name || basename(rootPath),
      path: dirPath,
      relativePath: relativePath || '.',
      type: 'directory',
      children: [],
      isImportant: false
    };

    if (depth >= this.config.maxDepth) {
      return item;
    }

    try {
      const entries = readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (this.shouldExclude(entry.name)) {
          continue;
        }

        const fullPath = join(dirPath, entry.name);

        if (entry.isDirectory()) {
          const childDir = this.analyzeDirectory(fullPath, rootPath, depth + 1);
          item.children!.push(childDir);
        } else if (entry.isFile()) {
          const childFile = this.analyzeFile(fullPath, rootPath);
          item.children!.push(childFile);
        }
      }

      // Sort children: directories first, then files
      item.children!.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });
    } catch {
      // Handle permission errors gracefully
      item.description = 'Access denied or error reading directory';
    }

    return item;
  }

  /**
   * Analyze a single file
   */
  private analyzeFile(filePath: string, rootPath: string): FileSystemItem {
    const relativePath = relative(rootPath, filePath);
    const name = basename(filePath);
    const extension = extname(filePath).toLowerCase();

    const item: FileSystemItem = {
      name,
      path: filePath,
      relativePath,
      type: 'file',
      extension: extension || undefined,
      language: this.languageMap[extension],
      isImportant: this.isImportantFile(name)
    };

    try {
      const stats = statSync(filePath);
      item.size = stats.size;
      item.lastModified = stats.mtime;

      if (this.config.analyzeContent && this.shouldAnalyzeContent(extension)) {
        const content = readFileSync(filePath, 'utf8');
        item.lineCount = content.split('\n').length;

        if (this.config.generateDescriptions) {
          item.description = this.generateFileDescription(
            name,
            extension,
            content
          );
        }
      }
    } catch {
      item.description = 'Error reading file';
    }

    return item;
  }

  /**
   * Check if a file or directory should be excluded
   */
  private shouldExclude(name: string): boolean {
    if (!this.config.includeHidden && name.startsWith('.')) {
      return true;
    }

    for (const pattern of this.config.excludePatterns) {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        if (regex.test(name)) {
          return true;
        }
      } else if (name === pattern) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if a file is considered important
   */
  private isImportantFile(name: string): boolean {
    return this.importantFilePatterns.some((pattern) => {
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(name);
      }
      return name === pattern;
    });
  }

  /**
   * Check if file content should be analyzed
   */
  private shouldAnalyzeContent(extension: string): boolean {
    const textExtensions = [
      '.ts',
      '.js',
      '.tsx',
      '.jsx',
      '.py',
      '.java',
      '.cpp',
      '.c',
      '.cs',
      '.go',
      '.rs',
      '.php',
      '.rb',
      '.swift',
      '.kt',
      '.scala',
      '.dart',
      '.vue',
      '.svelte',
      '.html',
      '.css',
      '.scss',
      '.sass',
      '.less',
      '.json',
      '.xml',
      '.yaml',
      '.yml',
      '.toml',
      '.ini',
      '.cfg',
      '.conf',
      '.env',
      '.md',
      '.txt',
      '.sql',
      '.sh',
      '.bat',
      '.ps1'
    ];

    return textExtensions.includes(extension);
  }

  /**
   * Generate description for a file based on its content
   */
  private generateFileDescription(
    name: string,
    extension: string,
    content: string
  ): string {
    // Basic heuristics for file descriptions
    if (name === 'package.json') {
      try {
        const pkg = JSON.parse(content);
        return `Package configuration for ${pkg.name || 'project'}`;
      } catch {
        return 'Package configuration file';
      }
    }

    if (name === 'action.yml' || name === 'action.yaml') {
      return 'GitHub Action definition file';
    }

    if (name === 'README.md') {
      return 'Project documentation and overview';
    }

    if (name === 'tsconfig.json') {
      return 'TypeScript compiler configuration';
    }

    if (name.includes('test') || name.includes('spec')) {
      return 'Test file';
    }

    if (extension === '.ts' || extension === '.js') {
      const lines = content.split('\n');
      for (let i = 0; i < Math.min(10, lines.length); i++) {
        const line = lines[i].trim();
        if (line.startsWith('/*') || line.startsWith('//')) {
          const comment = line
            .replace(/^\/\*+|^\*+|\*+\/$/g, '')
            .replace(/^\/\//, '')
            .trim();
          if (comment.length > 10) {
            return comment.slice(0, 100) + (comment.length > 100 ? '...' : '');
          }
        }
      }

      if (content.includes('export class')) {
        return 'TypeScript/JavaScript class module';
      }
      if (
        content.includes('export function') ||
        content.includes('export const')
      ) {
        return 'TypeScript/JavaScript utility module';
      }
      if (
        content.includes('describe(') ||
        content.includes('test(') ||
        content.includes('it(')
      ) {
        return 'Test file';
      }
    }

    const language = this.languageMap[extension];
    return language ? `${language} source file` : 'Source file';
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(root: FileSystemItem): ProjectStructure['summary'] {
    const summary = {
      totalFiles: 0,
      totalDirectories: 0,
      totalSize: 0,
      fileTypes: {} as Record<string, number>,
      languages: {} as Record<string, number>,
      importantFiles: [] as string[]
    };

    this.traverseForSummary(root, summary);

    return summary;
  }

  /**
   * Traverse structure to collect statistics
   */
  private traverseForSummary(
    item: FileSystemItem,
    summary: ProjectStructure['summary']
  ): void {
    // Skip items that don't exist
    if (item.description === 'Path does not exist') {
      return;
    }

    if (item.type === 'file') {
      summary.totalFiles++;
      summary.totalSize += item.size || 0;

      const ext = item.extension || '(no extension)';
      summary.fileTypes[ext] = (summary.fileTypes[ext] || 0) + 1;

      if (item.language) {
        summary.languages[item.language] =
          (summary.languages[item.language] || 0) + 1;
      }

      if (item.isImportant) {
        summary.importantFiles.push(item.relativePath);
      }
    } else {
      summary.totalDirectories++;
    }

    if (item.children) {
      for (const child of item.children) {
        this.traverseForSummary(child, summary);
      }
    }
  }

  /**
   * Detect file patterns
   */
  private detectPatterns(root: FileSystemItem): ProjectStructure['patterns'] {
    const patterns = {
      configFiles: [] as string[],
      sourceFiles: [] as string[],
      testFiles: [] as string[],
      buildFiles: [] as string[],
      documentationFiles: [] as string[]
    };

    this.traverseForPatterns(root, patterns);

    return patterns;
  }

  /**
   * Traverse structure to detect patterns
   */
  private traverseForPatterns(
    item: FileSystemItem,
    patterns: ProjectStructure['patterns']
  ): void {
    if (item.type === 'file') {
      const name = item.name.toLowerCase();
      const path = item.relativePath;

      // Config files
      if (
        name.includes('config') ||
        name.includes('.json') ||
        name.includes('.yml') ||
        name.includes('.yaml')
      ) {
        patterns.configFiles.push(path);
      }

      // Source files
      if (
        item.extension &&
        ['.ts', '.js', '.tsx', '.jsx', '.py', '.java', '.cpp'].includes(
          item.extension
        )
      ) {
        if (!name.includes('test') && !name.includes('spec')) {
          patterns.sourceFiles.push(path);
        }
      }

      // Test files
      if (
        name.includes('test') ||
        name.includes('spec') ||
        path.includes('__tests__')
      ) {
        patterns.testFiles.push(path);
      }

      // Build files
      if (
        name.includes('webpack') ||
        name.includes('rollup') ||
        name.includes('vite') ||
        name.includes('build') ||
        name.includes('makefile')
      ) {
        patterns.buildFiles.push(path);
      }

      // Documentation files
      if (
        item.extension === '.md' ||
        name.includes('readme') ||
        name.includes('changelog')
      ) {
        patterns.documentationFiles.push(path);
      }
    }

    if (item.children) {
      for (const child of item.children) {
        this.traverseForPatterns(child, patterns);
      }
    }
  }

  /**
   * Build tree string representation
   */
  private buildTreeString(
    item: FileSystemItem,
    prefix: string,
    isLast: boolean,
    depth: number,
    options: {
      showFiles?: boolean;
      showSizes?: boolean;
      maxDepth?: number;
      annotateImportant?: boolean;
    }
  ): string {
    if (depth > (options.maxDepth || 3)) {
      return '';
    }

    let result = '';
    const connector = isLast ? '└── ' : '├── ';
    const icon = item.type === 'directory' ? '📁' : '📄';

    let nameDisplay = item.name;
    if (options.annotateImportant && item.isImportant) {
      nameDisplay += ' ⭐';
    }

    if (options.showSizes && item.size !== undefined) {
      nameDisplay += ` (${this.formatFileSize(item.size)})`;
    }

    if (item.type === 'file' && !options.showFiles) {
      return '';
    }

    result += `${prefix}${connector}${icon} ${nameDisplay}\n`;

    if (item.children && item.children.length > 0) {
      const newPrefix = prefix + (isLast ? '    ' : '│   ');

      for (let i = 0; i < item.children.length; i++) {
        const child = item.children[i];
        const childIsLast = i === item.children.length - 1;
        result += this.buildTreeString(
          child,
          newPrefix,
          childIsLast,
          depth + 1,
          options
        );
      }
    }

    return result;
  }

  /**
   * Generate patterns documentation
   */
  private generatePatternsDocumentation(
    patterns: ProjectStructure['patterns']
  ): string {
    let result = '## File Patterns\n\n';

    if (patterns.sourceFiles.length > 0) {
      result += '### Source Files\n\n';
      patterns.sourceFiles.slice(0, 10).forEach((file) => {
        result += `- \`${file}\`\n`;
      });
      if (patterns.sourceFiles.length > 10) {
        result += `- ... and ${patterns.sourceFiles.length - 10} more\n`;
      }
      result += '\n';
    }

    if (patterns.testFiles.length > 0) {
      result += '### Test Files\n\n';
      patterns.testFiles.slice(0, 10).forEach((file) => {
        result += `- \`${file}\`\n`;
      });
      if (patterns.testFiles.length > 10) {
        result += `- ... and ${patterns.testFiles.length - 10} more\n`;
      }
      result += '\n';
    }

    if (patterns.configFiles.length > 0) {
      result += '### Configuration Files\n\n';
      patterns.configFiles.slice(0, 10).forEach((file) => {
        result += `- \`${file}\`\n`;
      });
      if (patterns.configFiles.length > 10) {
        result += `- ... and ${patterns.configFiles.length - 10} more\n`;
      }
      result += '\n';
    }

    if (patterns.documentationFiles.length > 0) {
      result += '### Documentation Files\n\n';
      patterns.documentationFiles.forEach((file) => {
        result += `- \`${file}\`\n`;
      });
      result += '\n';
    }

    return result;
  }

  /**
   * Format file size in human-readable format
   */
  private formatFileSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }
}
