import { db } from "@/lib/db";

export interface LogActivityParams {
  adminEmail?: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "UPLOAD" | "SETTING_CHANGE" | "LOGIN" | "STATUS_CHANGE";
  targetType: "course" | "lesson" | "module" | "user" | "category" | "media" | "content" | "setting" | "enrollment" | "certificate";
  targetId?: string;
  details?: string;
}

export async function logActivity({
  adminEmail = "admin@lms.local",
  action,
  targetType,
  targetId,
  details,
}: LogActivityParams) {
  try {
    return await db.activityLog.create({
      data: {
        adminEmail,
        action,
        targetType,
        targetId,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to log activity to database:", error);
    return null;
  }
}
