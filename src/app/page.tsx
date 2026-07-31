"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const speakers = [
  {
    name: "Dr. R. Gokulakrishnan",
    role: "Director, CSIR – CLRI, Chennai, India",
    img: "/images/speaker-gokulakrishnan.jpg",
  },
  {
    name: "Dr. Shweta Naik",
    role: "Head – Biologics R&D, Biocon Biologics, Bengaluru",
    img: "/images/speaker-shweta.jpg",
  },
  {
    name: "Dr. Manish Diwan",
    role: "Chief Scientific Officer, Avesthagen Limited, India",
    img: "/images/speaker-manish.jpg",
  },
  {
    name: "Dr. N. Kumar",
    role: "Professor of Biotechnology, IIT Madras, India",
    img: "/images/speaker-nkumar.jpg",
  },
];

const highlights = [
  { title: "Inspiring Keynote Talks", desc: "by leading experts" },
  { title: "Hands-on Workshops", desc: "on emerging technologies" },
  { title: "Exciting Competitions", desc: "showcase your talent" },
  { title: "Industry Networking", desc: "connect. collaborate. create impact." },
  { title: "Research Poster Presentations", desc: "share. learn. grow." },
];

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

const sponsors = [
  { name: "Biocon", img: "/images/spon-biocon.png" },
  { name: "Merck", img: "/images/spon-merck.png" },
  { name: "Thermo Fisher Scientific", img: "/images/spon-thermofisher.png" },
  { name: "Agilent", img: "/images/spon-agilent.png" },
  { name: "Bruker", img: "/images/spon-bruker.png" },
  { name: "Avantor", img: "/images/spon-avantor.png" },
];

const navLinks = [
  { href: "#speakers", label: "Speakers" },
  { href: "#highlights", label: "Highlights" },
  { href: "#competitions", label: "Competitions" },
  { href: "#register", label: "Register" },
  { href: "#contact", label: "Contact" },
];

// Fallback defaults used until /api/settings responds (or if it isn't configured yet).
const DEFAULT_SETTINGS = {
  event_dates: "13–14 March 2026",
  event_time: "09:00 AM Onwards",
  venue: "Dr. Mahalingam Auditorium, RVS ITECH Campus",
  launch_iso: "2026-03-13T09:00:00+05:30",
  registrations_open: true,
};

function useEventSettings() {
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
            launch_iso: data.launch_iso,
            registrations_open: data.registrations_open,
          });
        }
      })
      .catch(() => {});
  }, []);

  return settings;
}

function useCountdown(targetIso: string) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const target = new Date(targetIso).getTime();
    const tick = () => setRemaining(Math.max(0, target - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (remaining === null) return null;

  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const minute = 60 * 1000;

  return {
    days: Math.floor(remaining / day),
    hours: Math.floor((remaining % day) / hour),
    minutes: Math.floor((remaining % hour) / minute),
    seconds: Math.floor((remaining % minute) / 1000),
    launched: remaining <= 0,
  };
}

function TelemetryUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="telemetry-frame flex w-16 flex-col items-center rounded-md px-2 py-3 sm:w-20">
      <span className="telemetry-digit font-display text-2xl text-chrome sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-cyan/80">
        {label}
      </span>
    </div>
  );
}

function LaunchCountdown({ launchIso }: { launchIso: string }) {
  const t = useCountdown(launchIso);

  return (
    <div className="mx-auto mt-10 inline-flex flex-col items-center gap-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-cyan/90">
        {t?.launched ? (
          "// mission underway"
        ) : (
          <>
            T&ndash;minus to launch <span className="blink text-gold">_</span>
          </>
        )}
      </p>
      <div className="flex items-center gap-2 sm:gap-3">
        <TelemetryUnit value={t?.days ?? 0} label="Days" />
        <TelemetryUnit value={t?.hours ?? 0} label="Hrs" />
        <TelemetryUnit value={t?.minutes ?? 0} label="Min" />
        <TelemetryUnit value={t?.seconds ?? 0} label="Sec" />
      </div>
    </div>
  );
}

function SectionHelix() {
  return (
    <div className="helix-spine hidden md:block">
      <span className="helix-node glow-pulse" style={{ top: "10%" }} />
      <span className="helix-node glow-pulse" style={{ top: "45%", animationDelay: "1.3s" }} />
      <span className="helix-node glow-pulse" style={{ top: "80%", animationDelay: "2.6s" }} />
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const settings = useEventSettings();

  return (
    <main className="relative overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-ink/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/rvs-logo.png"
              alt="RVS ITECH logo"
              width={44}
              height={44}
              className="rounded bg-white p-0.5"
            />
            <div className="leading-tight">
              <p className="font-display text-sm tracking-wide text-chrome">RVS ITECH</p>
              <p className="text-[11px] text-mist/60">College of Engineering &middot; CSE Department</p>
            </div>
          </div>

          <nav className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-mist/70 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-cyan">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden rounded-full bg-gradient-to-r from-violet to-violet-soft px-5 py-2 font-mono text-xs uppercase tracking-widest text-white shadow-lg shadow-violet/30 transition hover:brightness-110 sm:inline-block"
            >
              Register
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-white/15 md:hidden"
            >
              <span
                className={`h-[1.5px] w-4 bg-chrome transition ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span className={`h-[1.5px] w-4 bg-chrome transition ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`h-[1.5px] w-4 bg-chrome transition ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className={`mobile-nav border-t border-white/10 md:hidden ${menuOpen ? "is-open" : ""}`}>
          <div>
            <nav className="flex flex-col gap-1 px-6 py-4 font-mono text-sm uppercase tracking-widest text-mist/80">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2.5 transition-colors hover:bg-white/5 hover:text-cyan"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-gradient-to-r from-violet to-violet-soft px-4 py-2.5 text-center text-white"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="starfield relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_top,#2c1454_0%,#0a0518_65%)] px-6 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,transparent,rgba(10,5,24,0.6)_70%,#0a0518_100%)]" />
        <div className="nebula-blob left-[-10%] top-[10%] h-72 w-72 bg-pink/30" />
        <div className="nebula-blob right-[-10%] top-[35%] h-80 w-80 bg-cyan/20" style={{ animationDelay: "3s" }} />
        <div className="nebula-blob left-[20%] bottom-[-15%] h-64 w-64 bg-violet/30" style={{ animationDelay: "6s" }} />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="eyebrow mb-4">Department of Computer Science and Engineering proudly presents</p>
          <div className="float-slow mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1 font-mono text-[11px] uppercase tracking-widest text-gold">
            A Decade of Impact &middot; A Future of Innovation
          </div>
          <h1 className="gradient-text-flow font-display text-6xl leading-[0.95] drop-shadow-[0_0_25px_rgba(188,108,255,0.45)] sm:text-8xl">
            BLAST
          </h1>
          <h2 className="font-display text-4xl leading-none text-violet-soft drop-shadow-[0_0_20px_rgba(166,128,255,0.6)] sm:text-6xl">
            SYMPOSIUM
          </h2>
          <p className="font-display text-5xl text-chrome/90 sm:text-7xl">2026</p>

          <p className="mx-auto mt-6 max-w-xl font-mono text-sm uppercase tracking-[0.3em] text-mist/70">
            Innovate. Inspire. <span className="text-gold">Lead</span> the Future.
          </p>

          <div className="mx-auto mt-8 inline-block rounded-lg border border-violet/40 bg-white/5 px-6 py-4">
            <p className="eyebrow mb-1">Theme</p>
            <p className="font-display text-lg text-chrome sm:text-xl">
              Empowering Tomorrow: Technology | AI | Sustainability | Humanity
            </p>
          </div>

          <LaunchCountdown launchIso={settings.launch_iso} />

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="eyebrow">Date</p>
              <p className="mt-1 font-display text-lg text-chrome">{settings.event_dates}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="eyebrow">Time</p>
              <p className="mt-1 font-display text-lg text-chrome">{settings.event_time}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">
              <p className="eyebrow">Venue</p>
              <p className="mt-1 font-display text-base text-chrome">{settings.venue}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-gold to-yellow-300 px-8 py-3 font-mono text-sm uppercase tracking-widest text-ink shadow-lg shadow-gold/30 transition hover:brightness-110"
            >
              Register Now
            </Link>
            <a
              href="#speakers"
              className="rounded-full border border-white/30 px-8 py-3 font-mono text-sm uppercase tracking-widest text-mist/80 transition hover:border-cyan hover:text-cyan"
            >
              Meet the Speakers
            </a>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="relative scroll-mt-20 border-t border-white/10 bg-ink-2 px-6 py-20">
        <SectionHelix />
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow mb-2 text-center">Who&apos;s speaking</p>
          <h2 className="font-display text-center text-3xl text-chrome sm:text-4xl">Keynote Speakers</h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((s) => (
              <div
                key={s.name}
                className="group rounded-xl border border-white/10 bg-white/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-violet/50 hover:bg-white/10"
              >
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-violet-soft/60 shadow-[0_0_20px_rgba(123,63,228,0.4)] transition group-hover:shadow-[0_0_30px_rgba(79,209,255,0.5)]">
                  <Image src={s.img} alt={s.name} width={96} height={96} className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 font-display text-base text-gold">{s.name}</p>
                <p className="mt-1 text-xs text-mist/60">{s.role}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-xl border border-gold/50 bg-gradient-to-b from-gold/10 to-transparent p-8 text-center shadow-[0_0_35px_rgba(232,184,75,0.15)]">
            <p className="eyebrow mb-4 text-gold">Chief Guest</p>
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-gold shadow-[0_0_25px_rgba(232,184,75,0.5)]">
              <Image
                src="/images/chief-guest.jpg"
                alt="Dr. Shekhar Mande"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-display text-xl text-chrome">Dr. Shekhar Mande</p>
            <p className="mt-1 text-sm text-mist/60">
              Former Director General, CSIR &amp; Secretary, DSIR, Government of India
            </p>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section id="highlights" className="relative scroll-mt-20 border-t border-white/10 px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow mb-2 text-center">What to expect</p>
          <h2 className="font-display text-center text-3xl text-chrome sm:text-4xl">Event Highlights</h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-white/10 bg-white/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan/40"
              >
                <div className="mb-3 h-1.5 w-8 rounded-full bg-gradient-to-r from-violet to-cyan" />
                <p className="font-display text-sm text-chrome">{h.title}</p>
                <p className="mt-1 text-xs text-mist/60">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions & Workshops */}
      <section id="competitions" className="relative scroll-mt-20 border-t border-white/10 bg-ink-2 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <p className="eyebrow mb-2">Compete</p>
            <h3 className="font-display text-2xl text-chrome">Competitions</h3>
            <ul className="mt-6 space-y-3">
              {competitions.map((c) => (
                <li key={c} className="flex items-center gap-3 text-mist/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-8">
            <p className="eyebrow mb-2">Learn by doing</p>
            <h3 className="font-display text-2xl text-chrome">Workshops</h3>
            <ul className="mt-6 space-y-3">
              {workshops.map((w) => (
                <li key={w} className="flex items-center gap-3 text-mist/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Register */}
      <section
        id="register"
        className="relative scroll-mt-20 border-t border-white/10 bg-[radial-gradient(ellipse_at_center,#2c1454_0%,#0a0518_75%)] px-6 py-20"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div>
            <p className="font-display text-3xl text-gold sm:text-4xl">Register Now</p>
            <p className="mt-2 max-w-sm text-mist/70">
              Be part of the next generation of innovation.
            </p>
            <p className="mt-4 inline-block rounded-full border border-gold/50 px-4 py-1 font-mono text-xs uppercase tracking-widest text-gold">
              {settings.registrations_open ? "Limited seats — register early!" : "Registrations are currently closed"}
            </p>
            <div className="mt-6">
              {settings.registrations_open ? (
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-gradient-to-r from-gold to-yellow-300 px-8 py-3 font-mono text-sm uppercase tracking-widest text-ink shadow-lg shadow-gold/30 transition hover:brightness-110"
                >
                  Register Online
                </Link>
              ) : (
                <span className="inline-block rounded-full border border-white/15 px-8 py-3 font-mono text-sm uppercase tracking-widest text-mist/50">
                  Registration closed
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative scroll-mt-20 border-t border-white/10 px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-sm text-mist/70 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow mb-2">Phone</p>
            <p>+91 97901 19963</p>
            <p>+91 94864 51468</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Email</p>
            <p>blast@rvsitech.ac.in</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Website</p>
            <p>www.rvsitech.ac.in/blast2026</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Social</p>
            <p>@blast.symposium</p>
          </div>
        </div>
      </section>

      
      {/* Footer */}
      <footer className="border-t border-white/10 bg-ink-2 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Image src="/images/cse-logo.png" alt="CSE Department logo" width={40} height={40} className="rounded bg-white p-1" />
              <div>
                <p className="text-xs text-mist/50">Organized by</p>
                <p className="font-display text-xs text-chrome">
                  Department of Computer Science and Engineering
                </p>
                <p className="text-[11px] text-mist/50">
                  RVS ITECH College of Engineering, Kumarasamy Nagar, Coimbatore – 641 402, Tamil Nadu, India
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/images/rc-logo.png" alt="RVS ITECH Research Council logo" width={32} height={32} className="rounded bg-white p-1" />
              <p className="text-xs text-mist/60">RVS ITECH Research Council</p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/images/ic-logo.png" alt="Institution's Innovation Council logo" width={32} height={32} className="rounded bg-white p-1" />
              <p className="text-xs text-mist/60">Institution&apos;s Innovation Council (Ministry of Education Initiative)</p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden border-t border-white/10 pt-8 text-center">
            <p className="eyebrow mb-4">Our Sponsors</p>
            <div className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
              <div className="marquee-track items-center gap-x-6 opacity-95">
                {[...sponsors, ...sponsors].map((s, i) => (
                  <div key={`${s.name}-${i}`} className="shrink-0 rounded-lg bg-white px-4 py-2 shadow-sm">
                    <Image src={s.img} alt={s.name} width={100} height={32} className="h-8 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[11px] text-mist/40">
            &copy; 2026 RVS ITECH College of Engineering, CSE Department. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
