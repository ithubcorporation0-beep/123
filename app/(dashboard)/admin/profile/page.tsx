import { Metadata } from "next";
import { AdminProfileView } from "@/components/admin/profile/AdminProfileView";

export const metadata: Metadata = {
  title: "Admin Profile — LMS Admin Panel",
  description: "Manage administrator identity, credentials, role authorizations, and audit status.",
};

export const dynamic = "force-dynamic";

export default function AdminProfilePage() {
  return <AdminProfileView />;
}
