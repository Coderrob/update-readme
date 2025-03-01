import { codeblock, header, tsMarkdown as markdown } from 'ts-markdown';

import { Inputs } from '../../schema/inputs.js';
import { SectionRenderer } from './section-renderer.js';

export class ExampleUsageRenderer extends SectionRenderer {
  constructor(name: string, actionRepository: string, inputs?: Inputs) {
    super(
      markdown([
        header(2, 'Example Usage'),
        codeblock(
          [
            'jobs:',
            '  example:',
            '    runs-on: ubuntu-latest',
            '    steps:',
            '      - name: Checkout Source',
            '        uses: actions/checkout@v2',
            '',
            `      - name: Run ${name}`,
            `        uses: ${actionRepository}@main`,
            '        with:',
            ...Object.keys(inputs || {})
              .sort()
              .map((input) => `          ${input}: <value>`)
          ].join('\n'),
          { language: 'yaml' }
        )
      ])
    );
  }
}
