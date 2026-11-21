import type { ReactNode } from "react";

interface BookReaderLayoutProps {
  children: ReactNode;
}

export default function BookReaderLayout({ children }: BookReaderLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f8f7f2] text-slate-800 dark:bg-[#111827] dark:text-slate-100">
      {children}
    </div>
  );
}
