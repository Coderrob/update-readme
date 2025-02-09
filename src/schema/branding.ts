import { z } from 'zod';

import { BrandingSchema } from './branding.schema.js';

export type Branding = z.infer<typeof BrandingSchema>;
