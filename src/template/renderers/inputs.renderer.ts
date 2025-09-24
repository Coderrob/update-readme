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

import {
  header,
  p as paragraph,
  table,
  tsMarkdown as markdown
} from 'ts-markdown';

import { Inputs } from '../../schema/index.js';
import { SectionRenderer } from './section.renderer.js';

export class InputsRenderer extends SectionRenderer {
  constructor(private readonly inputs: Inputs = {}) {
    super();
  }

  async render(): Promise<string> {
    return markdown([
      '',
      header(2, 'Inputs'),
      Object.keys(this.inputs).length > 0
        ? table({
            columns: [
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Default' },
              { name: 'Required' }
            ],
            rows: Object.entries(this.inputs)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(([key, input]) => [
                key,
                input.description || '-',
                input.default || '-',
                input.required ? '✅ Yes' : '❌ No'
              ])
          })
        : paragraph('This action does not define any inputs.')
    ]);
  }
}
