import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: hackathonId } = await params;
    const rounds = await dbService.getRoundsByHackathon(hackathonId);
    return NextResponse.json({ success: true, rounds });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: hackathonId } = await params;
    const body = await req.json();
    if (!body.name?.trim()) {
      return NextResponse.json({ success: false, error: "Round name is required." }, { status: 400 });
    }

    // Existing rounds for this hackathon to auto-number
    const existing = await dbService.getRoundsByHackathon(hackathonId);
    const roundNumber = body.roundNumber ?? (existing.length + 1);

    const round = await dbService.createRound({
      hackathonId,
      name: body.name.trim(),
      description: body.description || "",
      instructions: body.instructions || "",
      roundNumber,
      submissionType: body.submissionType || "combined",
      acceptedFileTypes: body.acceptedFileTypes || ".pdf,.pptx,.zip",
      maxFileSizeMb: body.maxFileSizeMb ?? 25,
      maxSubmissionsPerTeam: body.maxSubmissionsPerTeam ?? 1,
      allowResubmission: body.allowResubmission ?? false,
      startDate: body.startDate || undefined,
      deadline: body.deadline || undefined,
      evaluationCriteria: body.evaluationCriteria || [],
      customFields: body.customFields || [],
      status: body.status || "Upcoming",
      isPublished: body.isPublished ?? false,
      visibleToAll: body.visibleToAll ?? true,
    });
    return NextResponse.json({ success: true, round }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
