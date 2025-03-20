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

export interface ILog {
  debug(message: string): void;
  info(message: string): void;
  warn(message: string, error?: unknown): void;
  error(message: string, error: unknown): void;
  fatal(message: string, error?: unknown): void;
}

class ErrorFormatter {
  format(error: unknown): string {
    if (error instanceof Error) {
      return `${error.message}`;
    }
    return `Unknown error: ${String(error)}`;
  }
}

export class Logger implements ILog {
  private readonly formatter = new ErrorFormatter();

  debug(message: string): void {
    core.debug(message);
  }

  info(message: string): void {
    core.info(message);
  }

  warn(message: string, error?: unknown): void {
    core.warning(
      error ? `${message}: ${this.formatter.format(error)}` : message
    );
  }

  error(message: string, error: unknown): void {
    core.error(error ? `${message}: ${this.formatter.format(error)}` : message);
  }

  fatal(message: string, error?: unknown): void {
    core.setFailed(
      error ? `${message}: ${this.formatter.format(error)}` : message
    );
  }
}
