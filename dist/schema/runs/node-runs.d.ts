import { z } from 'zod';
export declare const NodeVersion: z.ZodEnum<["node12", "node14", "node16", "node18", "node20"]>;
/**
 * Node action Runs Schema.
 *
 * A node action uses either `node12`, `node16`, `node20` and must define the entrypoint `main`.
 * @default 'node20' if not specified.
 */
export declare const NodeRunsSchema: z.ZodObject<{
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
}>;
