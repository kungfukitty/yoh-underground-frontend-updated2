"use client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { apiFetch, endpoints } from "@/lib/api";
import { Brand } from "@/components/Brand";
type FP = { email:string };
export default function ForgotPasswordPage(){
  const form = useForm<FP>();
  async function onSubmit(data:FP){
    try{
      const continueUrl = typeof window!=="undefined" ? `${window.location.origin}/reset-password` : "/reset-password";
      await apiFetch(endpoints.forgotPassword,{method:"POST", body:JSON.stringify({ email:data.email, continueUrl })});
      toast.success("If your email exists, a reset link has been sent."); form.reset();
    }catch(e:any){ toast.error(e.message||"Request failed"); }
  }
  return (<main><Brand/><div className="card space-y-4">
    <h1 className="text-2xl font-bold">Reset your password</h1>
    <p className="text-white/70 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
    <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
      <div className="space-y-1"><label className="label">Email</label><input className="input" type="email" placeholder="you@domain.com" {...form.register("email",{required:"Email is required"})}/>{form.formState.errors.email&&<p className="text-xs text-red-400">{form.formState.errors.email.message}</p>}</div>
      <button className="btn w-full" type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting?"Sending...":"Send reset link"}</button>
    </form>
    <div className="text-sm text-white/60 text-center pt-2"><a className="underline" href="/login">Back to login</a></div>
  </div></main>);
}
