"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, endpoints } from "@/lib/api";
import { useAuthStore } from "@/lib/authStore";
import { Brand } from "@/components/Brand";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
type LoginForm = { email:string; password:string };
export default function LoginPage(){
  const form = useForm<LoginForm>();
  const setSession = useAuthStore((s)=>s.setSession);
  const isAuthenticated = useAuthStore((s)=>s.isAuthenticated());
  const router = useRouter();
  useEffect(()=>{ if(isAuthenticated){ router.replace("/dashboard"); } },[isAuthenticated, router]);
  async function onSubmit(data:LoginForm){
    try{
      const res = await apiFetch<{token?:string; user?:any}>(endpoints.login,{method:"POST", body:JSON.stringify(data)});
      setSession({ token: res?.token, email: data.email });
      toast.success("Welcome back!");
      setTimeout(()=>{ window.location.href="/dashboard"; }, 500);
    }catch(e:any){ toast.error(e.message||"Login failed"); }
  }
  return (<main><Brand/><div className="card space-y-4">
    <div><h1 className="text-2xl font-bold">Member Login</h1><p className="text-white/70 text-sm mt-1">Sign in to access your portal.</p></div>
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1"><label className="label">Email</label><input className="input" type="email" placeholder="you@domain.com" {...form.register("email",{required:"Email is required"})}/>{form.formState.errors.email&&<p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}</div>
      <div className="space-y-1"><label className="label">Password</label><input className="input" type="password" placeholder="••••••••" {...form.register("password",{required:"Password is required"})}/>{form.formState.errors.password&&<p className="text-xs text-red-400">{form.formState.errors.password.message}</p>}</div>
      <button className="btn w-full" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting?"Signing in...":"Log In"}</button>
    </form>
    <div className="text-sm text-white/60 flex justify-between pt-2"><a className="underline hover:text-white" href="/forgot-password">Forgot password?</a><a className="underline hover:text-white" href="/activate">Have an access code?</a></div>
  </div></main>);
}
