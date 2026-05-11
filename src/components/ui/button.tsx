import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      default: "dark:bg-violet-600 bg-violet-500 dark:text-white text-white hover:dark:bg-violet-500 hover:bg-violet-600 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shadow-sm",
      outline: "border dark:border-white/10 border-slate-200 dark:bg-white/5 bg-white hover:dark:bg-white/10 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900",
      ghost: "hover:dark:bg-white/5 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900",
      destructive: "dark:bg-red-500 bg-red-500 dark:text-white text-white hover:dark:bg-red-600 hover:bg-red-600 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] shadow-sm",
      secondary: "dark:bg-white/10 bg-slate-100 dark:text-white text-slate-900 hover:dark:bg-white/20 hover:bg-slate-200",
    }
    
    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs",
      lg: "h-12 rounded-xl px-8",
      icon: "h-10 w-10",
    }

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
