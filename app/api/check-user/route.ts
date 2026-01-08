import { NextRequest, NextResponse } from "next/server";
import { checkUserExists } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { mobile } = await request.json();

    if (!mobile) {
      return NextResponse.json(
        { error: "Mobile number is required" },
        { status: 400 }
      );
    }

    console.log("Checking user with mobile:", mobile);
    const user = await checkUserExists(mobile);
    console.log("User found:", user ? "Yes" : "No");
    console.log("User data:", user);

    return NextResponse.json({
      exists: !!user,
      user: user || null,
    });
  } catch (error) {
    console.error("Error checking user:", error);
    return NextResponse.json(
      { error: "Failed to check user", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

