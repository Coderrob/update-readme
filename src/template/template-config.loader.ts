import { existsSync, readFileSync } from 'fs';
import { load as yamlLoad } from 'js-yaml';
import { resolve } from 'path/posix';
import { z } from 'zod';
import { TemplateConfigSchema } from '../schema/index.js';
import { TemplateValidationError } from './template-validation.error.js';
import {
  TemplateConfig,
  DEFAULT_TEMPLATE_CONFIG,
  TemplateSection
} from '../types/index.js';

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
