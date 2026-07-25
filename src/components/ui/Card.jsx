import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ className, children, hoverable = false }) => {
  return (
    <div
      className={clsx(
        'bg-card rounded-2xl shadow-md p-4',
        hoverable && 'hover:shadow-lg transition-shadow duration-200',
        className
      )}
    >
      {children}
    </div>
  );
};