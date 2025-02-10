import * as core from '@actions/core';

import { ActionDocGenerator } from './services/action-doc-generator.js';
import { isError } from './utils/guards.js';

export async function run(
  actionYamlPath: string,
  readmeFilePath: string
): Promise<void> {
  await ActionDocGenerator.load(actionYamlPath)
    .then((service) => service.validate())
    .then((service) => service.save(readmeFilePath))
    .catch((error: Error) => {
      const message = isError(error)
        ? error.message
        : `Unknown error ${String(error)}`;
      core.setFailed(
        `Failed to update README with action metadata: ${message}`
      );
    });
}
