import * as React from "react"
import { cn } from "@/lib/utils"
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return <input type={type} className={cn("flex h-10 w-full rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.06] px-4 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 dark:focus-visible:ring-white/20 focus-visible:border-slate-300 dark:focus-visible:border-white/20 disabled:opacity-50 transition-colors", className)} ref={ref} {...props} />
})
Input.displayName = "Input"
export { Input }
