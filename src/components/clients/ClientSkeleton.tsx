export function ClientSkeleton() {
  return (
    <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 animate-pulse relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-violet-400/5 rounded-full blur-3xl -mr-10 -mt-10" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-white/5" />
          <div className="space-y-3">
            <div className="h-5 w-32 bg-white/5 rounded" />
            <div className="h-3 w-24 bg-white/5 rounded" />
          </div>
        </div>
      </div>
      
      <div className="mt-8 space-y-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="h-3 w-48 bg-white/5 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="h-3 w-32 bg-white/5 rounded" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded bg-white/5" />
          <div className="h-3 w-40 bg-white/5 rounded" />
        </div>
      </div>
    </div>
  );
}
