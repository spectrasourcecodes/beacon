import React from 'react';
import { clsx } from 'clsx';

export const IconPill = ({
  icon: Icon,
  bg = 'bg-primary-soft',
  iconColor = 'text-primary',
  size = 'lg',
}) => {
  const sizeClass = size === 'lg' ? 'h-16 w-16' : 'h-12 w-12';
  const iconSize = size === 'lg' ? 'h-7 w-7' : 'h-5 w-5';

  return (
    <div className={clsx('rounded-2xl flex items-center justify-center', bg, sizeClass)}>
      <Icon className={clsx(iconColor, iconSize)} strokeWidth={2} />
    </div>
  );
};