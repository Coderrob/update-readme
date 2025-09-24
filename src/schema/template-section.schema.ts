import { z } from 'zod';

/**
 * Template section schema for validation
 */

export const TemplateSectionSchema = z.object({
  name: z.string().min(1),
  enabled: z.boolean().default(true),
  order: z.number().int().min(1),
  template: z.string().min(1),
  variables: z.record(z.string()).optional()
});
