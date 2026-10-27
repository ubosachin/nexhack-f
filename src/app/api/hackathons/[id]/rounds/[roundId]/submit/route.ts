import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";
import { sendSubmissionConfirmationEmail } from "@/lib/mailer";

type Params = { params: Promise<{ id: string; roundId: string }> };

/**
 * POST /api/hackathons/[id]/rounds/[roundId]/submit
 * Submits or updates a submission for a round.
 *
 * GET returns the current user's/team's existing submission for this round.
 */
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const { id: hackathonId, roundId } = await params;

    // Find the user's team registration for this hackathon
    const teams = await dbService.getTeamsByUserId(session.user.id);
    const hackathonTeam = teams.find((t) => t.hackathonId === hackathonId);

    const submission = await dbService.getSubmissionByTeamAndRound(
      hackathonId,
      roundId,
      hackathonTeam?.id,
      session.user.id
    );
    return NextResponse.json({ success: true, submission: submission || null });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ success: false, error: "You must be signed in to submit." }, { status: 401 });
    }
    const { id: hackathonId, roundId } = await params;

    // Load round
    const round = await dbService.getRound(roundId);
    if (!round) return NextResponse.json({ success: false, error: "Round not found." }, { status: 404 });
    if (round.hackathonId !== hackathonId) return NextResponse.json({ success: false, error: "Round does not belong to this hackathon." }, { status: 400 });
    if (!round.isPublished) return NextResponse.json({ success: false, error: "This round is not open yet." }, { status: 400 });
    if (round.status === "Closed" || round.status === "Completed") {
      return NextResponse.json({ success: false, error: "The submission deadline for this round has passed." }, { status: 400 });
    }
    if (round.deadline) {
      if (new Date() > new Date(round.deadline)) {
        return NextResponse.json({ success: false, error: "The submission deadline has passed." }, { status: 400 });
      }
    }

    // Verify user is registered for this hackathon
    const registration = await dbService.checkExistingRegistration(hackathonId, session.user.email, session.user.id);
    if (!registration) {
      return NextResponse.json({ success: false, error: "You are not registered for this hackathon." }, { status: 403 });
    }

    // Check if resubmission is allowed
    const teams = await dbService.getTeamsByUserId(session.user.id);
    const hackathonTeam = teams.find((t) => t.hackathonId === hackathonId);
    const existing = await dbService.getSubmissionByTeamAndRound(hackathonId, roundId, hackathonTeam?.id, session.user.id);
    if (existing && !round.allowResubmission) {
      return NextResponse.json({ success: false, error: "Resubmission is not allowed for this round." }, { status: 409 });
    }

    const body = await req.json();
    const now = new Date().toISOString();
    const submission = await dbService.upsertSubmission({
      hackathonId,
      roundId,
      teamId: hackathonTeam?.id,
      teamName: hackathonTeam?.name,
      userId: session.user.id,
      registrationId: registration.id,
      textContent: body.textContent,
      githubUrl: body.githubUrl,
      demoUrl: body.demoUrl,
      videoUrl: body.videoUrl,
      customFieldValues: body.customFieldValues,
      files: body.files || [],
      status: "Submitted",
      submittedAt: existing?.submittedAt || now,
      lastUpdatedAt: now,
    });

    // Send confirmation (non-blocking)
    const hackathon = await dbService.getHackathon(hackathonId);
    const baseUrl = process.env.NEXTAUTH_URL || "https://nexhack.in";
    sendSubmissionConfirmationEmail({
      to: session.user.email,
      teamName: hackathonTeam?.name,
      hackathonName: hackathon?.name || "NEXHACK",
      roundName: round.name,
      dashboardUrl: `${baseUrl}/hackathons/${hackathonId}`,
    }).catch(() => {});

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
