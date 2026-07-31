import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseJson, supabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const [settings] = await supabaseJson<Record<string, unknown>[]>("event_settings?id=eq.1&select=*");
    return NextResponse.json({ settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load settings." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const body = (await req.json()) as Record<string, unknown>;
  const allowed = ["event_dates", "event_time", "venue", "launch_iso", "registrations_open"];
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const key of allowed) {
    if (key in body) patch[key] = body[key];
  }

  try {
    const rows = await supabaseJson<Record<string, unknown>[]>("event_settings?id=eq.1", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    });
    return NextResponse.json({ settings: rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not save settings." }, { status: 500 });
  }
}
