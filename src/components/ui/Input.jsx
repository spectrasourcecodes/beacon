import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Eye, EyeOff } from 'lucide-react';
import CurrencyInput from 'react-currency-input-field';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

export const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  className,
  required,
  id,
  name, // receive name prop
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  // PIN input: dot mask and numeric keyboard
  if (type === 'pin') {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <input
          id={id}
          name={name}
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          className={clsx(
            'input-base text-center tracking-[0.6em] font-mono',
            error && 'border-destructive focus:border-destructive focus:shadow-destructive/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-small text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // Currency input (R$)
  if (type === 'currency') {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <CurrencyInput
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onValueChange={(value) => onChange({ target: { value, name } })}
          onBlur={onBlur}
          prefix="R$ "
          decimalSeparator=","
          groupSeparator="."
          className={clsx(
            'input-base',
            error && 'border-destructive focus:border-destructive focus:shadow-destructive/20',
            className
          )}
          {...props}
        />
        {error && <p className="text-small text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // Phone input with mask (Brazil)
  if (type === 'phone') {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <PhoneInput
          country={'br'}
          value={value}
          onChange={(phone) => onChange({ target: { value: phone, name } })}
          onBlur={onBlur}
          inputClass={clsx(
            'input-base !pl-12',
            error && 'border-destructive focus:border-destructive focus:shadow-destructive/20'
          )}
          containerClass="w-full"
          buttonClass="!rounded-l-xl"
          {...props}
        />
        {error && <p className="text-small text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // Password with toggle
  if (type === 'password') {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="text-label text-foreground">
            {label} {required && <span className="text-destructive">*</span>}
          </label>
        )}
        <div className="relative">
          <input
            id={id}
            name={name}
            type={showPassword ? 'text' : 'password'}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
            className={clsx(
              'input-base pr-12',
              error && 'border-destructive focus:border-destructive focus:shadow-destructive/20',
              className
            )}
            {...props}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && <p className="text-small text-destructive mt-1">{error}</p>}
      </div>
    );
  }

  // Default text input
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="text-label text-foreground">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx(
          'input-base',
          error && 'border-destructive focus:border-destructive focus:shadow-destructive/20',
          className
        )}
        {...props}
      />
      {error && <p className="text-small text-destructive mt-1">{error}</p>}
    </div>
  );
};