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

import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { SectionRenderer } from './section.renderer.js';
import { Runs } from '../../schema/index.js';

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
