import { z } from 'zod';

/**
 * Branding Schema
 */
export const BrandingSchema = z
  .object({
    color: z.string(),
    icon: z.string()
  })
  .strict();
