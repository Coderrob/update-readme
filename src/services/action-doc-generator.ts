import { header, p as paragraph, tsMarkdown } from 'ts-markdown';

import * as core from '@actions/core';

import { Action } from '../schema/action.js';
import { ActionSchema } from '../schema/action.schema.js';
import { CompositeStep } from '../schema/runs/composite-step.js';
import { CompositeRun, DockerRun } from '../types.js';
import { MarkdownHelper } from '../utils/markdown.js';
import { readYamlFile } from '../utils/readYamlFile.js';
import { writeReadme } from '../utils/writeReadme.js';

export class ActionDocGenerator {
  private constructor(private readonly action: Action) {}

  /** Factory method to create an instance from an action YAML file */
  static async load(actionFilePath: string): Promise<ActionDocGenerator> {
    const action: Action = await readYamlFile(actionFilePath);
    return new ActionDocGenerator(action);
  }

  /** Validates the action against the schema */
  async validate(): Promise<this> {
    try {
      ActionSchema.parse(this.action);
    } catch (error) {
      core.setFailed(
        [
          'Validation failed:',
          error instanceof Error ? error.message : String(error)
        ].join(' ')
      );
    }
    return this;
  }

  /** Generates and saves the documentation */
  async save(filePath: string): Promise<this> {
    try {
      const documentation = await this.document();
      await writeReadme(filePath, documentation);
    } catch (error) {
      core.setFailed(
        [
          'Saving documentation failed:',
          error instanceof Error ? error.message : String(error)
        ].join(' ')
      );
    }
    return this;
  }

  /** Generates the full markdown documentation */
  async document(): Promise<string> {
    return tsMarkdown([
      this.getTitle(),
      this.getActionDescription(),
      ...this.getBranding(),
      ...this.getInputs(),
      ...this.getOutputs(),
      ...this.getEnvironmentVariables(),
      ...this.getDependencies(),
      ...this.getRunsDetails(),
      ...this.getExampleUsage(),
      ...this.getFooter()
    ]);
  }

  private getTitle() {
    return header(1, this.action.name);
  }

  private getActionDescription() {
    return paragraph(this.action.description);
  }

  private getBranding() {
    return MarkdownHelper.createBrandingTable(this.action.branding);
  }

  private getInputs() {
    return MarkdownHelper.createInputsTable(this.action.inputs);
  }

  private getOutputs() {
    return MarkdownHelper.createOutputsTable(this.action.outputs);
  }

  private getEnvironmentVariables() {
    return MarkdownHelper.createEnvironmentVariablesTable(
      this.extractEnvironmentVariables()
    );
  }

  private getDependencies() {
    return MarkdownHelper.createDependenciesSection();
  }

  private getRunsDetails() {
    return MarkdownHelper.createRunsDetailsSection(this.action.runs);
  }

  private getExampleUsage() {
    return MarkdownHelper.createExampleUsageSection(
      this.action.name,
      this.action.inputs
    );
  }

  private getFooter() {
    return MarkdownHelper.createAcknowledgmentSection();
  }

  private extractEnvironmentVariables(): [string, string][] {
    const envVars: [string, string][] = [];
    const { runs } = this.action;

    switch (runs.using) {
      case CompositeRun:
        runs.steps.forEach((step: CompositeStep) => {
          if (!step.env) {
            return;
          }
          Object.entries(step.env).forEach(([key]) => {
            envVars.push([
              key,
              ['Used in step:', step.name || 'Unnamed Step'].join(' ')
            ]);
          });
        });
        break;
      case DockerRun:
        if (runs.env) {
          Object.entries(runs.env).forEach(([key]) => {
            envVars.push([key, 'Docker environment variable']);
          });
        }
        break;
    }

    return envVars;
  }
}
