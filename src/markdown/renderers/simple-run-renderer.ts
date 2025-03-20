import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { Runs } from '../../schema/runs.js';
import { SectionRenderer } from './section-renderer.js';

export class SimpleRunRenderer extends SectionRenderer {
  constructor(private readonly runs: Runs) {
    super();
  }

  async render(): Promise<string> {
    return markdown([
      '',
      header(2, 'Runs'),
      paragraph(`**Execution Type:** ${this.runs.using}`)
    ]);
  }
}
