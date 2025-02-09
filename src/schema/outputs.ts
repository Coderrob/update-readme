import { z } from 'zod';
import { OutputsSchema } from './outputs.schema.js';

export type Outputs = z.infer<typeof OutputsSchema>;
