"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
type AuthState = { token?:string; email?:string; setSession:(s:{token?:string; email?:string})=>void; clear:()=>void; isAuthenticated:()=>boolean; };
export const useAuthStore = create<AuthState>()(persist((set, get)=>({
  token: undefined,
  email: undefined,
  setSession: (s)=> set(s),
  clear: ()=> set({ token: undefined, email: undefined }),
  isAuthenticated: ()=> !!get().token,
}), { name: "yoh-auth-storage" }));
