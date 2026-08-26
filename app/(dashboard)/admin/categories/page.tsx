import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CategoryManagement, CategoryItem } from "@/components/admin/categories/CategoryManagement";

export default async function AdminCategoriesPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser || currentUser.role !== "admin") {
    redirect("/login");
  }

  const categories = await db.courseCategory.findMany({
    include: {
      _count: {
        select: {
          courses: true,
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  const formattedCategories: CategoryItem[] = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description,
    coursesCount: c._count.courses,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Category Taxonomy
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage subject classifications, topics, and catalog filtering tags.
        </p>
      </div>

      <CategoryManagement categories={formattedCategories} />
    </div>
  );
}
