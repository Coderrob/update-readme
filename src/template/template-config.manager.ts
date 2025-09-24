import { TemplateConfig, DEFAULT_TEMPLATE_CONFIG } from '../types/index.js';
import { TemplateConfigLoader } from './template-config.loader.js';

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
