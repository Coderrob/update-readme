import { z } from 'zod';
/**
 * Output entry schema
 */
export declare const OutputEntrySchema: z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    value: z.ZodString;
}, "strict", z.ZodTypeAny, {
    value: string;
    description?: string | undefined;
}, {
    value: string;
    description?: string | undefined;
}>;
