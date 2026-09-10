import { Metadata } from "next";
import { AdminModulesView } from "@/components/admin/modules/AdminModulesView";

export const metadata: Metadata = {
  title: "Modules Management — LMS Admin Panel",
  description: "Create, edit, reorder, and manage course curriculum modules and syllabi.",
};

export const dynamic = "force-dynamic";

export default function AdminModulesPage() {
  return <AdminModulesView />;
}
