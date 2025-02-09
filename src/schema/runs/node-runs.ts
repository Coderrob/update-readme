import { z } from 'zod';

import { NodeRunsSchema } from './node-runs.schema.js';

export type NodeRuns = z.infer<typeof NodeRunsSchema>;
