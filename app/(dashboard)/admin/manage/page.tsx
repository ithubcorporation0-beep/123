import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { FALLBACK_COURSES } from "@/lib/course-catalog";
import { AdminItemManager, ManagedCourseItem } from "@/components/admin/AdminItemManager";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Add & Remove Items | Admin Control Panel",
  description: "Direct control center to add and remove courses and website items.",
};

export default async function AdminManageItemsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect("/login");
  }

  if (currentUser.role !== "admin") {
    if (currentUser.role === "instructor") {
      redirect("/teacher");
    }
    redirect("/student");
  }

  let dbCourses: any[] = [];
  let dbCategories: any[] = [];

  try {
    [dbCourses, dbCategories] = await Promise.all([
      db.course.findMany({
        include: {
          category: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.courseCategory.findMany({
        select: { name: true },
        orderBy: { name: "asc" },
      }),
    ]);
  } catch (err) {
    console.error("[ADMIN_MANAGE_FETCH_ERROR]", err);
  }

  let formattedCourses: ManagedCourseItem[] = [];

  if (dbCourses && dbCourses.length > 0) {
    formattedCourses = dbCourses.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      thumbnail: c.thumbnail,
      categoryName: c.category?.name || "General",
      level: c.level || "BEGINNER",
      price: c.price || 0,
      isPublished: c.isPublished,
      isFeatured: c.isFeatured,
    }));
  } else {
    // If DB has no courses, load the active fallback catalog so admin can add and remove items
    formattedCourses = FALLBACK_COURSES.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      description: c.description,
      thumbnail: c.thumbnail,
      categoryName: c.category?.name || "General",
      level: (c.level?.toUpperCase() as any) || "BEGINNER",
      price: c.price || 0,
      isPublished: true,
      isFeatured: c.isFeatured,
    }));
  }

  const categoryNames =
    dbCategories && dbCategories.length > 0
      ? dbCategories.map((cat) => cat.name)
      : [
          "Business & Leadership",
          "Design & Creative Arts",
          "Science & Technology",
          "Communication & Languages",
          "Finance & Economics",
          "Personal Development",
        ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16">
      <AdminItemManager
        initialCourses={formattedCourses}
        availableCategories={categoryNames}
      />
    </div>
  );
}
