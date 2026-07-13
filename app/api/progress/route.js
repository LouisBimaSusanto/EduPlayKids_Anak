import { NextResponse } from "next/server";

// GET: Fetch analytics for Parent Dashboard
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const childId = searchParams.get("childId") || "child_123";

  // TODO: Query Real Database
  // const analytics = await db.analytics.getSummary(childId);

  return NextResponse.json({
    status: "success",
    data: {
      child_id: childId,
      metrics: {
        accuracy_percent: 85,
        response_speed_seconds: 4.2,
        independence_rate: 90
      },
      skills: {
        letter_recognition: 95,
        speech_articulation: 65,
        focus: 85
      },
      recent_flags: [
        { type: "warning", message: "Pelafalan huruf B dan P sering tertukar." }
      ]
    }
  });
}

// POST: Called by Child's App when finishing a game/level
export async function POST(request) {
  try {
    const body = await request.json();
    const { childId, level, score, duration_seconds } = body;

    // TODO: Insert into Real Database
    // await db.progress.insert({ childId, level, score, ... });

    return NextResponse.json({
      status: "success",
      message: "Progres belajar berhasil disimpan."
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Gagal merekam progres."
    }, { status: 500 });
  }
}
