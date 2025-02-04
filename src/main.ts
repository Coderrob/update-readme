import * as core from '@actions/core';
import * as path from 'path';
import { readYamlFile } from './utils/readYamlFile.js';
import { writeReadme } from './utils/writeReadme.js';
import { ActionSchema } from './schema/action.js';
import { generateDocumentation } from './utils/generateDocumentation.js';
import { isError } from './utils/common.js';
import {
  INPUT_ACTION_YAML_PATH,
  README_NAME as README_FILE_NAME
} from './utils/constants.js';

const { log } = console;

/**
 * Main function: Reads the action YAML, validates it, generates documentation, and writes/updates the README.
 */
export async function run(): Promise<void> {
  try {
    // Read the file path from environment or input arguments.
    // As a GitHub Action, you might receive inputs via process.env or via the @actions/core package.
    const actionYamlPath = core.getInput(INPUT_ACTION_YAML_PATH);

    log(actionYamlPath);
    if (!actionYamlPath) {
      core.setFailed(
        'No action.yml path provided. Please provide a path to your action.yml file.'
      );
      return;
    }

    // Resolve the absolute path and directory
    const absolutePath = path.resolve(actionYamlPath);
    const folderDir = path.dirname(absolutePath);

    log('actionYamlPath', actionYamlPath);
    log('absolutePath', absolutePath);
    log('folderDir', folderDir);

    // Read and parse YAML file
    const rawAction = await readYamlFile(absolutePath);

    log('rawAction', rawAction);

    // Validate the action definition using Zod
    const action = ActionSchema.parse(rawAction);

    log('action', action);

    // Generate the documentation string
    const readmeContent = generateDocumentation(action);

    log('readmeContent', readmeContent);

    // Write or update the README.md file in the same folder as the action.yml
    await writeReadme(folderDir, readmeContent);

    core.info(
      `${README_FILE_NAME} has been generated/updated at: ${path.join(folderDir, README_FILE_NAME)}`
    );
  } catch (error) {
    const message = isError(error)
      ? `Error parsing action.yml: ${error.message}`
      : 'An unexpected error occurred.';
    log('error', error);
    core.error(message);
    core.setFailed(`Action failed with error: ${message}`);
  }
}
