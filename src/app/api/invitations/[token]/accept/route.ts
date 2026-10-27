import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";
import { sendInvitationAcceptedEmail } from "@/lib/mailer";

type Params = { params: Promise<{ token: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ success: false, error: "You must be signed in to accept an invitation." }, { status: 401 });
    }

    const { token } = await params;
    const invitation = await dbService.getInvitationByToken(token);
    if (!invitation) return NextResponse.json({ success: false, error: "Invitation not found." }, { status: 404 });
    if (invitation.status !== "Pending") return NextResponse.json({ success: false, error: `This invitation is already ${invitation.status.toLowerCase()}.` }, { status: 400 });
    if (new Date() > new Date(invitation.expiresAt)) {
      await dbService.updateInvitation(invitation.id, { status: "Expired" });
      return NextResponse.json({ success: false, error: "This invitation has expired." }, { status: 400 });
    }

    // Must match invited email
    if (session.user.email.toLowerCase() !== invitation.invitedEmail) {
      return NextResponse.json({
        success: false,
        error: `This invitation was sent to ${invitation.invitedEmail}. Please sign in with that email to accept.`,
      }, { status: 403 });
    }

    // Load team
    const team = await dbService.getTeam(invitation.teamId);
    if (!team) return NextResponse.json({ success: false, error: "Team no longer exists." }, { status: 404 });

    // Check capacity again
    const hackathon = invitation.hackathonId ? await dbService.getHackathon(invitation.hackathonId) : null;
    const maxSize = hackathon?.maxTeamSize ?? team.maxSize;
    if (team.members.length >= maxSize) {
      return NextResponse.json({ success: false, error: "Team is now full." }, { status: 400 });
    }

    // Check not already a member
    if (team.members.some((m) => m.userId === session.user.id || m.email.toLowerCase() === invitation.invitedEmail)) {
      await dbService.updateInvitation(invitation.id, { status: "Accepted", acceptedByUserId: session.user.id });
      return NextResponse.json({ success: true, message: "You are already in this team." });
    }

    // Get profile for display info
    const profile = await dbService.getUserProfile(session.user.id);
    const displayName = profile?.displayName || session.user.name || invitation.invitedEmail;

    // Add to team
    await dbService.addTeamMember(invitation.teamId, {
      userId: session.user.id,
      displayName,
      email: invitation.invitedEmail,
      avatarUrl: profile?.avatarUrl || session.user.image || undefined,
      role: "member",
      joinedAt: new Date().toISOString(),
    });

    await dbService.updateInvitation(invitation.id, { status: "Accepted", acceptedByUserId: session.user.id });

    // Notify captain (non-blocking)
    const captain = await dbService.getUserProfile(invitation.invitedByUserId);
    if (captain?.email) {
      const baseUrl = process.env.NEXTAUTH_URL || "https://nexhack.in";
      sendInvitationAcceptedEmail({
        to: captain.email,
        memberName: displayName,
        teamName: invitation.teamName,
        hackathonName: hackathon?.name || "NEXHACK Hackathon",
        dashboardUrl: `${baseUrl}/team/dashboard`,
      }).catch(() => {});
    }

    await dbService.logAction("Invitation Accepted", `${invitation.invitedEmail} → team:${invitation.teamId}`, displayName);
    return NextResponse.json({ success: true, message: "You have joined the team!", teamId: invitation.teamId });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
