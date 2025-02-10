import * as core from '@actions/core';
import { jest } from '@jest/globals';

import { ACTION_FILE_PATH, README_FILE_PATH } from './constants.js';
import { run } from './main.js';

jest.mock('@actions/core');

describe('main', () => {
  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    await run(ACTION_FILE_PATH, README_FILE_PATH);

    expect(core.setFailed).not.toHaveBeenCalled();
  });
});
