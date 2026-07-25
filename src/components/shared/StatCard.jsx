import React from 'react';
import { clsx } from 'clsx';
import { formatCurrency } from '../../utils/formatter';

export const StatCard = ({ label, value, className }) => {
  return (
    <div className={clsx('card p-4 flex-1', className)}>
      <p className="text-label text-muted-foreground">{label}</p>
      <p className="text-h2 font-bold text-primary tabular-nums">{formatCurrency(value)}</p>
    </div>
  );
};