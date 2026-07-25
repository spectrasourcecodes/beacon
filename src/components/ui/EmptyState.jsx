import React from 'react';
import { clsx } from 'clsx';

export const EmptyState = ({ icon, message, subMessage, className }) => {
  return (
    <div className={clsx('card flex flex-col items-center justify-center py-8 text-center', className)}>
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <p className="text-body font-medium text-foreground">{message}</p>
      {subMessage && <p className="text-small text-muted-foreground mt-1">{subMessage}</p>}
    </div>
  );
};