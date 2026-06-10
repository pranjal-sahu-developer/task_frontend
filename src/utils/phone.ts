export const PHONE_COUNTRY_CODE = '+91';

export const formatPhoneNumber = (digits: string): string =>
  `${PHONE_COUNTRY_CODE}${digits.replace(/\D/g, '')}`;

export const parsePhoneDigits = (phoneNumber: string): string => {
  const cleaned = phoneNumber.replace(/\D/g, '');

  if (cleaned.length === 12 && cleaned.startsWith('91')) {
    return cleaned.slice(2);
  }

  if (cleaned.length >= 10) {
    return cleaned.slice(-10);
  }

  return cleaned;
};

export const phoneValidationRules = {
  required: 'Phone number is required',
  pattern: {
    value: /^\d{10}$/,
    message: 'Phone number must be exactly 10 digits',
  },
} as const;
