import * as core from '@actions/core';
import { run } from './main.js';
import { INPUT_ACTION_YAML_PATH } from './utils/constants.js';

// Mocks should be declared before the module being tested is imported.
jest.mock('@actions/core');

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;
  let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;

  beforeEach(() => {
    getInputMock = jest.spyOn(core, 'getInput');
    setOutputMock = jest.spyOn(core, 'setOutput');
  });

  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    getInputMock.mockImplementationOnce(() => 'action.yml');

    await run();

    expect(getInputMock).toHaveBeenCalledTimes(1);
    expect(getInputMock).toHaveBeenCalledWith(INPUT_ACTION_YAML_PATH);
  });

  it('should set output with wait time if input is valid', async () => {
    getInputMock.mockImplementationOnce(() => 'action.yml');

    await run();

    expect(getInputMock).toHaveBeenCalledTimes(1);
    expect(getInputMock).toHaveBeenCalledWith('milliseconds');
    expect(setOutputMock).toHaveBeenCalledTimes(1);
    expect(setOutputMock).toHaveBeenCalledWith('ms', '500');
  });
});
