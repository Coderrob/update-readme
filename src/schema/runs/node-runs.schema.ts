import { z } from 'zod';

import { NodeVersion } from '../../types.js';

/**
 * Node action Runs Schema.
 *
 * A node action uses either `node12`, `node16`, `node20` and must define the entrypoint `main`.
 * @default 'node20' if not specified.
 */
export const NodeRunsSchema = z
  .object({
    using: z
      .nativeEnum(NodeVersion)
      .describe('The runtime used to execute the code specified in main.'),
    main: z.string().describe('The file that contains your action code.'),
    pre: z
      .string()
      .optional()
      .describe(
        'Allows you to run a script at the start of a job, before the main: action begins'
      ),
    'pre-if': z
      .string()
      .optional()
      .describe(
        'Allows you to define conditions for the pre: action execution. The pre: action will only run if the conditions in pre-if are met. If not set, then pre-if defaults to always().'
      ),
    post: z
      .string()
      .optional()
      .describe(
        'Allows you to run a script at the end of a job, once the main: action has completed.'
      ),
    'post-if': z
      .string()
      .optional()
      .describe(
        'Allows you to define conditions for the post: action execution. The post: action will only run if the conditions in post-if are met. If not set, then post-if defaults to always().'
      )
  })
  .strict();
