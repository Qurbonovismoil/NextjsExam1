"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetClientByIdQuery } from "@/services/clientsApi";
import { ArrowLeft, Mail, Phone, MapPin, Building, Calendar, GraduationCap, UserCircle2, CheckCircle2, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const { data: client, isLoading: isClientLoading, error: clientError } = useGetClientByIdQuery(id);
  // Tasks are not provided by json-server in this structure
  const todosData = { todos: [] };
  const isTodosLoading = false;

  if (isClientLoading) {
    return (
      <div className="p-8 pb-20 flex justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (clientError || !client) {
    return (
      <div className="p-8 pb-20">
        <Button variant="ghost" className="mb-6 gap-2 text-white/50 hover:text-white" onClick={() => router.back()}>
          <ArrowLeft size={16} />
          Back to Clients
        </Button>
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Client Profile</h3>
            <p className="text-red-400/80 mb-6">There was a problem fetching this client's details.</p>
            <Button variant="outline" onClick={() => router.push("/dashboard/clients")}>Return to Directory</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const todos = todosData?.todos || [];

  return (
    <div className="p-8 pb-20 max-w-6xl mx-auto">
      <Button variant="ghost" className="mb-8 gap-2 text-white/50 hover:text-white hover:bg-white/5" onClick={() => router.back()}>
        <ArrowLeft size={16} />
        Back to Clients
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-8">
          <Card className="relative overflow-hidden border-white/10 bg-white/5">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-violet-500/20 to-transparent" />
            
            <CardContent className="pt-12 px-8 pb-8 relative z-10 flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={client.image} 
                alt={client.firstName} 
                className="w-32 h-32 rounded-full bg-[#12121d] border-4 border-[#070711] shadow-xl mb-6 relative z-10"
              />
              <h1 className="text-3xl font-bold text-white mb-1">
                {client.firstName} {client.lastName}
              </h1>
              <p className="text-emerald-400 font-medium mb-6">
                {client.company?.title || "Professional"} @ {client.company?.name || "Independent"}
              </p>
              
              <div className="w-full space-y-4 text-left mt-4 border-t border-white/10 pt-6">
                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Mail size={18} className="text-violet-300" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-sm font-medium truncate">{client.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-violet-300" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white/40 mb-0.5">Phone</p>
                    <p className="text-sm font-medium truncate">{client.phone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-white/70">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-violet-300" />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs text-white/40 mb-0.5">Location</p>
                    <p className="text-sm font-medium truncate">
                      {client.address?.city}, {client.address?.country || "USA"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Details and Todos */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <UserCircle2 className="text-violet-400" />
                Personal Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#080811] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 text-white/40 mb-2">
                    <Calendar size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Demographics</span>
                  </div>
                  <p className="text-white">
                    <span className="text-white/60">Age:</span> {client.age || "N/A"} • <span className="text-white/60">Gender:</span> {client.gender || "N/A"}
                  </p>
                  <p className="text-white mt-1">
                    <span className="text-white/60">Birth Date:</span> {client.birthDate || "N/A"}
                  </p>
                </div>

                <div className="bg-[#080811] rounded-xl p-5 border border-white/5">
                  <div className="flex items-center gap-3 text-white/40 mb-2">
                    <GraduationCap size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Education</span>
                  </div>
                  <p className="text-white">
                    {client.university || "No university information provided"}
                  </p>
                </div>

                <div className="bg-[#080811] rounded-xl p-5 border border-white/5 md:col-span-2">
                  <div className="flex items-center gap-3 text-white/40 mb-2">
                    <Building size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Company Address</span>
                  </div>
                  <p className="text-white">
                    {client.address?.address}, {client.address?.city}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5">
            <CardContent className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-400" />
                  Client Tasks
                </h2>
                <span className="bg-violet-500/20 text-violet-300 py-1 px-3 rounded-full text-xs font-bold">
                  {todos.length} Tasks
                </span>
              </div>
              
              {isTodosLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-[#080811] rounded-xl border border-white/5 animate-pulse" />
                  ))}
                </div>
              ) : todos.length === 0 ? (
                <div className="text-center py-10 bg-[#080811] rounded-xl border border-white/5">
                  <p className="text-white/50">No tasks assigned to this client yet.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todos.map((todo) => (
                    <div 
                      key={todo.id} 
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                        todo.completed 
                        ? "bg-emerald-500/5 border-emerald-500/20" 
                        : "bg-[#080811] border-white/10 hover:border-violet-400/30"
                      }`}
                    >
                      <button className="mt-0.5 shrink-0">
                        {todo.completed ? (
                          <CheckCircle2 className="text-emerald-400" size={20} />
                        ) : (
                          <Circle className="text-white/30 hover:text-violet-400 transition-colors" size={20} />
                        )}
                      </button>
                      <p className={`text-sm ${todo.completed ? "text-white/50 line-through" : "text-white"}`}>
                        {todo.todo}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
