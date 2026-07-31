import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/adminAuth";
import { supabaseJson, supabaseConfigured } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  try {
    const rows = await supabaseJson("registrations?select=*&order=created_at.desc");
    return NextResponse.json({ registrations: rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not load registrations." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const { id, ...updates } = (await req.json()) as { id?: string; [key: string]: unknown };
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  // Only allow a known set of editable fields.
  const allowed = [
    "name",
    "email",
    "phone",
    "institution",
    "department",
    "category",
    "competitions",
    "workshops",
    "notes",
    "status",
  ];
  const patch: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in updates) patch[key] = updates[key];
  }

  try {
    const rows = await supabaseJson(`registrations?id=eq.${id}`, {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify(patch),
    });
    return NextResponse.json({ registration: Array.isArray(rows) ? rows[0] : rows });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not update registration." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAdminRequest(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!supabaseConfigured()) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  try {
    await supabaseJson(`registrations?id=eq.${id}`, { method: "DELETE" });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Could not delete registration." }, { status: 500 });
  }
}
