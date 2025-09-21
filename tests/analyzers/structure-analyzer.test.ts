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
  StructureAnalyzer,
  StructureAnalysisConfig
} from '../../src/analyzers/structure-analyzer.js';
import { writeFileSync, mkdtempSync, mkdirSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('StructureAnalyzer', () => {
  let analyzer: StructureAnalyzer;
  let tempDir: string;

  beforeEach(() => {
    analyzer = new StructureAnalyzer();
    tempDir = mkdtempSync(join(tmpdir(), 'structure-test-'));

    // Create test directory structure
    mkdirSync(join(tempDir, 'src'), { recursive: true });
    mkdirSync(join(tempDir, 'test'), { recursive: true });
    mkdirSync(join(tempDir, 'docs'), { recursive: true });

    // Create test files
    writeFileSync(
      join(tempDir, 'package.json'),
      JSON.stringify({
        name: 'test-project',
        version: '1.0.0'
      })
    );
    writeFileSync(join(tempDir, 'README.md'), '# Test Project');
    writeFileSync(join(tempDir, 'src/index.ts'), 'export const test = true;');
    writeFileSync(join(tempDir, 'src/utils.js'), 'module.exports = {};');
    writeFileSync(
      join(tempDir, 'test/index.test.ts'),
      'describe("test", () => {});'
    );
  });

  describe('analyzeStructure', () => {
    it('should analyze a directory structure', () => {
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure).toBeDefined();
      expect(structure.root).toBeDefined();
      expect(structure.summary).toBeDefined();
      expect(structure.summary.totalFiles).toBeGreaterThan(0);
      expect(structure.summary.totalDirectories).toBeGreaterThan(0);
      expect(structure.patterns).toBeDefined();
    });

    it('should detect file types and languages', () => {
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure.summary.fileTypes).toBeDefined();
      expect(structure.summary.languages).toBeDefined();
      expect(Object.keys(structure.summary.fileTypes).length).toBeGreaterThan(
        0
      );
    });

    it('should identify important files', () => {
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure.summary.importantFiles).toBeDefined();
      expect(structure.summary.importantFiles).toContain('package.json');
      expect(structure.summary.importantFiles).toContain('README.md');
    });

    it('should categorize files by patterns', () => {
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure.patterns.configFiles).toBeDefined();
      expect(structure.patterns.sourceFiles).toBeDefined();
      expect(structure.patterns.testFiles).toBeDefined();
      expect(structure.patterns.documentationFiles).toBeDefined();
    });
  });

  describe('generateDirectoryTree', () => {
    it('should generate a directory tree visualization', () => {
      const structure = analyzer.analyzeStructure(tempDir);
      const tree = analyzer.generateDirectoryTree(structure);

      expect(tree).toBeDefined();
      expect(typeof tree).toBe('string');
      expect(tree.length).toBeGreaterThan(0);
      expect(tree).toContain('package.json');
      expect(tree).toContain('src');
    });

    it('should respect max depth parameter', () => {
      const structure = analyzer.analyzeStructure(tempDir);
      const shallowTree = analyzer.generateDirectoryTree(structure, {
        maxDepth: 1
      });

      expect(shallowTree).toBeDefined();
      expect(typeof shallowTree).toBe('string');
    });
  });

  describe('generateProjectStats', () => {
    it('should generate project statistics', () => {
      const structure = analyzer.analyzeStructure(tempDir);
      const stats = analyzer.generateProjectStats(structure.summary);

      expect(stats).toBeDefined();
      expect(typeof stats).toBe('string');
      expect(stats.length).toBeGreaterThan(0);
    });
  });

  describe('configuration', () => {
    it('should use custom configuration', () => {
      const customConfig: Partial<StructureAnalysisConfig> = {
        maxDepth: 2,
        excludePatterns: ['test'],
        includeHidden: false,
        analyzeContent: false
      };

      const customAnalyzer = new StructureAnalyzer(customConfig);
      const structure = customAnalyzer.analyzeStructure(tempDir);

      expect(structure).toBeDefined();
      expect(structure.summary.totalFiles).toBeGreaterThan(0);
    });

    it('should exclude specified patterns', () => {
      const configWithExclusions: Partial<StructureAnalysisConfig> = {
        excludePatterns: ['node_modules', '*.log', 'test']
      };

      const analyzer = new StructureAnalyzer(configWithExclusions);
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure).toBeDefined();
    });
  });

  describe('language detection', () => {
    it('should detect programming languages', () => {
      const structure = analyzer.analyzeStructure(tempDir);

      expect(structure.summary.languages).toBeDefined();
      expect(structure.summary.languages['TypeScript']).toBeGreaterThan(0);
      expect(structure.summary.languages['JavaScript']).toBeGreaterThan(0);
    });
  });

  describe('error handling', () => {
    it('should handle non-existent directories', () => {
      const nonExistentPath = join(tempDir, 'nonexistent');
      const structure = analyzer.analyzeStructure(nonExistentPath);

      expect(structure).toBeDefined();
      expect(structure.summary.totalFiles).toBe(0);
      expect(structure.summary.totalDirectories).toBe(0);
    });

    it('should handle empty directories', () => {
      const emptyDir = join(tempDir, 'empty');
      mkdirSync(emptyDir);

      const structure = analyzer.analyzeStructure(emptyDir);

      expect(structure).toBeDefined();
      expect(structure.summary.totalFiles).toBe(0);
    });
  });
});
