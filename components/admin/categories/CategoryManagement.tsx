"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfirmModal } from "@/components/shared/ConfirmModal";
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
import {
  Edit2,
  FolderPlus,
  Loader2,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
  Upload,
  ChevronUp,
  ChevronDown,
  FolderTree,
} from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  position?: number;
  coursesCount: number;
}

interface CategoryManagementProps {
  categories: CategoryItem[];
}

export function CategoryManagement({ categories: initialCategories }: CategoryManagementProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setImageUrl(cat.imageUrl || "");
    setIsModalOpen(true);
  };

  const handleImageUpload = async (file: File) => {
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "image");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImageUrl(data.url);
      toast.success("Category image uploaded!");
    } catch (error: any) {
      toast.error(error.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    try {
      setIsLoading(true);

      const endpoint = editingCategory
        ? `/api/admin/categories/${editingCategory.id}`
        : "/api/admin/categories";

      const method = editingCategory ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, imageUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      toast.success(
        editingCategory
          ? "Category updated successfully! ✨"
          : "New category created successfully! 🏷️"
      );

      if (editingCategory) {
        setCategories((prev) =>
          prev.map((c) => (c.id === data.id ? { ...c, ...data } : c))
        );
      } else {
        setCategories((prev) => [...prev, { ...data, coursesCount: 0 }]);
      }

      setIsModalOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async (cat: CategoryItem) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      toast.success(`Category "${cat.name}" deleted successfully.`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Could not delete category");
    }
  };

  const handleMove = async (index: number, direction: "up" | "down") => {
    const list = [...categories];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);

    const reordered = list.map((c, idx) => ({ ...c, position: idx + 1 }));
    setCategories(reordered);

    try {
      await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ list: reordered.map((c) => ({ id: c.id, position: c.position })) }),
      });
      toast.success("Category order updated");
    } catch {
      toast.error("Failed to update category order");
    }
  };

  return (
    <div className="space-y-4 animate-fade-in-up">
      {/* Top Search & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories by name or slug..."
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

        <Button
          onClick={openCreateModal}
          className="rounded-2xl gap-2 font-semibold shadow-xs shrink-0"
        >
          <FolderPlus className="h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border border-border/70 overflow-hidden shadow-xs bg-card">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="text-xs font-bold w-14 text-center">Order</TableHead>
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">Slug URL</TableHead>
              <TableHead className="text-xs font-bold">Description</TableHead>
              <TableHead className="text-xs font-bold">Courses</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-xs text-muted-foreground">
                  No categories found.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((cat, idx) => (
                <TableRow key={cat.id} className="hover:bg-muted/30 transition-all duration-200">
                  <TableCell className="text-center py-4">
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
                        disabled={idx === filteredCategories.length - 1}
                        onClick={() => handleMove(idx, "down")}
                        className="h-6 w-6 rounded-md"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>

                  <TableCell className="py-4 font-semibold">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-lg overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} fill unoptimized className="object-cover" />
                        ) : (
                          <Tag className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-xs text-foreground font-bold">{cat.name}</span>
                    </div>
                  </TableCell>

                  <TableCell className="py-4">
                    <span className="text-xs font-mono text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md border">
                      /{cat.slug}
                    </span>
                  </TableCell>

                  <TableCell className="py-4 max-w-xs truncate text-xs text-muted-foreground">
                    {cat.description || "—"}
                  </TableCell>

                  <TableCell className="py-4">
                    <Badge variant="outline" className="text-xs font-semibold">
                      {cat.coursesCount} {cat.coursesCount === 1 ? "course" : "courses"}
                    </Badge>
                  </TableCell>

                  <TableCell className="py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                        className="rounded-xl text-xs h-8 px-2.5 gap-1 hover:bg-muted"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                        Edit
                      </Button>

                      <ConfirmModal
                        title={`Delete Category "${cat.name}"?`}
                        description={
                          cat.coursesCount > 0
                            ? `Cannot delete this category because ${cat.coursesCount} course(s) are currently attached to it.`
                            : "Are you sure you want to delete this category? This action cannot be undone."
                        }
                        confirmText="Delete Category"
                        onConfirm={() => onDelete(cat)}
                        disabled={cat.coursesCount > 0}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={cat.coursesCount > 0}
                          className="rounded-xl text-xs h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10 disabled:opacity-30"
                        >
                          <Trash2 className="h-4 w-4" />
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

      {/* Create / Edit Modal Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {editingCategory
                ? "Update category taxonomy, image, and description."
                : "Create a new course category to organize and tag platform courses."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="cat-name" className="text-xs font-semibold">
                Category Name *
              </Label>
              <Input
                id="cat-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Artificial Intelligence, Web Development"
                className="rounded-xl text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cat-desc" className="text-xs font-semibold">
                Description (optional)
              </Label>
              <Textarea
                id="cat-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of this field of study..."
                rows={3}
                className="rounded-xl text-xs resize-none"
              />
            </div>

            {/* Category Image Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center justify-between">
                <span>Category Image (optional)</span>
                {uploading && (
                  <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                    <Loader2 className="h-3 w-3 animate-spin" /> Uploading...
                  </span>
                )}
              </Label>
              <div className="flex gap-2">
                <Input
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://... or upload image"
                  className="rounded-xl text-xs"
                />
                <label className="cursor-pointer shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleImageUpload(f);
                    }}
                  />
                  <div className="h-9 px-3 rounded-xl border bg-card hover:bg-muted text-xs font-medium flex items-center gap-1.5">
                    <Upload className="h-3.5 w-3.5" />
                  </div>
                </label>
              </div>
              {imageUrl && (
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border bg-muted mt-2">
                  <Image src={imageUrl} alt="Preview" fill unoptimized className="object-cover" />
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="rounded-2xl text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-2xl text-xs font-bold gap-1.5 shadow-sm"
              >
                {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
