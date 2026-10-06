import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils/common';

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl font-bold transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ink-900 focus-visible:ring-offset-white dark:focus-visible:ring-white dark:focus-visible:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'bg-brand-500 text-ink-900 hover:bg-brand-400',
        secondary:
          'bg-ink-900 text-white hover:bg-ink-800 dark:bg-white dark:text-ink-900 dark:hover:bg-stone-200',
        outline:
          'border border-stone-300 bg-white text-ink-900 hover:border-ink-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:hover:border-white',
        ghost:
          'text-ink-900 hover:bg-stone-100 dark:text-gray-300 dark:hover:bg-gray-800',
        link:
          'text-brand-800 underline-offset-4 hover:underline dark:text-brand-300',
        destructive: 'bg-red-600 text-white hover:bg-red-700',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-base',
        icon: 'h-11 w-11',
      },
      fullWidth: {
        true: 'w-full',
        false: 'w-auto',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, fullWidth, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="md:animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };
