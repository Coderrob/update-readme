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

export const CompositeStepSchema = z
  .object({
    id: z.string().optional().describe('A unique identifier for the step.'),
    run: z.string().optional().describe('The command you want to run.'),
    uses: z.string().optional().describe('The path or reference to an action.'),
    name: z.string().optional().describe('The name of the composite step.'),
    shell: z.string().optional(),
    'working-directory': z
      .string()
      .optional()
      .describe('Specifies the working directory where the command is run.'),
    env: z
      .record(z.string())
      .optional()
      .describe('Sets a map of environment variables for only that step.'),
    if: z
      .string()
      .optional()
      .describe(
        'You can use the if conditional to prevent a step from running unless a condition is met. You can use any supported context and expression to create a conditional.'
      )
  })
  .strict();
