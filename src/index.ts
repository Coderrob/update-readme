import * as core from '@actions/core';
import { run } from './main.js';
import { Input } from './types.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './constants.js';

(async () => {
  await run(
    core.getInput(Input.ACTION_FILE_PATH, {
      required: true,
      trimWhitespace: true
    }) || ACTION_FILE_PATH,
    core.getInput(Input.README_FILE_PATH, {
      required: true,
      trimWhitespace: true
    }) || README_FILE_PATH
  );
})();
