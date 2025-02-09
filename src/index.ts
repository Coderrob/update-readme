import * as core from '@actions/core';

import { run } from './main.js';
import { Input } from './types/input.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './utils/constants.js';

/* istanbul ignore next */
(async () => {
  await run(
    core.getInput(Input.ACTION_YAML_PATH) || ACTION_FILE_PATH,
    core.getInput(Input.README_FILE_PATH) || README_FILE_PATH
  );
})();
