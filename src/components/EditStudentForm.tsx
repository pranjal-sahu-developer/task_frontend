import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import api from '../services/api';
import {
  decryptStudentPayload,
  encryptStudentUpdatePayload,
  type EncryptedStudent,
  type StudentUpdateFormData,
} from '../services/studentService';
import PhoneInput from './PhoneInput';
import {
  formatPhoneNumber,
  parsePhoneDigits,
  phoneValidationRules,
} from '../utils/phone';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

const COURSE_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical Engineering',
  'Business Administration',
  'Data Science',
] as const;

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
      'Update failed. Please try again.'
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
};

const toFormValues = (
  decrypted: ReturnType<typeof decryptStudentPayload>,
): StudentUpdateFormData => ({
  fullName: decrypted.fullName,
  email: decrypted.email,
  phoneNumber: parsePhoneDigits(decrypted.phoneNumber),
  dateOfBirth: decrypted.dateOfBirth,
  gender: decrypted.gender,
  address: decrypted.address,
  courseEnrolled: decrypted.courseEnrolled,
});

interface EditStudentFormProps {
  encryptedStudent: EncryptedStudent;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

function EditStudentForm({
  encryptedStudent,
  onClose,
  onSuccess,
  onError,
}: EditStudentFormProps) {
  const [isDecrypting, setIsDecrypting] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentUpdateFormData>();

  useEffect(() => {
    setIsDecrypting(true);

    try {
      const decrypted = decryptStudentPayload(encryptedStudent);
      reset(toFormValues(decrypted));
    } catch (error) {
      onError(getErrorMessage(error));
      onClose();
    } finally {
      setIsDecrypting(false);
    }
  }, [encryptedStudent, onClose, onError, reset]);

  const onSubmit = async (data: StudentUpdateFormData) => {
    try {
      const encryptedPayload = encryptStudentUpdatePayload({
        ...data,
        phoneNumber: formatPhoneNumber(data.phoneNumber),
      });

      await api.put(`/student/${encryptedStudent._id}`, encryptedPayload);

      onSuccess('Student updated successfully.');
      onClose();
    } catch (error) {
      onError(getErrorMessage(error));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Edit Student</h3>
            <p className="mt-1 text-sm text-gray-500">
              Values are decrypted for editing and re-encrypted on save.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close edit form"
          >
            ✕
          </button>
        </div>

        {isDecrypting ? (
          <p className="mt-8 text-center text-sm text-gray-500">
            Decrypting student data...
          </p>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="mt-6 space-y-5"
          >
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="edit-fullName"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="edit-fullName"
                  type="text"
                  className={inputClass(!!errors.fullName)}
                  {...register('fullName', {
                    required: 'Full name is required',
                    minLength: {
                      value: 2,
                      message: 'Full name must be at least 2 characters',
                    },
                  })}
                />
                {errors.fullName && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-email"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="edit-email"
                  type="email"
                  className={inputClass(!!errors.email)}
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: EMAIL_PATTERN,
                      message: 'Enter a valid email address',
                    },
                  })}
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-phoneNumber"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <PhoneInput
                  id="edit-phoneNumber"
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
                  htmlFor="edit-dateOfBirth"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Date Of Birth
                </label>
                <input
                  id="edit-dateOfBirth"
                  type="date"
                  className={inputClass(!!errors.dateOfBirth)}
                  {...register('dateOfBirth', {
                    required: 'Date of birth is required',
                  })}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="edit-gender"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <select
                  id="edit-gender"
                  className={inputClass(!!errors.gender)}
                  {...register('gender', { required: 'Please select gender' })}
                >
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
                  htmlFor="edit-courseEnrolled"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Course Enrolled
                </label>
                <select
                  id="edit-courseEnrolled"
                  className={inputClass(!!errors.courseEnrolled)}
                  {...register('courseEnrolled', {
                    required: 'Please select a course',
                  })}
                >
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
                  htmlFor="edit-address"
                  className="mb-1.5 block text-sm font-medium text-gray-700"
                >
                  Address
                </label>
                <textarea
                  id="edit-address"
                  rows={3}
                  className={inputClass(!!errors.address)}
                  {...register('address', {
                    required: 'Address is required',
                    minLength: {
                      value: 5,
                      message: 'Address must be at least 5 characters',
                    },
                  })}
                />
                {errors.address && (
                  <p className="mt-1.5 text-sm text-red-600">
                    {errors.address.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditStudentForm;
