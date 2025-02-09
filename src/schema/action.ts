import { z } from 'zod';
import { ActionSchema } from './action.schema.js';

export type Action = z.infer<typeof ActionSchema>;
