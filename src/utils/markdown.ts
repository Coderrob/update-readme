/*
 *
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { codeblock, header, p as paragraph, table, ul } from 'ts-markdown';

import { CompositeRun, DockerRun, NodeVersion } from '../types.js';
import { Branding } from '../schema/branding.js';
import { Inputs } from '../schema/inputs.js';
import { Outputs } from '../schema/outputs.js';
import { Runs } from '../schema/runs.js';
import { CompositeStep } from '../schema/composite/composite-step.js';

export class MarkdownHelper {
  static createBrandingTable(branding?: Branding) {
    return branding
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
      : [];
  }

  static createInputsTable(inputs: Inputs = {}) {
    return [
      header(2, 'Inputs'),
      Object.keys(inputs).length > 0
        ? table({
            columns: [
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Default' },
              { name: 'Required' },
              { name: 'Deprecation' }
            ],
            rows: Object.entries(inputs).map(([key, input]) => [
              key,
              input.description || '-',
              input.default || '-',
              input.required ? '✅ Yes' : '❌ No',
              input.deprecationMessage || '-'
            ])
          })
        : paragraph('This action does not define any inputs.')
    ];
  }

  static createOutputsTable(outputs: Outputs = {}) {
    return [
      header(2, 'Outputs'),
      Object.keys(outputs).length > 0
        ? table({
            columns: [
              { name: 'Name' },
              { name: 'Description' },
              { name: 'Value' }
            ],
            rows: Object.entries(outputs).map(([key, output]) => [
              key,
              output.description || 'N/A',
              output.value
            ])
          })
        : paragraph('This action does not define any outputs.')
    ];
  }

  static createEnvironmentVariablesTable(envVars: [string, string][]) {
    return [
      header(2, 'Environment Variables'),
      envVars.length > 0
        ? table({
            columns: [{ name: 'Variable' }, { name: 'Description' }],
            rows: envVars
          })
        : paragraph('This action does not require any environment variables.')
    ];
  }

  static createDependenciesSection() {
    return [
      header(2, 'Dependencies'),
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

  static createRunsDetailsSection(runs: Runs) {
    return [
      header(2, 'Runs'),
      paragraph(['**Execution Type:**', runs.using].join(' ')),
      ...MarkdownHelper.getRunTypeDetails(runs)
    ];
  }

  static getRunTypeDetails(runs: Runs) {
    switch (runs.using) {
      case CompositeRun:
        return [
          paragraph('This is a composite action composed of multiple steps.'),
          ul(
            runs.steps.map(
              (step: CompositeStep) =>
                `- **Step ID:** ${step.id || 'N/A'}\n  - **Run Command:** ${step.run || 'N/A'}\n  - **Shell:** ${step.shell || 'N/A'}`
            )
          )
        ];
      case DockerRun:
        return [
          paragraph('This is a Docker-based action.'),
          ul(
            [
              ['- **Docker Image:**', runs.image].join(' '),
              runs.entrypoint
                ? ['- **Entrypoint:**', runs.entrypoint].join(' ')
                : '',
              runs.args
                ? ['- **Arguments:**', runs.args.join(', ')].join(' ')
                : ''
            ].filter(Boolean)
          )
        ];
      case NodeVersion.NODE16:
      case NodeVersion.NODE18:
      case NodeVersion.NODE20:
      case NodeVersion.NODE22:
        return [paragraph('This action uses a Node.js runtime configuration.')];
      default:
        return [
          paragraph('This action uses an unrecognized runtime configuration.')
        ];
    }
  }

  static createExampleUsageSection(name: string, inputs?: Inputs) {
    return [
      header(2, 'Example Usage'),
      codeblock(
        [
          'jobs:',
          '  example:',
          '    runs-on: ubuntu-latest',
          '    steps:',
          '      - uses: actions/checkout@v2',
          `      - name: Run ${name}`,
          '        uses: ./',
          '        with:',
          ...Object.keys(inputs || {}).map(
            (input) => `          ${input}: <value>`
          )
        ].join('\n'),
        { language: 'yaml' }
      )
    ];
  }

  static createAcknowledgmentSection() {
    return [
      header(2, 'Acknowledgments'),
      paragraph(
        [
          'This project leverages Markdown generation techniques from',
          '[coderrob.com](https://coderrob.com), developed by **Robert Lindley**.'
        ].join(' ')
      )
    ];
  }
}
