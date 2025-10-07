import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}","./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: { brand: { gold: "#FFD700", black: "#0A0A0A", gray: "#1A1A1A" }}, boxShadow:{soft:"0 10px 30px rgba(0,0,0,0.25)"}, borderRadius:{xl2:"1rem"} } },
  plugins: [],
};
export default config;
