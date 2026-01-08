import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    if (!data.mobile || !data.name || !data.nid || !data.address || !data.pollingCenter) {
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
      pollingCenter: data.pollingCenter,
      video1Completed: false,
      video2Completed: false,
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

