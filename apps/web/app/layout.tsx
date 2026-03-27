import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SimSchool",
  description: "Interactive simulations"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#f6f7fb] text-slate-900 antialiased">
        <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(1200px_600px_at_20%_-10%,rgba(59,130,246,0.10),transparent),radial-gradient(900px_500px_at_85%_0%,rgba(16,185,129,0.10),transparent)]" />
        <main className="relative">{children}</main>
      </body>
    </html>
  );
}