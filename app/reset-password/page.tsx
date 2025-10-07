"use client";

import { Suspense, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { apiFetch, endpoints } from "@/lib/api";
import { Brand } from "@/components/Brand";

// Ensure this page is rendered dynamically to avoid pre-render issues
export const dynamic = "force-dynamic";

type RP = { password: string; confirmPassword: string };

function ResetPasswordInner() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [isValidToken, setIsValidToken] = useState(true);
  const form = useForm<RP>();

  useEffect(() => {
    if (!token) {
      setIsValidToken(false);
      toast.error("Invalid reset link. Please request a new one.");
    }
  }, [token]);

  async function onSubmit(data: RP) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (data.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    try {
      await apiFetch(endpoints.resetPassword, { 
        method: "POST", 
        body: JSON.stringify({ token, password: data.password }) 
      });
      toast.success("Password reset successfully! Redirecting...");
      setTimeout(() => { window.location.href = "/login"; }, 1500);
    } catch (e: any) {
      toast.error(e.message || "Reset failed");
    }
  }

  if (!isValidToken) {
    return (
      <main>
        <Brand />
        <div className="card space-y-4 text-center">
          <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
          <p className="text-white/70">This password reset link is invalid or has expired.</p>
          <a href="/forgot-password" className="btn inline-block">Request New Reset Link</a>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Brand />
      <div className="card space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Choose a new password</h1>
          <p className="text-white/70 text-sm mt-1">Enter your new password below.</p>
        </div>

        <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-1">
            <label className="label">New Password</label>
            <input 
              className="input" 
              type="password" 
              placeholder="••••••••"
              {...form.register("password", { 
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" }
              })} 
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-400">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="label">Confirm Password</label>
            <input 
              className="input" 
              type="password" 
              placeholder="••••••••"
              {...form.register("confirmPassword", { required: "Please confirm your password" })} 
            />
            {form.formState.errors.confirmPassword && (
              <p className="text-xs text-red-400">{form.formState.errors.confirmPassword.message}</p>
            )}
          </div>

          <button className="btn w-full" type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="text-sm text-white/60 text-center pt-2">
          <a className="underline" href="/login">Back to login</a>
        </div>
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<main><Brand /><div className="card text-center">Loading…</div></main>}>
      <ResetPasswordInner />
    </Suspense>
  );
}
