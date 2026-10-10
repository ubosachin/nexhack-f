import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dbService } from "@/lib/mongodb";

/**
 * GET /api/user/registrations
 * GET /api/user/registrations?hackathonId=<id>
 *
 * Returns all registrations for the current user.
 * If hackathonId query param is provided, filters to that hackathon only.
 */
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");

    const all = await dbService.getRegistrations();
    const userId = session.user.id;
    const email = session.user.email.toLowerCase();

    let mine = all.filter((r) => {
      // Match by email (individual) or by userId, or as a participating team member
      const emailMatch = r.email.toLowerCase() === email;
      const userMatch = userId && r.userId === userId;
      const memberMatch = userId && Array.isArray(r.participatingMemberIds) && r.participatingMemberIds.includes(userId);
      return emailMatch || userMatch || memberMatch;
    });

    // Filter by hackathon if requested
    if (hackathonId) {
      mine = mine.filter((r) => r.hackathonId === hackathonId);
    }

    return NextResponse.json({ success: true, registrations: mine });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
