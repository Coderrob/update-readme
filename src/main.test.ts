import { jest } from '@jest/globals';

import { ACTION_YAML_PATH, README_FILE_NAME } from './constants.js';
import { run } from './main.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './utils/constants.js';

jest.mock('@actions/core');

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;

  beforeEach(() => {
    // Since we're already in a mock environment, we can simply set up the mocks directly
    getInputMock = jest.spyOn(core, 'getInput');
  });

  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    // Directly pass the expected input values to the function
    getInputMock.mockImplementationOnce(() => ACTION_YAML_PATH);
    getInputMock.mockImplementationOnce(() => README_FILE_NAME);

    await run();

    expect(getInputMock).toHaveBeenCalledTimes(2);
    expect(core.setFailed).not.toHaveBeenCalled();
  });
});
