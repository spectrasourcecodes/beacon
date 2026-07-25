import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PageHeader = ({ title, backTo }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="flex items-center gap-3 px-5 pt-4 pb-3 border-b border-divider">
      <button
        onClick={handleBack}
        className="p-1.5 -ml-2 rounded-full hover:bg-muted transition-colors"
        aria-label="Voltar"
      >
        <ChevronLeft className="h-6 w-6 text-foreground" />
      </button>
      <h1 className="text-h3 font-bold flex-1">{title}</h1>
    </div>
  );
};