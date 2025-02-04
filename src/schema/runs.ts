import { z } from 'zod';
import { CompositeRunsSchema } from './runs/composite-runs.js';
import { DockerRunsSchema } from './runs/docker-runs.js';
import { NodeRunsSchema } from './runs/node-runs.js';

/**
 * Runs schema as a discriminated union using the `using` field.
 */
export const RunsSchema = z.discriminatedUnion('using', [
  CompositeRunsSchema,
  NodeRunsSchema,
  DockerRunsSchema
]);
