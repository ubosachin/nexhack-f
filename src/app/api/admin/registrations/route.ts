import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

/**
 * GET /api/admin/registrations
 * GET /api/admin/registrations?hackathonId=<id>
 *
 * Returns all registrations, or those for a specific hackathon if
 * hackathonId query param is provided.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hackathonId = searchParams.get("hackathonId");

    const registrations = hackathonId
      ? await dbService.getRegistrationsByHackathon(hackathonId)
      : await dbService.getRegistrations();

    return NextResponse.json({ success: true, registrations });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;
    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing id or status" }, { status: 400 });
    }
    const updated = await dbService.updateRegistrationStatus(id, status);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing registration id" }, { status: 400 });
    }
    const deleted = await dbService.deleteRegistration(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
