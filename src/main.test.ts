import * as core from '@actions/core';
import { jest } from '@jest/globals';
import { run } from './main.js';
import { INPUT_ACTION_YAML_PATH } from './utils/constants.js';

// Mocks should be declared before the module being tested is imported.
jest.mock('@actions/core');

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;

  beforeEach(() => {
    getInputMock = jest.spyOn(core, 'getInput');
  });

  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    getInputMock.mockImplementationOnce(() => 'action.yml');

    // todo: I am aware this does the real thing. Adding test coverage in coming pull request.
    await run();

    expect(getInputMock).toHaveBeenCalledTimes(1);
    expect(getInputMock).toHaveBeenCalledWith(INPUT_ACTION_YAML_PATH);
  });
});
