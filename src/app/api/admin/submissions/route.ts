import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

/**
 * GET /api/admin/submissions?hackathonId=<id>&roundId=<id>
 * Returns all submissions for a hackathon, optionally filtered by round.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");
    const roundId = searchParams.get("roundId");

    if (!hackathonId) {
      return NextResponse.json({ success: false, error: "hackathonId is required" }, { status: 400 });
    }

    const submissions = roundId
      ? await dbService.getSubmissionsByRound(hackathonId, roundId)
      : await dbService.getSubmissionsByHackathon(hackathonId);

    return NextResponse.json({ success: true, submissions });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
