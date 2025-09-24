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
  codeblock,
  header,
  p as paragraph,
  tsMarkdown as markdown
} from 'ts-markdown';

import { SectionRenderer } from './section.renderer.js';
import { isCompositeRun } from '../../utils/guards.js';
import { MermaidFlowchartGenerator } from '../mermaid-flowchart,generator.js';
import { Runs } from '../../schema/index.js';

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
