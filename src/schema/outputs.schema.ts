import { z } from 'zod';
import { OutputEntrySchema } from './output-entry.schema.js';
import { validKeyRegex } from './constants.js';

const message = `Every output key must match the pattern ${validKeyRegex.source}`;

/**
 * Outputs schema: a record whose keys match the validKeyRegex.
 */
export const OutputsSchema = z
  .record(OutputEntrySchema)
  .refine(
    (outputs) => Object.keys(outputs).every((key) => validKeyRegex.test(key)),
    { message }
  );
