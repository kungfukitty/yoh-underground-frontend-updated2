import "./globals.css";
import { Toaster } from "sonner";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "YOH Underground Portal", description: "Secure membership access portal" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="en"><body className="min-h-screen bg-gradient-to-b from-black via-[#0b0b0b] to-[#121212]"><div className="max-w-md mx-auto p-6">{children}</div><Toaster richColors /></body></html>);
}
