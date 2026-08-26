"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Search, Shield, ShieldAlert, User, X } from "lucide-react";

export interface AdminUserRecord {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: Date | string;
}

interface UserManagementTableProps {
  users: AdminUserRecord[];
  currentUserId: string;
}

export function UserManagementTable({
  users,
  currentUserId,
}: UserManagementTableProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [targetRole, setTargetRole] = useState<string>("");
  const [isUpdating, setIsUpdating] = useState(false);

  const filteredUsers = users.filter((u) => {
    const q = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  const onInitiateRoleChange = (user: AdminUserRecord, newRole: string) => {
    if (user.role === newRole) return;

    if (user.id === currentUserId && newRole !== "admin") {
      toast.error("You cannot remove your own admin privileges");
      return;
    }

    setSelectedUser(user);
    setTargetRole(newRole);
  };

  const onConfirmRoleChange = async () => {
    if (!selectedUser || !targetRole) return;

    try {
      setIsUpdating(true);
      const res = await fetch(`/api/admin/users/${selectedUser.id}/role`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: targetRole }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update role");
      }

      toast.success(
        `Role updated to ${targetRole.toUpperCase()} for ${selectedUser.name || selectedUser.email} 🎉`
      );
      setSelectedUser(null);
      setTargetRole("");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Confirmation Dialog */}
      <Dialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedUser(null);
            setTargetRole("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card">
          <DialogHeader className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center mb-1">
              <ShieldAlert className="h-6 w-6" />
            </div>
            <DialogTitle className="text-xl font-bold">
              Change User Role to {targetRole.toUpperCase()}?
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to change permissions for{" "}
              <strong className="text-foreground font-semibold">
                {selectedUser?.name || selectedUser?.email}
              </strong>{" "}
              from <span className="uppercase font-mono font-bold text-xs">{selectedUser?.role}</span> to{" "}
              <span className="uppercase font-mono font-bold text-xs text-primary">{targetRole}</span>?
              This immediately updates their database record and Clerk authentication metadata.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setSelectedUser(null)}
              disabled={isUpdating}
              className="rounded-xl text-xs"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirmRoleChange}
              disabled={isUpdating}
              className="rounded-xl text-xs font-bold gap-1.5"
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Role Change"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="pl-10 pr-9 rounded-2xl h-10 text-xs bg-card border shadow-xs"
        />
        {searchTerm && (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setSearchTerm("")}
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-muted-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>

      {/* Users Table */}
      <div className="rounded-3xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-bold">User</TableHead>
              <TableHead className="text-xs font-bold">Joined Date</TableHead>
              <TableHead className="text-xs font-bold">Current Role</TableHead>
              <TableHead className="text-xs font-bold text-right">Assign Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => {
              const isSelf = user.id === currentUserId;
              const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <TableRow key={user.id} className="hover:bg-muted/10 transition-colors">
                  {/* User Profile */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                        {user.avatar ? (
                          <Image src={user.avatar} alt={user.name || "User"} fill className="object-cover" />
                        ) : (
                          <User className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-bold text-foreground leading-snug">
                            {user.name || "Unnamed User"}
                          </p>
                          {isSelf && (
                            <Badge variant="outline" className="text-[9px] font-bold px-1.5 py-0">
                              You
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Joined Date */}
                  <TableCell className="py-4 text-xs font-medium text-muted-foreground">
                    {formattedDate}
                  </TableCell>

                  {/* Role Badge */}
                  <TableCell className="py-4">
                    <Badge
                      variant={user.role === "admin" ? "default" : user.role === "instructor" ? "secondary" : "outline"}
                      className="text-[10px] uppercase font-bold"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>

                  {/* Role Dropdown */}
                  <TableCell className="py-4 text-right">
                    <div className="inline-block w-36">
                      <Select
                        defaultValue={user.role}
                        value={user.role}
                        onValueChange={(val) => {
                          if (val) onInitiateRoleChange(user, val);
                        }}
                      >
                        <SelectTrigger className="h-8 rounded-xl text-xs bg-muted/30">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl">
                          <SelectItem value="student" className="text-xs font-medium">
                            Student
                          </SelectItem>
                          <SelectItem value="instructor" className="text-xs font-medium">
                            Instructor
                          </SelectItem>
                          <SelectItem value="admin" className="text-xs font-medium">
                            Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
