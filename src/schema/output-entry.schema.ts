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

export type OutputEntry = z.infer<typeof OutputEntrySchema>;

/**
 * Output entry schema
 */
export const OutputEntrySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe('A string description of the output parameter.'),
    value: z
      .string()
      .optional()
      .describe(
        'The value that the output parameter will be mapped to. You can set this to a string or an expression with context.'
      )
  })
  .strict();
