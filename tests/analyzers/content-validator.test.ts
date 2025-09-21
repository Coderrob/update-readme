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
  ContentValidator,
  ValidationConfig,
  ValidationSeverity
} from '../../src/analyzers/content-validator.js';
import { writeFileSync, mkdtempSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

describe('ContentValidator', () => {
  let validator: ContentValidator;
  let tempDir: string;

  beforeEach(() => {
    validator = new ContentValidator();
    tempDir = mkdtempSync(join(tmpdir(), 'validator-test-'));
  });

  describe('validateContent', () => {
    it('should validate valid markdown content', () => {
      const content = `# Test Document

This is a valid markdown document with:

- A proper header
- Some bullet points
- And a [valid link](https://example.com)

## Code Example

\`\`\`typescript
const example = 'test';
\`\`\`
`;

      const result = validator.validateContent(content, 'test.md');

      expect(result).toBeDefined();
      expect(result.summary.totalChecks).toBeGreaterThan(0);
      expect(result.metadata.validator).toBe('ContentValidator');
    });

    it('should detect markdown syntax issues', () => {
      const invalidContent = `# Header 1
## Header 2
# Header 1 Again - Invalid hierarchy

Invalid list:
- Item 1
  - Nested without parent
- Item 2

[Broken link](
`;

      const result = validator.validateContent(invalidContent, 'invalid.md');

      expect(result).toBeDefined();
      expect(result.summary.errorCount).toBeGreaterThan(0);
      expect(result.passed).toBe(false);
    });

    it('should validate code blocks', () => {
      const contentWithCode = `# Code Examples

\`\`\`javascript
const valid = 'syntax';
\`\`\`

\`\`\`invalid-language
Some content
\`\`\`

\`\`\`
// Missing language specification
\`\`\`
`;

      const result = validator.validateContent(contentWithCode, 'code.md');

      expect(result).toBeDefined();
      expect(result.summary.totalChecks).toBeGreaterThan(0);
    });
  });

  describe('validateFile', () => {
    it('should validate an existing file', () => {
      const testContent = `# Test File

This is a test markdown file for validation.

## Features

- Feature 1
- Feature 2

[GitHub](https://github.com)
`;

      const testFile = join(tempDir, 'test.md');
      writeFileSync(testFile, testContent);

      const result = validator.validateFile(testFile);

      expect(result).toBeDefined();
      expect(result.summary.totalChecks).toBeGreaterThan(0);
      expect(result.metadata.validator).toBe('ContentValidator');
    });

    it('should handle non-existent files', () => {
      const nonExistentFile = join(tempDir, 'nonexistent.md');

      const result = validator.validateFile(nonExistentFile);

      expect(result).toBeDefined();
      expect(result.passed).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('configuration', () => {
    it('should use custom configuration', () => {
      const customConfig: Partial<ValidationConfig> = {
        checkMarkdownSyntax: true,
        checkInternalLinks: false,
        checkExternalLinks: false,
        customRules: [
          {
            name: 'no-todo',
            description: 'Prohibit TODO items',
            severity: ValidationSeverity.WARNING,
            pattern: /TODO:/gi
          }
        ]
      };

      const customValidator = new ContentValidator(customConfig);
      const contentWithTodo = '# Test\n\nTODO: Fix this later';

      const result = customValidator.validateContent(
        contentWithTodo,
        'todo.md'
      );

      expect(result).toBeDefined();
      expect(result.warnings.some((w) => w.rule === 'no-todo')).toBe(true);
    });

    it('should use default configuration', () => {
      const defaultValidator = new ContentValidator();
      const simpleContent = '# Simple Test';

      const result = defaultValidator.validateContent(
        simpleContent,
        'simple.md'
      );

      expect(result).toBeDefined();
      expect(result.summary.totalChecks).toBeGreaterThan(0);
    });
  });

  describe('validation rules', () => {
    it('should check for proper header hierarchy', () => {
      const invalidHierarchy = `# Level 1
### Level 3 - Missing Level 2
`;

      const result = validator.validateContent(
        invalidHierarchy,
        'hierarchy.md'
      );

      expect(result).toBeDefined();
      expect(result.errors.some((e) => e.message.includes('header'))).toBe(
        true
      );
    });

    it('should validate link formats', () => {
      const invalidLinks = `# Links Test

[Valid link](https://example.com)
[Invalid link](broken
[Another invalid](
`;

      const result = validator.validateContent(invalidLinks, 'links.md');

      expect(result).toBeDefined();
    });
  });

  describe('scoring system', () => {
    it('should provide a quality score', () => {
      const goodContent = `# High Quality Document

This document has:

## Good Structure

- Proper headers
- Valid links: [Example](https://example.com)
- Code blocks with language:

\`\`\`typescript
const quality = 'high';
\`\`\`

## Conclusion

Everything looks good!
`;

      const result = validator.validateContent(goodContent, 'quality.md');

      expect(result).toBeDefined();
      expect(result.summary.score).toBeGreaterThanOrEqual(0);
      expect(result.summary.score).toBeLessThanOrEqual(100);
    });
  });
});
