import { z } from 'zod';
/**
 * Outputs schema: a record whose keys match the validKeyRegex.
 */
export declare const OutputsSchema: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodObject<{
    description: z.ZodOptional<z.ZodString>;
    value: z.ZodString;
}, "strict", z.ZodTypeAny, {
    value: string;
    description?: string | undefined;
}, {
    value: string;
    description?: string | undefined;
}>>, Record<string, {
    value: string;
    description?: string | undefined;
}>, Record<string, {
    value: string;
    description?: string | undefined;
}>>;
