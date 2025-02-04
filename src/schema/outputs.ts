import { z } from 'zod';
import { OutputEntrySchema } from './output-entry.js';
import { validKeyRegex } from './constants.js';

/**
 * Outputs schema: a record whose keys match the validKeyRegex.
 */
export const OutputsSchema = z
  .record(OutputEntrySchema)
  .refine(
    (outputs) => Object.keys(outputs).every((key) => validKeyRegex.test(key)),
    {
      message: `Every output key must match the pattern ${validKeyRegex.source}`
    }
  );
