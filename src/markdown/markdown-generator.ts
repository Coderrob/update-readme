import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { Action } from '../schema/action.js';
import { Runs } from '../schema/runs.js';
import { Renderer } from '../types.js';
import { isCompositeRun } from '../utils/guards.js';
import { AcknowledgmentRenderer } from './renderers/acknowledgment-renderer.js';
import { BrandingRenderer } from './renderers/branding-renderer.js';
import { CompositeRunRenderer } from './renderers/composite-run-renderer.js';
import { ExampleUsageRenderer } from './renderers/example-usage-renderer.js';
import { InputsRenderer } from './renderers/inputs-renderer.js';
import { OutputsRenderer } from './renderers/outputs-renderer.js';
import { SectionRenderer } from './renderers/section-renderer.js';
import { SimpleRunRenderer } from './renderers/simple-run-renderer.js';

export class MarkdownGenerator {
  constructor(
    private readonly action: Action,
    private readonly actionRepository: string,
    private readonly outputSVGPath?: string
  ) {}

  async generate(): Promise<string> {
    const sections = [
      new SectionRenderer(markdown([header(1, this.action.name)])),
      new SectionRenderer(markdown([paragraph(this.action.description)])),
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
      ? new CompositeRunRenderer(runs, this.outputSVGPath)
      : new SimpleRunRenderer(runs);
  }
}
