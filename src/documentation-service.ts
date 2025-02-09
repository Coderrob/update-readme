import * as core from '@actions/core';
import { Action } from './schema/action.js';
import { ActionSchema } from './schema/action.schema.js';
import { readYamlFile } from './utils/readYamlFile.js';
import { writeReadme } from './utils/writeReadme.js';
import {
  header,
  p as paragraph,
  table,
  codeblock,
  h2,
  tsMarkdown,
  ul,
  ol,
  text
} from 'ts-markdown';
import { CompositeRun, DockerRun } from './types/run-types.js';
import { NodeVersion } from './types/node-version.js';
import { Runs } from './schema/runs.js';

export class DocumentationService {
  protected constructor(private readonly action: Action) {}

  static async load(actionFilePath: string): Promise<DocumentationService> {
    const action: Action = await readYamlFile(actionFilePath);
    return new DocumentationService(action);
  }

  async validate(): Promise<DocumentationService> {
    try {
      ActionSchema.parse(this.action);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.setFailed(`Validation failed: ${message}`);
    }
    return this;
  }

  async save(filePath: string): Promise<DocumentationService> {
    try {
      const documentation = await this.document();
      await writeReadme(filePath, documentation);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      core.setFailed(`Saving documentation failed: ${message}`);
    }
    return this;
  }

  async document(): Promise<string> {
    return tsMarkdown([
      this.getTitle(),
      this.getActionDescription(),
      this.getBranding(),
      this.getInputs(),
      this.getOutputs(),
      this.getEnvironmentVariables(),
      this.getDependencies(),
      this.getRunsDetails(),
      this.getExampleUsage(),
      this.getFooter()
    ]);
  }

  private getTitle() {
    return header(1, this.action.name);
  }

  private getActionDescription() {
    return paragraph(this.action.description);
  }

  private getBranding() {
    const { branding, author } = this.action;
    return [
      h2('Branding'),
      ul(
        [
          branding ? `**Color:** ${branding.color}` : '',
          branding ? `**Icon:** ${branding.icon}` : '',
          author ? `**Author:** ${author}` : ''
        ].filter(Boolean)
      )
    ];
  }

  private getInputs() {
    const { inputs = {} } = this.action;
    return [
      h2('Inputs'),
      Object.keys(inputs).length > 0
        ? table({
            columns: [
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Default' },
              { name: 'Required' },
              { name: 'Deprecation' }
            ],
            rows: Object.entries(inputs).map(
              ([
                key,
                {
                  description,
                  default: defaultValue = '-',
                  required,
                  deprecationMessage
                }
              ]) => [
                key,
                description || '-',
                defaultValue || '-',
                required ? '✅ Yes' : '❌ No',
                deprecationMessage || '-'
              ]
            )
          })
        : paragraph('This action does not define any inputs.')
    ];
  }

  private getOutputs() {
    const { outputs = {} } = this.action;
    return [
      h2('Outputs'),
      Object.keys(outputs).length > 0
        ? table({
            columns: [
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Value' }
            ],
            rows: Object.entries(outputs).map(
              ([key, { description, value }]) => [
                key,
                description || 'N/A',
                value
              ]
            )
          })
        : paragraph('This action does not define any outputs.')
    ];
  }

  private getEnvironmentVariables() {
    const envVars = this.extractEnvironmentVariables();
    return [
      h2('Environment Variables'),
      envVars.length > 0
        ? table({
            columns: [{ name: 'Variable' }, { name: 'Description' }],
            rows: envVars.map(([key, desc]) => [key, desc])
          })
        : paragraph('This action does not require any environment variables.')
    ];
  }

  private extractEnvironmentVariables(): [string, string][] {
    const envVars: [string, string][] = [];

    switch (this.action.runs.using) {
      /**
       * Checks if the action is using a composite run strategy and extracts
       * environment variables from the composite run strategy.
       */
      case CompositeRun:
        this.action.runs.steps.forEach((step) => {
          if (step.env) {
            Object.entries(step.env).forEach(([key]) => {
              envVars.push([
                key,
                `Used in step: ${step.name || 'Unnamed Step'}`
              ]);
            });
          }
        });
        return envVars;

      /**
       * Checks if the action is using Docker run strategy and extracts
       * environment variables from the Docker run strategy.
       */
      case DockerRun:
        return this.action.runs.env
          ? Object.entries(this.action.runs.env).map(([key]) => [
              key,
              'Docker environment variable'
            ])
          : [];

      /**
       * The Node run strategy is not supported in this action. It does
       * not support Node.js environments for running actions.
       */
      default:
        return envVars;
    }
  }

  private getDependencies() {
    return [
      h2('Dependencies'),
      paragraph(
        'This section provides a graph of dependencies relevant to this action.'
      ),
      codeblock(
        [
          'dependencies:',
          '- GitHub Actions Runner',
          '- Specific environment variables',
          '- Required files and configurations'
        ].join('\n'),
        { language: 'yaml' }
      )
    ];
  }

  private getRunsDetails() {
    const { runs } = this.action;
    return [
      h2('Runs'),
      paragraph(`**Execution Type:** ${runs.using}`),
      this.getRunTypeDetails(runs)
    ];
  }

  private getRunTypeDetails(runs: Runs) {
    switch (runs.using) {
      case CompositeRun:
        return [
          paragraph('This is a composite action composed of multiple steps.'),
          ol(
            runs.steps.map((step) => [
              `- **Step ID:** ${step.id || 'N/A'}\n`,
              `- **Run Command:** ${step.run || 'N/A'}\n`,
              `- **Shell:** ${step.shell || 'N/A'}\n`
            ])
          )
        ];

      case NodeVersion.NODE18:
      case NodeVersion.NODE20:
      case NodeVersion.NODE22:
        return [
          paragraph('This is a Node.js-based action.'),
          ul(
            [
              `- **Entry Point:** ${text(runs.main)}`,
              runs.pre ? `- **Pre Script:** ${text(runs.pre)}` : '',
              runs.post ? `- **Post Script:** ${text(runs.post)}` : ''
            ].filter(Boolean)
          )
        ];

      case DockerRun:
        return [
          paragraph('This is a Docker-based action.'),
          ul(
            [
              `- **Docker Image:** ${text(runs.image)}`,
              runs.entrypoint
                ? `- **Entrypoint:** ${text(runs.entrypoint)}`
                : '',
              runs.args ? `- **Arguments:** ${runs.args.join(', ')}` : ''
            ].filter(Boolean)
          )
        ];

      default:
        return paragraph(
          'This action uses an unrecognized runtime configuration.'
        );
    }
  }

  private getExampleUsage() {
    return [
      h2('Example Usage'),
      codeblock(
        [
          'jobs:',
          '  example:',
          '    runs-on: ubuntu-latest',
          '    steps:',
          '      - uses: actions/checkout@v2',
          `      - name: Run ${this.action.name}`,
          '        uses: ./',
          '        with:',
          ...Object.keys(this.action.inputs || {}).map(
            (input) => `          ${input}: <value>`
          )
        ].join('\n'),
        { language: 'yaml' }
      )
    ];
  }

  private getFooter() {
    return paragraph(
      `*This documentation was automatically generated from the \`action.yml\` definition.*`
    );
  }
}
