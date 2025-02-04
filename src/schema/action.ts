import { z } from 'zod';
import { BrandingSchema } from './branding.js';
import { InputsSchema } from './inputs.js';
import { OutputsSchema } from './outputs.js';
import { RunsSchema } from './runs.js';

/**
 * GitHub Action Schema.
 *
 * Based on the schemastore definition, the required top‐level properties are:
 * - `name`
 * - `description`
 * - `inputs`
 * - `outputs`
 * - `runs`
 *
 * Optional properties include `author` and `branding`.
 */

export const ActionSchema = z
  .object({
    name: z.string().describe('The name of the action.'),
    description: z.string().describe('A short description of the action.'),
    author: z.string().optional().describe('The author of the action.'),
    branding: BrandingSchema.optional().describe(
      'You can use a color and Feather icon to create a badge to personalize and distinguish your action.'
    ),
    inputs: InputsSchema.optional().describe(
      'Input parameters allow you to specify data that the action expects to use during runtime.'
    ),
    outputs: OutputsSchema.optional().describe(
      'Output parameters allow you to declare data that an action sets.'
    ),
    runs: RunsSchema
  })
  .strict();
