import { header, p as paragraph, tsMarkdown as markdown } from 'ts-markdown';

import { SectionRenderer } from './section-renderer.js';

export class AcknowledgmentRenderer extends SectionRenderer {
  constructor() {
    super(
      markdown([
        header(2, 'Acknowledgments'),
        paragraph(
          [
            'This project leverages Markdown generation techniques from',
            '[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.'
          ].join('\n')
        )
      ])
    );
  }
}
