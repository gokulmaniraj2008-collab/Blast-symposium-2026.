"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const SESSION_KEY = "blast-admin-session";

type Registration = {
  id: string;
  created_at: string;
  ticket_id: string;
  name: string;
  email: string;
  phone: string;
  institution: string;
  department: string;
  category: string;
  competitions: string[];
  workshops: string[];
  notes: string;
  status: "confirmed" | "waitlisted" | "cancelled";
};

type Settings = {
  event_dates: string;
  event_time: string;
  venue: string;
  launch_iso: string;
  registrations_open: boolean;
};

function authHeaders(password: string) {
  return { "x-admin-password": password, "Content-Type": "application/json" };
}

function PasswordGate({ onUnlock }: { onUnlock: (password: string) => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Incorrect password.");
        return;
      }
      sessionStorage.setItem(SESSION_KEY, value);
      onUnlock(value);
    } catch {
      setError("Network error — please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="starfield relative flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#201a44_0%,#0b0f2b_65%)] px-6">
      <form onSubmit={handleSubmit} className="telemetry-frame w-full max-w-sm rounded-2xl p-8 text-center">
        <p className="eyebrow mb-2">Restricted</p>
        <h1 className="font-display text-2xl text-chrome">Admin Access</h1>
        <p className="mt-2 text-sm text-mist/70">Enter the admin password to continue.</p>

        <input
          type="password"
          autoFocus
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Password"
          className="mt-6 w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-center text-sm text-chrome placeholder:text-mist/30 outline-none transition focus:border-cyan/60 focus:bg-white/10"
        />
        {error && <p className="mt-2 font-mono text-[11px] text-rose-300">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-gradient-to-r from-violet to-violet-soft px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-white shadow-lg shadow-violet/30 transition hover:brightness-110 disabled:opacity-50"
        >
          {loading ? "Checking…" : "Unlock"}
        </button>

        <Link href="/" className="mt-6 block font-mono text-xs uppercase tracking-widest text-mist/50 hover:text-cyan">
          &larr; Back to event site
        </Link>
      </form>
    </main>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string; tone?: "gold" | "cyan" }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <p className="eyebrow">{label}</p>
      <p className={`mt-1 font-display text-lg ${tone === "gold" ? "text-gold" : tone === "cyan" ? "text-cyan" : "text-chrome"}`}>
        {value}
      </p>
    </div>
  );
}

function RegistrationsPanel({ password }: { password: string }) {
  const [rows, setRows] = useState<Registration[] | null>(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Registration | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/registrations", { headers: authHeaders(password) });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not load registrations.");
        setRows([]);
        return;
      }
      setRows(data.registrations);
    } catch {
      setError("Network error loading registrations.");
      setRows([]);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    if (!rows) return [];
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.name, r.email, r.institution, r.ticket_id, r.category].some((v) => v?.toLowerCase().includes(q))
    );
  }, [rows, query]);

  const updateStatus = async (row: Registration, status: Registration["status"]) => {
    setBusyId(row.id);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: authHeaders(password),
        body: JSON.stringify({ id: row.id, status }),
      });
      const data = await res.json();
      if (res.ok) {
        setRows((prev) => prev!.map((r) => (r.id === row.id ? data.registration : r)));
      }
    } finally {
      setBusyId(null);
    }
  };

  const saveEdit = async (updated: Registration) => {
    setBusyId(updated.id);
    try {
      const res = await fetch("/api/admin/registrations", {
        method: "PATCH",
        headers: authHeaders(password),
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok) {
        setRows((prev) => prev!.map((r) => (r.id === updated.id ? data.registration : r)));
        setEditing(null);
      }
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (row: Registration) => {
    if (!confirm(`Delete registration for ${row.name}? This cannot be undone.`)) return;
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/registrations?id=${row.id}`, {
        method: "DELETE",
        headers: authHeaders(password),
      });
      if (res.ok) setRows((prev) => prev!.filter((r) => r.id !== row.id));
    } finally {
      setBusyId(null);
    }
  };

  const exportCsv = () => {
    if (!rows || rows.length === 0) return;
    const cols: (keyof Registration)[] = [
      "ticket_id",
      "name",
      "email",
      "phone",
      "institution",
      "department",
      "category",
      "competitions",
      "workshops",
      "status",
      "created_at",
    ];
    const csv = [
      cols.join(","),
      ...filtered.map((r) =>
        cols
          .map((c) => {
            const v = r[c];
            const s = Array.isArray(v) ? v.join(" | ") : String(v ?? "");
            return `"${s.replace(/"/g, '""')}"`;
          })
          .join(",")
      ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blast-2026-registrations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (rows === null && !error) {
    return <p className="mt-8 text-mist/60">Loading registrations…</p>;
  }

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
        <p className="eyebrow mb-2 text-rose-300">Not connected</p>
        <p className="text-mist/70">{error}</p>
        <p className="mt-3 text-sm text-mist/50">
          Set <code className="text-cyan">SUPABASE_URL</code> and{" "}
          <code className="text-cyan">SUPABASE_SERVICE_ROLE_KEY</code> in your environment, then run{" "}
          <code className="text-cyan">supabase/schema.sql</code> once in the Supabase SQL editor.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard label="Total registrations" value={String(rows!.length)} />
        <StatCard label="Confirmed" value={String(rows!.filter((r) => r.status === "confirmed").length)} tone="gold" />
        <StatCard label="Waitlisted / Cancelled" value={String(rows!.filter((r) => r.status !== "confirmed").length)} tone="cyan" />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, institution, ticket…"
          className="w-full max-w-sm rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm text-chrome placeholder:text-mist/40 outline-none focus:border-cyan/60"
        />
        <div className="flex gap-3">
          <button
            onClick={load}
            className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-mist/70 hover:border-cyan hover:text-cyan"
          >
            Refresh
          </button>
          <button
            onClick={exportCsv}
            className="rounded-full bg-gradient-to-r from-cyan to-cyan-deep px-4 py-2 font-mono text-xs uppercase tracking-widest text-ink hover:brightness-110"
          >
            Export CSV
          </button>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/5 font-mono text-[11px] uppercase tracking-widest text-mist/60">
            <tr>
              <th className="px-4 py-3">Ticket</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Contact</th>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((r) => (
              <tr key={r.id} className={busyId === r.id ? "opacity-50" : ""}>
                <td className="px-4 py-3 font-mono text-xs text-gold">{r.ticket_id}</td>
                <td className="px-4 py-3 text-chrome">{r.name}</td>
                <td className="px-4 py-3 text-mist/70">
                  <div>{r.email}</div>
                  <div className="text-xs text-mist/50">{r.phone}</div>
                </td>
                <td className="px-4 py-3 text-mist/70">{r.institution}</td>
                <td className="px-4 py-3 text-mist/70">{r.category}</td>
                <td className="px-4 py-3">
                  <select
                    value={r.status}
                    onChange={(e) => updateStatus(r, e.target.value as Registration["status"])}
                    className="rounded-md border border-white/15 bg-white/5 px-2 py-1 text-xs text-chrome outline-none focus:border-cyan/60"
                  >
                    <option value="confirmed" className="bg-white text-ink">Confirmed</option>
                    <option value="waitlisted" className="bg-white text-ink">Waitlisted</option>
                    <option value="cancelled" className="bg-white text-ink">Cancelled</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(r)} className="mr-3 text-xs text-cyan hover:underline">
                    Edit
                  </button>
                  <button onClick={() => remove(r)} className="text-xs text-rose-300 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-mist/50">
                  No registrations match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6" onClick={() => setEditing(null)}>
          <div
            className="telemetry-frame w-full max-w-md rounded-2xl bg-ink-2 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="eyebrow mb-1">Edit registration</p>
            <h3 className="font-display text-xl text-chrome">{editing.ticket_id}</h3>
            <div className="mt-4 space-y-3">
              {(["name", "email", "phone", "institution", "department", "notes"] as const).map((field) => (
                <div key={field}>
                  <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-mist/50">
                    {field}
                  </label>
                  <input
                    value={editing[field] ?? ""}
                    onChange={(e) => setEditing({ ...editing, [field]: e.target.value })}
                    className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-chrome outline-none focus:border-cyan/60"
                  />
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditing(null)}
                className="rounded-full border border-white/15 px-4 py-2 font-mono text-xs uppercase tracking-widest text-mist/70"
              >
                Cancel
              </button>
              <button
                onClick={() => saveEdit(editing)}
                disabled={busyId === editing.id}
                className="rounded-full bg-gradient-to-r from-violet to-violet-soft px-4 py-2 font-mono text-xs uppercase tracking-widest text-white disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsPanel({ password }: { password: string }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { headers: authHeaders(password) });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error ?? "Could not load settings.");
          return;
        }
        setSettings(data.settings);
      } catch {
        setError("Network error loading settings.");
      }
    })();
  }, [password]);

  const save = async () => {
    if (!settings) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: authHeaders(password),
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        setSettings(data.settings);
        setSaved(true);
      } else {
        setError(data.error ?? "Could not save settings.");
      }
    } finally {
      setSaving(false);
    }
  };

  if (error) {
    return (
      <div className="mt-8 rounded-xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
        <p className="eyebrow mb-2 text-rose-300">Not connected</p>
        <p className="text-mist/70">{error}</p>
      </div>
    );
  }

  if (!settings) return <p className="mt-8 text-mist/60">Loading settings…</p>;

  const localDatetime = settings.launch_iso ? settings.launch_iso.slice(0, 16) : "";

  return (
    <div className="mt-8 max-w-xl space-y-5">
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-mist/50">Event dates (display text)</label>
        <input
          value={settings.event_dates}
          onChange={(e) => setSettings({ ...settings, event_dates: e.target.value })}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-chrome outline-none focus:border-cyan/60"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-mist/50">Time (display text)</label>
        <input
          value={settings.event_time}
          onChange={(e) => setSettings({ ...settings, event_time: e.target.value })}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-chrome outline-none focus:border-cyan/60"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-mist/50">Venue</label>
        <input
          value={settings.venue}
          onChange={(e) => setSettings({ ...settings, venue: e.target.value })}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-chrome outline-none focus:border-cyan/60"
        />
      </div>
      <div>
        <label className="mb-1 block font-mono text-[10px] uppercase tracking-widest text-mist/50">
          Countdown launch time
        </label>
        <input
          type="datetime-local"
          value={localDatetime}
          onChange={(e) => setSettings({ ...settings, launch_iso: e.target.value })}
          className="w-full rounded-lg border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-chrome outline-none focus:border-cyan/60"
        />
      </div>
      <div className="flex items-center justify-between rounded-lg border border-white/15 bg-white/5 px-4 py-3">
        <div>
          <p className="text-sm text-chrome">Registrations open</p>
          <p className="text-xs text-mist/50">Turn off to close the registration form site-wide.</p>
        </div>
        <button
          type="button"
          onClick={() => setSettings({ ...settings, registrations_open: !settings.registrations_open })}
          className={`h-7 w-12 rounded-full transition ${settings.registrations_open ? "bg-gradient-to-r from-cyan to-cyan-deep" : "bg-white/15"}`}
        >
          <span
            className={`block h-5 w-5 translate-x-1 rounded-full bg-white transition ${settings.registrations_open ? "translate-x-6" : ""}`}
          />
        </button>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-violet to-violet-soft px-6 py-2.5 font-mono text-xs uppercase tracking-widest text-white shadow-lg shadow-violet/30 hover:brightness-110 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
        {saved && <span className="font-mono text-xs uppercase tracking-widest text-cyan">Saved</span>}
      </div>
    </div>
  );
}


function AdminDashboard({ password, onLock }: { password: string; onLock: () => void }) {
  const [tab, setTab] = useState<"registrations" | "settings">("registrations");

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,#201a44_0%,#0b0f2b_65%)] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <p className="eyebrow mb-1">Mission control</p>
            <h1 className="font-display text-3xl text-chrome">BLAST 2026 &middot; Admin</h1>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="font-mono text-xs uppercase tracking-widest text-mist/60 hover:text-cyan">
              View site
            </Link>
            <button
              type="button"
              onClick={onLock}
              className="rounded-full border border-white/20 px-4 py-2 font-mono text-xs uppercase tracking-widest text-mist/70 transition hover:border-rose-300 hover:text-rose-300"
            >
              Log out
            </button>
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          {(["registrations", "settings"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-widest transition ${
                tab === t ? "bg-gradient-to-r from-violet to-violet-soft text-white" : "border border-white/15 text-mist/60 hover:text-cyan"
              }`}
            >
              {t === "registrations" ? "Registrations" : "Event Settings"}
            </button>
          ))}
        </div>

        {tab === "registrations" ? <RegistrationsPanel password={password} /> : <SettingsPanel password={password} />}
      </div>
    </main>
  );
}

export default function AdminPage() {
  const [password, setPassword] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setPassword(sessionStorage.getItem(SESSION_KEY));
    setChecked(true);
  }, []);

  const handleLock = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setPassword(null);
  };

  if (!checked) return null;

  return password ? (
    <AdminDashboard password={password} onLock={handleLock} />
  ) : (
    <PasswordGate onUnlock={(pw) => setPassword(pw)} />
  );
}
