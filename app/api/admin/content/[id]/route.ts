import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { logActivity } from "@/lib/activity-log";

export const dynamic = "force-dynamic";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await db.websiteContent.update({
      where: { id },
      data: body,
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "content",
      targetId: id,
      details: `Updated website content block: ${updated.key}`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_CONTENT_PATCH]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { id } = await params;

    const item = await db.websiteContent.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    await db.websiteContent.delete({ where: { id } });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "content",
      targetId: id,
      details: `Deleted website CMS block: ${item.key}`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_CONTENT_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
