import React, { useEffect } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  position = 'bottom',
  disableClose = false // ✅ new prop
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (!disableClose && e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.body.style.overflow = 'unset';
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, disableClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (!disableClose && e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm transition-opacity duration-200 md:items-center"
      onClick={handleBackdropClick}
    >
      <div
        className={clsx(
          'bg-card w-full max-w-md overflow-hidden',
          position === 'bottom' && 'rounded-t-3xl',
          position === 'center' && 'rounded-3xl shadow-modal mx-4'
        )}
      >
        {position === 'bottom' && (
          <div className="flex justify-center pt-3">
            <div className="h-1 w-12 rounded-full bg-border" />
          </div>
        )}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-divider">
          <h2 className="text-h3 font-bold">{title}</h2>
          {!disableClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </button>
          )}
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};