/*
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

import { ACTION_FILE_PATH, README_FILE_PATH } from './constants.js';
import { Input, InputEntry } from './types.js';

export const actionInputs: Record<Input, InputEntry> = {
  [Input.README_FILE_PATH]: {
    id: Input.README_FILE_PATH,
    default: README_FILE_PATH,
    deprecationMessage: '',
    description:
      "The path to the README.md file that should be updated. This is relative to the repository root. If not specified, it defaults to 'README.md'.",
    required: true
  },
  [Input.ACTION_FILE_PATH]: {
    id: Input.ACTION_FILE_PATH,
    default: ACTION_FILE_PATH,
    deprecationMessage: '',
    description:
      "The path to the YAML configuration file for the action. This is relative to the repository root. If not specified, it defaults to 'action.yml'.",
    required: true
  },
  [Input.ACTION_REPOSITORY]: {
    id: Input.ACTION_REPOSITORY,
    default: '',
    deprecationMessage: '',
    description:
      'The repository where the action is located. This is used to fetch the latest version of the action.',
    required: false
  }
};

/**
 * Proxy to get input values from GitHub Actions.
 * This proxy ensures that the correct default values
 * and validation are applied to each input.
 */
export const getInput = new Proxy({} as Record<Input, string>, {
  get: (_, key: string) => {
    if (!Object.values(Input).includes(key as Input)) {
      throw new Error(`Invalid input key: ${key}`);
    }
    const entry = actionInputs[key as Input];
    const value = core.getInput(entry.id, { required: entry.required });
    return value || entry.default;
  }
});
