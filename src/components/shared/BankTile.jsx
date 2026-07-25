import React from 'react';
import { clsx } from 'clsx';

export const BankTile = ({ code, name, color, letter, selected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(code)}
      className={clsx(
        'flex flex-col items-center gap-2 p-3 rounded-2xl border bg-card transition-all',
        selected
          ? 'border-2 border-primary ring-2 ring-primary/20'
          : 'border-border/60 hover:shadow-sm'
      )}
    >
      <div
        className="h-11 w-11 rounded-full flex items-center justify-center text-white font-bold text-label"
        style={{ backgroundColor: color }}
      >
        {letter}
      </div>
      <span className="text-caption text-center truncate w-full max-w-[5rem]">
        {name}
      </span>
    </button>
  );
};