import { NextRequest, NextResponse } from "next/server";
import { supabaseJson, supabaseConfigured, SupabaseError } from "@/lib/supabase";

type RegistrationInput = {
  name: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  category: string;
  competitions: string[];
  workshops: string[];
  notes: string;
};

function validate(body: Partial<RegistrationInput>) {
  if (!body.name?.trim()) return "Name is required.";
  if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return "A valid email is required.";
  if (!body.phone?.trim()) return "Phone number is required.";
  if (!body.institution?.trim()) return "Institution is required.";
  if (!body.category?.trim()) return "Category is required.";
  return null;
}

function makeTicketId() {
  return `BLAST26-${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function POST(req: NextRequest) {
  if (!supabaseConfigured()) {
    return NextResponse.json(
      { error: "Registrations aren't connected to a database yet. Ask the site admin to finish setup." },
      { status: 503 }
    );
  }

  const body = (await req.json()) as Partial<RegistrationInput>;
  const validationError = validate(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  try {
    const [settings] = await supabaseJson<{ registrations_open: boolean }[]>(
      "event_settings?id=eq.1&select=registrations_open"
    );
    if (settings && settings.registrations_open === false) {
      return NextResponse.json({ error: "Registrations are currently closed." }, { status: 403 });
    }

    let attempt = 0;
    let lastError: unknown = null;
    while (attempt < 3) {
      attempt += 1;
      const ticket_id = makeTicketId();
      try {
        const [row] = await supabaseJson<{ ticket_id: string }[]>("registrations", {
          method: "POST",
          headers: { Prefer: "return=representation" },
          body: JSON.stringify({
            ticket_id,
            name: body.name,
            email: body.email,
            phone: body.phone,
            institution: body.institution,
            department: body.department ?? "",
            category: body.category,
            competitions: body.competitions ?? [],
            workshops: body.workshops ?? [],
            notes: body.notes ?? "",
          }),
        });
        return NextResponse.json({ ticketId: row.ticket_id });
      } catch (err) {
        lastError = err;
        // 23505 = unique_violation on ticket_id; retry with a new one.
        if (!(err instanceof SupabaseError) || !err.message.includes("23505")) break;
      }
    }
    throw lastError ?? new Error("Could not create registration.");
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong saving your registration." }, { status: 500 });
  }
}
