import { NextResponse } from "next/server";

// POST: Create new child profile from Onboarding
export async function POST(request) {
  try {
    const body = await request.json();
    const { childName, ageRange, goals } = body;

    // TODO: Connect to Real Database here
    // const newProfile = await db.profiles.create({ ... })

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    return NextResponse.json({
      status: "success",
      message: "Profil anak berhasil didaftarkan.",
      data: {
        id: "usr_9999",
        name: childName || "Ara",
        age_range: ageRange || "4-5 Thn",
        learning_goals: goals || ["fonik"],
        created_at: new Date().toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Gagal mendaftarkan profil."
    }, { status: 500 });
  }
}
