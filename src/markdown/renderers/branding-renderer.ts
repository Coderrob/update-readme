import { header, table, tsMarkdown as markdown } from 'ts-markdown';

import { Branding } from '../../schema/branding.js';
import { SectionRenderer } from './section-renderer.js';

export class BrandingRenderer extends SectionRenderer {
  constructor(private readonly branding?: Branding) {
    super();
  }
  async render(): Promise<string> {
    if (!this.branding) {
      return '';
    }
    const { color = '-', icon = '-' } = this.branding;
    return markdown([
      '',
      header(2, 'Branding'),
      table({
        columns: [{ name: 'Attribute' }, { name: 'Value' }],
        rows: [
          ['Color', color],
          ['Icon', icon]
        ]
      })
    ]);
  }
}
