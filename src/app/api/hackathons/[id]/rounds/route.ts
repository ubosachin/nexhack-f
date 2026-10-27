import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

/**
 * GET /api/hackathons/[id]/rounds
 * Returns published rounds for a hackathon (public endpoint).
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: hackathonId } = await params;
    const rounds = await dbService.getRoundsByHackathon(hackathonId, true); // published only
    return NextResponse.json({ success: true, rounds });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
