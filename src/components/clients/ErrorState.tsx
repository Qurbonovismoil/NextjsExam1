import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = "Something went wrong", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-red-900/10 border border-red-900/20">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-500" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">Error Loading Data</h3>
      <p className="text-red-400/80 max-w-sm mb-6">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors font-medium text-sm border border-red-500/20"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
