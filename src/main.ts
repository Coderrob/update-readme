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

import { ActionDocGenerator } from './services/action-doc-generator.js';
import { isError } from './utils/guards.js';

export async function run(
  actionYamlPath: string,
  readmeFilePath: string
): Promise<void> {
  await ActionDocGenerator.load(actionYamlPath)
    .then((service) => service.validate())
    .then((service) => service.save(readmeFilePath))
    .catch((error: Error) => {
      const message = isError(error)
        ? error.message
        : `Unknown error ${String(error)}`;
      core.setFailed(
        `Failed to update README.md file with action metadata: ${message}`
      );
    });
}
