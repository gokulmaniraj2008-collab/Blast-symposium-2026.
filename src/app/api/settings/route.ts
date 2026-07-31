import { NextResponse } from "next/server";
import { supabaseJson, supabaseConfigured } from "@/lib/supabase";

export async function GET() {
  if (!supabaseConfigured()) {
    return NextResponse.json({ configured: false }, { status: 200 });
  }
  try {
    const [settings] = await supabaseJson<
      { event_dates: string; event_time: string; venue: string; launch_iso: string; registrations_open: boolean }[]
    >("event_settings?id=eq.1&select=event_dates,event_time,venue,launch_iso,registrations_open");
    return NextResponse.json({ configured: true, ...settings });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ configured: false }, { status: 200 });
  }
}
