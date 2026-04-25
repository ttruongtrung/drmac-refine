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
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-gold disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-black text-white hover:bg-gray-800 dark:bg-gold dark:text-charcoal dark:hover:bg-gold-light': variant === 'primary',
            'bg-white text-black border border-black hover:bg-gray-100 dark:bg-charcoal-light dark:text-gold dark:border-gold dark:hover:bg-charcoal': variant === 'secondary',
            'text-gray-900 hover:bg-gray-200 dark:text-foreground dark:hover:bg-charcoal-light': variant === 'ghost',
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
