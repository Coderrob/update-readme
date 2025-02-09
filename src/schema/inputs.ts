import { z } from 'zod';

import { InputsSchema } from './inputs.schema.js';

export type Inputs = z.infer<typeof InputsSchema>;
