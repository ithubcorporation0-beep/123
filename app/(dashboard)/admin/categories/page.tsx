import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryManagement, CategoryItem } from "@/components/admin/categories/CategoryManagement";
import { Badge } from "@/components/ui/badge";
import { FolderTree } from "lucide-react";

export default async function AdminCategoriesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/admin/login");
  }

  let categories: any[] = [];
  try {
    categories = await db.courseCategory.findMany({
      include: {
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: [
        { position: "asc" },
        { name: "asc" },
      ],
    });
  } catch (err) {
    console.warn("[ADMIN_CATEGORIES_WARN]", err);
  }

  const formattedCategories: CategoryItem[] = (categories || []).map((c) => ({
    id: c.id,
    name: c.name || "Category",
    slug: c.slug || "category",
    description: c.description || null,
    imageUrl: c.imageUrl || null,
    position: c.position ?? 0,
    coursesCount: c._count?.courses ?? 0,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Category Taxonomy
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <FolderTree className="h-3.5 w-3.5 mr-1" /> Taxonomy CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Add, edit, reorder, and illustrate course categories to organize subjects across the platform.
        </p>
      </div>

      <CategoryManagement categories={formattedCategories} />
    </div>
  );
}
