import { NextResponse } from "next/server";
import { supabaseDiagnostic, supabaseJson, supabaseConfigured } from "@/lib/supabase";

export async function GET() {
  const envCheck = {
    ...supabaseDiagnostic(),
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "present" : "MISSING",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "present" : "MISSING",
  };

  if (!supabaseConfigured()) {
    return NextResponse.json({ envCheck, writeTest: "skipped — not configured" });
  }

  try {
    const ticket_id = `DIAG-${Date.now()}`;
    const [row] = await supabaseJson<{ ticket_id: string }[]>("registrations", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        ticket_id,
        name: "Diagnostic Test",
        email: "diag@example.com",
        phone: "0000000000",
        institution: "Diagnostic",
        category: "Diagnostic",
      }),
    });
    await supabaseJson(`registrations?ticket_id=eq.${row.ticket_id}`, { method: "DELETE" });
    return NextResponse.json({ envCheck, writeTest: "SUCCESS — insert and delete both worked" });
  } catch (err) {
    return NextResponse.json({ envCheck, writeTest: "FAILED", error: String(err) });
  }
}
