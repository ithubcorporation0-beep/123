"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Compass,
  Plus,
  Trash2,
  Edit2,
  ChevronUp,
  ChevronDown,
  Loader2,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/shared/ConfirmModal";

export interface NavigationRecord {
  id: string;
  label: string;
  url: string;
  location: string;
  position: number;
  isActive: boolean;
  openInNewTab: boolean;
}

interface NavigationManagerViewProps {
  initialItems: NavigationRecord[];
}

export function NavigationManagerView({ initialItems }: NavigationManagerViewProps) {
  const [items, setItems] = useState<NavigationRecord[]>(initialItems);
  const [activeLocation, setActiveLocation] = useState<string>("header");
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<NavigationRecord | null>(null);

  // Form State
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [location, setLocation] = useState("header");
  const [isActive, setIsActive] = useState(true);
  const [openInNewTab, setOpenInNewTab] = useState(false);

  const currentItems = items.filter((i) => i.location === activeLocation);

  const openCreateDialog = () => {
    setEditingItem(null);
    setLabel("");
    setUrl("/");
    setLocation(activeLocation);
    setIsActive(true);
    setOpenInNewTab(false);
    setIsOpen(true);
  };

  const openEditDialog = (item: NavigationRecord) => {
    setEditingItem(item);
    setLabel(item.label);
    setUrl(item.url);
    setLocation(item.location);
    setIsActive(item.isActive);
    setOpenInNewTab(item.openInNewTab);
    setIsOpen(true);
  };

  const handleSave = async () => {
    if (!label.trim() || !url.trim()) {
      toast.error("Label and URL are required");
      return;
    }

    try {
      setLoading(true);

      if (editingItem) {
        const res = await fetch(`/api/admin/navigation/${editingItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, url, location, isActive, openInNewTab }),
        });
        if (!res.ok) throw new Error("Failed to update item");
        const updated = await res.json();
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
        toast.success("Navigation item updated");
      } else {
        const res = await fetch("/api/admin/navigation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ label, url, location, isActive, openInNewTab }),
        });
        if (!res.ok) throw new Error("Failed to create item");
        const created = await res.json();
        setItems((prev) => [...prev, created]);
        toast.success("Navigation link added");
      }

      setIsOpen(false);
    } catch (error: any) {
      toast.error(error.message || "Failed to save link");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/navigation/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete link");

      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Link removed");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete link");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const subset = [...currentItems];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= subset.length) return;

    const [moved] = subset.splice(index, 1);
    subset.splice(targetIndex, 0, moved);

    const reordered = subset.map((item, idx) => ({ ...item, position: idx + 1 }));

    setItems((prev) => [
      ...prev.filter((i) => i.location !== activeLocation),
      ...reordered,
    ]);

    try {
      await fetch("/api/admin/navigation", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          list: reordered.map((r) => ({ id: r.id, position: r.position })),
        }),
      });
      toast.success("Menu order updated");
    } catch {
      toast.error("Failed to update order");
    }
  };

  return (
    <div className="space-y-6">
      {/* Location Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-card border shadow-xs">
        <div className="flex items-center gap-2">
          {["header", "footer", "topbar"].map((loc) => (
            <Button
              key={loc}
              variant={activeLocation === loc ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveLocation(loc)}
              className="rounded-xl text-xs capitalize h-8 font-semibold"
            >
              {loc} Menu
            </Button>
          ))}
        </div>

        <Button onClick={openCreateDialog} size="sm" className="rounded-xl text-xs gap-1.5 font-bold shadow-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Menu Item
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden bg-card shadow-xs">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold w-16 text-center">Order</TableHead>
              <TableHead className="text-xs font-bold">Label</TableHead>
              <TableHead className="text-xs font-bold">Target Route / URL</TableHead>
              <TableHead className="text-xs font-bold">New Tab</TableHead>
              <TableHead className="text-xs font-bold">Status</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No custom items defined for {activeLocation}. Using default public menu.
                </TableCell>
              </TableRow>
            ) : (
              currentItems.map((item, idx) => (
                <TableRow key={item.id} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="text-center py-3">
                    <div className="flex items-center justify-center gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === 0}
                        onClick={() => handleMove(idx, "up")}
                        className="h-6 w-6 rounded-md"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={idx === currentItems.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="h-6 w-6 rounded-md"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-xs font-bold text-foreground">
                    {item.label}
                  </TableCell>

                  <TableCell className="py-3 text-xs font-mono text-muted-foreground">
                    {item.url}
                  </TableCell>

                  <TableCell className="py-3 text-xs">
                    {item.openInNewTab ? (
                      <span className="text-primary font-semibold flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" /> Yes
                      </span>
                    ) : (
                      <span className="text-muted-foreground">No</span>
                    )}
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge variant={item.isActive ? "default" : "secondary"} className="text-[10px] uppercase font-bold">
                      {item.isActive ? "Active" : "Disabled"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        className="h-7 w-7 rounded-lg"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <ConfirmModal
                        onConfirm={() => handleDelete(item.id)}
                        title="Delete Menu Link"
                        description={`Remove "${item.label}" from ${item.location} navigation?`}
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </ConfirmModal>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* --- Add / Edit Dialog --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Navigation Link" : "Add Navigation Link"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Menu Label *</label>
              <Input
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Courses, About Us, Resources"
                className="rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Target Route / URL *</label>
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="e.g. /courses or https://external-docs.com"
                className="rounded-xl text-sm font-mono text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Menu Placement</label>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border bg-background text-sm"
              >
                <option value="header">Header Navigation</option>
                <option value="footer">Footer Links</option>
                <option value="topbar">Topbar Banner</option>
              </select>
            </div>

            <div className="space-y-2 pt-1">
              <div
                onClick={() => setOpenInNewTab(!openInNewTab)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  openInNewTab ? "bg-primary/5 border-primary/40" : "bg-card"
                }`}
              >
                <span className="text-xs font-semibold">Open link in new browser tab</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    openInNewTab ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {openInNewTab && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
              </div>

              <div
                onClick={() => setIsActive(!isActive)}
                className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                  isActive ? "bg-primary/5 border-primary/40" : "bg-card"
                }`}
              >
                <span className="text-xs font-semibold">Item Enabled & Visible</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isActive ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/40"
                  }`}
                >
                  {isActive && <CheckCircle2 className="h-3.5 w-3.5" />}
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="rounded-xl font-bold">
              {loading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
              Save Link
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
