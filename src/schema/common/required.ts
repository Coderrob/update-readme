import { z } from 'zod';

export function requiredString(msg?: string): z.ZodString {
  return z
    .string()
    .trim()
    .min(1, { message: msg || 'This field is required' });
}
