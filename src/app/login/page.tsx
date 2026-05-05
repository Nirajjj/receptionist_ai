// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LoginFormData } from '@/types/auth';
import { useForm } from 'react-hook-form';
import { loginSchema } from '@/lib/validators/auth';
import { zodResolver } from '@hookform/resolvers/zod';

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setServerError('');

    const res = await signIn('credentials', {
      data,
      redirect: false,
    });

    if (res?.error) {
      setServerError('Invalid email or password');
      return;
    }

    router.push('/dashboard'); // ✅ correct navigation
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto mt-20 flex max-w-sm flex-col gap-4">
      <h1 className="text-xl font-bold">Login</h1>

      {/* Email */}
      <div>
        <input
          type="email"
          placeholder="Email"
          {...register('email')}
          className="w-full border p-2"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
      </div>

      {/* Password */}
      <div>
        <input
          type="password"
          placeholder="Password"
          {...register('password')}
          className="w-full border p-2"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      {/* Server Error */}
      {serverError && <p className="text-sm text-red-500">{serverError}</p>}

      {/* Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-black p-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
