import { z } from 'zod';
import { CompositeRunsSchema } from './composite-runs.schema.js';

export type CompositeRuns = z.infer<typeof CompositeRunsSchema>;
