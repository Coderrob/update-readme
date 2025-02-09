import { z } from 'zod';
import { OutputEntrySchema } from './output-entry.schema.js';

export type OutputEntry = z.infer<typeof OutputEntrySchema>;
