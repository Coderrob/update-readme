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

import fs from 'fs';

import { MarkdownGenerator } from '../markdown/markdown-generator.js';

/**
 * Generates a README file based on the provided Markdown content.
 */
export class ReadmeGenerator {
  private markdownGenerator: MarkdownGenerator;
  private filePath: string;

  constructor(markdownGenerator: MarkdownGenerator, filePath: string) {
    this.markdownGenerator = markdownGenerator;
    this.filePath = filePath;
  }

  /**
   * Generates the README file.
   */
  async generate(): Promise<void> {
    const markdownContent = await this.markdownGenerator.generate();
    fs.writeFileSync(this.filePath, markdownContent);
  }
}
