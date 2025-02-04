import { z } from 'zod';
import { CompositeStepSchema } from './composite-step.js';

/**
 * Composite Action Runs Schema.
 *
 * A composite action must have a `using: "composite"` and an array of steps.
 */
export const CompositeRunsSchema = z
  .object({
    using: z.literal('composite'),
    steps: z
      .array(CompositeStepSchema)
      .describe(
        'The steps that you plan to run in this action. These can be either run steps or uses steps.'
      )
  })
  .strict();
