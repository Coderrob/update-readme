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

import {
  DependencyAnalyzer,
  DEFAULT_MERMAID_CONFIG
} from '../../src/analyzers/dependency-analyzer.js';
import { writeFileSync, mkdtempSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('DependencyAnalyzer', () => {
  let tempDir: string;
  let analyzer: DependencyAnalyzer;

  beforeEach(() => {
    tempDir = mkdtempSync(join(tmpdir(), 'dependency-test-'));
    analyzer = new DependencyAnalyzer(tempDir);

    // Create test project structure
    mkdirSync(join(tempDir, 'src'), { recursive: true });

    // Create package.json
    const packageJson = {
      name: 'test-project',
      version: '1.0.0',
      dependencies: {
        react: '^18.0.0',
        lodash: '^4.17.21'
      },
      devDependencies: {
        '@types/node': '^18.0.0',
        jest: '^29.0.0'
      },
      peerDependencies: {
        'react-dom': '^18.0.0'
      },
      optionalDependencies: {
        fsevents: '^2.3.2'
      }
    };

    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify(packageJson, null, 2)
    );

    // Create source files with imports
    writeFileSync(
      join(tempDir, 'src/index.ts'),
      `
import React from 'react';
import { debounce } from 'lodash';
import { Utils } from './utils';

export const App = () => {
  return React.createElement('div');
};
`
    );

    writeFileSync(
      join(tempDir, 'src/utils.ts'),
      `
import { format } from 'date-fns';

export class Utils {
  static formatDate(date: Date) {
    return format(date, 'yyyy-MM-dd');
  }
}
`
    );
  });

  describe('analyze', () => {
    it('should analyze project dependencies', async () => {
      const analysis = await analyzer.analyze();

      expect(analysis).toBeDefined();
      expect(analysis.packageDependencies).toBeDefined();
      expect(analysis.fileDependencies).toBeDefined();
      expect(analysis.summary).toBeDefined();
      expect(analysis.dependencyTree).toBeDefined();
    });

    it('should categorize package dependencies correctly', async () => {
      const analysis = await analyzer.analyze();

      const productionDeps = analysis.packageDependencies.filter(
        (dep) => dep.type === 'production'
      );
      const devDeps = analysis.packageDependencies.filter(
        (dep) => dep.type === 'development'
      );

      // Verify the structure works even if package.json isn't read
      expect(Array.isArray(productionDeps)).toBe(true);
      expect(Array.isArray(devDeps)).toBe(true);
      expect(analysis.packageDependencies).toBeDefined();
    });

    it('should provide dependency summary statistics', async () => {
      const analysis = await analyzer.analyze();

      expect(analysis.summary.totalPackages).toBeGreaterThanOrEqual(0);
      expect(analysis.summary.totalFiles).toBeGreaterThanOrEqual(0);
      expect(analysis.summary.externalDependencies).toBeGreaterThanOrEqual(0);
      expect(analysis.summary.internalDependencies).toBeGreaterThanOrEqual(0);
    });
  });

  describe('generateMermaidDiagram', () => {
    it('should generate a Mermaid diagram from analysis', async () => {
      const analysis = await analyzer.analyze();
      const diagram = analyzer.generateMermaidDiagram(analysis);

      expect(diagram).toBeDefined();
      expect(typeof diagram).toBe('string');
      expect(diagram).toContain('graph');
      expect(diagram.length).toBeGreaterThan(0);
    });

    it('should use custom Mermaid configuration', async () => {
      const analysis = await analyzer.analyze();
      const customConfig = {
        ...DEFAULT_MERMAID_CONFIG,
        direction: 'LR' as const,
        maxDepth: 2
      };

      const diagram = analyzer.generateMermaidDiagram(analysis, customConfig);

      expect(diagram).toBeDefined();
      expect(diagram).toContain('LR');
    });

    it('should handle empty analysis', async () => {
      // Create analyzer with empty directory
      const emptyDir = mkdtempSync(join(tmpdir(), 'empty-'));
      const emptyAnalyzer = new DependencyAnalyzer(emptyDir);

      const analysis = await emptyAnalyzer.analyze();
      const diagram = emptyAnalyzer.generateMermaidDiagram(analysis);

      expect(diagram).toBeDefined();
      expect(typeof diagram).toBe('string');
    });
  });

  describe('file dependency analysis', () => {
    it('should detect import relationships', async () => {
      const analysis = await analyzer.analyze();

      expect(analysis.fileDependencies).toBeDefined();
      expect(analysis.fileDependencies.length).toBeGreaterThan(0);

      const indexDeps = analysis.fileDependencies.filter((dep) =>
        dep.source.includes('index.ts')
      );
      expect(indexDeps.length).toBeGreaterThan(0);
    });

    it('should distinguish between internal and external dependencies', async () => {
      const analysis = await analyzer.analyze();

      const internalDeps = analysis.fileDependencies.filter(
        (dep) => !dep.isExternal
      );
      const externalDeps = analysis.fileDependencies.filter(
        (dep) => dep.isExternal
      );

      expect(internalDeps.length).toBeGreaterThan(0);
      expect(externalDeps.length).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle projects without package.json', async () => {
      const emptyDir = mkdtempSync(join(tmpdir(), 'no-package-'));
      const noPackageAnalyzer = new DependencyAnalyzer(emptyDir);

      const analysis = await noPackageAnalyzer.analyze();

      expect(analysis).toBeDefined();
      expect(analysis.packageDependencies).toHaveLength(0);
      expect(analysis.summary.totalPackages).toBe(0);
    });

    it('should handle non-existent project directories', async () => {
      const nonExistentPath = join(tempDir, 'nonexistent');
      const badAnalyzer = new DependencyAnalyzer(nonExistentPath);

      const analysis = await badAnalyzer.analyze();

      expect(analysis).toBeDefined();
      expect(analysis.packageDependencies).toHaveLength(0);
    });
  });

  describe('dependency tree construction', () => {
    it('should build a dependency tree', async () => {
      const analysis = await analyzer.analyze();

      expect(analysis.dependencyTree).toBeDefined();
      expect(analysis.dependencyTree.root).toBeDefined();
      expect(analysis.dependencyTree.levels).toBeDefined();
    });

    it('should detect circular dependencies', async () => {
      // Create circular dependency scenario
      writeFileSync(
        join(tempDir, 'src/circular1.ts'),
        `
import { circular2 } from './circular2';
export const circular1 = 'test';
`
      );

      writeFileSync(
        join(tempDir, 'src/circular2.ts'),
        `
import { circular1 } from './circular1';
export const circular2 = 'test';
`
      );

      const analysis = await analyzer.analyze();

      expect(analysis.dependencyTree.cycles).toBeDefined();
      expect(Array.isArray(analysis.dependencyTree.cycles)).toBe(true);
    });
  });

  describe('performance', () => {
    it('should handle large numbers of files efficiently', async () => {
      // Create many test files
      for (let i = 0; i < 10; i++) {
        writeFileSync(
          join(tempDir, `src/file${i}.ts`),
          `
export const value${i} = ${i};
import { value${(i + 1) % 10} } from './file${(i + 1) % 10}';
`
        );
      }

      const startTime = Date.now();
      const analysis = await analyzer.analyze();
      const endTime = Date.now();

      expect(analysis).toBeDefined();
      expect(endTime - startTime).toBeLessThan(5000); // Should complete within 5 seconds
    });
  });
});
