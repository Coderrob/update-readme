import { z } from 'zod';
/**
 * Input entry schema
 */
export declare const InputEntrySchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    default: z.ZodOptional<z.ZodAny>;
    required: z.ZodOptional<z.ZodBoolean>;
    deprecationMessage: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    default?: any;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecationMessage?: string | undefined;
}, {
    default?: any;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecationMessage?: string | undefined;
}>;
