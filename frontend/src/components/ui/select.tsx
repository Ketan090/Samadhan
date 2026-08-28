"use client"
import * as React from "react"
import * as SelectPrimitive from "@radix-ui/react-select"
import { ChevronDown, Check } from "lucide-react"
import { cn } from "@/lib/utils"
const Select = SelectPrimitive.Root
const SelectGroup = SelectPrimitive.Group
const SelectValue = SelectPrimitive.Value
const SelectTrigger = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Trigger>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={cn("flex h-10 w-full items-center justify-between rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/[0.06] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 disabled:opacity-50", className)} {...props}>
    {children}<SelectPrimitive.Icon asChild><ChevronDown className="h-4 w-4 opacity-40" /></SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName
const SelectContent = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Content>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content ref={ref} className={cn("relative z-[60] max-h-96 min-w-[8rem] overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e293b] shadow-xl animate-in fade-in-80", position === "popper" && "translate-y-1 data-[side=bottom]:slide-in-from-top-1 data-[side=top]:slide-in-from-bottom-1", className)} position={position} {...props}>
      <SelectPrimitive.Viewport className={cn("p-1 w-full min-w-[var(--radix-select-trigger-width)]", position === "popper" && "max-h-[var(--radix-select-content-available-height)]")}>{children}</SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName
const SelectItem = React.forwardRef<React.ElementRef<typeof SelectPrimitive.Item>, React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item ref={ref} className={cn("relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 pl-8 pr-3 text-sm outline-none focus:bg-slate-100 dark:focus:bg-white/10 data-[state=checked]:bg-slate-900 data-[state=checked]:text-white dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-slate-900", className)} {...props}>
    <span className="absolute left-2 flex h-4 w-4 items-center justify-center"><SelectPrimitive.ItemIndicator><Check className="h-4 w-4" /></SelectPrimitive.ItemIndicator></span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
))
SelectItem.displayName = SelectPrimitive.Item.displayName
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem }
