"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isMounted, setIsMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isMounted, router]);

  if (!isMounted || !isAuthenticated) {
    return <div className="min-h-screen dark:bg-[#070711] bg-slate-100" />;
  }

  return (
    <main className="min-h-screen dark:bg-[#070711] bg-slate-100 dark:text-white text-slate-900 md:p-8">
      <div className="mx-auto w-full md:max-w-[1200px] h-screen md:h-[760px] md:min-h-[760px] dark:bg-[#0d0d18] bg-white border-0 md:border dark:border-white/10 border-slate-200 md:shadow-2xl flex flex-col md:flex-row overflow-hidden md:rounded-3xl relative">
        
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b dark:border-white/10 border-slate-200 dark:bg-[#080811] bg-slate-50 z-20">
          <h1 className="text-xl font-bold dark:text-white text-slate-900">
            Nexus<span className="text-emerald-500">CRM</span>
          </h1>
          <Button variant="outline" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={20} />
          </Button>
        </div>

        {/* Sidebar Overlay for Mobile */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <Sidebar 
          mobileMenuOpen={mobileMenuOpen} 
          setMobileMenuOpen={setMobileMenuOpen} 
        />
        
        <section className="flex-1 overflow-y-auto">
          {children}
        </section>
      </div>
    </main>
  );
}
