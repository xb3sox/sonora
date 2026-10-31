import React from 'react';
import { Heart } from 'lucide-react';

interface TipButtonProps {
  onClick: () => void;
  size?: 'sm' | 'md';
}

export function TipButton({ onClick, size = 'md' }: TipButtonProps) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
  };

  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-calm
        ${sizeClasses[size]}
        bg-sonora-accent/10 text-sonora-accent hover:bg-sonora-accent/20`}
    >
      <Heart size={14} fill="currentColor" />
      Tip
    </button>
  );
}
