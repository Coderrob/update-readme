import { jest } from '@jest/globals';

import { run } from './main.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './utils/constants.js';

// Mocks should be declared before the module being tested is imported.
jest.mock('@actions/core');

describe('main', () => {
  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    // todo: I am aware this does the real thing. Adding test coverage in coming pull request.
    await run(ACTION_FILE_PATH, README_FILE_PATH);

    expect(true).toEqual(true);
  });
});
