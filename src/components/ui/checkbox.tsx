import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, onCheckedChange, ...props }, ref) => {
    return (
      <div className="relative flex items-center justify-center">
        <input
          type="checkbox"
          className={cn(
            "peer h-4 w-4 appearance-none rounded-sm border border-white/30 bg-transparent ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-violet-400 checked:border-violet-400 transition-colors",
            className
          )}
          ref={ref}
          onChange={(e) => {
            if (props.onChange) props.onChange(e);
            if (onCheckedChange) onCheckedChange(e.target.checked);
          }}
          {...props}
        />
        <Check className="absolute h-3 w-3 text-[#080811] opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" />
      </div>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
