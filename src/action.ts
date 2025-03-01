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

import { MarkdownGenerator } from './markdown/markdown-generator.js';
import { Action } from './schema/action.js';
import { IExecute, Input } from './types.js';
import { isError } from './utils/guards.js';
import { readYamlFile } from './utils/read-yaml-file.js';
import { ReadmeGenerator } from './utils/readme-generator.js';

/**
 * Represents an action that generates documentation
 * for a GitHub Action.
 */
export class UpdateReadmeAction implements IExecute {
  private readonly actionYamlPath: string;
  private readonly readmeFilePath: string;
  private readonly repository: string;

  constructor({
    [Input.ACTION_FILE_PATH]: actionYamlPath,
    [Input.README_FILE_PATH]: readmeFilePath,
    [Input.ACTION_REPOSITORY]: repository
  }: Record<Input, string>) {
    this.actionYamlPath = actionYamlPath;
    this.readmeFilePath = readmeFilePath;
    this.repository = repository;
  }

  /**
   * Executes the action.
   */
  async execute(): Promise<void> {
    try {
      const action: Action = await readYamlFile<Action>(this.actionYamlPath);
      const markdown = new MarkdownGenerator(action, this.repository);
      await new ReadmeGenerator(markdown, this.readmeFilePath).generate();
    } catch (error) {
      const message = isError(error)
        ? error.message
        : `Unknown error ${String(error)}`;
      core.setFailed(`Failed to update README. Error: ${message}`);
    }
  }
}
