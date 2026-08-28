import * as React from "react"
import { cn } from "@/lib/utils"
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return <textarea className={cn("flex min-h-[90px] w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.06] px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/10 disabled:opacity-50", className)} ref={ref} {...props} />
})
Textarea.displayName = "Textarea"
export { Textarea }
