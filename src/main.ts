import * as core from '@actions/core';

import { DocumentationService } from './documentation-service.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './utils/constants.js';
import { isError } from './utils/guards.js';

export async function run(
  actionYamlPath = ACTION_FILE_PATH,
  readmeFilePath = README_FILE_PATH
): Promise<void> {
  await DocumentationService.load(actionYamlPath)
    .then((service) => service.validate())
    .then((service) => service.save(readmeFilePath))
    .catch((error: Error) => {
      const message = isError(error)
        ? error.message
        : `$Unknown error ${String(error)}`;
      core.setFailed(
        `Failed to update README with action metadata: ${message}`
      );
    });
}
