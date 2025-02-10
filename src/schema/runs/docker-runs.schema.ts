/*
 *
 * Copyright 2025 Robert Lindley
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { z } from 'zod';

/**
 * Docker action Runs Schema.
 *
 * A docker action requires a `dockerfile` and a `using: "docker"`.
 */

export const DockerRunsSchema = z
  .object({
    'pre-entrypoint': z
      .string()
      .optional()
      .describe(
        'Allows you to run a script before the entrypoint action begins. For example, you can use pre-entrypoint: to run a prerequisite setup script.'
      ),
    using: z.literal('docker'),
    image: z
      .string()
      .describe(
        'The Docker image to use as the container to run the action. The value can be the Docker base image name, a local Dockerfile in your repository, or a public image in Docker Hub or another registry'
      ),
    entrypoint: z
      .string()
      .optional()
      .describe(
        'Overrides the Docker ENTRYPOINT in the Dockerfile, or sets it if one was not already specified.'
      ),
    'post-entrypoint': z
      .string()
      .optional()
      .describe(
        'Allows you to run a script after the entrypoint action completes.'
      ),
    args: z
      .array(z.string())
      .optional()
      .describe(
        'An array of strings that define the inputs for a Docker container. Inputs can include hardcoded strings. GitHub passes the args to the container ENTRYPOINT when the container starts up.'
      ),
    env: z
      .record(z.string(), z.string())
      .optional()
      .describe(
        'Specifies a key/value map of environment variables to set in the container environment.'
      )
  })
  .strict();
