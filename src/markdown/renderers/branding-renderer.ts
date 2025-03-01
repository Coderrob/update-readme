import { header, table, tsMarkdown as markdown } from 'ts-markdown';

import { Branding } from '../../schema/branding.js';
import { SectionRenderer } from './section-renderer.js';

export class BrandingRenderer extends SectionRenderer {
  constructor(branding?: Branding) {
    super(
      markdown(
        branding
          ? [
              header(2, 'Branding'),
              table({
                columns: [{ name: 'Attribute' }, { name: 'Value' }],
                rows: [
                  ['Color', branding.color || '-'],
                  ['Icon', branding.icon || '-']
                ]
              })
            ]
          : []
      )
    );
  }
}
