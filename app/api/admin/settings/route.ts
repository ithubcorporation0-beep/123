import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const settings = await db.adminSetting.findMany();
    const map: Record<string, string> = {};
    settings.forEach((s) => {
      map[s.key] = s.value;
    });

    return NextResponse.json(map);
  } catch (error: any) {
    console.error("[ADMIN_SETTINGS_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();

    for (const [key, val] of Object.entries(body)) {
      if (typeof val === "string") {
        await db.adminSetting.upsert({
          where: { key },
          update: { value: val },
          create: { key, value: val, group: "general" },
        });
      }
    }

    await logActivity({
      adminEmail: user.email,
      action: "SETTING_CHANGE",
      targetType: "setting",
      details: "Updated platform LMS general configuration settings",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_SETTINGS_POST]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
