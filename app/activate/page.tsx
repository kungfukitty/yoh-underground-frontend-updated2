"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Brand } from "@/components/Brand";
import { apiFetch, endpoints } from "@/lib/api";
import { NDA_SHORT, NDA_VERSION } from "@/lib/nda";
type VerifyForm = { email:string; code:string };
type CompleteForm = { password:string; confirmPassword:string };
export default function ActivatePage(){
  const [verified, setVerified] = useState<{email:string; code:string}|null>(null);
  const verifyForm = useForm<VerifyForm>(); const completeForm = useForm<CompleteForm>();
  async function onVerify(data:VerifyForm){ try{ await apiFetch(endpoints.verifyActivation,{method:"POST", body:JSON.stringify(data)}); setVerified({email:data.email, code:data.code}); toast.success("Code verified. Set your password."); } catch(e:any){ toast.error(e.message||"Verification failed"); } }
  async function onComplete(data:CompleteForm){
    if(data.password!==data.confirmPassword){ toast.error("Passwords do not match"); return; }
    if(data.password.length<8){ toast.error("Password must be at least 8 characters"); return; }
    if(!verified){ toast.error("Verification data missing"); return; }
    try{
      const payload={ email:verified.email, code:verified.code, password:data.password, acceptNDA:true, ndaVersion:NDA_VERSION, acceptedAt:new Date().toISOString(), ua: typeof window!=='undefined'?navigator.userAgent:undefined };
      await apiFetch(endpoints.completeActivation,{method:"POST", body:JSON.stringify(payload)});
      toast.success("Account activated. Please log in."); setTimeout(()=>{window.location.href="/login"},1500);
    }catch(e:any){ toast.error(e.message||"Activation failed"); }
  }
  return (<main><Brand/><div className="card space-y-6">{!verified?(
    <form className="space-y-4" onSubmit={verifyForm.handleSubmit(onVerify)}>
      <div><h1 className="text-2xl font-bold">Activate Access</h1><p className="text-white/70 text-sm mt-1">Enter the email and access code you received.</p></div>
      <div className="space-y-1"><label className="label">Email</label><input className="input" type="email" placeholder="you@domain.com" {...verifyForm.register("email",{required:"Email is required"})}/>{verifyForm.formState.errors.email&&<p className="text-xs text-red-400">{verifyForm.formState.errors.email.message}</p>}</div>
      <div className="space-y-1"><label className="label">Access Code</label><input className="input" type="text" placeholder="e.g. 6-digit code" {...verifyForm.register("code",{required:"Access code is required"})}/>{verifyForm.formState.errors.code&&<p className="text-xs text-red-400">{verifyForm.formState.errors.code.message}</p>}</div>
      <button className="btn w-full" type="submit" disabled={verifyForm.formState.isSubmitting}>{verifyForm.formState.isSubmitting?"Verifying...":"Verify Code"}</button>
      <div className="text-sm text-white/60 text-center pt-2"><a className="underline" href="/login">Already have an account?</a></div>
    </form>
  ):(
    <form className="space-y-4" onSubmit={completeForm.handleSubmit(onComplete)}>
      <div><h1 className="text-2xl font-bold">Set Password</h1><p className="text-white/70 text-sm mt-1">Creating account for: <span className="font-medium text-white">{verified.email}</span></p></div>
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3"><p className="text-xs text-yellow-200">{NDA_SHORT}</p></div>
      <div className="space-y-1"><label className="label">New Password</label><input className="input" type="password" placeholder="••••••••" {...completeForm.register("password",{required:"Password is required", minLength:{value:8, message:"Password must be at least 8 characters"}})}/>{completeForm.formState.errors.password&&<p className="text-xs text-red-400">{completeForm.formState.errors.password.message}</p>}</div>
      <div className="space-y-1"><label className="label">Confirm Password</label><input className="input" type="password" placeholder="••••••••" {...completeForm.register("confirmPassword",{required:"Please confirm your password"})}/>{completeForm.formState.errors.confirmPassword&&<p className="text-xs text-red-400">{completeForm.formState.errors.confirmPassword.message}</p>}</div>
      <button className="btn w-full" type="submit" disabled={completeForm.formState.isSubmitting}>{completeForm.formState.isSubmitting?"Activating...":"Complete Activation"}</button>
    </form>
  )}</div></main>);
}
