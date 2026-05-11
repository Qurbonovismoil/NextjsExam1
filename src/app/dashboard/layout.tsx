"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) {
    return <div className="min-h-screen bg-[#070711]" />;
  }

  return (
    <main className="min-h-screen bg-[#070711] text-white p-8">
      <div className="mx-auto max-w-[1200px] min-h-[760px] bg-[#0d0d18] border border-white/10 shadow-2xl flex overflow-hidden rounded-3xl">
        <Sidebar />
        <section className="flex-1 overflow-y-auto">
          {children}
        </section>
      </div>
    </main>
  );
}
