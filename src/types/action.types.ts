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

/**
 * Input names for the action.
 */
export enum Input {
  README_FILE_PATH = 'readme-file-path',
  ACTION_FILE_PATH = 'action-file-path',
  ACTION_REPOSITORY = 'action-repository'
}

/**
 *  InputEntry interface definition
 */
export interface IEntry<T> {
  id: T;
  default: string;
  deprecationMessage: string;
  description: string;
  required: boolean;
  value?: string;
}

export type InputEntry = IEntry<Input>;

/**
 * Execute interface definition
 */
export interface IExecute {
  execute(): Promise<void>;
}

/**
 * Render interface definition
 */
export interface IRender {
  render(): Promise<string>;
}

/**
 * Node version enum for GitHub Actions
 */
export enum NodeVersion {
  NODE20 = 'node20',
  NODE22 = 'node22'
}

export const CompositeRun = 'composite';
export const DockerRun = 'docker';

export type RunType = typeof CompositeRun | typeof DockerRun | `${NodeVersion}`;
