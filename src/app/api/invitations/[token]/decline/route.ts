import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

type Params = { params: Promise<{ token: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { token } = await params;
    const invitation = await dbService.getInvitationByToken(token);
    if (!invitation) return NextResponse.json({ success: false, error: "Invitation not found." }, { status: 404 });
    if (invitation.status !== "Pending") return NextResponse.json({ success: false, error: `Invitation already ${invitation.status.toLowerCase()}.` }, { status: 400 });
    if (session.user.email?.toLowerCase() !== invitation.invitedEmail) {
      return NextResponse.json({ success: false, error: "Email mismatch." }, { status: 403 });
    }
    await dbService.updateInvitation(invitation.id, { status: "Declined" });
    return NextResponse.json({ success: true, message: "Invitation declined." });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
