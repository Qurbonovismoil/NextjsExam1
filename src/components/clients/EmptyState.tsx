import { FolderSearch } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({ 
  title = "No clients found", 
  description = "We couldn't find any clients matching your search." 
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-gray-900/50 border border-gray-800 border-dashed">
      <div className="w-16 h-16 mb-4 rounded-2xl bg-gray-800 flex items-center justify-center">
        <FolderSearch className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      <p className="text-gray-400 max-w-sm">{description}</p>
    </div>
  );
}
