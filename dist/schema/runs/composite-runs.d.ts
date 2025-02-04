import { z } from 'zod';
/**
 * Composite Action Runs Schema.
 *
 * A composite action must have a `using: "composite"` and an array of steps.
 */
export declare const CompositeRunsSchema: z.ZodObject<{
    using: z.ZodLiteral<"composite">;
    steps: z.ZodArray<z.ZodObject<{
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
    }>, "many">;
}, "strict", z.ZodTypeAny, {
    using: "composite";
    steps: {
        id?: string | undefined;
        run?: string | undefined;
        name?: string | undefined;
        shell?: string | undefined;
        'working-directory'?: string | undefined;
        env?: Record<string, string> | undefined;
        if?: string | undefined;
    }[];
}, {
    using: "composite";
    steps: {
        id?: string | undefined;
        run?: string | undefined;
        name?: string | undefined;
        shell?: string | undefined;
        'working-directory'?: string | undefined;
        env?: Record<string, string> | undefined;
        if?: string | undefined;
    }[];
}>;
