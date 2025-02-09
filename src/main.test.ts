import * as core from '@actions/core';
import { jest } from '@jest/globals';

import { run } from './main.js';

// Mocks should be declared before the module being tested is imported.
jest.mock('@actions/core');

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;

  beforeEach(() => {
    getInputMock = jest.spyOn(core, 'getInput');
  });

  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    getInputMock.mockImplementationOnce(() => './action.yml');
    getInputMock.mockImplementationOnce(() => './README.md');

    // todo: I am aware this does the real thing. Adding test coverage in coming pull request.
    await run();

    expect(getInputMock).toHaveBeenCalledTimes(2);
  });
});
