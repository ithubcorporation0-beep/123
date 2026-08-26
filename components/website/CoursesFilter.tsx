"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CoursesFilterProps {
  categories: Category[];
}

export function CoursesFilter({ categories }: CoursesFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentCategoryId = searchParams.get("categoryId") || searchParams.get("category");
  const currentTitle = searchParams.get("title") || searchParams.get("search") || "";

  const [title, setTitle] = useState(currentTitle);
  const debouncedTitle = useDebounce(title, 400);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (debouncedTitle) {
      params.set("title", debouncedTitle);
    } else {
      params.delete("title");
      params.delete("search");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [debouncedTitle, pathname, router]);

  const onSelectCategory = (categoryId: string | null) => {
    const params = new URLSearchParams(searchParams.toString());

    if (categoryId) {
      params.set("categoryId", categoryId);
    } else {
      params.delete("categoryId");
      params.delete("category");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearSearch = () => {
    setTitle("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("title");
    params.delete("search");
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="space-y-5 mb-10">
      {/* Search Input Bar */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Search courses by title or topic..."
          className="pl-10 pr-10 rounded-2xl h-12 text-sm bg-card border shadow-xs"
        />
        {title && (
          <Button
            size="icon"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <Badge
          onClick={() => onSelectCategory(null)}
          variant={!currentCategoryId ? "default" : "outline"}
          className="cursor-pointer py-1.5 px-4 text-xs font-semibold rounded-full transition-all shrink-0 select-none shadow-xs"
        >
          All Subjects
        </Badge>
        {categories.map((cat) => {
          const isSelected = currentCategoryId === cat.id || currentCategoryId === cat.slug;
          return (
            <Badge
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              variant={isSelected ? "default" : "outline"}
              className="cursor-pointer py-1.5 px-4 text-xs font-semibold rounded-full transition-all shrink-0 select-none shadow-xs"
            >
              {cat.name}
            </Badge>
          );
        })}
      </div>
    </div>
  );
}
