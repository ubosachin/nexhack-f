import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";
import { sendRegistrationVerifiedEmail } from "@/lib/mailer";

/**
 * POST /api/hackathons/[id]/verify-code
 * Body: { code: string, fullName?: string, phone?: string, collegeOrSchool?: string }
 *
 * Validates an Unstop/admin-issued code and creates a verified registration.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await params;
    const session = await auth();

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ success: false, error: "You must be signed in to verify a code." }, { status: 401 });
    }

    const hackathon = await dbService.getHackathon(hackathonId);
    if (!hackathon) {
      return NextResponse.json({ success: false, error: "Hackathon not found." }, { status: 404 });
    }
    if (hackathon.status === "Completed") {
      return NextResponse.json({ success: false, error: "This hackathon is completed." }, { status: 400 });
    }

    const body = await req.json();
    const { code, fullName, phone, collegeOrSchool } = body;

    if (!code?.trim()) {
      return NextResponse.json({ success: false, error: "Verification code is required." }, { status: 400 });
    }

    // Check not already registered
    const existing = await dbService.checkExistingRegistration(hackathonId, session.user.email, session.user.id);
    if (existing) {
      return NextResponse.json({ success: false, error: "You are already registered for this hackathon." }, { status: 409 });
    }

    // Validate & redeem code
    const result = await dbService.validateAndRedeemCode(hackathonId, code, session.user.id, session.user.email);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    // Create registration
    const registration = await dbService.addRegistration({
      fullName: fullName || session.user.name || "Participant",
      email: session.user.email,
      phone: phone || undefined,
      collegeOrSchool: collegeOrSchool || "Verified via Unstop",
      eventOrHackathon: hackathon.name,
      hackathonId,
      registrationType: "individual",
      userId: session.user.id,
      role: "Hacker / Participant",
      status: "Confirmed",
    });
    await dbService.incrementRegisteredCount(hackathonId);

    // Send confirmation email (non-blocking)
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexhack.in";
    sendRegistrationVerifiedEmail({
      to: session.user.email,
      name: fullName || session.user.name || "Participant",
      hackathonName: hackathon.name,
      dashboardUrl: `${baseUrl}/hackathons/${hackathonId}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, registration }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
