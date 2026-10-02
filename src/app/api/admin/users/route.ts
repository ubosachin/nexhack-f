import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function GET() {
  try {
    const users = await dbService.getAllUserProfiles();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId } = body;
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    // If only role is being toggled
    const keys = Object.keys(body).filter((k) => k !== "userId");
    if (keys.length === 1 && keys[0] === "role") {
      const role = body.role;
      if (role !== "admin" && role !== "user") {
        return NextResponse.json({ success: false, error: "Invalid role" }, { status: 400 });
      }
      const updated = await dbService.updateUserRole(userId, role);
      return NextResponse.json({ success: updated });
    }

    // Comprehensive profile update
    const updatedUser = await dbService.updateUserProfileByAdmin(userId, body);
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "User not found or update failed" }, { status: 404 });
    }
    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return PATCH(req);
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }
    const deleted = await dbService.deleteUserProfile(userId);
    return NextResponse.json({ success: deleted });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
