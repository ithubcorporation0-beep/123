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

  const categories = await db.courseCategory.findMany({
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

  const formattedCategories: CategoryItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    imageUrl: c.imageUrl,
    position: c.position,
    coursesCount: c._count.courses,
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
