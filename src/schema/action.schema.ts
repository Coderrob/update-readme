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
import { CompositeRun } from '../types/index.js';
import { BrandingSchema } from './branding.schema.js';
import { InputsSchema } from './inputs.schema.js';
import { OutputsSchema } from './outputs.schema.js';
import { RunsSchema } from './runs.schema.js';

export type Action = z.infer<typeof ActionSchema>;

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
    runs: RunsSchema.describe(
      'The method of running the action. This can be a Node version, a composite, or a Docker container.'
    )
  })
  .superRefine((schema, ctx) => {
    const { runs, outputs } = schema;
    const { using } = runs;
    if (using === CompositeRun && !!outputs) {
      Object.entries(outputs).forEach(([key, { value }]) => {
        if (value) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `For 'composite', each output key must contain a 'value' field. Missing value for output key '${key}'`,
            path: ['outputs']
          });
        }
      });
    }
  });
