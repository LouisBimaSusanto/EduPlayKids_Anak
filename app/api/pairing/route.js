import { NextResponse } from "next/server";

// GET: Check pairing status (Polled by parent app to see if child connected)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Kode pairing diperlukan" }, { status: 400 });
  }

  // TODO: Query real Database
  // const isPaired = await db.pairing.checkStatus(code);

  return NextResponse.json({
    status: "success",
    data: {
      pairing_code: code,
      is_paired: true, // Dummy: assume it is paired for testing
      device_name: "Tablet Anak Samsung"
    }
  });
}

// POST: Generate a new Pairing Code for Onboarding Step 3
export async function POST(request) {
  // Generate random 6 character code like ARA-87X
  const prefix = "ARA"; // Usually dynamic based on child name
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const pairingCode = `${prefix}-${suffix}`;

  // TODO: Save to Real Database
  // await db.pairing.create({ code: pairingCode, parent_id: "usr_123" });

  return NextResponse.json({
    status: "success",
    message: "Kode pairing berhasil dibuat",
    data: {
      pairing_code: pairingCode,
      expires_in: 3600 // 1 hour
    }
  });
}
