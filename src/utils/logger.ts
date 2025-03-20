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
