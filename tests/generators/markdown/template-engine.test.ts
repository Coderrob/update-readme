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
  TemplateEngine,
  TemplateContext,
  TemplateConfig,
  DEFAULT_TEMPLATE_CONFIG,
  ConfigurableTemplateRenderer
} from '../../../src/generators/markdown/template-engine.js';
import { Action } from '../../../src/schema/action.js';
import { NodeVersion } from '../../../src/types.js';

describe('TemplateEngine', () => {
  let engine: TemplateEngine;
  let mockAction: Action;
  let context: TemplateContext;

  beforeEach(() => {
    mockAction = {
      name: 'Test Action',
      description: 'A test action for unit testing',
      runs: {
        using: NodeVersion.NODE20,
        main: 'dist/index.js'
      },
      inputs: {
        'test-input': {
          description: 'A test input',
          required: true,
          default: 'test-value'
        }
      },
      outputs: {
        'test-output': {
          description: 'A test output'
        }
      },
      branding: {
        color: 'blue',
        icon: 'package'
      }
    };

    context = {
      action: mockAction,
      repository: 'owner/repo',
      metadata: {
        generatedAt: '2025-01-01T00:00:00Z',
        generatorVersion: '1.0.0',
        documentVersion: '1.0.0'
      }
    };

    engine = new TemplateEngine(context);
  });

  describe('processTemplate', () => {
    it('should process simple variable substitution', () => {
      const template = 'Hello {{action.name}}!';
      const result = engine.processTemplate(template);

      expect(result).toBe('Hello Test Action!');
    });

    it('should process nested object properties', () => {
      const template =
        'Repository: {{repository}}, Color: {{action.branding.color}}';
      const result = engine.processTemplate(template);

      expect(result).toBe('Repository: owner/repo, Color: blue');
    });

    it('should handle missing properties gracefully', () => {
      const template = 'Missing: {{action.nonexistent}}';
      const result = engine.processTemplate(template);

      expect(result).toBe('Missing:');
    });

    it('should process conditional blocks', () => {
      const template = `{{#if action.branding}}
Has branding: {{action.branding.color}}
{{/if}}`;

      const result = engine.processTemplate(template);

      expect(result).toContain('Has branding: blue');
    });

    it('should skip false conditionals', () => {
      const template = `{{#if action.nonexistent}}
This should not appear
{{/if}}`;

      const result = engine.processTemplate(template);

      expect(result.trim()).toBe('');
    });

    it('should process loops over arrays', () => {
      const arrayContext = {
        ...context,
        items: ['item1', 'item2', 'item3']
      };
      const arrayEngine = new TemplateEngine(arrayContext);

      const template = `{{#each items}}
- {{this}}
{{/each}}`;

      const result = arrayEngine.processTemplate(template);

      expect(result).toContain('- item1');
      expect(result).toContain('- item2');
      expect(result).toContain('- item3');
    });

    it('should process loops over objects', () => {
      const template = `{{#each action.inputs}}
Input: {{@key}} - {{this.description}}
{{/each}}`;

      const result = engine.processTemplate(template);

      expect(result).toContain('Input: test-input - A test input');
    });
  });

  describe('ConfigurableTemplateRenderer', () => {
    it('should render with default configuration', async () => {
      const renderer = new ConfigurableTemplateRenderer(
        context,
        DEFAULT_TEMPLATE_CONFIG
      );

      const result = await renderer.render();

      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
      expect(result).toContain('Test Action');
    });

    it('should render with custom configuration', async () => {
      const customConfig: TemplateConfig = {
        sections: [
          {
            name: 'header',
            enabled: true,
            order: 1,
            template: '# {{action.name}}\n\n{{action.description}}'
          }
        ],
        variables: {
          projectName: 'Custom Project'
        },
        formatting: {
          lineEndings: 'lf',
          indentation: 'spaces',
          indentSize: 2,
          maxLineLength: 80,
          trimTrailingWhitespace: true
        }
      };

      const renderer = new ConfigurableTemplateRenderer(context, customConfig);
      const result = await renderer.render();

      expect(result).toContain('# Test Action');
      expect(result).toContain('A test action for unit testing');
    });

    it('should handle disabled sections', async () => {
      const configWithDisabled: TemplateConfig = {
        sections: [
          {
            name: 'header',
            enabled: true,
            order: 1,
            template: '# {{action.name}}'
          },
          {
            name: 'disabled',
            enabled: false,
            order: 2,
            template: 'This should not appear'
          }
        ],
        variables: {},
        formatting: {
          lineEndings: 'lf',
          indentation: 'spaces',
          indentSize: 2,
          maxLineLength: 80,
          trimTrailingWhitespace: true
        }
      };

      const renderer = new ConfigurableTemplateRenderer(
        context,
        configWithDisabled
      );
      const result = await renderer.render();

      expect(result).toContain('# Test Action');
      expect(result).not.toContain('This should not appear');
    });
  });

  describe('complex templates', () => {
    it('should handle complex nested structures', () => {
      const complexTemplate = `# {{action.name}}

{{action.description}}

{{#if action.inputs}}
## Inputs

{{#each action.inputs}}
### {{@key}}

- **Description**: {{this.description}}
- **Required**: {{#if this.required}}Yes{{else}}No{{/if}}
{{#if this.default}}
- **Default**: {{this.default}}
{{/if}}

{{/each}}
{{/if}}`;

      const result = engine.processTemplate(complexTemplate);

      expect(result).toContain('# Test Action');
      expect(result).toContain('## Inputs');
      expect(result).toContain('### test-input');
      expect(result).toContain('**Required**: Yes');
      expect(result).toContain('**Default**: test-value');
    });

    it('should handle special template functions', () => {
      const template = `Generated at: {{metadata.generatedAt}}
Repository: {{repository}}
Version: {{metadata.generatorVersion}}`;

      const result = engine.processTemplate(template);

      expect(result).toContain('Generated at: 2025-01-01T00:00:00Z');
      expect(result).toContain('Repository: owner/repo');
      expect(result).toContain('Version: 1.0.0');
    });
  });

  describe('error handling', () => {
    it('should handle malformed templates gracefully', () => {
      const malformedTemplate = '{{action.name} - missing closing brace';

      expect(() => {
        engine.processTemplate(malformedTemplate);
      }).not.toThrow();
    });

    it('should handle empty templates', () => {
      const result = engine.processTemplate('');

      expect(result).toBe('');
    });

    it('should handle null context values', () => {
      const nullContextEngine = new TemplateEngine({
        action: mockAction,
        repository: '',
        metadata: {
          generatedAt: '',
          generatorVersion: '',
          documentVersion: ''
        }
      });

      const template = 'Repository: {{repository}}';
      const result = nullContextEngine.processTemplate(template);

      expect(result).toBe('Repository:');
    });
  });

  describe('performance', () => {
    it('should handle large templates efficiently', () => {
      const largeTemplate = Array(100).fill('{{action.name}} - ').join('');

      const startTime = Date.now();
      const result = engine.processTemplate(largeTemplate);
      const endTime = Date.now();

      expect(result).toBeDefined();
      expect(endTime - startTime).toBeLessThan(100); // Should be fast
    });
  });
});
