"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, UserCircle, Moon, Sun, Globe } from "lucide-react";
import { useDispatch } from "react-redux";
import { logout } from "@/features/auth/authSlice";
import { useGetProfileQuery, useUpdateProfileMutation } from "@/services/clientsApi";
import { Button } from "@/components/ui/button";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

export function Sidebar({ mobileMenuOpen, setMobileMenuOpen }: { mobileMenuOpen?: boolean, setMobileMenuOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const { data: profile, isLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: profile?.username || "",
      email: profile?.email || "",
      role: profile?.role || "",
    },
  });

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  const handleOpenProfile = () => {
    if (profile) {
      form.reset({
        username: profile.username,
        email: profile.email,
        role: profile.role,
      });
      setIsProfileModalOpen(true);
    }
  };

  const onSubmitProfile = async (values: z.infer<typeof profileSchema>) => {
    try {
      await updateProfile(values).unwrap();
      setIsProfileModalOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);
    }
  };

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'en' ? 'ru' : i18n.language === 'ru' ? 'tj' : 'en';
    i18n.changeLanguage(nextLang);
  };

  return (
    <>
      <aside className={`w-[260px] dark:bg-[#080811] bg-white border-r dark:border-white/10 border-slate-200 p-6 flex flex-col h-full shrink-0 transition-transform duration-300 md:translate-x-0 ${mobileMenuOpen ? 'translate-x-0 fixed inset-y-0 left-0 z-40' : '-translate-x-full fixed md:relative inset-y-0 left-0 z-40 md:z-auto'}`}>
        <div className="mb-10 hidden md:block">
          <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-1">
            Nexus<span className="text-emerald-500">CRM</span>
          </h1>
          <p className="text-xs dark:text-white/30 text-slate-400 tracking-widest uppercase">{t('sidebar.admin_portal')}</p>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname === "/dashboard" 
              ? "bg-violet-500/10 border border-violet-400/30 dark:text-white text-violet-700 font-medium shadow-sm" 
              : "dark:text-white/60 text-slate-500 hover:dark:bg-white/5 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900"
            }`}
          >
            <LayoutDashboard size={18} className={pathname === "/dashboard" ? "text-violet-500" : ""} />
            {t('sidebar.dashboard')}
          </Link>

          <Link
            href="/dashboard/clients"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname.startsWith("/dashboard/clients") 
              ? "bg-violet-500/10 border border-violet-400/30 dark:text-white text-violet-700 font-medium shadow-sm" 
              : "dark:text-white/60 text-slate-500 hover:dark:bg-white/5 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900"
            }`}
          >
            <Users size={18} className={pathname.startsWith("/dashboard/clients") ? "text-violet-500" : ""} />
            {t('sidebar.clients')}
          </Link>

          <Link
            href="/dashboard/settings"
            onClick={() => setMobileMenuOpen && setMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname === "/dashboard/settings" 
              ? "bg-violet-500/10 border border-violet-400/30 dark:text-white text-violet-700 font-medium shadow-sm" 
              : "dark:text-white/60 text-slate-500 hover:dark:bg-white/5 hover:bg-slate-100 hover:dark:text-white hover:text-slate-900"
            }`}
          >
            <Settings size={18} className={pathname === "/dashboard/settings" ? "text-violet-500" : ""} />
            {t('sidebar.settings')}
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t dark:border-white/10 border-slate-200 space-y-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="flex-1 dark:border-white/10 border-slate-200" onClick={toggleLanguage}>
              <Globe size={16} className="mr-2" />
              {i18n.language?.toUpperCase()}
            </Button>
            <Button variant="outline" size="icon" className="flex-1 dark:border-white/10 border-slate-200" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </Button>
          </div>

          <div 
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:dark:bg-white/5 hover:bg-slate-100 cursor-pointer transition-colors"
            onClick={handleOpenProfile}
          >
            {isLoading ? (
              <div className="w-10 h-10 rounded-full dark:bg-white/10 bg-slate-200 animate-pulse border dark:border-white/20 border-slate-300" />
            ) : profile?.image ? (
              <img src={profile.image} alt={profile.username} className="w-10 h-10 rounded-full border border-violet-400/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-400/30">
                <UserCircle className="text-violet-500" size={24} />
              </div>
            )}
            
            <div className="overflow-hidden">
              <p className="text-sm font-medium dark:text-white text-slate-900 truncate">{isLoading ? t('sidebar.loading') : profile?.username || "Admin"}</p>
              <p className="text-xs dark:text-white/40 text-slate-500 truncate">{isLoading ? "..." : profile?.email || "admin@nexuscrm.com"}</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 dark:border-white/10 border-slate-200 hover:bg-red-50 hover:dark:bg-red-500/10 hover:text-red-500 text-slate-600 dark:text-white hover:dark:border-red-500/20"
          >
            <LogOut size={16} />
            {t('sidebar.logout')}
          </Button>
        </div>
      </aside>

      {/* Profile Dialog */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogHeader>
          <DialogTitle>{t('sidebar.my_profile')}</DialogTitle>
          <DialogClose onClick={() => setIsProfileModalOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full dark:bg-white/10 bg-slate-100 border-4 dark:border-[#070711] border-white shadow-xl relative overflow-hidden flex items-center justify-center">
              {profile?.image ? (
                <img src={profile.image} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full dark:text-white/50 text-slate-400" />
              )}
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">{t('modals.username')}</Label>
              <Input id="username" {...form.register("username")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('modals.email')}</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">{t('modals.role')}</Label>
              <Input id="role" {...form.register("role")} />
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isUpdating}>
              {isUpdating ? t('modals.saving') : t('modals.save_profile')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
