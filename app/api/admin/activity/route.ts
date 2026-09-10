import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action");
    const targetType = searchParams.get("targetType");
    const query = searchParams.get("q") || "";

    const where: any = {};
    if (action && action !== "all") where.action = action;
    if (targetType && targetType !== "all") where.targetType = targetType;
    if (query) {
      where.OR = [
        { details: { contains: query, mode: "insensitive" } },
        { adminEmail: { contains: query, mode: "insensitive" } },
      ];
    }

    const logs = await db.activityLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error("[ADMIN_ACTIVITY_GET]", error);
    return NextResponse.json({ error: error?.message || "Internal Error" }, { status: 500 });
  }
}
