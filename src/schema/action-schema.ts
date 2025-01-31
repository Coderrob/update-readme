import { z } from 'zod';

export const InputsSchema = z.object({
  required: z
    .boolean()
    .optional()
    .default(false)
    .describe(
      'A boolean to indicate whether the action requires the input parameter. Set to `true` when the parameter is required.'
    ),
  default: z
    .string()
    .optional()
    .describe(
      "A string representing the default value. The default value is used when an input parameter isn't specified in a workflow file."
    ),
  description: z
    .string()
    .optional()
    .describe('A string description of the input parameter.'),
  deprecationMessage: z
    .string()
    .optional()
    .describe('A string shown to users using the deprecated input.')
});

export const ActionSchema = z.object({
  username: z.string()
});
