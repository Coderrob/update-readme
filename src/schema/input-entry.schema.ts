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

/**
 * Input entry schema
 */
export const InputEntrySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe('A string description of the input parameter.'),
    default: z
      .any()
      .optional()
      .describe(
        'A string representing the default value. The default value is used when an input parameter is not specified in a workflow file.'
      ),
    required: z
      .boolean()
      .optional()
      .describe(
        'A boolean to indicate whether the action requires the input parameter. Set to true when the parameter is required.'
      ),
    deprecationMessage: z
      .string()
      .optional()
      .describe(
        'If the input parameter is used, this string is logged as a warning message. You can use this warning to notify users that the input is closing down and mention any alternatives.'
      )
  })
  .strict();
