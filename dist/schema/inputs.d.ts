import { z } from 'zod';
/**
 * Inputs schema: a record whose keys match the validKeyRegex.
 */
export declare const InputsSchema: z.ZodEffects<z.ZodRecord<z.ZodString, z.ZodObject<{
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
}>>, Record<string, {
    default?: any;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecationMessage?: string | undefined;
}>, Record<string, {
    default?: any;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecationMessage?: string | undefined;
}>>;
