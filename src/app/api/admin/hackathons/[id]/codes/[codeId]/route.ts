import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

type Params = { params: Promise<{ id: string; codeId: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const { codeId } = await params;
    const body = await req.json();
    const ok = await dbService.updateVerificationCode(codeId, body);
    return NextResponse.json({ success: ok });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const { codeId } = await params;
    const ok = await dbService.deleteVerificationCode(codeId);
    return NextResponse.json({ success: ok });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
