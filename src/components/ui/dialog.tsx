import * as React from "react"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export function Dialog({ open, onOpenChange, children }: { open: boolean, onOpenChange: (open: boolean) => void, children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      {/* Click outside to close */}
      <div className="absolute inset-0" onClick={() => onOpenChange(false)} />
      <div className="relative z-10 w-full max-w-lg bg-[#0d0d18] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>
  )
}

export function DialogHeader({ children, className }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-6 pb-4 border-b border-white/5", className)}>
      {children}
    </div>
  )
}

export function DialogTitle({ children, className }: { children: React.ReactNode, className?: string }) {
  return <h2 className={cn("text-xl font-bold text-white", className)}>{children}</h2>
}

export function DialogContent({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("p-6", className)}>{children}</div>
}

export function DialogClose({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none">
      <X className="h-4 w-4 text-white" />
      <span className="sr-only">Close</span>
    </button>
  )
}
