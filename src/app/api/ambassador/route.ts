import { NextRequest, NextResponse } from "next/server";
import { dbService } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, email, phone, college, city, yearOfStudy, course, whyAmbassador, linkedinUrl } = body;

    if (!fullName || !email || !phone || !college || !city || !yearOfStudy || !course || !whyAmbassador) {
      return NextResponse.json(
        { success: false, error: "All required fields must be filled." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const application = await dbService.addAmbassadorApplication({
      fullName,
      email,
      phone,
      college,
      city,
      yearOfStudy,
      course,
      whyAmbassador,
      linkedinUrl,
    });

    return NextResponse.json({ success: true, application }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
