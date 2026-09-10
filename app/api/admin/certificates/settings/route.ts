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

    const settings = await db.adminSetting.findMany({
      where: { group: "certificate" },
    });

    const config: Record<string, string> = {
      cert_enabled: "true",
      cert_title: "Certificate of Completion",
      cert_issuer: "IZBA Learning HUB",
      cert_signature_title: "Academic Director",
      cert_logo_url: "",
    };

    settings.forEach((s) => {
      config[s.key] = s.value;
    });

    return NextResponse.json(config);
  } catch (error: any) {
    console.error("[ADMIN_CERT_SETTINGS_GET]", error);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();

    for (const [key, value] of Object.entries(body)) {
      if (typeof value === "string") {
        await db.adminSetting.upsert({
          where: { key },
          update: { value, group: "certificate" },
          create: { key, value, group: "certificate" },
        });
      }
    }

    await logActivity({
      adminEmail: user.email,
      action: "SETTING_CHANGE",
      targetType: "certificate",
      details: "Updated Certificate design, text, and issuer settings",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_CERT_SETTINGS_POST]", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
