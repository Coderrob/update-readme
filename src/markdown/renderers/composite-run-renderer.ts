import {
  header,
  img,
  p as paragraph,
  tsMarkdown as markdown
} from 'ts-markdown';

import { Runs } from '../../schema/runs.js';
import { isCompositeRun } from '../../utils/guards.js';
import { PlantUMLGenerator } from '../../utils/plant-uml-generator.js';
import { SVGGenerator } from '../../utils/svg-generator.js';
import { SectionRenderer } from './section-renderer.js';

export class CompositeRunRenderer extends SectionRenderer {
  constructor(
    private readonly runs: Runs,
    private readonly outputSVGPath?: string
  ) {
    super('');
  }

  async render(): Promise<string> {
    if (isCompositeRun(this.runs)) {
      const pumlGenerator = new PlantUMLGenerator(this.runs);
      const puml = pumlGenerator.generate();
      const svgGenerator = new SVGGenerator(puml, this.outputSVGPath!);
      await svgGenerator.generate();
    }
    return markdown([
      header(2, 'Runs'),
      paragraph(`**Execution Type:** ${this.runs.using}`),
      header(2, 'GitHub Actions Workflow Diagram'),
      paragraph(
        'This diagram represents the workflow steps of the GitHub Action.'
      ),
      img({
        alt: 'Workflow Diagram',
        source: `./${this.outputSVGPath}`,
        title: 'Workflow Diagram'
      })
    ]);
  }
}
