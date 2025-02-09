import { z } from 'zod';

/**
 * Branding Schema
 */
export const BrandingSchema = z
  .object({
    color: z.string().describe('The primary color of the brand'),
    icon: z.string().describe('The icon best representing the action category')
  })
  .strict();
