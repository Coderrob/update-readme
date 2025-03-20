import {
  codeblock,
  header,
  p as paragraph,
  tsMarkdown as markdown
} from 'ts-markdown';

import { Runs } from '../../schema/runs.js';
import { isCompositeRun } from '../../utils/guards.js';
import { MermaidFlowchartGenerator } from '../../utils/mermaid-flowchart-generator.js';
import { SectionRenderer } from './section-renderer.js';

export class CompositeRunRenderer extends SectionRenderer {
  constructor(private readonly runs: Runs) {
    super();
  }

  async render(): Promise<string> {
    if (!isCompositeRun(this.runs)) {
      return '';
    }

    const flowchart = new MermaidFlowchartGenerator(this.runs).generate();

    return markdown([
      '',
      header(2, 'Runs'),
      paragraph(`**Execution Type:** ${this.runs.using}`),
      paragraph('This diagram represents the steps of the GitHub Action.'),
      codeblock(flowchart, { language: 'mermaid', fenced: '`' })
    ]);
  }
}
