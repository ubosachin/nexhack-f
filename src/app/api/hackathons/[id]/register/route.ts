import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

/**
 * POST /api/hackathons/[id]/register
 *
 * Body (individual):
 *   { registrationType: "individual", fullName, email, collegeOrSchool, degreeOrGrade?, phone? }
 *
 * Body (team):
 *   { registrationType: "team", teamId, participatingMemberIds: string[] }
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await params;
    const session = await auth();
    const body = await req.json();

    // Load hackathon
    const hackathon = await dbService.getHackathon(hackathonId);
    if (!hackathon) {
      return NextResponse.json({ success: false, error: "Hackathon not found." }, { status: 404 });
    }

    // Registration window validation
    const now = new Date();
    if (hackathon.registrationStartDate) {
      const start = new Date(hackathon.registrationStartDate);
      if (now < start) {
        return NextResponse.json(
          { success: false, error: `Registration opens on ${start.toLocaleDateString()}.` },
          { status: 400 }
        );
      }
    }
    if (hackathon.registrationEndDate) {
      const end = new Date(hackathon.registrationEndDate);
      if (now > end) {
        return NextResponse.json(
          { success: false, error: "Registration deadline has passed." },
          { status: 400 }
        );
      }
    }
    if (hackathon.status === "Completed") {
      return NextResponse.json(
        { success: false, error: "This hackathon is already completed. Registration is closed." },
        { status: 400 }
      );
    }

    const { registrationType } = body;

    // ── INDIVIDUAL REGISTRATION ──────────────────────────────────────────────
    if (registrationType === "individual") {
      const { fullName, email, collegeOrSchool, degreeOrGrade, phone } = body;
      if (!fullName || !email || !collegeOrSchool) {
        return NextResponse.json(
          { success: false, error: "Name, email, and institution are required." },
          { status: 400 }
        );
      }

      // Duplicate check
      const existing = await dbService.checkExistingRegistration(
        hackathonId,
        email,
        session?.user?.id
      );
      if (existing) {
        return NextResponse.json(
          { success: false, error: "You are already registered for this hackathon." },
          { status: 409 }
        );
      }

      const registration = await dbService.addRegistration({
        fullName,
        email,
        phone,
        collegeOrSchool,
        degreeOrGrade,
        eventOrHackathon: hackathon.name,
        hackathonId,
        registrationType: "individual",
        userId: session?.user?.id,
        role: "Hacker / Participant",
      });

      await dbService.incrementRegisteredCount(hackathonId);

      return NextResponse.json({ success: true, registration }, { status: 201 });
    }

    // ── TEAM REGISTRATION ────────────────────────────────────────────────────
    if (registrationType === "team") {
      if (!session?.user?.id) {
        return NextResponse.json(
          { success: false, error: "You must be signed in to register as a team." },
          { status: 401 }
        );
      }

      const { teamId, participatingMemberIds } = body as {
        teamId: string;
        participatingMemberIds: string[];
      };

      if (!teamId) {
        return NextResponse.json(
          { success: false, error: "teamId is required for team registration." },
          { status: 400 }
        );
      }
      if (!Array.isArray(participatingMemberIds) || participatingMemberIds.length === 0) {
        return NextResponse.json(
          { success: false, error: "Select at least one member to participate." },
          { status: 400 }
        );
      }

      // Load team
      const team = await dbService.getTeam(teamId);
      if (!team) {
        return NextResponse.json({ success: false, error: "Team not found." }, { status: 404 });
      }

      // Must be captain
      if (team.captainId !== session.user.id) {
        return NextResponse.json(
          { success: false, error: "Only the team captain can register the team." },
          { status: 403 }
        );
      }

      // Validate participating members are actual team members
      const memberIds = team.members.map((m) => m.userId);
      const invalid = participatingMemberIds.filter((uid) => !memberIds.includes(uid));
      if (invalid.length > 0) {
        return NextResponse.json(
          { success: false, error: "Some selected participants are not team members." },
          { status: 400 }
        );
      }

      // Team size validation
      const minSize = hackathon.minTeamSize ?? 1;
      const maxSize = hackathon.maxTeamSize ?? 4;
      if (participatingMemberIds.length < minSize) {
        return NextResponse.json(
          {
            success: false,
            error: `Minimum ${minSize} member${minSize !== 1 ? "s" : ""} required to register.`,
          },
          { status: 400 }
        );
      }
      if (participatingMemberIds.length > maxSize) {
        return NextResponse.json(
          {
            success: false,
            error: `Maximum ${maxSize} member${maxSize !== 1 ? "s" : ""} allowed per team.`,
          },
          { status: 400 }
        );
      }

      // Duplicate check (same team)
      const existingTeamReg = await dbService.checkExistingTeamRegistration(hackathonId, teamId);
      if (existingTeamReg) {
        return NextResponse.json(
          { success: false, error: `Team "${team.name}" is already registered for this hackathon.` },
          { status: 409 }
        );
      }

      // Check if any individual member is already registered
      for (const uid of participatingMemberIds) {
        const member = team.members.find((m) => m.userId === uid);
        if (!member) continue;
        const dup = await dbService.checkExistingRegistration(hackathonId, member.email, uid);
        if (dup) {
          return NextResponse.json(
            {
              success: false,
              error: `${member.displayName} is already individually registered for this hackathon.`,
            },
            { status: 409 }
          );
        }
      }

      // Get captain info for registration record
      const captain = team.members.find((m) => m.userId === team.captainId);

      const registration = await dbService.addRegistration({
        fullName: captain?.displayName || "Team Captain",
        email: captain?.email || "",
        collegeOrSchool: "Team Registration",
        eventOrHackathon: hackathon.name,
        hackathonId,
        registrationType: "team",
        teamId,
        teamName: team.name,
        participatingMemberIds,
        userId: session.user.id,
        role: "Hacker / Participant",
      });

      await dbService.incrementRegisteredCount(hackathonId);

      return NextResponse.json({ success: true, registration }, { status: 201 });
    }

    return NextResponse.json(
      { success: false, error: "registrationType must be 'individual' or 'team'." },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
