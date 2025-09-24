import { StructureAnalyzer } from '../analysis/structure.analyzer.js';
import {
  TemplateContext,
  TemplateConfig,
  DEFAULT_TEMPLATE_CONFIG
} from '../types/index.js';

/**
 * Template engine for processing Handlebars-like templates
 */

export class TemplateEngine {
  private context: TemplateContext;
  private config: TemplateConfig;

  constructor(
    context: TemplateContext,
    config: TemplateConfig = DEFAULT_TEMPLATE_CONFIG
  ) {
    this.context = context;
    this.config = config;
  }

  /**
   * Process a template string with the current context
   */
  processTemplate(template: string): string {
    let result = template;

    // Replace simple variables {{variable}}
    result = this.replaceSimpleVariables(result);

    // Process conditional blocks {{#if}}
    result = this.processConditionals(result);

    // Process loops {{#each}}
    result = this.processLoops(result);

    // Apply formatting
    result = this.applyFormatting(result);

    return result;
  }

  /**
   * Replace simple variable placeholders
   */
  private replaceSimpleVariables(template: string): string {
    return template.replace(/\{\{([^#/}]+)\}\}/g, (match, path) => {
      const trimmedPath = path.trim();
      // Skip special loop variables
      if (
        trimmedPath === 'this' ||
        trimmedPath === '@key' ||
        trimmedPath === '@index'
      ) {
        return match;
      }
      const value = this.getValueByPath(trimmedPath);
      return value !== undefined ? String(value) : '';
    });
  }

  /**
   * Process conditional blocks
   */
  private processConditionals(template: string): string {
    return template.replace(
      /\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g,
      (_, condition, ifBlock, elseBlock = '') => {
        const value = this.getValueByPath(condition.trim());
        const shouldShow = this.isTruthy(value);
        return shouldShow ? ifBlock : elseBlock;
      }
    );
  }

  /**
   * Process loop blocks
   */
  private processLoops(template: string): string {
    return template.replace(
      /\{\{#each\s+([^}]+)\}\}([\s\S]*?)\{\{\/each\}\}/g,
      (_, path, block) => {
        const collection = this.getValueByPath(path.trim());
        if (!collection || typeof collection !== 'object') {
          return '';
        }

        let result = '';
        if (Array.isArray(collection)) {
          collection.forEach((item, index) => {
            result += this.processLoopBlock(block, item, index, path);
          });
        } else {
          Object.entries(collection).forEach(([key, value], index) => {
            result += this.processLoopBlock(block, value, index, path, key);
          });
        }

        return result;
      }
    );
  }

  /**
   * Process a single loop iteration
   */
  private processLoopBlock(
    block: string,
    item: unknown,
    index: number,
    _parentPath: string,
    key?: string
  ): string {
    let result = block;

    // Process conditionals within the block
    result = this.processConditionalsInBlock(result, item, index, key);

    // Replace this references
    result = result.replace(/\{\{this\.([^}]+)\}\}/g, (match, prop) => {
      return item && typeof item === 'object' && item !== null && prop in item
        ? String((item as Record<string, unknown>)[prop])
        : match;
    });

    // Replace {{this}} with the item value
    result = result.replace(/\{\{this\}\}/g, String(item));

    // Replace @key references
    if (key !== undefined) {
      result = result.replace(/\{\{@key\}\}/g, key);
    }

    // Replace @index references
    result = result.replace(/\{\{@index\}\}/g, String(index));

    return result;
  }

  /**
   * Process conditionals within a loop block with loop context
   */
  private processConditionalsInBlock(
    template: string,
    item: unknown,
    index: number,
    key?: string
  ): string {
    return template.replace(
      /\{\{#if\s+([^}]+)\}\}([\s\S]*?)(?:\{\{else\}\}([\s\S]*?))?\{\{\/if\}\}/g,
      (_, condition, ifBlock, elseBlock = '') => {
        const value = this.getValueByPathInBlock(
          condition.trim(),
          item,
          index,
          key
        );
        const shouldShow = this.isTruthy(value);
        return shouldShow ? ifBlock : elseBlock;
      }
    );
  }

  /**
   * Get value by path within a loop block context
   */
  private getValueByPathInBlock(
    path: string,
    item: unknown,
    index: number,
    key?: string
  ): unknown {
    // Handle special loop variables
    if (path === 'this') {
      return item;
    }
    if (path === '@key' && key !== undefined) {
      return key;
    }
    if (path === '@index') {
      return index;
    }
    if (path.startsWith('this.')) {
      const prop = path.slice(5);
      return item && typeof item === 'object' && item !== null && prop in item
        ? (item as Record<string, unknown>)[prop]
        : undefined;
    }

    // Fall back to normal path resolution
    return this.getValueByPath(path);
  }
  private getValueByPath(path: string): unknown {
    // Handle special cases
    if (path === 'mermaid_flowchart') {
      return this.generateMermaidFlowchart();
    }

    if (path === 'dependency_graph') {
      return this.generateDependencyGraph();
    }

    if (path === 'dependency_summary') {
      return this.generateDependencySummary();
    }

    if (path === 'project_structure') {
      return this.generateProjectStructure();
    }

    if (path === 'directory_tree') {
      return this.generateDirectoryTree();
    }

    const parts = path.split('.');
    let current: unknown = this.context;

    for (const part of parts) {
      if (
        current &&
        typeof current === 'object' &&
        current !== null &&
        part in current
      ) {
        current = (current as Record<string, unknown>)[part];
      } else {
        return undefined;
      }
    }

    return current;
  }

  /**
   * Check if a value is truthy for template conditions
   */
  private isTruthy(value: unknown): boolean {
    if (value === undefined || value === null) return false;
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') return value.length > 0;
    if (typeof value === 'number') return value !== 0;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return Boolean(value);
  }

  /**
   * Generate mermaid flowchart for composite actions
   */
  private generateMermaidFlowchart(): string {
    const runs = this.context.action.runs;
    if (!runs || !('steps' in runs) || !runs.steps) {
      return '';
    }

    const lines: string[] = ['flowchart TD'];
    let nodeIndex = 0;
    let lastNodeId: string | null = null;

    const getNodeId = (): string => `N${nodeIndex++}`;

    for (const step of runs.steps) {
      const nodeId = getNodeId();
      const name = this.escapeForMermaid(
        step.name || step.id || 'Unnamed Step'
      );
      const uses = step.uses
        ? `\\nuses: ${this.escapeForMermaid(step.uses)}`
        : '';
      const label = `${name}${uses}`;

      lines.push(`${nodeId}["${label}"]`);

      if (step.if) {
        const conditionNodeId = getNodeId();
        const conditionLabel = this.escapeForMermaid(step.if);
        lines.push(
          `${lastNodeId ?? nodeId} --> ${conditionNodeId}{"if: ${conditionLabel}"}`
        );
        lines.push(`${conditionNodeId} -->|Yes| ${nodeId}`);
        lastNodeId = conditionNodeId;
      } else if (lastNodeId) {
        lines.push(`${lastNodeId} --> ${nodeId}`);
      }

      lastNodeId = nodeId;
    }

    return lines.join('\n');
  }

  /**
   * Escape text for mermaid diagrams
   */
  private escapeForMermaid(text: string): string {
    return text.replace(/"/g, '\\"').replace(/\n/g, ' ');
  }

  /**
   * Generate dependency graph using DependencyAnalyzer
   */
  private generateDependencyGraph(): string {
    try {
      // Try to determine workspace path from context
      const workspacePath = this.getWorkspacePath();
      if (!workspacePath) {
        return '<!-- Dependency graph generation requires workspace path -->';
      }

      // Create analyzer instance (for future async implementation)
      // const analyzer = new DependencyAnalyzer(workspacePath);
      // For now, return a placeholder
      return `\`\`\`mermaid
graph TD
  A[Project Dependencies] --> B[Production]
  A --> C[Development]
  B --> D[Runtime Dependencies]
  C --> E[Build Tools]
\`\`\``;
    } catch {
      return '<!-- Error generating dependency graph -->';
    }
  }

  /**
   * Generate dependency summary table
   */
  private generateDependencySummary(): string {
    try {
      const workspacePath = this.getWorkspacePath();
      if (!workspacePath) {
        return '<!-- Dependency summary requires workspace path -->';
      }

      // For now, return a basic table structure
      return `| Dependency Type | Count | Description |
| --------------- | ----- | ----------- |
| Production      | -     | Runtime dependencies |
| Development     | -     | Build and test tools |
| Peer            | -     | Expected in host environment |
| Optional        | -     | Optional enhancements |`;
    } catch {
      return '<!-- Error generating dependency summary -->';
    }
  }

  /**
   * Generate project structure documentation
   */
  private generateProjectStructure(): string {
    try {
      const workspacePath = this.getWorkspacePath();
      if (!workspacePath) {
        return '<!-- Project structure analysis requires workspace path -->';
      }

      const analyzer = new StructureAnalyzer();
      const structure = analyzer.analyzeStructure(workspacePath);
      return analyzer.generateStructureDocumentation(structure);
    } catch {
      return '<!-- Error analyzing project structure -->';
    }
  }

  /**
   * Generate directory tree
   */
  private generateDirectoryTree(): string {
    try {
      const workspacePath = this.getWorkspacePath();
      if (!workspacePath) {
        return '<!-- Directory tree generation requires workspace path -->';
      }

      const analyzer = new StructureAnalyzer();
      const structure = analyzer.analyzeStructure(workspacePath);
      return `\`\`\`
${analyzer.generateDirectoryTree(structure, {
  showFiles: true,
  maxDepth: 3,
  annotateImportant: true
})}
\`\`\``;
    } catch {
      return '<!-- Error generating directory tree -->';
    }
  }

  /**
   * Get workspace path from context
   */
  private getWorkspacePath(): string | null {
    if (typeof this.context === 'object' && this.context !== null) {
      const ctx = this.context as unknown as Record<string, unknown>;
      if (ctx.workspace && typeof ctx.workspace === 'string') {
        return ctx.workspace;
      }
      if (
        ctx.metadata &&
        typeof ctx.metadata === 'object' &&
        ctx.metadata !== null
      ) {
        const metadata = ctx.metadata as Record<string, unknown>;
        if (
          metadata.workspacePath &&
          typeof metadata.workspacePath === 'string'
        ) {
          return metadata.workspacePath;
        }
      }
    }
    return null;
  }

  /**
   * Apply formatting rules to the final output
   */
  private applyFormatting(content: string): string {
    let result = content;

    // Normalize line endings
    if (this.config.formatting.lineEndings === 'crlf') {
      result = result.replace(/\r?\n/g, '\r\n');
    } else {
      result = result.replace(/\r\n/g, '\n');
    }

    // Trim trailing whitespace
    if (this.config.formatting.trimTrailingWhitespace) {
      result = result.replace(/[ \t]+$/gm, '');
    }

    // Remove excessive blank lines (more than 2 consecutive)
    result = result.replace(/\n{3,}/g, '\n\n');

    // Ensure single trailing newline (only if content doesn't already end with newline)
    // if (!result.endsWith('\n')) {
    //   result += '\n';
    // }
    return result;
  }
}
