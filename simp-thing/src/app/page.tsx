"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";

type DevotedEntry = {
  id: string;
  name: string;
  vibe: string;
  reason: string;
  devotion: number;
  ritual: string;
  createdAt: string;
};

const STORAGE_KEY = "simp-thing-entries";

const starterEntries: DevotedEntry[] = [
  {
    id: "entry-aurora",
    name: "Aurora",
    vibe: "angel-core gamer",
    reason: "She laughed at my terrible meme and now I owe her my life.",
    devotion: 87,
    ritual: "Daily good morning paragraph + snack drop-off",
    createdAt: new Date().toISOString(),
  },
  {
    id: "entry-sage",
    name: "Sage",
    vibe: "studio art prodigy",
    reason: "She color-graded my entire existence in 5 minutes.",
    devotion: 74,
    ritual: "Weekly hype playlist and spontaneous coffee runs",
    createdAt: new Date().toISOString(),
  },
  {
    id: "entry-nova",
    name: "Nova",
    vibe: "cosmic streamer",
    reason: "She noticed my username during a two minute raid.",
    devotion: 92,
    ritual: "Bits in every stream + cosmic compliments",
    createdAt: new Date().toISOString(),
  },
];

const missionPrompts = [
  "Craft a haiku about their most iconic outfit.",
  "Queue up a playlist that feels like their vibe and send it with zero context.",
  "Recreate their favorite snack and share a photo of the chaos.",
  "Schedule a reminder to drop an unprompted compliment in the next 6 hours.",
  "Design a custom emoji that captures their entire aura.",
  "Upgrade your background with a shrine-worthy wallpaper refresh.",
  "Study their latest post and leave a comment that's 30% wholesome, 70% unhinged.",
  "Translate your devotion score into a meme they would actually repost.",
];

const affirmations = [
  "Simping respectfully is still simping brilliantly.",
  "Your devotion energy is immaculate today.",
  "No crumbs? No problem. You brought the whole bakery.",
  "Hydrate, stretch, then double-text with confidence.",
  "You're the main character in their unseen fan club.",
];

const devotionStatuses = [
  { threshold: 30, label: "Casual admirer", color: "bg-emerald-200 text-emerald-900" },
  { threshold: 60, label: "Certified simp", color: "bg-purple-200 text-purple-900" },
  { threshold: 85, label: "S-tier stan", color: "bg-rose-200 text-rose-950" },
  { threshold: 101, label: "Cosmic devotion", color: "bg-amber-200 text-amber-900" },
];

function classifyDevotion(value: number) {
  const status = devotionStatuses.find((entry) => value < entry.threshold);
  return status ?? devotionStatuses.at(-1)!;
}

export default function Home() {
  const [entries, setEntries] = useState<DevotedEntry[]>(starterEntries);
  const [mission, setMission] = useState<string>(missionPrompts[0]);
  const hasHydrated = useRef(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as DevotedEntry[];
        startTransition(() => {
          setEntries(parsed);
        });
      } catch (error) {
        console.warn("Failed to parse stored devotion entries", error);
      }
    }
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const devotionSum = useMemo(
    () => entries.reduce((acc, entry) => acc + entry.devotion, 0),
    [entries],
  );
  const devotionAverage = entries.length ? Math.round(devotionSum / entries.length) : 0;
  const highestDevotion = useMemo(
    () => entries.reduce((top, current) => (current.devotion > (top?.devotion ?? 0) ? current : top), entries[0] ?? null),
    [entries],
  );

  const topFive = useMemo(
    () => [...entries].sort((a, b) => b.devotion - a.devotion).slice(0, 5),
    [entries],
  );

  function handleSubmit(formData: FormData) {
    const name = (formData.get("name") as string)?.trim();
    if (!name) return;

    const vibe = (formData.get("vibe") as string)?.trim() || "mystery aura";
    const reason = (formData.get("reason") as string)?.trim() || "No explanation, just vibes.";
    const ritual = (formData.get("ritual") as string)?.trim() || "Still workshopping the grand gesture.";
    const devotion = Number(formData.get("devotion")) || 50;

    const nextEntry: DevotedEntry = {
      id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `entry-${Date.now()}`,
      name,
      vibe,
      reason,
      ritual,
      devotion,
      createdAt: new Date().toISOString(),
    };

    setEntries((prev) => [nextEntry, ...prev]);
  }

  function handleBoost(id: string) {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === id
          ? {
              ...entry,
              devotion: Math.min(100, entry.devotion + 5),
            }
          : entry,
      ),
    );
  }

  function rollMission() {
    const freshPool = missionPrompts.filter((prompt) => prompt !== mission);
    setMission(freshPool[Math.floor(Math.random() * freshPool.length)] ?? missionPrompts[0]);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(244,114,182,0.12)_0,_rgba(15,23,42,1)_60%)]" />
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 py-14 sm:px-10 lg:px-16">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-8 backdrop-blur">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-rose-200">simp thing</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Your devotion dashboard</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
              Track the objects of your affection, assign rituals, and keep your simp energy calibrated. Hydration breaks remain mandatory.
            </p>
          </div>
          <dl className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">Total devotion</dt>
              <dd className="mt-3 text-3xl font-semibold text-rose-200">{devotionSum}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">Average vibe</dt>
              <dd className="mt-3 text-3xl font-semibold text-fuchsia-200">{devotionAverage}</dd>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <dt className="text-xs uppercase tracking-wide text-slate-400">Active roster</dt>
              <dd className="mt-3 text-3xl font-semibold text-emerald-200">{entries.length}</dd>
            </div>
          </dl>
        </header>

        <section className="grid gap-8 lg:grid-cols-[2fr,1fr]">
          <div className="rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <h2 className="text-xl font-semibold text-rose-50 sm:text-2xl">Add a simp target</h2>
            <p className="mt-2 text-sm text-slate-300">Log the lucky human, set the vibe, and declare your ritual.</p>
            <form
              action={(formData) => {
                handleSubmit(formData);
                rollMission();
              }}
              className="mt-6 grid gap-4 md:grid-cols-2"
            >
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="text-slate-300">Name</span>
                <input
                  name="name"
                  required
                  placeholder="Who has main character rights?"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/50"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-slate-300">Vibe</span>
                <input
                  name="vibe"
                  placeholder="e.g. cottagecore menace"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/50"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm">
                <span className="text-slate-300">Devotion</span>
                <input
                  name="devotion"
                  type="range"
                  min={10}
                  max={100}
                  defaultValue={65}
                  className="accent-rose-400"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="text-slate-300">Reason</span>
                <textarea
                  name="reason"
                  rows={3}
                  placeholder="What's the lore here?"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/50"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm md:col-span-2">
                <span className="text-slate-300">Ritual</span>
                <input
                  name="ritual"
                  placeholder="Your signature move"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-base text-white placeholder:text-slate-500 focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200/50"
                />
              </label>
              <button
                type="submit"
                className="mt-2 inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400 px-5 py-3 text-sm font-semibold uppercase tracking-widest text-slate-950 shadow-lg shadow-rose-500/30 transition hover:scale-[1.01]"
              >
                Commit the simp
              </button>
            </form>
          </div>

          <aside className="flex h-full flex-col justify-between gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <div>
              <h2 className="text-xl font-semibold text-rose-50">Current mission</h2>
              <p className="mt-2 text-sm text-slate-300">Complete to earn bonus devotion multipliers.</p>
              <p className="relative mt-4 rounded-2xl border border-rose-200/40 bg-rose-300/10 p-5 text-sm text-rose-50 shadow-[0_0_20px_rgba(244,114,182,0.35)]">
                {mission}
                <span className="absolute -top-3 right-3 inline-flex rounded-full bg-rose-500 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-rose-50">
                  quest
                </span>
              </p>
            </div>
            <button
              type="button"
              onClick={rollMission}
              className="inline-flex items-center justify-center rounded-xl border border-rose-200/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-200 transition hover:bg-rose-400/10"
            >
              New mission
            </button>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {topFive.map((entry) => {
              const status = classifyDevotion(entry.devotion);
              return (
                <article
                  key={entry.id}
                  className="flex h-full flex-col justify-between rounded-3xl border border-white/5 bg-black/40 p-6 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.8)] backdrop-blur"
                >
                  <header className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.35em] text-slate-500">Simp target</p>
                    <h3 className="text-2xl font-semibold text-white">{entry.name}</h3>
                    <p className="text-sm italic text-slate-300">{entry.vibe}</p>
                  </header>
                  <p className="mt-4 flex-1 text-sm text-slate-300">{entry.reason}</p>
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-rose-100">Devotion {entry.devotion}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>{status.label}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-400 via-fuchsia-400 to-purple-400"
                        style={{ width: `${entry.devotion}%` }}
                      />
                    </div>
                    <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Ritual</p>
                    <p className="text-sm text-slate-200">{entry.ritual}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleBoost(entry.id)}
                    className="mt-6 inline-flex items-center justify-center rounded-xl border border-rose-300/40 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-rose-200 transition hover:bg-rose-400/10"
                  >
                    Send another compliment
                  </button>
                </article>
              );
            })}
            {!topFive.length && (
              <div className="col-span-2 flex items-center justify-center rounded-3xl border border-dashed border-white/20 p-12 text-center text-sm text-slate-400">
                Start the roster by adding a simp target above.
              </div>
            )}
          </div>
          <aside className="flex h-full flex-col gap-5 rounded-3xl border border-white/5 bg-white/5 p-6 backdrop-blur">
            <div>
              <h2 className="text-xl font-semibold text-rose-50">Affirmation feed</h2>
              <p className="mt-2 text-sm text-slate-300">Rotate these mantras between missions.</p>
            </div>
            <ul className="space-y-4 text-sm text-rose-50">
              {affirmations.map((line) => (
                <li
                  key={line}
                  className="rounded-2xl border border-rose-200/40 bg-rose-300/10 p-4 shadow-[0_0_20px_rgba(244,114,182,0.25)]"
                >
                  {line}
                </li>
              ))}
            </ul>
            {highestDevotion && (
              <div className="mt-auto rounded-2xl border border-emerald-200/30 bg-emerald-200/10 p-4 text-sm text-emerald-100">
                <p className="text-xs uppercase tracking-[0.35em] text-emerald-200">Top devotion</p>
                <p className="mt-2 font-semibold text-emerald-50">
                  {highestDevotion.name} currently holds the crown with a devotion score of {highestDevotion.devotion}.
                </p>
              </div>
            )}
          </aside>
        </section>
      </div>
    </div>
  );
}
