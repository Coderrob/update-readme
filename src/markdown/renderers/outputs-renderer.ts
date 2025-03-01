import {
  header,
  p as paragraph,
  table,
  tsMarkdown as markdown
} from 'ts-markdown';

import { Outputs } from '../../schema/outputs.js';
import { SectionRenderer } from './section-renderer.js';

export class OutputsRenderer extends SectionRenderer {
  constructor(outputs: Outputs = {}) {
    super(
      markdown([
        header(2, 'Outputs'),
        Object.keys(outputs).length > 0
          ? table({
              columns: [{ name: 'Name' }, { name: 'Description' }],
              rows: Object.entries(outputs)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([key, output]) => [key, output.description || '-'])
            })
          : paragraph('This action does not define any outputs.')
      ])
    );
  }
}
