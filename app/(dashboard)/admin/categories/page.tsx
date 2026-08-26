import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FolderTree } from "lucide-react";

export default async function AdminCategoriesPage() {
  const categories = await db.courseCategory.findMany({
    include: {
      _count: {
        select: { courses: true },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Category Taxonomy</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage subject categories and taxonomies for course organization.
        </p>
      </div>

      <Card className="rounded-2xl border shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-muted/20">
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <FolderTree className="h-4 w-4 text-primary" />
            Configured Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Courses Count</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-semibold text-foreground">{cat.name}</TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">{cat.slug}</TableCell>
                  <TableCell className="font-medium">{cat._count.courses}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(cat.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
