import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { Action } from '../schema/action.js';
import { Runs } from '../schema/runs.js';
import { Renderer } from '../types.js';
import { isCompositeRun } from '../utils/guards.js';
import {
  AcknowledgmentRenderer,
  BrandingRenderer,
  CompositeRunRenderer,
  ExampleUsageRenderer,
  InputsRenderer,
  OutputsRenderer,
  SimpleRunRenderer
} from './renderers/index.js';
import { TextRenderer } from './renderers/text-renderer.js';

export class MarkdownGenerator {
  constructor(
    private readonly action: Action,
    private readonly actionRepository: string
  ) {}

  async generate(): Promise<string> {
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

  private async createRunsSection(runs: Runs): Promise<Renderer> {
    return isCompositeRun(runs)
      ? new CompositeRunRenderer(runs)
      : new SimpleRunRenderer(runs);
  }
}
