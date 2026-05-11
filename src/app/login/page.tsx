"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { login } from "@/features/auth/authSlice";
import { Mail, Lock, TrendingUp, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";

const loginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate fake login delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    dispatch(login(data.email.split("@")[0]));
    router.push("/dashboard/clients");
  };

  return (
    <main className="min-h-screen dark:bg-[#070711] bg-slate-100 dark:text-white text-slate-900 flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-[1200px] min-h-[760px] dark:bg-[radial-gradient(circle_at_20%_20%,#1d245c,transparent_35%),radial-gradient(circle_at_90%_50%,#0a7267,transparent_30%),#090914] bg-white border border-slate-200 dark:border-none p-6 md:p-9 relative overflow-hidden rounded-3xl shadow-xl">
        <p className="dark:text-white/30 text-slate-400 text-xl font-bold mb-10 md:mb-28">
          Login - NexusCRM
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center relative z-10">
          <div className="w-full max-w-[420px] mx-auto lg:mx-0 dark:bg-white/10 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-3xl p-6 md:p-9 backdrop-blur-xl shadow-2xl">
            <h1 className="text-3xl font-bold mb-2">
              Nexus<span className="text-emerald-500">CRM</span>
            </h1>

            <p className="dark:text-white/50 text-slate-500 text-sm mb-8">
              Welcome back. Enter your credentials to access the command center.
            </p>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-white text-slate-700 font-bold text-xs tracking-wider">EMAIL ADDRESS</Label>
                <div className="relative">
                  <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-white/35 text-slate-400 z-10" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@company.com"
                    className="pl-12"
                    {...form.register("email")}
                  />
                </div>
                {form.formState.errors.email && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-white text-slate-700 font-bold text-xs tracking-wider">PASSWORD</Label>
                <div className="relative">
                  <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 dark:text-white/35 text-slate-400 z-10" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••••••"
                    className="pl-12"
                    {...form.register("password")}
                  />
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.password.message}</p>
                )}
              </div>

              <div className="flex items-center justify-between text-xs py-2">
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="dark:border-white/50 border-slate-300 dark:data-[state=checked]:bg-white dark:data-[state=checked]:text-black" />
                  <label htmlFor="remember" className="dark:text-white/50 text-slate-500 cursor-pointer select-none">
                    Remember me
                  </label>
                </div>
                <button type="button" className="dark:text-emerald-400 text-emerald-600 hover:text-emerald-500 transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full font-bold h-12"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Dashboard"
                )}
              </Button>
            </form>

            <Separator className="my-7 dark:bg-white/10 bg-slate-200" />

            <p className="text-center dark:text-white/35 text-slate-400 text-xs mb-4">
              Or continue with
            </p>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full text-sm font-normal">
                Google
              </Button>
              <Button variant="outline" className="w-full text-sm font-normal">
                SSO
              </Button>
            </div>
          </div>

          {/* Decorative Right Side - Hidden on Mobile */}
          <div className="relative h-[430px] hidden lg:block">
            <div className="absolute top-16 left-8 w-[520px] h-[330px] dark:bg-white/10 bg-slate-50 border dark:border-white/10 border-slate-200 rounded-3xl rotate-[-2deg] backdrop-blur-xl shadow-2xl overflow-hidden">
              <div className="h-20 dark:bg-violet-400/10 bg-violet-100 border-b dark:border-white/10 border-slate-200 flex gap-4 items-center px-7">
                <div className="w-8 h-8 rounded-lg dark:bg-violet-400/30 bg-violet-300" />
                <div className="w-120 h-4 rounded-full dark:bg-white/10 bg-white/50" />
              </div>

              <div className="p-6 flex flex-col gap-3">
                <div className="grid grid-cols-4 gap-4 px-4 py-2 border-b dark:border-white/10 border-slate-200 text-[10px] font-bold dark:text-white/40 text-slate-400 uppercase tracking-wider">
                  <div className="col-span-2">Client</div>
                  <div>Status</div>
                  <div>Amount</div>
                </div>
                
                <div className="grid grid-cols-4 gap-4 items-center px-4 py-3 dark:bg-white/5 bg-white border border-transparent dark:border-transparent rounded-xl transition-colors">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full dark:bg-violet-400/20 bg-violet-100 border dark:border-violet-400/30 border-violet-200 flex items-center justify-center dark:text-violet-300 text-violet-700 text-xs font-bold">JD</div>
                    <div>
                      <div className="text-sm font-medium">John Doe</div>
                      <div className="text-[10px] dark:text-white/40 text-slate-400">Acme Corp</div>
                    </div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full dark:bg-emerald-500/20 bg-emerald-100 dark:text-emerald-300 text-emerald-700 text-[10px] font-bold">Active</span>
                  </div>
                  <div className="text-sm font-medium">$4,250</div>
                </div>

                <div className="grid grid-cols-4 gap-4 items-center px-4 py-3 dark:bg-white/5 bg-white border border-transparent dark:border-transparent rounded-xl transition-colors">
                  <div className="col-span-2 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full dark:bg-cyan-400/20 bg-cyan-100 border dark:border-cyan-400/30 border-cyan-200 flex items-center justify-center dark:text-cyan-300 text-cyan-700 text-xs font-bold">SA</div>
                    <div>
                      <div className="text-sm font-medium">Sarah Adams</div>
                      <div className="text-[10px] dark:text-white/40 text-slate-400">TechFlow</div>
                    </div>
                  </div>
                  <div>
                    <span className="px-2 py-1 rounded-full dark:bg-amber-500/20 bg-amber-100 dark:text-amber-300 text-amber-700 text-[10px] font-bold">Pending</span>
                  </div>
                  <div className="text-sm font-medium">$1,800</div>
                </div>
              </div>
            </div>

            <div className="absolute right-0 top-0 dark:bg-cyan-500/20 bg-cyan-50 border dark:border-cyan-300/20 border-cyan-200 rounded-2xl p-5 w-[230px] backdrop-blur-xl shadow-lg">
              <TrendingUp className="dark:text-emerald-400 text-emerald-600 mb-2" />
              <p className="text-xs dark:text-emerald-300 text-emerald-700">REVENUE</p>
              <h3 className="text-2xl font-bold dark:text-emerald-300 text-emerald-700">+24.8%</h3>
            </div>

            <div className="absolute left-0 bottom-8 flex items-center gap-4 dark:bg-cyan-500/20 bg-cyan-50 border dark:border-cyan-300/20 border-cyan-200 rounded-2xl p-4 w-[260px] backdrop-blur-xl shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.pravatar.cc/80?img=32"
                className="w-12 h-12 rounded-xl"
                alt=""
              />
              <div>
                <h4 className="font-bold">Alex Rivera</h4>
                <p className="dark:text-white/50 text-slate-500 text-sm">Top Client Manager</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="absolute bottom-9 left-9 right-9 flex flex-col md:flex-row justify-between dark:text-white/35 text-slate-400 text-xs z-10 gap-4">
          <div className="flex gap-6">
            <span className="cursor-pointer hover:dark:text-white hover:text-slate-900">Privacy Policy</span>
            <span className="cursor-pointer hover:dark:text-white hover:text-slate-900">Terms of Service</span>
            <span className="cursor-pointer hover:dark:text-white hover:text-slate-900">Contact Support</span>
          </div>
          <span>© 2024 NexusCRM Systems Inc.</span>
        </footer>
      </div>
    </main>
  );
}
