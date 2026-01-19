import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    const constituency = data.pollingCenter || data.constituency; // Support both field names
    
    if (!data.mobile || !data.name || !data.nid || !data.address || !constituency) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    await registerUser({
      mobile: data.mobile,
      name: data.name,
      nid: data.nid,
      address: data.address,
      constituency: constituency, // নির্বাচনী আসন
      video1Completed: false,
      video2Completed: false,
      video3Completed: false,
      video4Completed: false,
      video5Completed: false,
      video6Completed: false,
      video7Completed: false,
      registrationTime: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}

