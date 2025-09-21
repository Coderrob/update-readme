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

import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { z } from 'zod';
import { load as yamlLoad } from 'js-yaml';

import {
  TemplateConfig,
  TemplateSection,
  DEFAULT_TEMPLATE_CONFIG
} from './template-engine.js';

/**
 * Template section schema for validation
 */
const TemplateSectionSchema = z.object({
  name: z.string().min(1),
  enabled: z.boolean().default(true),
  order: z.number().int().min(1),
  template: z.string().min(1),
  variables: z.record(z.string()).optional()
});

/**
 * Template formatting schema for validation
 */
const TemplateFormattingSchema = z.object({
  lineEndings: z.enum(['lf', 'crlf']).default('lf'),
  indentation: z.enum(['spaces', 'tabs']).default('spaces'),
  indentSize: z.number().int().min(1).max(8).default(2),
  maxLineLength: z.number().int().min(80).max(200).default(120),
  trimTrailingWhitespace: z.boolean().default(true)
});

/**
 * Template config schema for validation
 */
const TemplateConfigSchema = z.object({
  sections: z.array(TemplateSectionSchema).min(1),
  formatting: TemplateFormattingSchema.default({
    lineEndings: 'lf',
    indentation: 'spaces',
    indentSize: 2,
    maxLineLength: 120,
    trimTrailingWhitespace: true
  }),
  variables: z.record(z.string()).optional()
});

/**
 * Template validation error
 */
export class TemplateValidationError extends Error {
  constructor(
    message: string,
    public readonly path?: string,
    public readonly errors?: z.ZodError
  ) {
    super(message);
    this.name = 'TemplateValidationError';
  }
}

/**
 * Template configuration loader and validator
 */
export class TemplateConfigLoader {
  private static readonly SUPPORTED_EXTENSIONS = ['.yml', '.yaml', '.json'];

  /**
   * Load template configuration from file
   */
  static loadFromFile(filePath: string): TemplateConfig {
    const resolvedPath = resolve(filePath);

    if (!existsSync(resolvedPath)) {
      throw new TemplateValidationError(
        `Template configuration file not found: ${resolvedPath}`,
        resolvedPath
      );
    }

    try {
      const content = readFileSync(resolvedPath, 'utf8');
      const parsedConfig = this.parseConfigContent(content, resolvedPath);

      return this.validateAndTransform(parsedConfig, resolvedPath);
    } catch (error) {
      if (error instanceof TemplateValidationError) {
        throw error;
      }

      throw new TemplateValidationError(
        `Failed to load template configuration: ${error instanceof Error ? error.message : 'Unknown error'}`,
        resolvedPath
      );
    }
  }

  /**
   * Load template configuration from multiple possible locations
   */
  static loadFromWorkspace(workspacePath: string): TemplateConfig {
    const configFileNames = [
      '.readme-template.yml',
      '.readme-template.yaml',
      'readme-template.yml',
      'readme-template.yaml',
      '.readme-template.json',
      'readme-template.json'
    ];

    for (const fileName of configFileNames) {
      const configPath = resolve(workspacePath, fileName);
      if (existsSync(configPath)) {
        return this.loadFromFile(configPath);
      }
    }

    // Return default configuration if no custom template found
    return DEFAULT_TEMPLATE_CONFIG;
  }

  /**
   * Validate template configuration object
   */
  static validate(config: unknown, path?: string): TemplateConfig {
    return this.validateAndTransform(config, path);
  }

  /**
   * Merge custom configuration with default
   */
  static mergeWithDefaults(
    customConfig: Partial<TemplateConfig>
  ): TemplateConfig {
    const defaultConfig = DEFAULT_TEMPLATE_CONFIG;

    return {
      sections: [
        ...defaultConfig.sections,
        ...(customConfig.sections || [])
      ].sort((a, b) => a.order - b.order),
      formatting: {
        ...defaultConfig.formatting,
        ...customConfig.formatting
      },
      variables: {
        ...defaultConfig.variables,
        ...customConfig.variables
      }
    };
  }

  /**
   * Create template configuration from template string
   */
  static fromTemplateString(
    templateString: string,
    name = 'custom',
    order = 1
  ): TemplateConfig {
    const section: TemplateSection = {
      name,
      enabled: true,
      order,
      template: templateString
    };

    return {
      sections: [section],
      formatting: DEFAULT_TEMPLATE_CONFIG.formatting,
      variables: DEFAULT_TEMPLATE_CONFIG.variables
    };
  }

  /**
   * Parse configuration content based on file extension
   */
  private static parseConfigContent(
    content: string,
    filePath: string
  ): unknown {
    const extension = filePath.toLowerCase().split('.').pop();

    switch (extension) {
      case 'yml':
      case 'yaml':
        return yamlLoad(content);

      case 'json':
        return JSON.parse(content);

      default:
        throw new TemplateValidationError(
          `Unsupported file extension: ${extension}. Supported extensions: ${this.SUPPORTED_EXTENSIONS.join(', ')}`,
          filePath
        );
    }
  }

  /**
   * Validate and transform configuration
   */
  private static validateAndTransform(
    config: unknown,
    path?: string
  ): TemplateConfig {
    try {
      const result = TemplateConfigSchema.parse(config);

      // Ensure sections are sorted by order
      result.sections.sort((a, b) => a.order - b.order);

      // Ensure variables is defined
      if (!result.variables) {
        result.variables = {};
      }

      // Validate section name uniqueness
      const sectionNames = new Set<string>();
      for (const section of result.sections) {
        if (sectionNames.has(section.name)) {
          throw new TemplateValidationError(
            `Duplicate section name found: ${section.name}`,
            path
          );
        }
        sectionNames.add(section.name);
      }

      // Validate template syntax (basic check)
      for (const section of result.sections) {
        this.validateTemplateSyntax(section.template, section.name, path);
      }

      return result as TemplateConfig;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessages = error.errors
          .map((err) => `${err.path.join('.')}: ${err.message}`)
          .join(', ');

        throw new TemplateValidationError(
          `Template configuration validation failed: ${errorMessages}`,
          path,
          error
        );
      }

      throw error;
    }
  }

  /**
   * Basic template syntax validation
   */
  private static validateTemplateSyntax(
    template: string,
    sectionName: string,
    path?: string
  ): void {
    // Check for unmatched braces
    const openBraces = (template.match(/\{\{/g) || []).length;
    const closeBraces = (template.match(/\}\}/g) || []).length;

    if (openBraces !== closeBraces) {
      throw new TemplateValidationError(
        `Template syntax error in section '${sectionName}': Unmatched braces (${openBraces} opening, ${closeBraces} closing)`,
        path
      );
    }

    // Check for unmatched conditional blocks
    const ifBlocks = (template.match(/\{\{#if\b/g) || []).length;
    const endIfBlocks = (template.match(/\{\{\/if\}\}/g) || []).length;

    if (ifBlocks !== endIfBlocks) {
      throw new TemplateValidationError(
        `Template syntax error in section '${sectionName}': Unmatched if blocks (${ifBlocks} opening, ${endIfBlocks} closing)`,
        path
      );
    }

    // Check for unmatched loop blocks
    const eachBlocks = (template.match(/\{\{#each\b/g) || []).length;
    const endEachBlocks = (template.match(/\{\{\/each\}\}/g) || []).length;

    if (eachBlocks !== endEachBlocks) {
      throw new TemplateValidationError(
        `Template syntax error in section '${sectionName}': Unmatched each blocks (${eachBlocks} opening, ${endEachBlocks} closing)`,
        path
      );
    }
  }
}

/**
 * Template configuration manager
 */
export class TemplateConfigManager {
  private configs: Map<string, TemplateConfig> = new Map();

  /**
   * Register a template configuration
   */
  register(name: string, config: TemplateConfig): void {
    this.configs.set(name, config);
  }

  /**
   * Get a registered template configuration
   */
  get(name: string): TemplateConfig | undefined {
    return this.configs.get(name);
  }

  /**
   * Get all registered configurations
   */
  getAll(): Map<string, TemplateConfig> {
    return new Map(this.configs);
  }

  /**
   * Load and register configuration from file
   */
  loadAndRegister(name: string, filePath: string): TemplateConfig {
    const config = TemplateConfigLoader.loadFromFile(filePath);
    this.register(name, config);
    return config;
  }

  /**
   * Create default configurations
   */
  static createWithDefaults(): TemplateConfigManager {
    const manager = new TemplateConfigManager();

    // Register default configuration
    manager.register('default', DEFAULT_TEMPLATE_CONFIG);

    // Register minimal configuration
    manager.register('minimal', {
      sections: [
        {
          name: 'header',
          enabled: true,
          order: 1,
          template: '# {{action.name}}\n\n{{action.description}}'
        }
      ],
      formatting: DEFAULT_TEMPLATE_CONFIG.formatting,
      variables: {}
    });

    return manager;
  }
}
