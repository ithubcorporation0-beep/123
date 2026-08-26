import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TeacherSettingsForm } from "@/components/teacher/settings/TeacherSettingsForm";

export default async function TeacherSettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="space-y-6 max-w-4xl pb-16">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Instructor Settings
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your author profile, teaching bio, and account credentials.
        </p>
      </div>

      <TeacherSettingsForm
        initialData={{
          bio: user.bio,
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
    </div>
  );
}
