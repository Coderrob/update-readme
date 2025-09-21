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

import { CompositeRun } from '../../types.js';
import { CompositeStepSchema } from './composite-step.schema.js';

/**
 * Composite Action Runs Schema.
 *
 * A composite action must have a `using: "composite"` and an array of steps.
 */
export const CompositeRunsSchema = z
  .object({
    using: z.literal(CompositeRun),
    steps: z
      .array(CompositeStepSchema)
      .describe(
        'The steps that you plan to run in this action. These can be either run steps or uses steps.'
      )
  })
  .strict();
