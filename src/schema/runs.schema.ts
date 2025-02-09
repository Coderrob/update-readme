import { z } from 'zod';
import { CompositeRunsSchema } from './runs/composite-runs.schema.js';
import { DockerRunsSchema } from './runs/docker-runs.schema.js';
import { NodeRunsSchema } from './runs/node-runs.schema.js';

/**
 * Runs schema as a discriminated union using the `using` field.
 */
export const RunsSchema = z.discriminatedUnion('using', [
  CompositeRunsSchema,
  NodeRunsSchema,
  DockerRunsSchema
]);
