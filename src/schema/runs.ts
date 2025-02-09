import { z } from 'zod';
import { RunsSchema } from './runs.schema.js';

export type Runs = z.infer<typeof RunsSchema>;
