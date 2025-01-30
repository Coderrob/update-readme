/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals';
import * as core from '@actions/core';

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core);

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('./main.js');

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;
  let setOutputMock: jest.SpiedFunction<typeof core.setOutput>;

  beforeEach(() => {
    getInputMock = jest.spyOn(core, 'getInput');
    setOutputMock = jest.spyOn(core, 'setOutput');
  });

  afterEach(jest.clearAllMocks);

  it('should set output with wait time if input is valid', async () => {
    getInputMock.mockImplementationOnce(() => '500');

    await run();

    expect(getInputMock).toHaveBeenCalledTimes(1);
    expect(getInputMock).toHaveBeenCalledWith('milliseconds');
    expect(setOutputMock).toHaveBeenCalledTimes(1);
    expect(setOutputMock).toHaveBeenCalledWith('ms', '500');
  });
});
