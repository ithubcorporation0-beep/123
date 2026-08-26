"use client";

import { useState } from "react";
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
import { Edit2, FolderPlus, Loader2, Plus, Search, Tag, Trash2, X } from "lucide-react";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  coursesCount: number;
}

interface CategoryManagementProps {
  categories: CategoryItem[];
}

export function CategoryManagement({ categories }: CategoryManagementProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openCreateModal = () => {
    setEditingCategory(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || "");
    setIsModalOpen(true);
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
        body: JSON.stringify({ name, description }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save category");
      }

      toast.success(
        editingCategory
          ? "Category updated successfully! 🎉"
          : "Category created successfully! 🎉"
      );

      setIsModalOpen(false);
      setName("");
      setDescription("");
      setEditingCategory(null);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onDeleteCategory = async (cat: CategoryItem) => {
    try {
      const res = await fetch(`/api/admin/categories/${cat.id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete category");
      }

      toast.success(`Category "${cat.name}" deleted`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete category");
    }
  };

  const previewSlug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return (
    <div className="space-y-4">
      {/* Category Create/Edit Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 bg-card">
          <form onSubmit={onSubmit} className="space-y-4">
            <DialogHeader className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
                <Tag className="h-6 w-6" />
              </div>
              <DialogTitle className="text-xl font-bold">
                {editingCategory ? "Edit Category" : "Create New Category"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Categories help students filter and discover courses in the catalog.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="category-name" className="text-xs font-semibold">
                  Category Name
                </Label>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Artificial Intelligence"
                  className="rounded-2xl h-10 text-xs"
                  required
                />
                {previewSlug && (
                  <p className="text-[11px] text-muted-foreground">
                    URL Slug: <code className="font-mono text-primary font-bold">/courses?category={previewSlug}</code>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="category-desc" className="text-xs font-semibold">
                  Description (Optional)
                </Label>
                <Textarea
                  id="category-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of topic domain..."
                  rows={3}
                  className="rounded-2xl resize-none text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                disabled={isLoading}
                className="rounded-xl text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="rounded-xl text-xs font-bold gap-1.5"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : editingCategory ? (
                  "Save Changes"
                ) : (
                  "Create Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Toolbar: Search and Create Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-sm w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search categories..."
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
          size="sm"
          className="rounded-2xl text-xs font-bold gap-1.5 shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Categories Table */}
      <div className="rounded-3xl border bg-card shadow-xs overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30">
              <TableHead className="text-xs font-bold">Category</TableHead>
              <TableHead className="text-xs font-bold">URL Slug</TableHead>
              <TableHead className="text-xs font-bold">Assigned Courses</TableHead>
              <TableHead className="text-xs font-bold text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.map((cat) => (
              <TableRow key={cat.id} className="hover:bg-muted/10 transition-colors">
                <TableCell className="py-4 font-bold text-sm text-foreground">
                  <div>
                    <p>{cat.name}</p>
                    {cat.description && (
                      <p className="text-xs font-normal text-muted-foreground line-clamp-1 mt-0.5">
                        {cat.description}
                      </p>
                    )}
                  </div>
                </TableCell>

                <TableCell className="py-4">
                  <Badge variant="outline" className="font-mono text-xs">
                    {cat.slug}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-xs font-semibold">
                  <Badge variant="secondary" className="text-xs">
                    {cat.coursesCount} {cat.coursesCount === 1 ? "course" : "courses"}
                  </Badge>
                </TableCell>

                <TableCell className="py-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Button
                      onClick={() => openEditModal(cat)}
                      variant="ghost"
                      size="sm"
                      className="rounded-xl text-xs h-8 w-8 p-0"
                      title="Edit Category"
                    >
                      <Edit2 className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </Button>

                    <ConfirmModal
                      title={`Delete "${cat.name}"?`}
                      description={
                        cat.coursesCount > 0
                          ? `Warning: This category has ${cat.coursesCount} active courses. You cannot delete it until all courses are reassigned.`
                          : `Are you sure you want to delete category "${cat.name}"?`
                      }
                      confirmText="Delete Category"
                      onConfirm={() => onDeleteCategory(cat)}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="rounded-xl text-xs h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        title="Delete Category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </ConfirmModal>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
