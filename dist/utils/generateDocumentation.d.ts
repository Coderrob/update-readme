import { z } from 'zod';
import { ActionSchema } from '../schema/action.js';
/**
 * Generates a Markdown documentation string based on the validated action definition.
 */
export declare const generateDocumentation: (action: z.infer<typeof ActionSchema>) => string;
