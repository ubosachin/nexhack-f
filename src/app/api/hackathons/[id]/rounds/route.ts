import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

/**
 * GET /api/hackathons/[id]/rounds
 *
 * Returns published rounds — but ONLY after registration has closed.
 * Rounds are part of the post-registration phase; they must not be visible
 * while registration is still open.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await params;

    const hackathon = await dbService.getHackathon(hackathonId);
    if (!hackathon) {
      return NextResponse.json({ success: false, error: "Hackathon not found." }, { status: 404 });
    }

    // Gate: rounds are only accessible after registration is closed
    const now = new Date();
    const regOpen = !hackathon.registrationEndDate || now <= new Date(hackathon.registrationEndDate);
    const regNotStarted = hackathon.registrationStartDate && now < new Date(hackathon.registrationStartDate);

    if (regNotStarted || regOpen) {
      // Registration is still open (or hasn't closed yet) — return empty list silently
      return NextResponse.json({ success: true, rounds: [], registrationStillOpen: true });
    }

    const rounds = await dbService.getRoundsByHackathon(hackathonId, true); // published only
    return NextResponse.json({ success: true, rounds });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
