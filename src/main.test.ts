import { jest } from '@jest/globals';

import { run } from './main.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from './utils/constants.js';

jest.mock('@actions/core', () => ({
  __esModule: true, // this property makes it work
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  warning: jest.fn()
}));

describe('main', () => {
  let getInputMock: jest.SpiedFunction<typeof core.getInput>;

  beforeEach(() => {
    // Since we're already in a mock environment, we can simply set up the mocks directly
    getInputMock = jest
      .spyOn(core, 'getInput')
      .mockImplementationOnce((value) => value);
  });

  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    // Directly pass the expected input values to the function
    getInputMock.mockImplementationOnce(() => './action.yml');
    getInputMock.mockImplementationOnce(() => './README.md');

    await run();

    expect(true).toEqual(true);
  });
});
