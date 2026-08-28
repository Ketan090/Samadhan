import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold tracking-tight ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md hover:-translate-y-[1px]",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
        outline: "border border-input dark:border-white/10 bg-background dark:bg-white/5 hover:bg-accent dark:hover:bg-white/10 hover:text-accent-foreground dark:hover:text-white hover:border-accent-foreground/10 dark:text-white",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline h-auto p-0",
        gradient: "gradient-primary text-white shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-[1px] hover:brightness-[1.03]",
        soft: "bg-primary/10 text-primary hover:bg-primary/15 border border-primary/10",
      },
      size: { default: "h-10 px-5", sm: "h-9 rounded-xl px-3.5 text-[13px]", lg: "h-11 rounded-xl px-6 text-[15px]", xl: "h-12 rounded-2xl px-8 text-[15px]", icon: "h-10 w-10" },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> { asChild?: boolean }
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = "Button"
export { Button, buttonVariants }
