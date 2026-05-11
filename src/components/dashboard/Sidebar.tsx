"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, Settings, LogOut, UserCircle } from "lucide-react";
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

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email"),
  role: z.string().min(1, "Role is required"),
});

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  
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

  return (
    <>
      <aside className="w-[260px] bg-[#080811] border-r border-white/10 p-6 flex flex-col h-full shrink-0">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white mb-1">
            Nexus<span className="text-emerald-400">CRM</span>
          </h1>
          <p className="text-xs text-white/30 tracking-widest uppercase">Admin Portal</p>
        </div>

        <nav className="space-y-2 text-sm flex-1">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname === "/dashboard" 
              ? "bg-violet-500/20 border border-violet-400/30 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <LayoutDashboard size={18} className={pathname === "/dashboard" ? "text-violet-400" : ""} />
            Dashboard
          </Link>

          <Link
            href="/dashboard/clients"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname.startsWith("/dashboard/clients") 
              ? "bg-violet-500/20 border border-violet-400/30 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Users size={18} className={pathname.startsWith("/dashboard/clients") ? "text-violet-400" : ""} />
            Clients
          </Link>

          <Link
            href="/dashboard/settings"
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-colors ${
              pathname === "/dashboard/settings" 
              ? "bg-violet-500/20 border border-violet-400/30 text-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Settings size={18} className={pathname === "/dashboard/settings" ? "text-violet-400" : ""} />
            Settings
          </Link>
        </nav>

        <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
          <div 
            className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
            onClick={handleOpenProfile}
          >
            {isLoading ? (
              <div className="w-10 h-10 rounded-full bg-white/10 animate-pulse border border-white/20" />
            ) : profile?.image ? (
              <img src={profile.image} alt={profile.username} className="w-10 h-10 rounded-full border border-violet-400/30" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center border border-violet-400/30">
                <UserCircle className="text-violet-400" size={24} />
              </div>
            )}
            
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{isLoading ? "Loading..." : profile?.username || "Admin"}</p>
              <p className="text-xs text-white/40 truncate">{isLoading ? "..." : profile?.email || "admin@nexuscrm.com"}</p>
            </div>
          </div>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full justify-start gap-3 border-white/10 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
          >
            <LogOut size={16} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Profile Dialog */}
      <Dialog open={isProfileModalOpen} onOpenChange={setIsProfileModalOpen}>
        <DialogHeader>
          <DialogTitle>My Profile</DialogTitle>
          <DialogClose onClick={() => setIsProfileModalOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-white/10 border-4 border-[#070711] shadow-xl relative overflow-hidden">
              {profile?.image ? (
                <img src={profile.image} alt={profile.username} className="w-full h-full object-cover" />
              ) : (
                <UserCircle className="w-full h-full text-white/50" />
              )}
            </div>
          </div>
          <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register("username")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...form.register("email")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input id="role" {...form.register("role")} />
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
