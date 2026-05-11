"use client";

import { useState } from "react";
import { useGetClientsQuery, useDeleteClientMutation, useAddClientMutation, useUpdateClientMutation } from "@/services/clientsApi";
import { useRouter } from "next/navigation";
import { Search, Plus, Trash2, Edit, ChevronLeft, ChevronRight, User, Shield, Briefcase, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClientSkeleton } from "@/components/clients/ClientSkeleton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Client } from "@/types/client";
import { useTranslation } from "react-i18next";

const clientSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required"),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
});

type ClientFormValues = z.infer<typeof clientSchema>;

export default function ClientsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading, error } = useGetClientsQuery({ page, limit });
  const [deleteClient, { isLoading: isDeleting }] = useDeleteClientMutation();
  const [addClient, { isLoading: isAdding }] = useAddClientMutation();
  const [updateClient, { isLoading: isUpdating }] = useUpdateClientMutation();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const clients = data?.clients || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / limit);

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      role: "User",
      status: "Active",
    },
  });

  const handleOpenAddModal = () => {
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      role: "User",
      status: "Active",
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (client: Client) => {
    form.reset({
      firstName: client.firstName,
      lastName: client.lastName,
      email: client.email,
      phone: client.phone,
      company: client.company,
      role: client.role,
      status: client.status,
    });
    setClientToEdit(client);
  };

  const onSubmitAdd = async (values: ClientFormValues) => {
    try {
      await addClient({
        ...values,
        id: Math.random().toString(36).substr(2, 9),
        image: `https://i.pravatar.cc/150?u=${values.email}`,
        address: { address: "Unknown", city: "Unknown", country: "Unknown" }
      }).unwrap();
      setIsAddModalOpen(false);
    } catch (err) {
      console.error("Failed to add client", err);
    }
  };

  const onSubmitEdit = async (values: ClientFormValues) => {
    if (!clientToEdit) return;
    try {
      await updateClient({
        id: clientToEdit.id,
        data: values,
      }).unwrap();
      setClientToEdit(null);
    } catch (err) {
      console.error("Failed to update client", err);
    }
  };

  const handleDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete).unwrap();
        setClientToDelete(null);
        // Refresh page if last item deleted
        if (clients.length === 1 && page > 1) {
          setPage(page - 1);
        }
      } catch (err) {
        console.error("Failed to delete client", err);
      }
    }
  };

  // Local filtering if user types in search box
  const filteredClients = clients.filter((client) => {
    const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
    const email = client.email.toLowerCase();
    const query = searchQuery.toLowerCase();
    return fullName.includes(query) || email.includes(query);
  });

  return (
    <div className="p-4 md:p-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">{t('clients.title')}</h1>
          <p className="dark:text-white/50 text-slate-500 text-sm">{t('clients.description')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-white/40 text-slate-400" size={18} />
            <Input
              type="text"
              placeholder={t('clients.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2 w-full sm:w-auto" onClick={handleOpenAddModal}>
            <Plus size={18} />
            {t('clients.add_client')}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <ClientSkeleton />
          <ClientSkeleton />
          <ClientSkeleton />
        </div>
      ) : error ? (
        <Card className="dark:border-red-500/20 border-red-200 dark:bg-red-500/5 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full dark:bg-red-500/10 bg-red-100 flex items-center justify-center mb-4">
              <User className="text-red-500" size={32} />
            </div>
            <h3 className="text-xl font-bold dark:text-white text-slate-900 mb-2">{t('clients.error_loading')}</h3>
            <p className="dark:text-red-400/80 text-red-600 mb-6">{t('clients.error_desc')}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>{t('clients.try_again')}</Button>
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card className="dark:border-white/10 border-slate-200 dark:bg-white/5 bg-slate-50">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-20 h-20 rounded-full dark:bg-white/5 bg-white border dark:border-transparent border-slate-200 shadow-sm flex items-center justify-center mb-6">
              <Shield className="dark:text-white/30 text-slate-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold dark:text-white text-slate-900 mb-2">{t('clients.no_clients')}</h3>
            <p className="dark:text-white/50 text-slate-500 mb-6 max-w-md">
              {searchQuery ? t('clients.no_clients_search') : t('clients.no_clients_empty')}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>{t('clients.clear_search')}</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('clients.table_client')}</TableHead>
                <TableHead>{t('clients.table_contact')}</TableHead>
                <TableHead>{t('clients.table_company')}</TableHead>
                <TableHead>{t('clients.table_role')}</TableHead>
                <TableHead>{t('clients.table_status')}</TableHead>
                <TableHead className="text-right">{t('clients.table_actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.image} alt={client.firstName} className="w-10 h-10 rounded-full dark:bg-white/10 bg-slate-200 border dark:border-white/20 border-slate-300" />
                      <div>
                        <div className="font-bold dark:text-white text-slate-900">{client.firstName} {client.lastName}</div>
                        <div className="text-[10px] dark:text-white/40 text-slate-500">ID: {client.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm dark:text-white/80 text-slate-700">{client.email}</div>
                    <div className="text-xs dark:text-white/50 text-slate-500">{client.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 dark:text-white/80 text-slate-700">
                      <Briefcase size={14} className="dark:text-white/40 text-slate-400" />
                      {client.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full border dark:border-violet-500/30 border-violet-200 dark:bg-violet-500/10 bg-violet-50 text-violet-600 dark:text-violet-300 text-[10px] font-bold tracking-wider uppercase">
                      {client.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${client.status === 'Active' ? 'bg-emerald-500 dark:bg-emerald-400 dark:shadow-[0_0_8px_rgba(52,211,153,0.8)] shadow-sm' : 'bg-red-500 dark:bg-red-400 dark:shadow-[0_0_8px_rgba(248,113,113,0.8)] shadow-sm'}`} />
                      <span className="text-xs font-bold dark:text-white/70 text-slate-600 uppercase tracking-wider">{client.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="dark:text-white/50 text-slate-400 dark:hover:text-white hover:text-slate-900" onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="dark:text-white/50 text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400 dark:hover:bg-cyan-400/10 hover:bg-cyan-50" onClick={() => handleOpenEditModal(client)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="dark:text-white/50 text-slate-400 hover:text-red-600 dark:hover:text-red-400 dark:hover:bg-red-500/10 hover:bg-red-50" onClick={() => setClientToDelete(client.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between px-2 gap-4">
            <p className="text-sm dark:text-white/40 text-slate-500">
              {t('clients.showing')} <span className="dark:text-white text-slate-900 font-medium">{(page - 1) * limit + 1}</span> {t('clients.to')} <span className="dark:text-white text-slate-900 font-medium">{Math.min(page * limit, totalCount)}</span> {t('clients.of')} <span className="dark:text-white text-slate-900 font-medium">{totalCount}</span> {t('clients.clients_count')}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} />
              </Button>
              <div className="flex gap-1 hidden sm:flex">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button 
                    key={i} 
                    variant={page === i + 1 ? "default" : "outline"}
                    className={page === i + 1 ? "w-10" : "w-10 dark:text-white/50 text-slate-500 hover:text-slate-900 dark:hover:text-white"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
              <span className="sm:hidden text-sm font-medium dark:text-white text-slate-900">{page} / {totalPages}</span>
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={clientToDelete !== null} onOpenChange={() => setClientToDelete(null)}>
        <DialogHeader>
          <div className="w-12 h-12 rounded-full dark:bg-red-500/20 bg-red-100 flex items-center justify-center mb-4">
            <Trash2 className="text-red-500" size={24} />
          </div>
          <DialogTitle>{t('modals.delete_title')}</DialogTitle>
          <DialogClose onClick={() => setClientToDelete(null)} />
        </DialogHeader>
        <DialogContent>
          <p className="dark:text-white/60 text-slate-500 mb-6">
            {t('modals.delete_desc')}
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="w-full" onClick={() => setClientToDelete(null)} disabled={isDeleting}>
              {t('modals.cancel')}
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? t('modals.deleting') : t('modals.delete')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle>{t('modals.add_title')}</DialogTitle>
          <DialogClose onClick={() => setIsAddModalOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">{t('modals.first_name')}</Label>
                <Input id="firstName" {...form.register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">{t('modals.last_name')}</Label>
                <Input id="lastName" {...form.register("lastName")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('modals.email')}</Label>
                <Input id="email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{t('modals.phone')}</Label>
                <Input id="phone" {...form.register("phone")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">{t('modals.company')}</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">{t('modals.role')}</Label>
                <Input id="role" {...form.register("role")} placeholder="e.g. Admin, User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">{t('modals.status')}</Label>
                <Input id="status" {...form.register("status")} placeholder="e.g. Active, Inactive" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isAdding}>
              {isAdding ? t('modals.adding') : t('clients.add_client')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={clientToEdit !== null} onOpenChange={(open) => !open && setClientToEdit(null)}>
        <DialogHeader>
          <DialogTitle>{t('modals.edit_title')}</DialogTitle>
          <DialogClose onClick={() => setClientToEdit(null)} />
        </DialogHeader>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">{t('modals.first_name')}</Label>
                <Input id="edit-firstName" {...form.register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">{t('modals.last_name')}</Label>
                <Input id="edit-lastName" {...form.register("lastName")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">{t('modals.email')}</Label>
                <Input id="edit-email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">{t('modals.phone')}</Label>
                <Input id="edit-phone" {...form.register("phone")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">{t('modals.company')}</Label>
              <Input id="edit-company" {...form.register("company")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">{t('modals.role')}</Label>
                <Input id="edit-role" {...form.register("role")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">{t('modals.status')}</Label>
                <Input id="edit-status" {...form.register("status")} />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isUpdating}>
              {isUpdating ? t('modals.saving') : t('modals.save_changes')}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
