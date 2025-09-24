import { z } from 'zod';

/**
 * Template formatting schema for validation
 */

export const TemplateFormattingSchema = z.object({
  lineEndings: z.enum(['lf', 'crlf']).default('lf'),
  indentation: z.enum(['spaces', 'tabs']).default('spaces'),
  indentSize: z.number().int().min(1).max(8).default(2),
  maxLineLength: z.number().int().min(80).max(200).default(120),
  trimTrailingWhitespace: z.boolean().default(true)
});
