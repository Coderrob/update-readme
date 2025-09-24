import { z } from 'zod';

/**
 * Template validation error
 */

export class TemplateValidationError extends Error {
  constructor(
    message: string,
    public readonly path?: string,
    public readonly errors?: z.ZodError
  ) {
    super(message);
    this.name = 'TemplateValidationError';
  }
}
