import { z } from 'zod';
/**
 * Docker action Runs Schema.
 *
 * A docker action requires a `dockerfile` and a `using: "docker"`.
 */
export declare const DockerRunsSchema: z.ZodObject<{
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
}>;
