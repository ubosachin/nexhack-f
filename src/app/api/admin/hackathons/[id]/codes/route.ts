import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string }> };

function generateCode(length = 8): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const { id: hackathonId } = await params;
    const codes = await dbService.getCodesByHackathon(hackathonId);
    return NextResponse.json({ success: true, codes });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const { id: hackathonId } = await params;
    const body = await req.json();
    const count = Math.min(Number(body.count) || 1, 100);
    const maxUses = Number(body.maxUses) || 1;
    const expiresAt = body.expiresAt || undefined;
    const note = body.note || undefined;

    const created = [];
    for (let i = 0; i < count; i++) {
      const code = await dbService.createVerificationCode({
        hackathonId,
        code: generateCode(),
        maxUses,
        isActive: true,
        note,
        expiresAt,
      });
      created.push(code);
    }
    return NextResponse.json({ success: true, codes: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
