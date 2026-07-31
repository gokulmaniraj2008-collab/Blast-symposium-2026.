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
      <span className="telemetry-digit font-display text-2xl text-milk sm:text-3xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-amber/80">
        {label}
      </span>
    </div>
  );
}

function LaunchCountdown({ launchIso }: { launchIso: string }) {
  const t = useCountdown(launchIso);

  return (
    <div className="mx-auto mt-10 inline-flex flex-col items-center gap-3">
      <p className="font-mono text-[11px] uppercase tracking-[0.35em] text-rose/90">
        {t?.launched ? (
          "Symposium is underway"
        ) : (
          <>
            Countdown to Day One <span className="blink text-amber">_</span>
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
      <header className="sticky top-0 z-30 border-b border-milk/10 bg-plum/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/images/rvs-logo.png"
              alt="RVS ITECH logo"
              width={44}
              height={44}
              className="rounded bg-milk p-0.5"
            />
            <div className="leading-tight">
              <p className="font-display text-sm tracking-wide text-milk">RVS ITECH</p>
              <p className="text-[11px] text-milk/60">College of Engineering &middot; CSE Department</p>
            </div>
          </div>

          <nav className="hidden gap-8 font-mono text-xs uppercase tracking-widest text-milk/70 md:flex">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="transition-colors hover:text-amber">
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden rounded-full bg-gradient-to-r from-rose to-amber px-5 py-2 font-mono text-xs uppercase tracking-widest text-plum shadow-lg shadow-plum-deep/30 transition hover:brightness-105 sm:inline-block"
            >
              Register
            </Link>
            <button
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-md border border-milk/15 md:hidden"
            >
              <span
                className={`h-[1.5px] w-4 bg-milk transition ${menuOpen ? "translate-y-[6.5px] rotate-45" : ""}`}
              />
              <span className={`h-[1.5px] w-4 bg-milk transition ${menuOpen ? "opacity-0" : ""}`} />
              <span
                className={`h-[1.5px] w-4 bg-milk transition ${menuOpen ? "-translate-y-[6.5px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        <div className={`mobile-nav border-t border-milk/10 md:hidden ${menuOpen ? "is-open" : ""}`}>
          <div>
            <nav className="flex flex-col gap-1 px-6 py-4 font-mono text-sm uppercase tracking-widest text-milk/80">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2.5 transition-colors hover:bg-milk/5 hover:text-amber"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="mt-2 rounded-full bg-gradient-to-r from-rose to-amber px-4 py-2.5 text-center text-plum"
              >
                Register
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative isolate bg-[radial-gradient(ellipse_at_top,#4a2242_0%,#381932_65%)] px-6 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[linear-gradient(180deg,transparent,rgba(28,10,23,0.55)_70%,#1c0a17_100%)]" />
        <div className="relative mx-auto max-w-5xl text-center">
          <p className="eyebrow mb-4">Department of Computer Science and Engineering proudly presents</p>
          <div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-amber/40 bg-amber/10 px-4 py-1 font-mono text-[11px] uppercase tracking-widest text-amber">
            A Decade of Impact &middot; A Future of Innovation
          </div>
          <h1 className="font-display text-6xl font-extrabold leading-[0.95] text-milk sm:text-8xl">
            BLAST
          </h1>
          <h2 className="font-display text-4xl italic leading-none text-rose sm:text-6xl">
            Symposium
          </h2>
          <p className="font-display text-5xl font-extrabold text-milk/90 sm:text-7xl">2026</p>

          <p className="mx-auto mt-6 max-w-xl font-mono text-sm uppercase tracking-[0.3em] text-milk/70">
            Innovate. Inspire. <span className="text-amber">Lead</span> the Future.
          </p>

          <div className="mx-auto mt-8 inline-block rounded-lg border border-rose/30 bg-milk/5 px-6 py-4">
            <p className="eyebrow mb-1">Theme</p>
            <p className="font-display text-lg text-milk sm:text-xl">
              Empowering Tomorrow: Technology | AI | Sustainability | Humanity
            </p>
          </div>

          <LaunchCountdown launchIso={settings.launch_iso} />

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-milk/10 bg-milk/5 px-4 py-3">
              <p className="eyebrow">Date</p>
              <p className="mt-1 font-display text-lg text-milk">{settings.event_dates}</p>
            </div>
            <div className="rounded-lg border border-milk/10 bg-milk/5 px-4 py-3">
              <p className="eyebrow">Time</p>
              <p className="mt-1 font-display text-lg text-milk">{settings.event_time}</p>
            </div>
            <div className="rounded-lg border border-milk/10 bg-milk/5 px-4 py-3">
              <p className="eyebrow">Venue</p>
              <p className="mt-1 font-display text-base text-milk">{settings.venue}</p>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-gradient-to-r from-amber to-[#e9c583] px-8 py-3 font-mono text-sm uppercase tracking-widest text-plum shadow-lg shadow-plum-deep/40 transition hover:brightness-105"
            >
              Register Now
            </Link>
            <a
              href="#speakers"
              className="rounded-full border border-milk/30 px-8 py-3 font-mono text-sm uppercase tracking-widest text-milk/80 transition hover:border-amber hover:text-amber"
            >
              Meet the Speakers
            </a>
          </div>
        </div>
      </section>

      {/* Speakers */}
      <section id="speakers" className="relative scroll-mt-20 border-t border-milk/10 bg-plum-2 px-6 py-20">
        <SectionHelix />
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow mb-2 text-center">Who&apos;s speaking</p>
          <h2 className="font-display text-center text-3xl text-milk sm:text-4xl">Keynote Speakers</h2>

          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {speakers.map((s) => (
              <div
                key={s.name}
                className="group rounded-xl border border-milk/10 bg-milk/5 p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-rose/50 hover:bg-milk/10"
              >
                <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border-2 border-rose/60 shadow-[0_0_16px_rgba(199,123,148,0.35)] transition group-hover:shadow-[0_0_22px_rgba(214,162,76,0.45)]">
                  <Image src={s.img} alt={s.name} width={96} height={96} className="h-full w-full object-cover" />
                </div>
                <p className="mt-4 font-display text-base text-amber">{s.name}</p>
                <p className="mt-1 text-xs text-milk/60">{s.role}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-12 max-w-md rounded-xl border border-amber/50 bg-gradient-to-b from-amber/10 to-transparent p-8 text-center shadow-[0_0_30px_rgba(214,162,76,0.12)]">
            <p className="eyebrow mb-4 text-amber">Chief Guest</p>
            <div className="mx-auto h-28 w-28 overflow-hidden rounded-full border-2 border-amber shadow-[0_0_20px_rgba(214,162,76,0.45)]">
              <Image
                src="/images/chief-guest.jpg"
                alt="Dr. Shekhar Mande"
                width={112}
                height={112}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-4 font-display text-xl text-milk">Dr. Shekhar Mande</p>
            <p className="mt-1 text-sm text-milk/60">
              Former Director General, CSIR &amp; Secretary, DSIR, Government of India
            </p>
          </div>
        </div>
      </section>

      {/* Highlights — light "milk" panel for palette rhythm */}
      <section id="highlights" className="relative scroll-mt-20 border-t border-milk/10 bg-milk px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="eyebrow-dark eyebrow mb-2 text-center">What to expect</p>
          <h2 className="font-display text-center text-3xl text-plum sm:text-4xl">Event Highlights</h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {highlights.map((h) => (
              <div
                key={h.title}
                className="rounded-xl border border-plum/10 bg-plum/5 p-5 transition duration-300 hover:-translate-y-1 hover:border-rose/40"
              >
                <div className="mb-3 h-1.5 w-8 rounded-full bg-gradient-to-r from-rose to-amber" />
                <p className="font-display text-sm text-plum">{h.title}</p>
                <p className="mt-1 text-xs text-plum/60">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitions & Workshops */}
      <section id="competitions" className="relative scroll-mt-20 border-t border-milk/10 bg-plum-2 px-6 py-20">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 lg:grid-cols-2">
          <div className="rounded-xl border border-milk/10 bg-milk/5 p-8">
            <p className="eyebrow mb-2">Compete</p>
            <h3 className="font-display text-2xl text-milk">Competitions</h3>
            <ul className="mt-6 space-y-3">
              {competitions.map((c) => (
                <li key={c} className="flex items-center gap-3 text-milk/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber" />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-milk/10 bg-milk/5 p-8">
            <p className="eyebrow mb-2">Learn by doing</p>
            <h3 className="font-display text-2xl text-milk">Workshops</h3>
            <ul className="mt-6 space-y-3">
              {workshops.map((w) => (
                <li key={w} className="flex items-center gap-3 text-milk/80">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
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
        className="relative scroll-mt-20 border-t border-milk/10 bg-[radial-gradient(ellipse_at_center,#4a2242_0%,#1c0a17_75%)] px-6 py-20"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center">
          <div>
            <p className="font-display text-3xl text-milk sm:text-4xl">Register Now</p>
            <p className="mt-2 max-w-sm text-milk/70">
              Be part of the next generation of innovation.
            </p>
            <p className="mt-4 inline-block rounded-full border border-amber/50 px-4 py-1 font-mono text-xs uppercase tracking-widest text-amber">
              {settings.registrations_open ? "Limited seats — register early!" : "Registrations are currently closed"}
            </p>
            <div className="mt-6">
              {settings.registrations_open ? (
                <Link
                  href="/register"
                  className="inline-block rounded-full bg-gradient-to-r from-amber to-[#e9c583] px-8 py-3 font-mono text-sm uppercase tracking-widest text-plum shadow-lg shadow-plum-deep/40 transition hover:brightness-105"
                >
                  Register Online
                </Link>
              ) : (
                <span className="inline-block rounded-full border border-milk/15 px-8 py-3 font-mono text-sm uppercase tracking-widest text-milk/50">
                  Registration closed
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="relative scroll-mt-20 border-t border-milk/10 px-6 py-16">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 text-sm text-milk/70 sm:grid-cols-2 lg:grid-cols-4">
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
      <footer className="border-t border-milk/10 bg-plum-deep px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex items-center gap-3">
              <Image src="/images/cse-logo.png" alt="CSE Department logo" width={40} height={40} className="rounded bg-milk p-1" />
              <div>
                <p className="text-xs text-milk/50">Organized by</p>
                <p className="font-display text-xs text-milk">
                  Department of Computer Science and Engineering
                </p>
                <p className="text-[11px] text-milk/50">
                  RVS ITECH College of Engineering, Kumarasamy Nagar, Coimbatore – 641 402, Tamil Nadu, India
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/images/rc-logo.png" alt="RVS ITECH Research Council logo" width={32} height={32} className="rounded bg-milk p-1" />
              <p className="text-xs text-milk/60">RVS ITECH Research Council</p>
            </div>
            <div className="flex items-center gap-3">
              <Image src="/images/ic-logo.png" alt="Institution's Innovation Council logo" width={32} height={32} className="rounded bg-milk p-1" />
              <p className="text-xs text-milk/60">Institution&apos;s Innovation Council (Ministry of Education Initiative)</p>
            </div>
          </div>

          <div className="mt-10 overflow-hidden border-t border-milk/10 pt-8 text-center">
            <p className="eyebrow mb-4">Our Sponsors</p>
            <div className="[mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
              <div className="marquee-track items-center gap-x-6 opacity-95">
                {[...sponsors, ...sponsors].map((s, i) => (
                  <div key={`${s.name}-${i}`} className="shrink-0 rounded-lg bg-milk px-4 py-2 shadow-sm">
                    <Image src={s.img} alt={s.name} width={100} height={32} className="h-8 w-auto object-contain" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-10 text-center text-[11px] text-milk/40">
            &copy; 2026 RVS ITECH College of Engineering, CSE Department. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
