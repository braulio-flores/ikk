import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Acceso",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="ikk-dot-bg flex min-h-dvh items-center justify-center bg-[var(--ikk-bg)] p-4 sm:p-6">
      {children}
    </div>
  );
}
