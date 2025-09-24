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

import { readFileSync, existsSync, readdirSync } from 'fs';
import { resolve, join, relative, dirname, basename, extname } from 'path';
import {
  DependencyAnalysis,
  MermaidConfig,
  DEFAULT_MERMAID_CONFIG,
  DependencyInfo,
  FileDependency,
  DependencyTree,
  DependencyTreeNode
} from '../types/index.js';

/**
 * Dependency graph analyzer and generator
 */
export class DependencyAnalyzer {
  private projectPath: string;
  private packageJson: Record<string, unknown> | null = null;

  constructor(projectPath: string) {
    this.projectPath = resolve(projectPath);
    this.loadProjectMetadata();
  }

  /**
   * Analyze all project dependencies
   */
  async analyze(): Promise<DependencyAnalysis> {
    const packageDependencies = this.analyzePackageDependencies();
    const fileDependencies = await this.analyzeFileDependencies();
    const dependencyTree = this.buildDependencyTree(
      packageDependencies,
      fileDependencies
    );

    return {
      packageDependencies,
      fileDependencies,
      dependencyTree,
      summary: {
        totalPackages: packageDependencies.length,
        totalFiles: fileDependencies.filter((dep) => !dep.isExternal).length,
        externalDependencies: fileDependencies.filter((dep) => dep.isExternal)
          .length,
        internalDependencies: fileDependencies.filter((dep) => !dep.isExternal)
          .length,
        circularDependencies: dependencyTree.cycles
      }
    };
  }

  /**
   * Generate Mermaid dependency diagram
   */
  generateMermaidDiagram(
    analysis: DependencyAnalysis,
    config: Partial<MermaidConfig> = {}
  ): string {
    const mergedConfig = { ...DEFAULT_MERMAID_CONFIG, ...config };

    let diagram = `graph ${mergedConfig.direction}\n`;
    const addedNodes = new Set<string>();
    const addedEdges = new Set<string>();

    // Add package dependencies
    if (mergedConfig.showPackages) {
      diagram += this.generatePackageNodes(
        analysis.packageDependencies,
        addedNodes
      );
      diagram += this.generatePackageEdges();
    }

    // Add file dependencies
    if (mergedConfig.showFiles) {
      diagram += this.generateFileNodes(analysis.fileDependencies, addedNodes);
      diagram += this.generateFileEdges(
        analysis.fileDependencies,
        addedEdges,
        mergedConfig
      );
    }

    // Add styling
    diagram += this.generateMermaidStyling();

    return diagram;
  }

  /**
   * Generate package dependency summary
   */
  generatePackageSummary(dependencies: DependencyInfo[]): string {
    const productionDeps = dependencies.filter(
      (dep) => dep.type === 'production'
    );
    const devDeps = dependencies.filter((dep) => dep.type === 'development');
    const peerDeps = dependencies.filter((dep) => dep.type === 'peer');
    const optionalDeps = dependencies.filter((dep) => dep.type === 'optional');

    let summary = '## Dependencies\n\n';

    if (productionDeps.length > 0) {
      summary += '### Production Dependencies\n\n';
      summary += '| Package | Version | Description |\n';
      summary += '| ------- | ------- | ----------- |\n';
      productionDeps.forEach((dep) => {
        const description = dep.description
          ? dep.description.slice(0, 100) + '...'
          : '';
        summary += `| ${dep.name} | ${dep.version} | ${description} |\n`;
      });
      summary += '\n';
    }

    if (devDeps.length > 0) {
      summary += '### Development Dependencies\n\n';
      summary += '| Package | Version | Description |\n';
      summary += '| ------- | ------- | ----------- |\n';
      devDeps.forEach((dep) => {
        const description = dep.description
          ? dep.description.slice(0, 100) + '...'
          : '';
        summary += `| ${dep.name} | ${dep.version} | ${description} |\n`;
      });
      summary += '\n';
    }

    if (peerDeps.length > 0) {
      summary += '### Peer Dependencies\n\n';
      summary += '| Package | Version |\n';
      summary += '| ------- | ------- |\n';
      peerDeps.forEach((dep) => {
        summary += `| ${dep.name} | ${dep.version} |\n`;
      });
      summary += '\n';
    }

    if (optionalDeps.length > 0) {
      summary += '### Optional Dependencies\n\n';
      summary += '| Package | Version |\n';
      summary += '| ------- | ------- |\n';
      optionalDeps.forEach((dep) => {
        summary += `| ${dep.name} | ${dep.version} |\n`;
      });
      summary += '\n';
    }

    return summary;
  }

  /**
   * Load project metadata files
   */
  private loadProjectMetadata(): void {
    // Load package.json
    const packageJsonPath = join(this.projectPath, 'package.json');
    if (existsSync(packageJsonPath)) {
      this.packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    }

    // Load action.yml (for future use)
    const actionYmlPath = join(this.projectPath, 'action.yml');
    if (existsSync(actionYmlPath)) {
      // const actionYml = yamlLoad(readFileSync(actionYmlPath, 'utf8')) as Record<
      //   string,
      //   unknown
      // >;
      // For now, we don't use action.yml data but it's available for future enhancements
    }
  }

  /**
   * Analyze package dependencies from package.json
   */
  private analyzePackageDependencies(): DependencyInfo[] {
    if (!this.packageJson) {
      return [];
    }

    const dependencies: DependencyInfo[] = [];

    // Production dependencies
    if (this.packageJson.dependencies) {
      Object.entries(this.packageJson.dependencies).forEach(
        ([name, version]) => {
          dependencies.push({
            name,
            version: version as string,
            type: 'production'
          });
        }
      );
    }

    // Development dependencies
    if (this.packageJson.devDependencies) {
      Object.entries(this.packageJson.devDependencies).forEach(
        ([name, version]) => {
          dependencies.push({
            name,
            version: version as string,
            type: 'development'
          });
        }
      );
    }

    // Peer dependencies
    if (this.packageJson.peerDependencies) {
      Object.entries(this.packageJson.peerDependencies).forEach(
        ([name, version]) => {
          dependencies.push({
            name,
            version: version as string,
            type: 'peer'
          });
        }
      );
    }

    // Optional dependencies
    if (this.packageJson.optionalDependencies) {
      Object.entries(this.packageJson.optionalDependencies).forEach(
        ([name, version]) => {
          dependencies.push({
            name,
            version: version as string,
            type: 'optional'
          });
        }
      );
    }

    return dependencies;
  }

  /**
   * Analyze file dependencies
   */
  private async analyzeFileDependencies(): Promise<FileDependency[]> {
    const dependencies: FileDependency[] = [];
    const sourceFiles = await this.findSourceFiles();

    for (const file of sourceFiles) {
      const fileDeps = await this.analyzeFileImports(file);
      dependencies.push(...fileDeps);
    }

    return dependencies;
  }

  /**
   * Find all source files in the project
   */
  private async findSourceFiles(): Promise<string[]> {
    // For this implementation, we'll focus on TypeScript/JavaScript files
    // This could be expanded to support other file types
    const extensions = ['.ts', '.js', '.tsx', '.jsx'];
    const srcDir = join(this.projectPath, 'src');

    if (!existsSync(srcDir)) {
      return [];
    }

    return this.findFilesRecursively(srcDir, extensions);
  }

  /**
   * Recursively find files with specific extensions
   */
  private findFilesRecursively(dir: string, extensions: string[]): string[] {
    const files: string[] = [];

    try {
      const entries = readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = join(dir, entry.name);

        if (entry.isDirectory()) {
          files.push(...this.findFilesRecursively(fullPath, extensions));
        } else if (entry.isFile() && extensions.includes(extname(entry.name))) {
          files.push(fullPath);
        }
      }
    } catch {
      // Ignore directories that can't be read
    }

    return files;
  }

  /**
   * Analyze imports/requires in a single file
   */
  private async analyzeFileImports(
    filePath: string
  ): Promise<FileDependency[]> {
    try {
      const content = readFileSync(filePath, 'utf8');
      const dependencies: FileDependency[] = [];
      const lines = content.split('\n');

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        const lineNumber = i + 1;

        // ES6 imports
        const importMatch = line.match(
          /import\s+.*?\s+from\s+['"`]([^'"`]+)['"`]/
        );
        if (importMatch) {
          dependencies.push(
            this.createFileDependency(
              filePath,
              importMatch[1],
              'import',
              lineNumber
            )
          );
        }

        // CommonJS requires
        const requireMatch = line.match(/require\(['"`]([^'"`]+)['"`]\)/);
        if (requireMatch) {
          dependencies.push(
            this.createFileDependency(
              filePath,
              requireMatch[1],
              'require',
              lineNumber
            )
          );
        }

        // Dynamic imports
        const dynamicImportMatch = line.match(/import\(['"`]([^'"`]+)['"`]\)/);
        if (dynamicImportMatch) {
          dependencies.push(
            this.createFileDependency(
              filePath,
              dynamicImportMatch[1],
              'import',
              lineNumber
            )
          );
        }
      }

      return dependencies;
    } catch {
      return [];
    }
  }

  /**
   * Create file dependency object
   */
  private createFileDependency(
    source: string,
    target: string,
    type: 'import' | 'require',
    line: number
  ): FileDependency {
    const isExternal = this.isExternalDependency(target);
    const resolvedTarget = isExternal
      ? target
      : this.resolveRelativePath(source, target);

    return {
      source: relative(this.projectPath, source),
      target: resolvedTarget,
      type,
      line,
      isExternal
    };
  }

  /**
   * Check if a dependency is external (npm package)
   */
  private isExternalDependency(target: string): boolean {
    return !target.startsWith('.') && !target.startsWith('/');
  }

  /**
   * Resolve relative file paths
   */
  private resolveRelativePath(source: string, target: string): string {
    if (this.isExternalDependency(target)) {
      return target;
    }

    const sourceDirname = dirname(source);
    const resolved = resolve(sourceDirname, target);
    return relative(this.projectPath, resolved);
  }

  /**
   * Build dependency tree from analysis
   */
  private buildDependencyTree(
    packageDeps: DependencyInfo[],
    fileDeps: FileDependency[]
  ): DependencyTree {
    const nodes = new Map<string, DependencyTreeNode>();
    const levels: DependencyTreeNode[][] = [];

    // Create nodes for packages
    packageDeps.forEach((dep) => {
      nodes.set(dep.name, {
        name: dep.name,
        type: 'package',
        dependencies: [],
        dependents: [],
        level: 0
      });
    });

    // Create nodes for files
    const fileSet = new Set<string>();
    fileDeps.forEach((dep) => {
      fileSet.add(dep.source);
      if (!dep.isExternal) {
        fileSet.add(dep.target);
      }
    });

    fileSet.forEach((file) => {
      nodes.set(file, {
        name: file,
        type: 'file',
        dependencies: [],
        dependents: [],
        level: 0
      });
    });

    // Build relationships
    fileDeps.forEach((dep) => {
      const sourceNode = nodes.get(dep.source);
      if (sourceNode) {
        if (dep.isExternal) {
          const targetNode = nodes.get(dep.target);
          if (targetNode) {
            sourceNode.dependencies.push(targetNode);
            targetNode.dependents.push(dep.source);
          }
        } else {
          const targetNode = nodes.get(dep.target);
          if (targetNode) {
            sourceNode.dependencies.push(targetNode);
            targetNode.dependents.push(dep.source);
          }
        }
      }
    });

    // Calculate levels and find root nodes
    const rootNodes = Array.from(nodes.values()).filter(
      (node) => node.dependents.length === 0
    );

    // Find circular dependencies
    const cycles = this.findCircularDependencies(Array.from(nodes.values()));

    return {
      root: rootNodes,
      levels,
      cycles
    };
  }

  /**
   * Find circular dependencies using DFS
   */
  private findCircularDependencies(nodes: DependencyTreeNode[]): string[][] {
    const cycles: string[][] = [];
    const visited = new Set<string>();
    const recursionStack = new Set<string>();

    for (const node of nodes) {
      if (!visited.has(node.name)) {
        this.dfsForCycles(node, visited, recursionStack, [], cycles);
      }
    }

    return cycles;
  }

  /**
   * DFS helper for finding cycles
   */
  private dfsForCycles(
    node: DependencyTreeNode,
    visited: Set<string>,
    recursionStack: Set<string>,
    path: string[],
    cycles: string[][]
  ): void {
    visited.add(node.name);
    recursionStack.add(node.name);
    path.push(node.name);

    for (const dependency of node.dependencies) {
      if (!visited.has(dependency.name)) {
        this.dfsForCycles(dependency, visited, recursionStack, path, cycles);
      } else if (recursionStack.has(dependency.name)) {
        // Found a cycle
        const cycleStart = path.indexOf(dependency.name);
        cycles.push([...path.slice(cycleStart), dependency.name]);
      }
    }

    recursionStack.delete(node.name);
    path.pop();
  }

  /**
   * Generate package nodes for Mermaid diagram
   */
  private generatePackageNodes(
    dependencies: DependencyInfo[],
    addedNodes: Set<string>
    // config: MermaidConfig - for future use
  ): string {
    let result = '';

    dependencies.forEach((dep) => {
      if (!addedNodes.has(dep.name)) {
        const nodeId = this.sanitizeNodeId(dep.name);
        const label = `${dep.name}<br/>${dep.version}`;
        result += `  ${nodeId}["${label}"]\n`;
        addedNodes.add(dep.name);
      }
    });

    return result;
  }

  /**
   * Generate package edges for Mermaid diagram
   */
  private generatePackageEdges(): string {
    // For package dependencies, we'd need to analyze package.json files
    // of the dependencies themselves, which is complex
    // For now, we'll return empty string
    return '';
  }

  /**
   * Generate file nodes for Mermaid diagram
   */
  private generateFileNodes(
    dependencies: FileDependency[],
    addedNodes: Set<string>
    // config: MermaidConfig - for future use
  ): string {
    let result = '';
    const files = new Set<string>();

    dependencies.forEach((dep) => {
      files.add(dep.source);
      if (!dep.isExternal) {
        files.add(dep.target);
      }
    });

    files.forEach((file) => {
      if (!addedNodes.has(file)) {
        const nodeId = this.sanitizeNodeId(file);
        const label = basename(file);
        result += `  ${nodeId}["${label}"]\n`;
        addedNodes.add(file);
      }
    });

    return result;
  }

  /**
   * Generate file edges for Mermaid diagram
   */
  private generateFileEdges(
    dependencies: FileDependency[],
    addedEdges: Set<string>,
    config: MermaidConfig
  ): string {
    let result = '';

    dependencies.forEach((dep) => {
      if (!config.showExternalOnly || !dep.isExternal) {
        const sourceId = this.sanitizeNodeId(dep.source);
        const targetId = this.sanitizeNodeId(dep.target);
        const edgeKey = `${sourceId}->${targetId}`;

        if (!addedEdges.has(edgeKey)) {
          result += `  ${sourceId} --> ${targetId}\n`;
          addedEdges.add(edgeKey);
        }
      }
    });

    return result;
  }

  /**
   * Generate Mermaid styling
   */
  private generateMermaidStyling(): string {
    return `
  classDef package fill:#e1f5fe,stroke:#01579b,stroke-width:2px
  classDef file fill:#f3e5f5,stroke:#4a148c,stroke-width:2px
  classDef external fill:#fff3e0,stroke:#e65100,stroke-width:2px
`;
  }

  /**
   * Sanitize node ID for Mermaid
   */
  private sanitizeNodeId(name: string): string {
    return name.replace(/[^a-zA-Z0-9]/g, '_');
  }
}
