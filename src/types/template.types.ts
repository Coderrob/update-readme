import { Action } from '../schema/index.js';

/**
 * Template configuration structure
 */
export interface TemplateConfig {
  sections: TemplateSection[];
  formatting: TemplateFormatting;
}

/**
 * Template section configuration
 */
export interface TemplateSection {
  name: string;
  enabled: boolean;
  order: number;
  renderer: string;
  options?: Record<string, unknown>;
  condition?: string;
  template?: string;
}

/**
 * Template formatting options
 */
export interface TemplateFormatting {
  lineWidth: number;
  indentSize: number;
  useSpaces: boolean;
  addToc: boolean;
  tocDepth: number;
  addTimestamp: boolean;
  addBranding: boolean;
  brandingText?: string;
  customStyles?: Record<string, string>;
}

/**
 * Context for template rendering
 */
export interface TemplateContext {
  action: Action;
  structure?: unknown;
  dependencies?: unknown;
  branding?: BrandingOptions;
  metadata?: Record<string, unknown>;
  timestamp?: string;
  version?: string;
  environment?: Record<string, string>;
}

/**
 * Branding options for README generation
 */
export interface BrandingOptions {
  enabled: boolean;
  position: 'top' | 'bottom';
  text: string;
  style: 'badge' | 'text' | 'banner';
  customBadge?: {
    label: string;
    message: string;
    color: string;
  };
}

/**
 * Rendering result with metadata
 */
export interface RenderResult {
  content: string;
  metadata: {
    sections: string[];
    wordCount: number;
    lineCount: number;
    generatedAt: string;
    warnings?: string[];
  };
}

/**
 * Default template configuration
 */
export const DEFAULT_TEMPLATE_CONFIG: TemplateConfig = {
  sections: [
    {
      name: 'header',
      enabled: true,
      order: 1,
      renderer: 'HeaderRenderer',
      options: {
        includeBadges: true,
        includeDescription: true
      }
    },
    {
      name: 'inputs',
      enabled: true,
      order: 2,
      renderer: 'InputsRenderer',
      options: {
        showRequired: true,
        showDefaults: true,
        sortByRequired: true
      }
    },
    {
      name: 'outputs',
      enabled: true,
      order: 3,
      renderer: 'OutputsRenderer',
      options: {
        showTypes: true,
        includeDescriptions: true
      }
    },
    {
      name: 'usage',
      enabled: true,
      order: 4,
      renderer: 'ExampleUsageRenderer',
      options: {
        includeBasic: true,
        includeAdvanced: false,
        showComments: true
      }
    },
    {
      name: 'runs',
      enabled: true,
      order: 5,
      renderer: 'RunsRenderer',
      options: {
        showSteps: true,
        includeEnvironment: false
      }
    },
    {
      name: 'branding',
      enabled: false,
      order: 6,
      renderer: 'BrandingRenderer',
      options: {
        position: 'bottom',
        style: 'text'
      }
    }
  ],
  formatting: {
    lineWidth: 120,
    indentSize: 2,
    useSpaces: true,
    addToc: false,
    tocDepth: 3,
    addTimestamp: false,
    addBranding: false,
    brandingText: 'Generated with update-readme-action'
  }
};
