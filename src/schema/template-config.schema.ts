import { z } from 'zod';
import { TemplateSectionSchema } from './template-section.schema.js';
import { TemplateFormattingSchema } from './template-formatting.schema.js';

/**
 * Template config schema for validation
 */

export const TemplateConfigSchema = z.object({
  sections: z.array(TemplateSectionSchema).min(1),
  formatting: TemplateFormattingSchema.default({
    lineEndings: 'lf',
    indentation: 'spaces',
    indentSize: 2,
    maxLineLength: 120,
    trimTrailingWhitespace: true
  }),
  variables: z.record(z.string()).optional()
});
