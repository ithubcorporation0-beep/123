import { Metadata } from "next";
import { Suspense } from "react";
import { AdminLessonsView } from "@/components/admin/lessons/AdminLessonsView";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Lessons Management — LMS Admin Panel",
  description: "Create, edit, attach video and documents, reorder, and manage course lessons.",
};

export const dynamic = "force-dynamic";

export default function AdminLessonsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center bg-white rounded-[16px] border border-[#DEDEDE]">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#194866]" />
        </div>
      }
    >
      <AdminLessonsView />
    </Suspense>
  );
}
