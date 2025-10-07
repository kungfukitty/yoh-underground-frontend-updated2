"use client";
import { AuthGuard } from "@/components/AuthGuard";
import { useAuthStore } from "@/lib/authStore";
import { useRouter } from "next/navigation";
export default function DashboardPage(){
  const router = useRouter();
  const { email, clear } = useAuthStore();
  function handleLogout(){ clear(); router.push("/login"); }
  return (<AuthGuard><main className="space-y-4">
    <div className="card"><div className="flex items-center justify-between mb-4">
      <div><h1 className="text-2xl font-bold">Dashboard</h1><p className="text-white/70 text-sm">Welcome back, {email}</p></div>
      <button onClick={handleLogout} className="btn bg-red-500/20 hover:bg-red-500/30">Logout</button>
    </div><p className="text-white/70">Your member portal content goes here.</p></div>
    <div className="grid grid-cols-2 gap-4">
      <div className="card"><h3 className="font-semibold mb-2">Upcoming Tours</h3><p className="text-sm text-white/60">No tours booked</p></div>
      <div className="card"><h3 className="font-semibold mb-2">Account Status</h3><p className="text-sm text-green-400">Active</p></div>
    </div>
  </main></AuthGuard>);
}
