import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string; roundId: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { roundId } = await params;
    const round = await dbService.getRound(roundId);
    if (!round) return NextResponse.json({ success: false, error: "Round not found" }, { status: 404 });
    return NextResponse.json({ success: true, round });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const { roundId } = await params;
    const body = await req.json();
    const { id: _id, hackathonId: _hid, createdAt: _ca, updatedAt: _ua, ...updates } = body;
    const ok = await dbService.updateRound(roundId, updates);
    return NextResponse.json({ success: ok });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { roundId } = await params;
    const ok = await dbService.deleteRound(roundId);
    return NextResponse.json({ success: ok });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
