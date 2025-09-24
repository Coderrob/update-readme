/*
 *
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { z } from 'zod';
import { requiredString } from './required.schema.js';
import { NodeVersion } from '../types/index.js';

export type NodeRuns = z.infer<typeof NodeRunsSchema>;

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
    main: requiredString(
      'Main file for Node.js actions. This is required for Node.js actions.'
    ).describe('The file that contains your action code.'),
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
