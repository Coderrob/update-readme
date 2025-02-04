import { z } from 'zod';
export declare const CompositeStepSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodString>;
    run: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    shell: z.ZodOptional<z.ZodString>;
    'working-directory': z.ZodOptional<z.ZodString>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    if: z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    id?: string | undefined;
    run?: string | undefined;
    name?: string | undefined;
    shell?: string | undefined;
    'working-directory'?: string | undefined;
    env?: Record<string, string> | undefined;
    if?: string | undefined;
}, {
    id?: string | undefined;
    run?: string | undefined;
    name?: string | undefined;
    shell?: string | undefined;
    'working-directory'?: string | undefined;
    env?: Record<string, string> | undefined;
    if?: string | undefined;
}>;
