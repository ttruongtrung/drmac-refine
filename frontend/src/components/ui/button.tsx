import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-navy dark:focus:ring-rose disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-navy text-white hover:bg-navy-light dark:bg-rose dark:text-navy dark:hover:bg-rose-light': variant === 'primary',
            'bg-white text-navy border border-navy hover:bg-gray-100 dark:bg-navy-light dark:text-rose dark:border-rose dark:hover:bg-navy': variant === 'secondary',
            'text-navy hover:bg-gray-100 dark:text-foreground dark:hover:bg-navy-light': variant === 'ghost',
          },
          'h-10 py-2 px-4',
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
