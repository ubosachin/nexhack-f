import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";
import { sendTeamInvitationEmail } from "@/lib/mailer";
import crypto from "crypto";

/**
 * POST /api/teams/[id]/invite
 * Body: { email: string }
 *
 * Sends an email invitation to join the team for a hackathon.
 * Only the team captain can invite.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.name) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: teamId } = await params;
    const team = await dbService.getTeam(teamId);
    if (!team) return NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });
    if (team.captainId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Only the team captain can invite members." }, { status: 403 });
    }

    const hackathon = team.hackathonId ? await dbService.getHackathon(team.hackathonId) : null;

    const body = await req.json();
    const invitedEmail = body.email?.toLowerCase().trim();
    if (!invitedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(invitedEmail)) {
      return NextResponse.json({ success: false, error: "Valid email address required." }, { status: 400 });
    }

    // Cannot invite yourself
    if (invitedEmail === session.user.email?.toLowerCase()) {
      return NextResponse.json({ success: false, error: "You cannot invite yourself." }, { status: 400 });
    }

    // Check team capacity
    const maxSize = hackathon?.maxTeamSize ?? team.maxSize;
    if (team.members.length >= maxSize) {
      return NextResponse.json({ success: false, error: `Team is already at maximum size (${maxSize}).` }, { status: 400 });
    }

    // Already a member?
    if (team.members.some((m) => m.email.toLowerCase() === invitedEmail)) {
      return NextResponse.json({ success: false, error: "This person is already a team member." }, { status: 409 });
    }

    // Generate secure token (expires in 7 days)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const invitation = await dbService.createInvitation({
      hackathonId: team.hackathonId || "",
      teamId,
      teamName: team.name,
      invitedEmail,
      invitedByUserId: session.user.id,
      invitedByName: session.user.name,
      token,
      expiresAt,
    });

    // Send email
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexhack.in";
    await sendTeamInvitationEmail({
      to: invitedEmail,
      invitedByName: session.user.name,
      teamName: team.name,
      hackathonName: hackathon?.name || "NEXHACK Hackathon",
      acceptUrl: `${baseUrl}/invitations/${token}/accept`,
      declineUrl: `${baseUrl}/invitations/${token}/decline`,
      expiresAt,
    });

    return NextResponse.json({ success: true, invitation }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

/** GET — list all invitations for this team (captain only) */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id: teamId } = await params;
    const team = await dbService.getTeam(teamId);
    if (!team) return NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });
    if (team.captainId !== session.user.id) return NextResponse.json({ success: false, error: "Captain only." }, { status: 403 });
    const invitations = await dbService.getInvitationsByTeam(teamId);
    return NextResponse.json({ success: true, invitations });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
