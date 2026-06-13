import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { encryptData } from '../utils/crypto';
import { setToken } from '../utils/auth';
import api from '../services/api';
import type { LoginCredentials } from '../services/studentService';
import PasswordInput from './PasswordInput';
import {
  emailValidationRules,
  passwordValidationRules,
} from '../utils/validation';

const inputClass = (hasError: boolean) =>
  [
    'block w-full rounded-lg border px-3.5 py-2.5 text-sm shadow-sm transition',
    hasError
      ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500',
  ].join(' ');

const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ??
      error.message ??
      'Login failed. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

function LoginForm() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginCredentials) => {
    setSubmitError(null);

    try {
      const response = await api.post<{ success: boolean; token: string }>(
        '/login',
        {
          email: encryptData(data.email),
          password: encryptData(data.password),
        },
      );

      const token = response.data.token;

      if (!token) {
        throw new Error('No authentication token received.');
      }

      setToken(token);
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error));
    }
  };

  return (
    <div className="mx-auto w-full max-w-md px-4 py-6 sm:px-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Student Login
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Sign in with your registered email and password.
        </p>

        {submitError && (
          <div
            className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {submitError}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-5"
        >
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className={inputClass(!!errors.email)}
              {...register('email', emailValidationRules)}
            />
            {errors.email && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <PasswordInput
              id="password"
              autoComplete="current-password"
              hasError={!!errors.password}
              {...register('password', passwordValidationRules)}
            />
            {errors.password && (
              <p className="mt-1.5 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginForm;
