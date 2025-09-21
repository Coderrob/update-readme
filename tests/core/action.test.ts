/*
 *
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as core from '@actions/core';
import { jest } from '@jest/globals';

import { UpdateReadmeAction } from '../../src/core/action.js';
import { ACTION_FILE_PATH, README_FILE_PATH } from '../../src/constants.js';
import { Input } from '../../src/types.js';

jest.mock('@actions/core');

describe('main', () => {
  afterEach(jest.clearAllMocks);

  it('should create a new README.md file for an action.yml file', async () => {
    await new UpdateReadmeAction({
      [Input.ACTION_FILE_PATH]: ACTION_FILE_PATH,
      [Input.README_FILE_PATH]: README_FILE_PATH,
      [Input.ACTION_REPOSITORY]: 'Coderrob/update-action-readme'
    }).execute();

    expect(core.setFailed).not.toHaveBeenCalled();
  });
});
