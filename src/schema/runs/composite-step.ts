import { z } from 'zod';

export const CompositeStepSchema = z
  .object({
    id: z.string().optional().describe('A unique identifier for the step.'),
    run: z.string().optional().describe('The command you want to run.'),
    name: z.string().optional().describe('The name of the composite step.'),
    shell: z.string().optional(),
    'working-directory': z
      .string()
      .optional()
      .describe('Specifies the working directory where the command is run.'),
    env: z
      .record(z.string())
      .optional()
      .describe('Sets a map of environment variables for only that step.'),
    if: z
      .string()
      .optional()
      .describe(
        'You can use the if conditional to prevent a step from running unless a condition is met. You can use any supported context and expression to create a conditional.'
      )
  })
  .strict();
