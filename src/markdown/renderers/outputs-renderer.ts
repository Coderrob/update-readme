import {
  header,
  p as paragraph,
  table,
  tsMarkdown as markdown
} from 'ts-markdown';

import { Outputs } from '../../schema/outputs.js';
import { SectionRenderer } from './section-renderer.js';

export class OutputsRenderer extends SectionRenderer {
  constructor(private readonly outputs: Outputs = {}) {
    super();
  }

  async render(): Promise<string> {
    return markdown([
      '',
      header(2, 'Outputs'),
      Object.keys(this.outputs).length > 0
        ? table({
            columns: [{ name: 'Name' }, { name: 'Description' }],
            rows: Object.entries(this.outputs)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, output]) => [key, output.description || '-'])
          })
        : paragraph('This action does not define any outputs.')
    ]);
  }
}
