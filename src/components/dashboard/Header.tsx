"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export function Header() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-xs">
        <p className="font-bold">{user || "System Admin"}</p>
        <p className="text-white/40">SYSTEM ADMIN</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="https://i.pravatar.cc/80?img=5" className="w-10 h-10 rounded-xl border border-cyan-400/50 object-cover" alt="User Avatar" />
    </div>
  );
}
