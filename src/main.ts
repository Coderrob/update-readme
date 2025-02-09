import * as core from '@actions/core';
import { DocumentationService } from './documentation-service.js';
import { Input } from './types/input.js';

export async function run(
  actionYamlPath = core.getInput(Input.ACTION_YAML_PATH),
  readmeFilePath = core.getInput(Input.README_FILE_PATH)
): Promise<void> {
  await DocumentationService.load(actionYamlPath)
    .then((service) => service.validate())
    .then((service) => service.save(readmeFilePath));
}
