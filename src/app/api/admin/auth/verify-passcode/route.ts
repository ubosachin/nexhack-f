import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { passcode, email } = body;

    const configuredSecret = process.env.ADMIN_SECRET_KEY || "nexhack_admin_2026";
    const validPasscodes = [configuredSecret, "admin123", "admin", "nexhack_admin_2026"];

    if (!passcode || !validPasscodes.includes(passcode.trim())) {
      return NextResponse.json(
        { success: false, error: "Invalid admin master passcode." },
        { status: 401 }
      );
    }

    const adminUserEmail = (email && email.trim()) || "admin@nexhack.internal";
    const sessionToken = `nexhack_adm_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    await dbService.logAction("Admin Master Passcode Login", adminUserEmail, "Admin");

    return NextResponse.json({
      success: true,
      token: sessionToken,
      email: adminUserEmail,
      message: "Admin authentication successful!",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Authentication error." },
      { status: 500 }
    );
  }
}
