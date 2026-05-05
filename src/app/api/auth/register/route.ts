import { prisma } from '@/lib/prisma';
import { success, z, ZodFlattenedError } from 'zod';
import bcrypt from 'bcrypt';
import { AppError } from '@/lib/errors/AppError';
import { asyncHandler } from '@/lib/utils/asyncHandler';

export const registerSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
});
type RegisterBody = z.infer<typeof registerSchema>;
export const POST = asyncHandler(async (req: Request) => {
  const body = await req.json();

  const validBody = registerSchema.safeParse(body);

  if (!validBody.success) {
    const errors = z.flattenError(validBody.error);
    throw new AppError({
      message: 'Validation failed',
      statusCode: 400,
      code: 'VALIDATION_ERROR',
      details: errors.fieldErrors,
    });
  }

  const { email, password } = validBody.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (user) {
    throw new AppError({
      message: 'User already exists, please login',
      statusCode: 400,
      code: 'USER_ALREADY_EXISTS',
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });
  const safeUser = {
    id: newUser.id,
    email: newUser.email,
    createdAt: newUser.createdAt,
  };
  return Response.json({ success: true, data: safeUser }, { status: 201 });
});
