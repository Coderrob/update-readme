import { z } from 'zod';

import { DockerRunsSchema } from './docker-runs.schema.js';

export type DockerRuns = z.infer<typeof DockerRunsSchema>;
