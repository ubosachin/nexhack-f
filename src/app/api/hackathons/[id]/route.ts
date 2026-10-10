import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const hackathon = await dbService.getHackathon(id);
    if (!hackathon) {
      return NextResponse.json({ success: false, error: "Hackathon not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, hackathon });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
