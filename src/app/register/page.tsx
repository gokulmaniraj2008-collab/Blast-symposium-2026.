"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const DEFAULT_SETTINGS = {
  event_dates: "13–14 March 2026",
  event_time: "09:00 AM onwards",
  venue: "Dr. Mahalingam Auditorium, RVS ITECH Campus",
  registrations_open: true,
};

const competitions = [
  "Biotech Quiz",
  "Model Mania",
  "Paper Presentation",
  "Startup Pitch",
  "Poster Presentation",
];

const workshops = [
  "AI & Machine Learning",
  "Data Science & Analytics",
  "Cyber Security",
  "Cloud Computing",
  "Web Development",
];

const categories = ["Student", "Faculty", "Industry Professional"];

type FormState = {
  name: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  category: string;
  competitions: string[];
  workshops: string[];
  notes: string;
  agree: boolean;
};

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  institution: "",
  department: "",
  category: "Student",
  competitions: [],
  workshops: [],
  notes: "",
  agree: false,
};

type Errors = Partial<Record<keyof FormState, string>>;

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

function validate(form: FormState): Errors {
  const errors: Errors = {};
  if (!form.name.trim()) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = "Enter a valid email address.";
  if (!/^[0-9+\-\s]{10,15}$/.test(form.phone)) errors.phone = "Enter a valid phone number.";
  if (!form.institution.trim()) errors.institution = "Enter your college or organisation.";
  if (!form.agree) errors.agree = "You must accept the terms to register.";
  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 font-mono text-[11px] text-rose-300">{message}</p>;
}

const inputClasses =
  "w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-chrome placeholder:text-mist/30 outline-none transition focus:border-cyan/60 focus:bg-white/10";

export default function RegisterPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.configured) {
          setSettings({
            event_dates: data.event_dates,
            event_time: data.event_time,
            venue: data.venue,
            registrations_open: data.registrations_open,
          });
        }
      })
      .catch(() => {});
  }, []);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setTicketId(data.ticketId);
      setSubmitted(true);
    } catch {
      setSubmitError("Network error — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="starfield relative flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#131a3d_0%,#05060f_65%)] px-6 py-20">
        <div className="telemetry-frame relative mx-auto max-w-lg rounded-2xl p-10 text-center">
          <p className="eyebrow mb-3">Confirmation</p>
          <h1 className="font-display text-3xl text-chrome sm:text-4xl">You&apos;re on the manifest.</h1>
          <p className="mt-4 text-mist/70">
            Thanks, {form.name.split(" ")[0]}. Your seat for BLAST Symposium 2026 is reserved. A confirmation
            email is on its way to <span className="text-cyan">{form.email}</span>.
          </p>
          <div className="mx-auto mt-6 inline-block rounded-full border border-gold/50 bg-gold/10 px-5 py-2 font-mono text-sm uppercase tracking-widest text-gold">
            Ticket {ticketId}
          </div>
          <div className="mt-8 grid grid-cols-1 gap-3 text-left text-sm text-mist/70 sm:grid-cols-2">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="eyebrow">Date</p>
              <p className="mt-1 text-chrome">{settings.event_dates}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="eyebrow">Venue</p>
              <p className="mt-1 text-chrome">{settings.venue}</p>
            </div>
          </div>
          <p className="mt-8 text-xs text-mist/50">
            Questions? Reach us at blast@rvsitech.ac.in or +91 97901 19963.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-white/30 px-8 py-3 font-mono text-sm uppercase tracking-widest text-mist/80 transition hover:border-cyan hover:text-cyan"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  if (!settings.registrations_open) {
    return (
      <main className="starfield relative flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#131a3d_0%,#05060f_65%)] px-6 py-20">
        <div className="telemetry-frame relative mx-auto max-w-lg rounded-2xl p-10 text-center">
          <p className="eyebrow mb-3">Registration</p>
          <h1 className="font-display text-3xl text-chrome sm:text-4xl">Registrations are closed</h1>
          <p className="mt-4 text-mist/70">
            We&apos;re not accepting new sign-ups for BLAST Symposium 2026 right now. Check back soon or
            reach out to the organisers below.
          </p>
          <p className="mt-8 text-xs text-mist/50">
            Questions? Reach us at blast@rvsitech.ac.in or +91 97901 19963.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full border border-white/30 px-8 py-3 font-mono text-sm uppercase tracking-widest text-mist/80 transition hover:border-cyan hover:text-cyan"
          >
            Back to home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="starfield relative min-h-screen bg-[radial-gradient(ellipse_at_top,#131a3d_0%,#05060f_65%)] px-6 pb-24 pt-10">
      <div className="mx-auto flex max-w-6xl items-center justify-between pb-10">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/images/rvs-logo.png" alt="RVS ITECH logo" width={36} height={36} className="rounded bg-white p-0.5" />
          <span className="font-display text-sm text-chrome">RVS ITECH &middot; CSE Department</span>
        </Link>
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-widest text-mist/60 transition hover:text-cyan"
        >
          &larr; Back to event
        </Link>
      </div>

      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-[1.4fr_1fr]">
        {/* Form */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-10">
          <p className="eyebrow mb-2">Boarding pass</p>
          <h1 className="font-display text-3xl text-chrome sm:text-4xl">Register for BLAST 2026</h1>
          <p className="mt-2 text-sm text-mist/60">
            Fill in your details below. It takes less than two minutes.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  Full name
                </label>
                <input
                  id="name"
                  type="text"
                  className={inputClasses}
                  placeholder="Ada Lovelace"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
                <FieldError message={errors.name} />
              </div>

              <div>
                <label htmlFor="email" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className={inputClasses}
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                />
                <FieldError message={errors.email} />
              </div>

              <div>
                <label htmlFor="phone" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  Phone
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={inputClasses}
                  placeholder="+91 90000 00000"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
                <FieldError message={errors.phone} />
              </div>

              <div>
                <label htmlFor="category" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  Category
                </label>
                <select
                  id="category"
                  className={inputClasses}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c} value={c} className="bg-white text-ink">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="institution" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  College / Organisation
                </label>
                <input
                  id="institution"
                  type="text"
                  className={inputClasses}
                  placeholder="RVS ITECH College of Engineering"
                  value={form.institution}
                  onChange={(e) => set("institution", e.target.value)}
                />
                <FieldError message={errors.institution} />
              </div>

              <div>
                <label htmlFor="department" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                  Department (optional)
                </label>
                <input
                  id="department"
                  type="text"
                  className={inputClasses}
                  placeholder="Computer Science and Engineering"
                  value={form.department}
                  onChange={(e) => set("department", e.target.value)}
                />
              </div>
            </div>

            <fieldset>
              <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-mist/60">
                Competitions you&apos;d like to join (optional)
              </legend>
              <div className="flex flex-wrap gap-2">
                {competitions.map((c) => {
                  const active = form.competitions.includes(c);
                  return (
                    <button
                      type="button"
                      key={c}
                      onClick={() => set("competitions", toggleValue(form.competitions, c))}
                      className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
                        active
                          ? "border-gold bg-gold/15 text-gold"
                          : "border-white/15 text-mist/60 hover:border-white/30"
                      }`}
                      aria-pressed={active}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 font-mono text-xs uppercase tracking-widest text-mist/60">
                Workshops you&apos;d like to join (optional)
              </legend>
              <div className="flex flex-wrap gap-2">
                {workshops.map((w) => {
                  const active = form.workshops.includes(w);
                  return (
                    <button
                      type="button"
                      key={w}
                      onClick={() => set("workshops", toggleValue(form.workshops, w))}
                      className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition ${
                        active
                          ? "border-cyan bg-cyan/15 text-cyan"
                          : "border-white/15 text-mist/60 hover:border-white/30"
                      }`}
                      aria-pressed={active}
                    >
                      {w}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div>
              <label htmlFor="notes" className="mb-1.5 block font-mono text-xs uppercase tracking-widest text-mist/60">
                Anything else we should know? (optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                className={inputClasses}
                placeholder="Dietary needs, accessibility requirements, questions..."
                value={form.notes}
                onChange={(e) => set("notes", e.target.value)}
              />
            </div>

            <div>
              <label className="flex items-start gap-3 text-sm text-mist/70">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 shrink-0 rounded border-white/30 bg-white/5 accent-violet"
                  checked={form.agree}
                  onChange={(e) => set("agree", e.target.checked)}
                />
                <span>
                  I agree to receive event updates and confirm the details above are accurate.
                </span>
              </label>
              <FieldError message={errors.agree} />
            </div>

            {submitError && (
              <p className="font-mono text-[11px] text-rose-300">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-full bg-gradient-to-r from-gold to-yellow-300 px-8 py-3.5 font-mono text-sm uppercase tracking-widest text-ink shadow-lg shadow-gold/30 transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
            >
              {submitting ? "Submitting…" : "Confirm registration"}
            </button>
          </form>
        </div>

        {/* Summary panel */}
        <aside className="h-fit space-y-4 lg:sticky lg:top-10">
          <div className="telemetry-frame rounded-2xl p-6">
            <p className="eyebrow mb-4">Mission brief</p>
            <h2 className="font-display text-2xl text-chrome">BLAST Symposium 2026</h2>
            <div className="mt-5 space-y-4 text-sm">
              <div>
                <p className="eyebrow">Date</p>
                <p className="mt-1 text-chrome">{settings.event_dates}</p>
              </div>
              <div>
                <p className="eyebrow">Time</p>
                <p className="mt-1 text-chrome">{settings.event_time}</p>
              </div>
              <div>
                <p className="eyebrow">Venue</p>
                <p className="mt-1 text-chrome">{settings.venue}</p>
              </div>
              <div>
                <p className="eyebrow">Theme</p>
                <p className="mt-1 text-chrome/90">
                  Empowering Tomorrow: Technology | AI | Sustainability | Humanity
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-mist/70">
            <p className="eyebrow mb-3">Need help?</p>
            <p>+91 97901 19963</p>
            <p>+91 94864 51468</p>
            <p className="mt-2">blast@rvsitech.ac.in</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
  
