import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const hackathons = await dbService.getHackathons();
    return NextResponse.json({ success: true, hackathons });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await dbService.addHackathon(body);
    return NextResponse.json({ success: true, hackathon: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    // Destructure all fields that must never be sent to $set
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, _id, createdAt, registeredCount, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing hackathon id" }, { status: 400 });
    }
    const updated = await dbService.updateHackathon(id, updates);
    return NextResponse.json({ success: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ success: false, error: "Missing hackathon id" }, { status: 400 });
    }
    // PATCH is used for partial updates like status changes
    const updated = await dbService.updateHackathon(id, updates);
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
      return NextResponse.json({ success: false, error: "Missing hackathon id" }, { status: 400 });
    }
    const deleted = await dbService.deleteHackathon(id);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
