import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  left?: ReactNode;
  right?: ReactNode;
}

export function PageHeader({ title, left, right }: PageHeaderProps) {
  return (
    <div className="sticky top-0 z-[90] flex-none flex items-center justify-between px-4 sm:px-5 py-3 bg-white/92 backdrop-blur-xl border-b border-black/5 shadow-[0_4px_18px_rgba(0,0,0,0.04)]">
      <div className="w-[30%] flex items-center justify-start min-h-[30px]">{left}</div>
      <div className="flex-1 text-center font-display font-bold text-[16px] sm:text-[17px] text-dark leading-none truncate px-2">
        {title}
      </div>
      <div className="w-[30%] flex items-center justify-end min-h-[30px]">{right}</div>
    </div>
  );
}
