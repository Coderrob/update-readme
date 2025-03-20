import { SectionRenderer } from './section-renderer.js';

export class TextRenderer extends SectionRenderer {
  constructor(private readonly text: string) {
    super();
  }

  async render(): Promise<string> {
    return this.text;
  }
}
