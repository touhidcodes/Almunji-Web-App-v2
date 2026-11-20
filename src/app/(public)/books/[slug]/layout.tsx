import type { ReactNode } from "react";

export default function BookReaderLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <div className="min-h-screen bg-[#f8faf8]">{children}</div>;
}
