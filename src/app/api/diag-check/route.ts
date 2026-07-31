import { NextResponse } from "next/server";
import { supabaseDiagnostic } from "@/lib/supabase";

export async function GET() {
  return NextResponse.json({
    ...supabaseDiagnostic(),
    GROQ_API_KEY: process.env.GROQ_API_KEY ? "present" : "MISSING",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "present" : "MISSING",
  });
}
