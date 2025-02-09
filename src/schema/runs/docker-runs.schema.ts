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
