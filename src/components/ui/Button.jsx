import React from 'react';
import { cva } from 'class-variance-authority';
import { clsx } from 'clsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-2xl text-button font-semibold transition-all duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-primary-foreground hover:brightness-95 active:brightness-90',
        outline: 'bg-card text-foreground border border-border hover:bg-muted',
        ghost: 'bg-transparent text-foreground hover:bg-muted/50',
        whatsapp: 'bg-whatsapp text-white hover:brightness-95',
        telegram: 'bg-info text-white hover:brightness-95',
        fab: 'bg-primary text-primary-foreground shadow-fab hover:shadow-lg active:scale-[0.94]',
      },
      size: {
        default: 'h-14 px-6 py-3.5',
        sm: 'h-10 px-4 py-2 text-sm',
        icon: 'h-14 w-14 p-0',
        fab: 'h-14 w-14 rounded-full p-0',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export const Button = ({
  variant,
  size,
  fullWidth,
  className,
  children,
  loading,
  disabled,
  icon,
  ...props
}) => {
  const loadingText = typeof children === 'string' ? 'Processando...' : 'Carregando...';
  return (
    <button
      className={clsx(buttonVariants({ variant, size, fullWidth, className }))}
      disabled={disabled || loading}
      {...props}
    >
      {!loading && icon && <span className="flex-shrink-0">{icon}</span>}
      {loading ? loadingText : children}
    </button>
  );
};