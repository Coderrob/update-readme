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
