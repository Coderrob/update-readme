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
 *
 */

import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { Action } from '../../schema/action.js';
import { Runs } from '../../schema/runs.js';
import { IRender } from '../../types.js';
import { isCompositeRun } from '../../utils/guards.js';
import {
  AcknowledgmentRenderer,
  BrandingRenderer,
  CompositeRunRenderer,
  ExampleUsageRenderer,
  InputsRenderer,
  OutputsRenderer,
  SimpleRunRenderer
} from '../renderers/index.js';
import { TextRenderer } from '../renderers/text-renderer.js';
import {
  TemplateEngine,
  ConfigurableTemplateRenderer,
  TemplateContext
} from './template-engine.js';
import { TemplateConfigLoader } from './template-config.js';
import {
  ContentValidator,
  ValidationConfig
} from '../../analyzers/content-validator.js';

export class MarkdownGenerator {
  private templateEngine?: TemplateEngine;

  constructor(
    private readonly action: Action,
    private readonly actionRepository: string,
    private readonly useTemplate = false,
    private readonly customTemplatePath?: string,
    private readonly workspacePath?: string
  ) {
    if (this.useTemplate) {
      this.templateEngine = new TemplateEngine(this.createTemplateContext());
    }
  }

  async generate(): Promise<string> {
    if (this.useTemplate && this.templateEngine) {
      return this.generateFromTemplate();
    }

    return this.generateFromRenderers();
  }

  private async generateFromTemplate(): Promise<string> {
    const context = this.createTemplateContext();

    let config;
    if (this.customTemplatePath) {
      // Load custom template from file
      config = TemplateConfigLoader.loadFromFile(this.customTemplatePath);
    } else if (this.workspacePath) {
      // Load from workspace
      config = TemplateConfigLoader.loadFromWorkspace(this.workspacePath);
    } else {
      // Use default configuration
      config = undefined;
    }

    const renderer = new ConfigurableTemplateRenderer(context, config);
    return renderer.render();
  }

  private async generateFromRenderers(): Promise<string> {
    const sections = [
      new TextRenderer(markdown([header(1, this.action.name)])),
      new TextRenderer(markdown(['', paragraph(this.action.description)])),
      new BrandingRenderer(this.action.branding),
      new InputsRenderer(this.action.inputs),
      new OutputsRenderer(this.action.outputs),
      await this.createRunsSection(this.action.runs),
      new ExampleUsageRenderer(
        this.action.name,
        this.actionRepository,
        this.action.inputs
      ),
      new AcknowledgmentRenderer()
    ];

    const content = await Promise.all(
      sections.flatMap(async (section) => await section.render())
    );

    return content.join('\n');
  }

  private createTemplateContext(): TemplateContext {
    return {
      action: this.action,
      repository: this.actionRepository,
      metadata: {
        generatedAt: new Date().toISOString(),
        generatorVersion: '2.0.0',
        documentVersion: '1.0.0'
      }
    };
  }

  private async createRunsSection(runs: Runs): Promise<IRender> {
    return isCompositeRun(runs)
      ? new CompositeRunRenderer(runs)
      : new SimpleRunRenderer(runs);
  }

  /**
   * Validate generated markdown content
   */
  validateContent(
    content: string,
    validationConfig?: Partial<ValidationConfig>
  ) {
    const validator = new ContentValidator(validationConfig);
    return validator.validateContent(content, 'README.md');
  }
}
