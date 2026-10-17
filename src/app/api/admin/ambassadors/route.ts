import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const applications = await dbService.getAmbassadorApplications();
    return NextResponse.json({ success: true, applications });
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
    const updated = await dbService.updateAmbassadorStatus(id, status);
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
      return NextResponse.json({ success: false, error: "Missing application id" }, { status: 400 });
    }
    const deleted = await dbService.deleteAmbassadorApplication(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
