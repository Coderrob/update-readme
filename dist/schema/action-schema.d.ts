import { z } from 'zod';
export declare const InputsSchema: z.ZodObject<{
    required: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    default: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    deprecationMessage: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    required: boolean;
    default?: string | undefined;
    description?: string | undefined;
    deprecationMessage?: string | undefined;
}, {
    default?: string | undefined;
    description?: string | undefined;
    required?: boolean | undefined;
    deprecationMessage?: string | undefined;
}>;
export declare const ActionSchema: z.ZodObject<{
    username: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
}, {
    username: string;
}>;
