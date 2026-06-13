export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'] as const;

export const COURSE_OPTIONS = [
  'Computer Science',
  'Information Technology',
  'Electronics',
  'Mechanical Engineering',
  'Business Administration',
  'Data Science',
] as const;

export const passwordValidationRules = {
  required: 'Password is required',
  minLength: {
    value: 8,
    message: 'Password must be at least 8 characters',
  },
  pattern: {
    value: PASSWORD_PATTERN,
    message: 'Password must include uppercase, lowercase, and a number',
  },
} as const;

export const fullNameValidationRules = {
  required: 'Full name is required',
  minLength: {
    value: 2,
    message: 'Full name must be at least 2 characters',
  },
  maxLength: {
    value: 100,
    message: 'Full name must not exceed 100 characters',
  },
} as const;

export const emailValidationRules = {
  required: 'Email is required',
  pattern: {
    value: EMAIL_PATTERN,
    message: 'Enter a valid email address',
  },
} as const;

export const addressValidationRules = {
  required: 'Address is required',
  minLength: {
    value: 5,
    message: 'Address must be at least 5 characters',
  },
  maxLength: {
    value: 300,
    message: 'Address must not exceed 300 characters',
  },
} as const;

export const dateOfBirthValidationRules = {
  required: 'Date of birth is required',
  validate: (value: string) => {
    const dob = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (Number.isNaN(dob.getTime())) {
      return 'Enter a valid date';
    }

    if (dob >= today) {
      return 'Date of birth must be in the past';
    }

    return true;
  },
} as const;

export const genderValidationRules = {
  required: 'Please select a gender',
  validate: (value: string) =>
    GENDER_OPTIONS.includes(value as (typeof GENDER_OPTIONS)[number]) ||
    'Please select a valid gender',
} as const;

export const courseValidationRules = {
  required: 'Please select a course',
  validate: (value: string) =>
    COURSE_OPTIONS.includes(value as (typeof COURSE_OPTIONS)[number]) ||
    'Please select a valid course',
} as const;
