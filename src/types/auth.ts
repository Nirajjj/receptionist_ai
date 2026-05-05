import { loginSchema } from '@/lib/validators/auth';
import { z } from 'zod';

export type LoginFormData = z.infer<typeof loginSchema>;
