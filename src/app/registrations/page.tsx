"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalModal } from "@/components/modals/LegalModal";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import {
  ClipboardList, Trophy, Calendar, ArrowLeft, Loader2,
  CheckCircle2, Clock, XCircle, AlertCircle, ArrowRight,
  Sparkles, Tag,
} from "lucide-react";
import type { DbRegistration } from "@/lib/dbTypes";
import { fmtDate } from "@/lib/dateUtils";

/* ── status config ── */
const STATUS_CONFIG: Record<
  DbRegistration["status"],
  { label: string; icon: React.ElementType; classes: string; dot: string }
> = {
  Confirmed: {
    label: "Confirmed",
    icon: CheckCircle2,
    classes: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
  },
  Approved: {
    label: "Approved",
    icon: CheckCircle2,
    classes: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
  },
  Waitlisted: {
    label: "Waitlisted",
    icon: Clock,
    classes: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-400",
  },
  Cancelled: {
    label: "Cancelled",
    icon: XCircle,
    classes: "bg-rose-50 border-rose-200 text-rose-600",
    dot: "bg-rose-400",
  },
};

const ROLE_COLORS: Record<string, string> = {
  "Hacker / Participant":     "bg-blue-50 border-blue-200 text-blue-700",
  "Volunteer / Organizer":    "bg-violet-50 border-violet-200 text-violet-700",
  "Campus Ambassador":        "bg-cyan-50 border-cyan-200 text-cyan-700",
  "Mentor / Speaker":         "bg-amber-50 border-amber-200 text-amber-700",
};

/* ── page ── */
export default function RegistrationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [isJoinOpen, setIsJoinOpen] = useState(false);

  const [registrations, setRegistrations] = useState<DbRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<DbRegistration["status"] | "All">("All");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin?callbackUrl=/registrations");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    (async () => {
      try {
        const res = await fetch("/api/user/registrations");
        const data = await res.json();
        if (data.success) setRegistrations(data.registrations);
        else setError(data.error ?? "Could not load registrations.");
      } catch {
        setError("Could not load registrations.");
      } finally {
        setLoading(false);
      }
    })();
  }, [status]);

  const filtered = filter === "All" ? registrations : registrations.filter((r) => r.status === filter);

  const counts = {
    All: registrations.length,
    Confirmed: registrations.filter((r) => r.status === "Confirmed").length,
    Approved: registrations.filter((r) => r.status === "Approved").length,
    Waitlisted: registrations.filter((r) => r.status === "Waitlisted").length,
    Cancelled: registrations.filter((r) => r.status === "Cancelled").length,
  };

  /* ── loading ── */
  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col selection:bg-blue-600 selection:text-white">
        <Navbar onJoinClick={() => setIsJoinOpen(true)} />
        <div className="flex-1 flex items-center justify-center pt-20">
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="text-sm font-medium">Loading your registrations…</p>
          </div>
        </div>
      </div>
    );
  }
  if (status === "unauthenticated") return null;

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24 pb-16">

        {/* ── Hero ── */}
        <section className="relative py-10 sm:py-14 bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-400/8 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
            <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6">
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-3 h-3" /> Your Activity
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900">My Registrations</h1>
                <p className="text-sm text-slate-500 mt-1">
                  All hackathons and events you&apos;ve signed up for — {registrations.length} total.
                </p>
              </div>
              <Link
                href="/hackathons"
                className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.02]"
              >
                <Trophy className="w-3.5 h-3.5" /> Explore Hackathons
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8 space-y-6">

          {/* error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {/* ── Filter tabs ── */}
          {registrations.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {(["All", "Confirmed", "Approved", "Waitlisted", "Cancelled"] as const).map((s) => (
                counts[s] > 0 || s === "All" ? (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                      filter === s
                        ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                        : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600"
                    }`}
                  >
                    {s}
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${filter === s ? "bg-white/20" : "bg-slate-100"}`}>
                      {counts[s]}
                    </span>
                  </button>
                ) : null
              ))}
            </div>
          )}

          {/* ── Empty state ── */}
          {registrations.length === 0 && !error && (
            <div className="text-center py-16 px-6 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-8 h-8 text-blue-500" />
              </div>
              <h2 className="text-lg font-black text-slate-900 mb-1">No registrations yet</h2>
              <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
                You haven&apos;t signed up for any hackathons or events. Explore what&apos;s coming up!
              </p>
              <div className="flex items-center justify-center gap-3">
                <Link href="/hackathons" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition-all">
                  <Trophy className="w-3.5 h-3.5" /> View Hackathons
                </Link>
                <Link href="/events" className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:text-blue-600 text-slate-700 text-xs font-bold transition-all">
                  <Calendar className="w-3.5 h-3.5" /> View Events
                </Link>
              </div>
            </div>
          )}

          {/* ── Registration cards ── */}
          {filtered.length > 0 && (
            <div className="space-y-3">
              {filtered.map((reg) => {
                const sc = STATUS_CONFIG[reg.status];
                const StatusIcon = sc.icon;
                const roleColor = ROLE_COLORS[reg.role] ?? "bg-slate-50 border-slate-200 text-slate-600";

                return (
                  <div key={reg.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-5">

                      {/* Icon */}
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-blue-600" />
                      </div>

                      {/* Main info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-black text-slate-900 leading-snug">{reg.eventOrHackathon}</h3>
                          {reg.hackathonId && (
                            <Link
                              href={`/hackathons/${reg.hackathonId}`}
                              className="shrink-0 text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                            >
                              View →
                            </Link>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Status badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${sc.classes}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                            <StatusIcon className="w-3 h-3" />
                            {sc.label}
                          </span>
                          {/* Role badge */}
                          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-semibold ${roleColor}`}>
                            <Tag className="w-3 h-3" />
                            {reg.role}
                          </span>
                          {/* Team */}
                          {reg.teamName && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600 text-[10px] font-semibold">
                              Team: {reg.teamName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400">
                          Registered {fmtDate(reg.createdAt)}
                          {reg.collegeOrSchool && ` · ${reg.collegeOrSchool}`}
                        </p>
                      </div>

                      {/* Links */}
                      <div className="flex items-center gap-2 shrink-0">
                        {reg.githubUrl && (
                          <a
                            href={reg.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-slate-800 transition-all text-[10px] font-bold"
                          >
                            GitHub
                          </a>
                        )}
                        {reg.linkedinUrl && (
                          <a
                            href={reg.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-500 hover:text-blue-600 transition-all text-[10px] font-bold"
                          >
                            LinkedIn
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Filtered empty ── */}
          {filtered.length === 0 && registrations.length > 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No {filter.toLowerCase()} registrations.</p>
              <button onClick={() => setFilter("All")} className="mt-2 text-xs text-blue-600 hover:underline cursor-pointer">
                Show all
              </button>
            </div>
          )}

          {/* ── CTA for more ── */}
          {registrations.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Link href="/hackathons" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                  <Trophy className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Upcoming Hackathons</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Register for the next sprint</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="/events" className="flex items-center gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:border-violet-200 hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0 group-hover:bg-violet-100 transition-colors">
                  <Calendar className="w-5 h-5 text-violet-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Knowledge Sessions</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Browse upcoming workshops</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />
      <JoinCommunityModal isOpen={isJoinOpen} onClose={() => setIsJoinOpen(false)} />
      <LegalModal isOpen={!!legalModalType} onClose={() => setLegalModalType(null)} type={legalModalType || "privacy"} />
    </div>
  );
}
