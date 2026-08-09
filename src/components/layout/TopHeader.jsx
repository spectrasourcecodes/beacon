import React from 'react';
import { Bell } from 'lucide-react';
import { formatCurrency } from '../../utils/formatter';

export const TopHeader = ({ companyName, userName, avatarLetter, balance }) => {
  return (
    <header className="bg-primary text-primary-foreground rounded-b-3xl pb-24 pt-6 px-5">
      {/* Company name – centered, bold, premium */}
      <div className="text-center mb-1">
        <span className="text-3xl font-extrabold tracking-tight drop-shadow-sm">
          {companyName || 'Beacon Profi'}
        </span>
      </div>

      {/* User greeting + notification (unchanged) */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-primary-soft text-primary flex items-center justify-center text-body-strong font-bold">
            {avatarLetter}
          </div>
          <div>
            <p className="text-sm font-medium text-white/80">Olá,</p>
            <p className="text-h3 font-bold leading-tight">{userName}</p>
          </div>
        </div>
        <button className="relative p-1.5 rounded-full hover:bg-white/10 transition-colors">
          <Bell className="h-6 w-6" strokeWidth={2} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-destructive ring-2 ring-primary" />
        </button>
      </div>

      {/* Balance – reduced font size */}
      <div className="mt-8">
        <p className="text-sm font-medium text-white/80">Saldo Total</p>
        <p className="text-2xl font-extrabold tabular-nums drop-shadow-sm">
          {formatCurrency(balance)}
        </p>
      </div>
    </header>
  );
};