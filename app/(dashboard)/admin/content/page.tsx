import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { WebsiteContentManager, ContentBlock } from "@/components/admin/content/WebsiteContentManager";
import { Badge } from "@/components/ui/badge";
import { Globe } from "lucide-react";

export default async function AdminContentPage() {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    redirect("/admin/login");
  }

  const contentItems = await db.websiteContent.findMany({
    orderBy: [{ section: "asc" }, { position: "asc" }],
  });

  const formatted: ContentBlock[] = contentItems.map((c) => ({
    id: c.id,
    section: c.section,
    key: c.key,
    title: c.title,
    subtitle: c.subtitle,
    content: c.content,
    imageUrl: c.imageUrl,
    videoUrl: c.videoUrl,
    linkUrl: c.linkUrl,
    linkText: c.linkText,
    isPublished: c.isPublished,
    position: c.position,
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-16">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-serif">
            Website Content CMS
          </h1>
          <Badge className="bg-primary/10 text-primary border-primary/20 text-xs uppercase font-bold">
            <Globe className="h-3.5 w-3.5 mr-1" /> Dynamic Site CMS
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Manage landing page copy, Hero headlines, About blurbs, service highlights, FAQs, and testimonials without touching code.
        </p>
      </div>

      <WebsiteContentManager initialBlocks={formatted} />
    </div>
  );
}
