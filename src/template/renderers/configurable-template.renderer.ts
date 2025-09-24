import { ContentValidator } from '../../core/content.validator.js';
import { TemplateEngine } from '../template.engine.js';
import {
  IRender,
  TemplateConfig,
  TemplateContext,
  DEFAULT_TEMPLATE_CONFIG,
  ValidationConfig
} from '../../types/index.js';

export class ConfigurableTemplateRenderer implements IRender {
  private engine: TemplateEngine;
  private config: TemplateConfig;

  constructor(context: TemplateContext, config?: Partial<TemplateConfig>) {
    this.config = config
      ? this.mergeConfigs(DEFAULT_TEMPLATE_CONFIG, config)
      : DEFAULT_TEMPLATE_CONFIG;
    this.engine = new TemplateEngine(context, this.config);
  }

  async render(): Promise<string> {
    const enabledSections = this.config.sections
      .filter((section) => section.enabled)
      .sort((a, b) => a.order - b.order);

    const renderedSections = enabledSections.map((section) => {
      return this.engine.processTemplate(section.template);
    });

    return renderedSections.join('\n\n');
  }

  /**
   * Merge configuration objects
   */
  private mergeConfigs(
    base: TemplateConfig,
    override: Partial<TemplateConfig>
  ): TemplateConfig {
    return {
      sections: override.sections || base.sections,
      variables: { ...base.variables, ...(override.variables || {}) },
      formatting: { ...base.formatting, ...(override.formatting || {}) }
    };
  }

  /**
   * Validate generated content
   */
  validateContent(
    content: string,
    validationConfig?: Partial<ValidationConfig>
  ) {
    const validator = new ContentValidator(validationConfig);
    return validator.validateContent(content, 'README.md');
  }
}
