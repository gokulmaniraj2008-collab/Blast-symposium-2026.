import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the friendly help-desk assistant for BLAST Symposium 2026, a two-day
tech symposium (13–14 March 2026, 09:00 AM onwards) hosted by the Department of Computer Science
and Engineering at RVS ITECH College of Engineering, Kumarasamy Nagar, Coimbatore, at the
Dr. Mahalingam Auditorium. Theme: "Empowering Tomorrow: Technology | AI | Sustainability | Humanity".

Competitions: Biotech Quiz, Model Mania, Paper Presentation, Startup Pitch, Poster Presentation.
Workshops: AI & Machine Learning, Data Science & Analytics, Cyber Security, Cloud Computing, Web Development.
Registration is online at the "Register" page/button on the site (free-form form, no payment flow built in).
Contact: blast@rvsitech.ac.in, +91 97901 19963 / +91 94864 51468. Instagram/social: @blast.symposium.

Answer questions about the event concisely and warmly, in 2-4 sentences unless more detail is asked for.
If you don't know something specific (e.g. exact seat counts, prize money, live schedule changes), say so
honestly and point the person to the contact email/phone instead of guessing.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "The chat assistant isn't configured yet. Set GROQ_API_KEY on the server." },
      { status: 503 }
    );
  }

  const { messages } = (await req.json()) as {
    messages: { role: "user" | "assistant"; content: string }[];
  };

  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json({ error: "messages is required" }, { status: 400 });
  }

  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        temperature: 0.4,
        max_tokens: 400,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages.slice(-12)],
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(data);
      return NextResponse.json({ error: "Chat request failed." }, { status: 502 });
    }

    const reply = data?.choices?.[0]?.message?.content ?? "Sorry, I couldn't come up with a reply.";
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Chat request failed." }, { status: 500 });
  }
}
