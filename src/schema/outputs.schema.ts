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
import { validKeyRegex } from '../utils/constants.js';
import { OutputEntrySchema } from './output-entry.schema.js';

const message = `Every output key must match the pattern ${validKeyRegex.source}`;

export type Outputs = z.infer<typeof OutputsSchema>;

/**
 * Outputs schema: a record whose keys match the validKeyRegex.
 */
export const OutputsSchema = z
  .record(OutputEntrySchema)
  .refine(
    (outputs) => Object.keys(outputs).every((key) => validKeyRegex.test(key)),
    { message }
  );
