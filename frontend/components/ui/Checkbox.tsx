/**
 * Checkbox Component
 *
 * Accessible checkbox input with label support.
 * Constitution v1.2.0 Compliance: Accessibility (keyboard navigable, ARIA labels)
 */

'use client';

import { forwardRef, InputHTMLAttributes } from 'react';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Checkbox label */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text */
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    // Generate unique ID if not provided
    const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <input
            ref={ref}
            type="checkbox"
            id={checkboxId}
            className={`
              h-4 w-4 rounded border-gray-300 text-blue-600
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              disabled:cursor-not-allowed disabled:opacity-50
              ${error ? 'border-red-500' : ''}
              ${className}
            `}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${checkboxId}-error` : helperText ? `${checkboxId}-helper` : undefined
            }
            {...props}
          />
          {label && (
            <label
              htmlFor={checkboxId}
              className={`
                text-sm font-medium text-gray-700
                cursor-pointer select-none
                ${props.disabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {label}
            </label>
          )}
        </div>

        {helperText && !error && (
          <p id={`${checkboxId}-helper`} className="text-xs text-gray-500 ml-6">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${checkboxId}-error`} className="text-xs text-red-600 ml-6" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
