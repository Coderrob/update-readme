import { z } from 'zod';

/**
 * Output entry schema
 */
export const OutputEntrySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe('A string description of the output parameter.'),
    value: z
      .string()
      .describe(
        'The value that the output parameter will be mapped to. You can set this to a string or an expression with context.'
      )
  })
  .strict();
