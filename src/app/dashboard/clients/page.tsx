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
    <div className="p-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Clients Directory</h1>
          <p className="text-white/50 text-sm">Manage your client relationships and contact information.</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
            <Input
              type="text"
              placeholder="Search in page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button className="gap-2" onClick={handleOpenAddModal}>
            <Plus size={18} />
            Add Client
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
        <Card className="border-red-500/20 bg-red-500/5">
          <CardContent className="flex flex-col items-center justify-center p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-4">
              <User className="text-red-400" size={32} />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Error Loading Clients</h3>
            <p className="text-red-400/80 mb-6">There was a problem fetching the client directory. Is json-server running on port 3001?</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      ) : filteredClients.length === 0 ? (
        <Card className="border-white/10 bg-white/5">
          <CardContent className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Shield className="text-white/30" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Clients Found</h3>
            <p className="text-white/50 mb-6 max-w-md">
              {searchQuery ? "No clients match your search criteria. Try a different term." : "You haven't added any clients yet. Start building your directory."}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={client.image} alt={client.firstName} className="w-10 h-10 rounded-full bg-white/10 border border-white/20" />
                      <div>
                        <div className="font-bold text-white">{client.firstName} {client.lastName}</div>
                        <div className="text-[10px] text-white/40">ID: {client.id}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-white/80">{client.email}</div>
                    <div className="text-xs text-white/50">{client.phone}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-white/80">
                      <Briefcase size={14} className="text-white/40" />
                      {client.company}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="px-3 py-1 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-[10px] font-bold tracking-wider uppercase">
                      {client.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${client.status === 'Active' ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)]'}`} />
                      <span className="text-xs font-bold text-white/70 uppercase tracking-wider">{client.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="text-white/50 hover:text-white hover:bg-white/10" onClick={() => router.push(`/dashboard/clients/${client.id}`)}>
                        <Eye size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white/50 hover:text-cyan-400 hover:bg-cyan-400/10" onClick={() => handleOpenEditModal(client)}>
                        <Edit size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-white/50 hover:text-red-400 hover:bg-red-500/10" onClick={() => setClientToDelete(client.id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-2">
            <p className="text-sm text-white/40">
              Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span> to <span className="text-white font-medium">{Math.min(page * limit, totalCount)}</span> of <span className="text-white font-medium">{totalCount}</span> clients
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>
                <ChevronLeft size={16} />
              </Button>
              <div className="flex gap-1">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <Button 
                    key={i} 
                    variant={page === i + 1 ? "default" : "outline"}
                    className={page === i + 1 ? "w-10" : "w-10 text-white/50 hover:text-white"}
                    onClick={() => setPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
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
          <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
            <Trash2 className="text-red-400" size={24} />
          </div>
          <DialogTitle>Delete Client?</DialogTitle>
          <DialogClose onClick={() => setClientToDelete(null)} />
        </DialogHeader>
        <DialogContent>
          <p className="text-white/60 mb-6">
            This action cannot be undone. This will permanently remove the client from the database.
          </p>
          <div className="flex gap-4">
            <Button variant="outline" className="w-full" onClick={() => setClientToDelete(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" className="w-full" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Client Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogClose onClick={() => setIsAddModalOpen(false)} />
        </DialogHeader>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmitAdd)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" {...form.register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" {...form.register("lastName")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...form.register("phone")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" {...form.register("company")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Input id="role" {...form.register("role")} placeholder="e.g. Admin, User" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input id="status" {...form.register("status")} placeholder="e.g. Active, Inactive" />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isAdding}>
              {isAdding ? "Adding..." : "Add Client"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Client Dialog */}
      <Dialog open={clientToEdit !== null} onOpenChange={(open) => !open && setClientToEdit(null)}>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogClose onClick={() => setClientToEdit(null)} />
        </DialogHeader>
        <DialogContent>
          <form onSubmit={form.handleSubmit(onSubmitEdit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-firstName">First Name</Label>
                <Input id="edit-firstName" {...form.register("firstName")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-lastName">Last Name</Label>
                <Input id="edit-lastName" {...form.register("lastName")} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" {...form.register("email")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input id="edit-phone" {...form.register("phone")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company</Label>
              <Input id="edit-company" {...form.register("company")} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-role">Role</Label>
                <Input id="edit-role" {...form.register("role")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Input id="edit-status" {...form.register("status")} />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
