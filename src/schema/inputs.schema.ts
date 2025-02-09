import { z } from 'zod';

import { validKeyRegex } from './constants.js';
import { InputEntrySchema } from './input-entry.schema.js';

/**
 * Inputs schema: a record whose keys match the validKeyRegex.
 */
export const InputsSchema = z
  .record(InputEntrySchema)
  .refine(
    (inputs) => Object.keys(inputs).every((key) => validKeyRegex.test(key)),
    {
      message:
        'Every input key must match the pattern /^[a-zA-Z][a-zA-Z0-9_-]*$/'
    }
  );
