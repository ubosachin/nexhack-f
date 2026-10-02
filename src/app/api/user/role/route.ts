import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({
        success: false,
        role: "none",
        isAdmin: false,
      });
    }

    const userId = session.user.id || "";
    const userEmail = session.user.email || "";

    const role = await dbService.getUserRole(userId, userEmail);
    const isAdmin = String(role || "").toLowerCase().trim() === "admin";

    return NextResponse.json({
      success: true,
      role: isAdmin ? "admin" : "user",
      isAdmin,
      email: userEmail,
      userId,
    });
  } catch (error: any) {
    console.error("Error in /api/user/role:", error);
    return NextResponse.json(
      { success: false, role: "user", isAdmin: false, error: error?.message },
      { status: 500 }
    );
  }
}
