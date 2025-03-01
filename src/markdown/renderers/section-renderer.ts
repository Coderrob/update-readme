import { tsMarkdown as markdown } from 'ts-markdown';

import { Renderer } from '../../types.js';

/**
 * Base class for markdown sections.
 */

export class SectionRenderer implements Renderer {
  constructor(private readonly content: string) {}

  async render(): Promise<string> {
    const section = Array.isArray(this.content)
      ? markdown(this.content)
      : this.content;
    return section + '\n'; // Add a newline at the end of each section for better readability.
  }
}
