import { z } from 'zod';
import { CompositeStepSchema } from './composite-step.schema.js';

export type CompositeStep = z.infer<typeof CompositeStepSchema>;
