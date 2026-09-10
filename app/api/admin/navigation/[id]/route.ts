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

    const updated = await db.navigationItem.update({
      where: { id },
      data: body,
    });

    await logActivity({
      adminEmail: user.email,
      action: "UPDATE",
      targetType: "content",
      targetId: id,
      details: `Updated navigation link: "${updated.label}"`,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("[ADMIN_NAVIGATION_PATCH]", error);
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

    const item = await db.navigationItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
    }

    await db.navigationItem.delete({ where: { id } });

    await logActivity({
      adminEmail: user.email,
      action: "DELETE",
      targetType: "content",
      targetId: id,
      details: `Deleted navigation link: "${item.label}"`,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[ADMIN_NAVIGATION_DELETE]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
