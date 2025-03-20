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
