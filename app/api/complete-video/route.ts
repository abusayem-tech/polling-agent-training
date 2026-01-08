import { NextRequest, NextResponse } from "next/server";
import { updateVideoCompletion } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { mobile, videoNumber } = await request.json();

    if (!mobile || !videoNumber || (videoNumber !== 1 && videoNumber !== 2)) {
      return NextResponse.json(
        { error: "Invalid request" },
        { status: 400 }
      );
    }

    await updateVideoCompletion(mobile, videoNumber);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error completing video:", error);
    return NextResponse.json(
      { error: "Failed to complete video" },
      { status: 500 }
    );
  }
}

