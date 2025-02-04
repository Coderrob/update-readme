import { z } from 'zod';
/**
 * Runs schema as a discriminated union using the `using` field.
 */
export declare const RunsSchema: z.ZodDiscriminatedUnion<"using", [z.ZodObject<{
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
}>, z.ZodObject<{
    using: z.ZodEnum<["node12", "node14", "node16", "node18", "node20"]>;
    main: z.ZodString;
    pre: z.ZodOptional<z.ZodString>;
    'pre-if': z.ZodOptional<z.ZodString>;
    post: z.ZodOptional<z.ZodString>;
    'post-if': z.ZodOptional<z.ZodString>;
}, "strict", z.ZodTypeAny, {
    using: "node12" | "node14" | "node16" | "node18" | "node20";
    main: string;
    pre?: string | undefined;
    'pre-if'?: string | undefined;
    post?: string | undefined;
    'post-if'?: string | undefined;
}, {
    using: "node12" | "node14" | "node16" | "node18" | "node20";
    main: string;
    pre?: string | undefined;
    'pre-if'?: string | undefined;
    post?: string | undefined;
    'post-if'?: string | undefined;
}>, z.ZodObject<{
    'pre-entrypoint': z.ZodOptional<z.ZodString>;
    using: z.ZodLiteral<"docker">;
    image: z.ZodString;
    entrypoint: z.ZodOptional<z.ZodString>;
    'post-entrypoint': z.ZodOptional<z.ZodString>;
    args: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    env: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
}, "strict", z.ZodTypeAny, {
    using: "docker";
    image: string;
    env?: Record<string, string> | undefined;
    'pre-entrypoint'?: string | undefined;
    entrypoint?: string | undefined;
    'post-entrypoint'?: string | undefined;
    args?: string[] | undefined;
}, {
    using: "docker";
    image: string;
    env?: Record<string, string> | undefined;
    'pre-entrypoint'?: string | undefined;
    entrypoint?: string | undefined;
    'post-entrypoint'?: string | undefined;
    args?: string[] | undefined;
}>]>;
