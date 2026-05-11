import { Client } from '@/types/client';
import { Mail, Phone, Building2, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface ClientCardProps {
  client: Client;
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export function ClientCard({ client, onDelete, isDeleting }: ClientCardProps) {
  return (
    <div className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-gray-700 hover:shadow-xl hover:shadow-blue-900/10 transition-all duration-300">
      <Link href={`/dashboard/clients/${client.id}`} className="absolute inset-0 z-0" />
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={client.image}
            alt={`${client.firstName} ${client.lastName}`}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-800"
          />
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {client.firstName} {client.lastName}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
              <Building2 className="w-4 h-4" />
              <span>{client.company.name}</span>
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(client.id);
          }}
          disabled={isDeleting}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50"
          title="Delete client"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mt-6 space-y-3 relative z-10">
        <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-800/50">
          <Mail className="w-4 h-4 text-gray-500" />
          <span className="truncate">{client.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-300 bg-gray-800/50 p-3 rounded-lg border border-gray-800/50">
          <Phone className="w-4 h-4 text-gray-500" />
          <span>{client.phone}</span>
        </div>
      </div>
    </div>
  );
}
