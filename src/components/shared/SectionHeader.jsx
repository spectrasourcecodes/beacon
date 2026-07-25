import React from 'react';

export const SectionHeader = ({ title, linkText, onLinkClick }) => {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-h3 font-bold">{title}</h2>
      {linkText && (
        <button
          onClick={onLinkClick}
          className="text-label font-semibold text-primary hover:underline"
        >
          {linkText}
        </button>
      )}
    </div>
  );
};