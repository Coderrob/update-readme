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

import { mkdir, writeFile } from 'fs/promises';
import * as path from 'path';

import { DEFAULT_ENCODING } from '../constants.js';
import { isError } from './guards.js';

/**
 * Writes or updates the README.md file in the given directory.
 */
export async function writeReadme(
  filePath: string,
  content: string
): Promise<void> {
  if (!filePath || typeof filePath !== 'string') {
    throw new Error('Invalid file path provided');
  }

  let resolvedPath = path.resolve(filePath);

  // If input is a directory, append README.md
  if (!path.extname(resolvedPath)) {
    resolvedPath = path.join(resolvedPath, 'README.md');
  }

  const dirPath = path.dirname(resolvedPath);

  try {
    // Ensure the directory exists before writing
    await mkdir(dirPath, { recursive: true });

    // Write file atomically to prevent partial writes
    await writeFile(resolvedPath, content, { encoding: DEFAULT_ENCODING });
  } catch (error) {
    const message = isError(error) ? error.message : 'Unknown error';
    throw new Error(`Failed to write documentation file: ${message}`);
  }
}
