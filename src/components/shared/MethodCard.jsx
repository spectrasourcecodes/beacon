import React from 'react';
import { clsx } from 'clsx';


export const MethodCard = ({
  icon: Icon,
  title,
  subtitle,
  iconBg = 'bg-primary-soft',
  iconColor = 'text-primary',
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 p-4 card hover:shadow-lg transition-all text-left"
    >
      <div className={clsx('h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0', iconBg)}>
        <Icon className={clsx('h-7 w-7', iconColor)} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-h3 font-bold">{title}</p>
        <p className="text-label text-muted-foreground truncate">{subtitle}</p>
      </div>
    </button>
  );
};