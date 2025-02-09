import { z } from 'zod';

/**
 * Input entry schema
 */
export const InputEntrySchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe('A string description of the input parameter.'),
    default: z
      .any()
      .optional()
      .describe(
        'A string representing the default value. The default value is used when an input parameter is not specified in a workflow file.'
      ),
    required: z
      .boolean()
      .optional()
      .describe(
        'A boolean to indicate whether the action requires the input parameter. Set to true when the parameter is required.'
      ),
    deprecationMessage: z
      .string()
      .optional()
      .describe(
        'If the input parameter is used, this string is logged as a warning message. You can use this warning to notify users that the input is closing down and mention any alternatives.'
      )
  })
  .strict();
