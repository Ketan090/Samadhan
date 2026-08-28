import type { Config } from "tailwindcss"
const config: Config = {
  darkMode: ["class"],
  content: ["./src/pages/**/*.{js,ts,jsx,tsx,mdx}","./src/components/**/*.{js,ts,jsx,tsx,mdx}","./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: { center:true, padding:{DEFAULT:"1rem", sm:"1.5rem", lg:"2rem", xl:"2rem","2xl":"2rem"}, screens:{"2xl":"1400px"}},
    extend: {
      fontFamily: { sans: ["var(--font-jakarta)","var(--font-inter)","system-ui","sans-serif"], display: ["var(--font-display)","var(--font-jakarta)","sans-serif"] },
      colors: {
        border:"hsl(var(--border))", input:"hsl(var(--input))", ring:"hsl(var(--ring))", background:"hsl(var(--background))", foreground:"hsl(var(--foreground))",
        primary:{DEFAULT:"hsl(var(--primary))",foreground:"hsl(var(--primary-foreground))"},
        secondary:{DEFAULT:"hsl(var(--secondary))",foreground:"hsl(var(--secondary-foreground))"},
        destructive:{DEFAULT:"hsl(var(--destructive))",foreground:"hsl(var(--destructive-foreground))"},
        muted:{DEFAULT:"hsl(var(--muted))",foreground:"hsl(var(--muted-foreground))"},
        accent:{DEFAULT:"hsl(var(--accent))",foreground:"hsl(var(--accent-foreground))"},
        card:{DEFAULT:"hsl(var(--card))",foreground:"hsl(var(--card-foreground))"},
        popover:{DEFAULT:"hsl(var(--popover))",foreground:"hsl(var(--popover-foreground))"},
        saffron:"#ff9933", emerald:"#138808",
        jp:{ navy:"#0f2440", dark:"#16365e", mid:"#2563a0", blue:"#3b82f6", accent:"#60a5fa", light:"#e8f0fe", footer:"#0f2440"},
        bmrc:{ bg:"#f8fafb", card:"#ffffff", border:"#e8eaed", dark:"#2d3436", darker:"#1e272e", green:"#00b894", greenLight:"#55efc4", greenBg:"#e6f9f1"},
        datago:{ bg:"#0f172a", panel:"#1e293b", panelBorder:"#334155", accent:"#e94560", orange:"#e67e22"},
      },
      borderRadius:{ lg:"var(--radius)", md:"calc(var(--radius) - 2px)", sm:"calc(var(--radius) - 4px)", "2xl":"1rem","3xl":"1.5rem", "4xl":"2rem"},
      boxShadow:{ card:'0 1px 3px 0 rgb(16 24 40 / 0.04), 0 1px 2px -1px rgb(16 24 40 / 0.03)', 'card-hover':'0 20px 40px -14px rgb(16 24 40 / 0.12), 0 8px 18px -8px rgb(16 24 40 / 0.06)', elevated:'0 25px 50px -12px rgb(16 24 40 / 0.15)', premium:'0 0 0 1px rgb(16 24 40 / 0.03), 0 2px 4px rgb(16 24 40 / 0.02), 0 12px 24px rgb(16 24 40 / 0.04)', 'premium-hover':'0 0 0 1px rgb(16 24 40 / 0.02), 0 4px 8px rgb(16 24 40 / 0.04), 0 24px 48px rgb(16 24 40 / 0.08)', glow:'0 0 20px rgb(59 130 246 / 0.15)', 'inner-glow':'inset 0 1px 0 0 rgb(255 255 255 / 0.1)'},
      keyframes:{
        "fade-up":{"0%":{opacity:"0",transform:"translateY(14px)"},"100%":{opacity:"1",transform:"translateY(0)"}},
        "slide-up":{"0%":{transform:"translateY(24px)",opacity:"0"},"100%":{transform:"translateY(0)",opacity:"1"}},
        "fade-in":{"0%":{opacity:"0"},"100%":{opacity:"1"}},
        "pulse-soft":{"0%,100%":{opacity:"1"},"50%":{opacity:"0.72"}},
        "count-up":{"0%":{opacity:"0",transform:"translateY(8px)"},"100%":{opacity:"1",transform:"translateY(0)"}},
        "scale-in":{"0%":{opacity:"0",transform:"scale(0.96)"},"100%":{opacity:"1",transform:"scale(1)"}},
        "slide-in-right":{"0%":{opacity:"0",transform:"translateX(16px)"},"100%":{opacity:"1",transform:"translateX(0)"}},
        shimmer:{"0%":{backgroundPosition:"-200% 0"},"100%":{backgroundPosition:"200% 0"}},
      },
      animation:{ "fade-up":"fade-up 0.55s cubic-bezier(0.16,1,0.3,1) forwards","slide-up":"slide-up 0.6s cubic-bezier(0.16,1,0.3,1) forwards","fade-in":"fade-in 0.4s ease-out forwards","pulse-soft":"pulse-soft 3s ease-in-out infinite","count-up":"count-up 0.4s ease-out forwards","scale-in":"scale-in 0.3s cubic-bezier(0.16,1,0.3,1) forwards","slide-in-right":"slide-in-right 0.4s cubic-bezier(0.16,1,0.3,1) forwards"},
    },
  },
  plugins: [require("tailwindcss-animate")],
}
export default config
