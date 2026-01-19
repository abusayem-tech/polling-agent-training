import { NextRequest, NextResponse } from "next/server";
import { updateCertificateId } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { mobile, certificateId } = await request.json();

    if (!mobile || !certificateId) {
      return NextResponse.json(
        { error: "Mobile and certificateId are required" },
        { status: 400 }
      );
    }

    await updateCertificateId(mobile, certificateId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating certificate:", error);
    return NextResponse.json(
      { error: "Failed to update certificate" },
      { status: 500 }
    );
  }
}
