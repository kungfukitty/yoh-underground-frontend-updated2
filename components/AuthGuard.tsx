"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());
  useEffect(() => { if (!isAuthenticated) router.replace("/login"); }, [isAuthenticated, router]);
  if (!isAuthenticated) return <div className="card text-center"><p className="text-white/70">Checking authentication...</p></div>;
  return <>{children}</>;
}
