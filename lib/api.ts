type EndpointMap = { verifyActivation:string; completeActivation:string; login:string; forgotPassword:string; resetPassword:string; me:string; };
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://access.yohunderground.fun";
const defaultPaths: EndpointMap = { verifyActivation:"/auth/activate/verify", completeActivation:"/auth/activate/complete", login:"/auth/login", forgotPassword:"/auth/forgot-password", resetPassword:"/auth/reset-password", me:"/auth/me" };
let paths = defaultPaths;
try { if (process.env.NEXT_PUBLIC_ENDPOINTS_JSON) { const parsed = JSON.parse(process.env.NEXT_PUBLIC_ENDPOINTS_JSON) as Partial<EndpointMap>; paths = { ...defaultPaths, ...parsed }; } } catch {}
export async function apiFetch<T>(path:string, init?:RequestInit):Promise<T>{ const res = await fetch(`${API_BASE}${path}`, { ...init, headers:{ "Content-Type":"application/json", ...(init?.headers||{}) }, credentials:"include", cache:"no-store" }); if (!res.ok){ let message = `Request failed (${res.status})`; try { const data = await res.json(); message = (data && (data.error||data.message)) || message; } catch {} throw new Error(message);} return res.json() as Promise<T>; }
export const endpoints = paths;
