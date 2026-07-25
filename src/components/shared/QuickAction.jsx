import React from 'react';

export const QuickAction = ({ icon: Icon, label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1.5 group"
    >
      <div className="h-14 w-14 rounded-2xl bg-card shadow-sm flex items-center justify-center text-primary group-hover:shadow-md transition-shadow">
        <Icon className="h-6 w-6" strokeWidth={2} />
      </div>
      <span className="text-caption text-muted-foreground">{label}</span>
    </button>
  );
};