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

import { readFile } from 'fs/promises';
import * as yaml from 'js-yaml';

import { DEFAULT_ENCODING } from '../constants.js';
import { isString } from './guards.js';

type Document = Record<string, unknown>;

/**
 * Reads a YAML file from disk and returns its parsed content.
 */
export async function readYamlFile<T extends Document>(
  filePath: string
): Promise<T> {
  const fileContent = await readFile(filePath, {
    encoding: DEFAULT_ENCODING,
    flag: 'r'
  });
  if (!isString(fileContent) || !fileContent) {
    throw new Error(`YAML file at ${filePath} is empty`);
  }
  return yaml.load(fileContent) as T;
}
