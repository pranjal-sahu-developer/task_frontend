import { forwardRef } from 'react';
import { PHONE_COUNTRY_CODE } from '../utils/phone';

const prefixClass = (hasError: boolean) =>
  [
    'inline-flex items-center rounded-l-lg border border-r-0 px-3.5 py-2.5 text-sm font-medium shadow-sm',
    hasError
      ? 'border-red-500 bg-red-50 text-red-900'
      : 'border-gray-300 bg-gray-50 text-gray-600',
  ].join(' ');

const inputClass = (hasError: boolean) =>
  [
    'block w-full rounded-r-lg border px-3.5 py-2.5 text-sm shadow-sm transition',
    hasError
      ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-300 bg-white text-gray-900 focus:border-indigo-500 focus:ring-indigo-500',
  ].join(' ');

type PhoneInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
};

const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ hasError = false, className, onChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      event.target.value = event.target.value.replace(/\D/g, '').slice(0, 10);
      onChange?.(event);
    };

    return (
      <div className="flex">
        <span className={prefixClass(hasError)}>{PHONE_COUNTRY_CODE}</span>
        <input
          ref={ref}
          type="tel"
          inputMode="numeric"
          maxLength={10}
          placeholder="9876543210"
          onChange={handleChange}
          className={[inputClass(hasError), className].filter(Boolean).join(' ')}
          {...props}
        />
      </div>
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

export default PhoneInput;
