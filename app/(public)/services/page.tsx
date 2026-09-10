import { redirect } from "next/navigation";

export const metadata = {
  title: "Course Catalog — IZBA Learning HUB",
  description: "Explore all structured courses, hands-on modules, and verified credentials.",
};

export default function ServicesPage() {
  redirect("/courses");
}
