import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import axios from 'axios';
import api from '../services/api';
import {
  encryptStudentPayload,
  type StudentFormData,
} from '../services/studentService';
import PasswordInput from './PasswordInput';
import PhoneInput from './PhoneInput';
import { formatPhoneNumber, phoneValidationRules } from '../utils/phone';
import {
  addressValidationRules,
  courseValidationRules,
  COURSE_OPTIONS,
  dateOfBirthValidationRules,
  emailValidationRules,
  fullNameValidationRules,
  genderValidationRules,
  GENDER_OPTIONS,
  passwordValidationRules,
} from '../utils/validation';

const defaultValues: StudentFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  courseEnrolled: '',
  password: '',
};

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
      'Registration failed. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
};

function StudentForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentFormData>({ defaultValues });

  const onSubmit = async (data: StudentFormData) => {
    setSubmitStatus(null);

    try {
      const encryptedPayload = encryptStudentPayload({
        ...data,
        phoneNumber: formatPhoneNumber(data.phoneNumber),
      });

      await api.post('/register', encryptedPayload);

      setSubmitStatus({
        type: 'success',
        message: 'Student registered successfully!',
      });
      reset(defaultValues);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: getErrorMessage(error),
      });
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6">
      <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-gray-200 sm:p-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Student Registration
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in your details below. 
        </p>

        {submitStatus && (
          <div
            className={`mt-6 rounded-lg border px-4 py-3 text-sm ${
              submitStatus.type === 'success'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-red-200 bg-red-50 text-red-800'
            }`}
            role="alert"
          >
            {submitStatus.message}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="mt-6 space-y-6"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                autoComplete="name"
                className={inputClass(!!errors.fullName)}
                {...register('fullName', fullNameValidationRules)}
              />
              {errors.fullName && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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
                htmlFor="phoneNumber"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <PhoneInput
                id="phoneNumber"
                autoComplete="tel"
                hasError={!!errors.phoneNumber}
                {...register('phoneNumber', phoneValidationRules)}
              />
              {errors.phoneNumber && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.phoneNumber.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateOfBirth"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Date Of Birth
              </label>
              <input
                id="dateOfBirth"
                type="date"
                className={inputClass(!!errors.dateOfBirth)}
                {...register('dateOfBirth', dateOfBirthValidationRules)}
              />
              {errors.dateOfBirth && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.dateOfBirth.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="gender"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Gender
              </label>
              <select
                id="gender"
                className={inputClass(!!errors.gender)}
                {...register('gender', genderValidationRules)}
              >
                <option value="" disabled>
                  Select gender
                </option>
                {GENDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.gender && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.gender.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="courseEnrolled"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Course Enrolled
              </label>
              <select
                id="courseEnrolled"
                className={inputClass(!!errors.courseEnrolled)}
                {...register('courseEnrolled', courseValidationRules)}
              >
                <option value="" disabled>
                  Select course
                </option>
                {COURSE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.courseEnrolled && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.courseEnrolled.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="address"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <textarea
                id="address"
                rows={3}
                autoComplete="street-address"
                className={inputClass(!!errors.address)}
                {...register('address', addressValidationRules)}
              />
              {errors.address && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.address.message}
                </p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                hasError={!!errors.password}
                {...register('password', passwordValidationRules)}
              />
              {errors.password && (
                <p className="mt-1.5 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Registering...' : 'Register Student'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default StudentForm;
