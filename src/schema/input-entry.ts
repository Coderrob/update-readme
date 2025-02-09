import { z } from 'zod';

import { InputEntrySchema } from './input-entry.schema.js';

export type InputEntry = z.infer<typeof InputEntrySchema>;
