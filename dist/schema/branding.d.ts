import { z } from 'zod';
/**
 * Branding Schema
 */
export declare const BrandingSchema: z.ZodObject<{
    color: z.ZodString;
    icon: z.ZodString;
}, "strict", z.ZodTypeAny, {
    color: string;
    icon: string;
}, {
    color: string;
    icon: string;
}>;
