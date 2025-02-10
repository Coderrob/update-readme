import { z } from 'zod';

import { CompositeRun } from '../../types.js';
import { CompositeStepSchema } from './composite-step.schema.js';

/**
 * Composite Action Runs Schema.
 *
 * A composite action must have a `using: "composite"` and an array of steps.
 */
export const CompositeRunsSchema = z
  .object({
    using: z.literal(CompositeRun).describe('Must be "composite"'),
    steps: z
      .array(CompositeStepSchema)
      .describe(
        'The steps that you plan to run in this action. These can be either run steps or uses steps.'
      )
  })
  .strict();
