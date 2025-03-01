import { CompositeRuns } from '../schema/composite/composite-runs.js';

/**
 * Generates a PlantUML diagram based on the provided runs.
 */
export class PlantUMLGenerator {
  private runs: CompositeRuns;

  constructor(runs: CompositeRuns) {
    this.runs = runs;
  }

  /**
   * Generates a PlantUML diagram based on the provided runs.
   * @returns A string representing the PlantUML diagram.
   */
  generate(): string {
    const puml = ['@startuml', '!pragma useVerticalIf on', 'start'];

    for (const step of this.runs.steps) {
      if (step.if) {
        puml.push(`if (${step.if}) then (yes)`);
      }

      const stepText = step.name
        ? step.name
        : step.run
          ? step.run
          : 'Unnamed Step';
      puml.push(`  :${stepText};`);

      if (step.if) {
        puml.push('endif');
      }
    }

    puml.push('stop', '@enduml');
    return puml.join('\n');
  }
}
