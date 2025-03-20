import { codeblock, header, tsMarkdown as markdown } from 'ts-markdown';

import { Inputs } from '../../schema/inputs.js';
import { SectionRenderer } from './section-renderer.js';

export class ExampleUsageRenderer extends SectionRenderer {
  constructor(
    private readonly name: string,
    private readonly actionRepository: string,
    private readonly inputs?: Inputs
  ) {
    super();
  }

  async render(): Promise<string> {
    return markdown([
      '',
      header(2, 'Example Usage'),
      codeblock(
        [
          'jobs:',
          '  example:',
          '    runs-on: ubuntu-latest',
          '    steps:',
          '      - name: Checkout Source',
          '        id: checkout-source',
          '        uses: actions/checkout@v2',
          '',
          `      - name: ${this.name}`,
          '        id: update-readme',
          `        uses: ${this.actionRepository}@v1`,
          '        with:',
          ...Object.keys(this.inputs || {})
            .sort()
            .map((input) => `          ${input}: <value>`)
        ].join('\n'),
        { language: 'yaml', fenced: '`' }
      )
    ]);
  }
}
