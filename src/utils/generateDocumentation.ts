import { z } from 'zod';
import { ActionSchema } from '../schema/action.js';

/**
 * Generates a Markdown documentation string based on the validated action definition.
 */
export const generateDocumentation = (
  action: z.infer<typeof ActionSchema>
): string => {
  const {
    name,
    description,
    author,
    branding,
    inputs = {},
    outputs = {},
    runs
  } = action;

  // Title and Description
  let doc = `# ${name}\n\n`;
  doc += `${description}\n\n`;

  // Optional author
  if (author) {
    doc += `**Author:** ${author}\n\n`;
  }

  // Branding information if available
  if (branding) {
    doc += `**Branding:**\n\n- **Color:** ${branding.color}\n- **Icon:** ${branding.icon}\n\n`;
  }

  // Inputs section
  doc += `## Inputs\n\n`;
  if (Object.keys(inputs).length > 0) {
    doc += `| Name | Description | Default | Required |\n`;
    doc += `| ---- | ----------- | ------- | -------- |\n`;
    for (const [
      inputName,
      { description = '-', default: defaultValue = '-', required = false }
    ] of Object.entries(inputs)) {
      doc += `| \`${inputName}\` | ${description} | ${defaultValue} | ${required ? '✅ Yes' : '❌ No'} |\n`;
    }
    doc += `\n`;
  } else {
    doc += `This action does not define any inputs.\n\n`;
  }

  // Outputs section
  doc += `## Outputs\n\n`;
  if (Object.keys(outputs).length > 0) {
    doc += `| Name | Description |\n`;
    doc += `| ---- | ----------- |\n`;
    for (const [outputName, { description = 'N/A' }] of Object.entries(
      outputs
    )) {
      doc += `| \`${outputName}\` | ${description} |\n`;
    }
    doc += `\n`;
  } else {
    doc += `This action does not define any outputs.\n\n`;
  }

  // Runs section
  doc += `## Runs\n\n`;
  switch (runs.using) {
    case 'composite':
      doc += `**Type:** Composite Action\n\n`;
      doc += `This action is composed of the following steps:\n\n`;
      runs.steps.forEach((step, index) => {
        doc += `**Step ${index + 1}:**\n`;
        doc += `- **Run:** \`${step.run}\`\n`;
        if (step.name) doc += `- **Name:** ${step.name}\n`;
        if (step.shell) doc += `- **Shell:** ${step.shell}\n`;
        if (step['working-directory'])
          doc += `- **Working Directory:** ${step['working-directory']}\n`;
        if (step.if) doc += `- **Conditional:** ${step.if}\n`;
        if (step.env) {
          doc += `- **Environment Variables:**\n`;
          Object.entries(step.env).forEach(([envKey, envValue]) => {
            doc += `  - \`${envKey}\`: ${envValue}\n`;
          });
        }
        doc += `\n`;
      });
      break;

    case 'node12':
    case 'node14':
    case 'node16':
    case 'node18':
    case 'node20':
      doc += `**Type:** Node.js Action\n\n`;
      doc += `- **Entry Point:** \`${runs.main}\`\n`;
      if (runs.pre) doc += `- **Pre:** \`${runs.pre}\`\n`;
      if (runs.post) doc += `- **Post:** \`${runs.post}\`\n`;
      break;

    case 'docker':
      doc += `**Type:** Docker Action\n\n`;
      doc += `- **Dockerfile:** \`${runs.image}\`\n`;
      break;

    default:
      doc += `This action uses an unrecognized runtime configuration.\n`;
      break;
  }

  // Example usage section (customize as needed)
  doc += `\n## Example Usage\n\n`;
  doc += '```yaml\n';
  doc += '# Example workflow using this action\n';
  doc += 'jobs:\n';
  doc += '  example:\n';
  doc += '    runs-on: ubuntu-latest\n';
  doc += '    steps:\n';
  doc += '      - uses: actions/checkout@v2\n';
  doc += `      - name: Run ${action.name}\n`;
  doc += `        uses: ./\n`;
  doc += '        with:\n';
  Object.keys(inputs).forEach((inputName) => {
    doc += `          ${inputName}: <value>\n`;
  });
  doc += '```\n';

  // Footer / update notice
  doc += `\n*This documentation was automatically generated from the \`action.yml\` definition.*\n`;

  return doc;
};
