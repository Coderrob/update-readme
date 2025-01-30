import * as core from '@actions/core';
import { isError } from './utils/common.js';

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds');

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Waiting ${ms} milliseconds ...`);

    // Set outputs for other workflow steps to use
    core.setOutput('ms', ms);
  } catch (error) {
    if (isError(error)) core.setFailed(error.message);
  }
}
