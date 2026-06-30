import React from "react";
import type { ReactNode } from "react";

interface EmptyStateProps {
  emoji?: string;
  icon?: ReactNode;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
}

export function EmptyState({ emoji, icon, title, description, actionText, onAction }: EmptyStateProps) {
  return (
    <div className="empty-state flex flex-col items-center justify-center gap-3.5 px-6 py-18 sm:py-20 text-center animate-fade-up-enter">
      {icon ? (
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-light/40 text-blue shadow-sm">
          {icon}
        </div>
      ) : (
        <div className="text-[56px] filter drop-shadow-md select-none">{emoji}</div>
      )}
      <h3 className="font-display font-bold text-[18px] sm:text-[19px] text-dark tracking-tight">{title}</h3>
      <p className="font-sans text-[13px] leading-relaxed text-gray2 max-w-[260px] -mt-1.5">
        {description}
      </p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn-outline h-11 mt-3 border-blue text-blue font-display font-semibold px-6 cursor-pointer active:scale-95 hover:bg-blue-light/10 rounded-full transition-all text-xs"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
