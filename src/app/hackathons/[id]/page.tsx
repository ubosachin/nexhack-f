"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalModal } from "@/components/modals/LegalModal";
import { HackathonRegistrationModal } from "@/components/modals/HackathonRegistrationModal";
import { RichTextDisplay } from "@/components/ui/RichTextEditor";
import type { DbHackathon } from "@/lib/dbTypes";
import {
  Trophy,
  MapPin,
  Users,
  ArrowRight,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  CalendarCheck,
  CalendarX,
  BadgeCheck,
} from "lucide-react";

/* ── helpers ────────────────────────────────────────────────────────────── */

type RegStatus = "open" | "upcoming" | "closed" | "completed";

function getRegStatus(h: DbHackathon): RegStatus {
  if (h.status === "Completed") return "completed";
  const now = new Date();
  if (h.registrationStartDate && now < new Date(h.registrationStartDate)) return "upcoming";
  if (h.registrationEndDate && now > new Date(h.registrationEndDate)) return "closed";
  return "open";
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ── sub-components ────────────────────────────────────────────────────── */

function RegStatusBadge({ status }: { status: RegStatus }) {
  if (status === "open")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Registration Open
      </span>
    );
  if (status === "upcoming")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
        <Clock className="w-3 h-3" />
        Registration Upcoming
      </span>
    );
  if (status === "closed")
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold border border-rose-200">
        <AlertCircle className="w-3 h-3" />
        Registration Closed
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
      <AlertCircle className="w-3 h-3" />
      Event Completed
    </span>
  );
}

/* ── main page ─────────────────────────────────────────────────────────── */

export default function HackathonDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { data: session } = useSession();

  const [hackathon, setHackathon] = useState<DbHackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [legalType, setLegalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Load hackathon
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/hackathons/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.hackathon) setHackathon(data.hackathon);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // Check if user is already registered
  const checkRegistration = useCallback(async () => {
    if (!id || !session?.user) return;
    try {
      const res = await fetch(`/api/user/registrations?hackathonId=${id}`);
      const data = await res.json();
      if (data.success && data.registrations?.length > 0) {
        setAlreadyRegistered(true);
      }
    } catch {
      // silent — not critical
    }
  }, [id, session?.user]);

  useEffect(() => {
    checkRegistration();
  }, [checkRegistration]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar onJoinClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (notFound || !hackathon) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar onJoinClick={() => {}} />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4 text-center">
          <Trophy className="w-12 h-12 text-slate-300" />
          <h1 className="text-2xl font-black text-slate-900">Hackathon Not Found</h1>
          <p className="text-slate-500 text-sm">This hackathon may have been removed or the link is invalid.</p>
          <Link href="/hackathons" className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm">
            View All Hackathons
          </Link>
        </div>
      </div>
    );
  }

  const grad = hackathon.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500";
  const bannerSrc = isMobile && hackathon.mobileBannerUrl ? hackathon.mobileBannerUrl : hackathon.bannerUrl;
  const regStatus = getRegStatus(hackathon);
  const canRegister = regStatus === "open" && !alreadyRegistered;
  const minSize = hackathon.minTeamSize ?? 1;
  const maxSize = hackathon.maxTeamSize ?? 4;
  const isOnline = hackathon.mode === "Online";

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col">
      <Navbar onJoinClick={() => canRegister && setIsRegOpen(true)} />

      <main className="flex-1 pt-16 sm:pt-20">

        {/* ── BREADCRUMB ── */}
        <div className="bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <Link href="/hackathons" className="inline-flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 text-xs font-semibold transition-colors">
              <ChevronLeft className="w-3.5 h-3.5" />
              All Hackathons
            </Link>
          </div>
        </div>

        {/* ── BANNER ── */}
        <section>
          {bannerSrc ? (
            /* If a custom banner image exists — show it cleanly, full width, correct aspect ratio */
            <div className="w-full overflow-hidden bg-slate-100">
              <img
                src={bannerSrc}
                alt={`${hackathon.name} banner`}
                className="w-full object-cover object-center"
                style={{ aspectRatio: isMobile ? "4/3" : "3/1", display: "block" }}
              />
            </div>
          ) : (
            /* No image — use gradient as a tasteful header bar (not full-background takeover) */
            <div className={`w-full bg-gradient-to-r ${grad}`} style={{ height: isMobile ? "8px" : "10px" }} />
          )}
          {/* Gradient accent line below any banner */}
          <div className={`h-[3px] w-full bg-gradient-to-r ${grad}`} />
        </section>

        {/* ── TITLE BLOCK (always below the banner, never overlapping) ── */}
        <section className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {hackathon.edition && (
                <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${grad} text-white`}>
                  {hackathon.edition}
                </span>
              )}
              <span className="text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {hackathon.mode}
              </span>
              <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                hackathon.status === "Ongoing" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" :
                hackathon.status === "Upcoming" ? "bg-amber-100 text-amber-800 border border-amber-200" :
                "bg-slate-100 text-slate-600 border border-slate-200"
              }`}>
                {hackathon.status}
              </span>
              <RegStatusBadge status={regStatus} />
            </div>

            {/* Title + tagline */}
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {hackathon.name}
            </h1>
            {hackathon.tagline && (
              <p className="text-slate-500 text-sm sm:text-base mt-1.5 italic">
                "{hackathon.tagline}"
              </p>
            )}

            {/* Key meta pills */}
            <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
              {hackathon.prizePool && (
                <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {hackathon.prizePool}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-blue-500" />
                {hackathon.registeredCount.toLocaleString()} registered
              </span>
              {/* Location only for non-online */}
              {!isOnline && hackathon.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  {hackathon.location}
                </span>
              )}
            </div>

            {/* Registration dates */}
            {(hackathon.registrationStartDate || hackathon.registrationEndDate) && (
              <div className="mt-3 flex flex-wrap gap-4 text-xs">
                {hackathon.registrationStartDate && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CalendarCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Opens: <span className="font-semibold text-slate-700">{fmtDate(hackathon.registrationStartDate)}</span></span>
                  </span>
                )}
                {hackathon.registrationEndDate && (
                  <span className="flex items-center gap-1.5 text-slate-500">
                    <CalendarX className="w-3.5 h-3.5 text-rose-500" />
                    <span>Closes: <span className="font-semibold text-slate-700">{fmtDate(hackathon.registrationEndDate)}</span></span>
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="py-8 sm:py-12 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

              {/* ── LEFT: description + prizes ── */}
              <div className="lg:col-span-2 space-y-6">

                {/* Description */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className={`w-1 h-5 rounded-full bg-gradient-to-b ${grad}`} />
                    About this Hackathon
                  </h2>
                  {hackathon.description ? (
                    <RichTextDisplay html={hackathon.description} />
                  ) : (
                    <p className="text-sm text-slate-400 italic">No description provided yet.</p>
                  )}
                </div>

                {/* Prizes — only shown if data exists */}
                {hackathon.prizes && hackathon.prizes.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Prize Breakdown
                    </h2>
                    <div className="space-y-3">
                      {hackathon.prizes.map((prize, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 border border-amber-100 hover:border-amber-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[11px] font-black bg-gradient-to-br ${grad} text-white shadow-sm`}>
                              #{i + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">{prize.place}</div>
                              {prize.perks && <div className="text-[11px] text-slate-500">{prize.perks}</div>}
                            </div>
                          </div>
                          <div className="font-black text-slate-900">{prize.reward}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ── RIGHT: registration + quick info ── */}
              <div className="space-y-4">

                {/* Registration card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className={`h-1 w-full bg-gradient-to-r ${grad}`} />
                  <div className="p-5">
                    <h3 className="font-bold text-slate-900 text-sm mb-3">Join this Hackathon</h3>

                    {/* Registration status */}
                    <div className="mb-3">
                      <RegStatusBadge status={regStatus} />
                    </div>

                    {/* Reg dates summary */}
                    {(hackathon.registrationStartDate || hackathon.registrationEndDate) && (
                      <div className="mb-4 space-y-1.5 text-xs text-slate-500">
                        {hackathon.registrationStartDate && (
                          <div className="flex items-center gap-1.5">
                            <CalendarCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            <span>Opens: <span className="font-semibold text-slate-700">{fmtDate(hackathon.registrationStartDate)}</span></span>
                          </div>
                        )}
                        {hackathon.registrationEndDate && (
                          <div className="flex items-center gap-1.5">
                            <CalendarX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>Closes: <span className="font-semibold text-slate-700">{fmtDate(hackathon.registrationEndDate)}</span></span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Team size */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        Participation
                      </div>
                      {minSize <= 1
                        ? `Individual or teams up to ${maxSize} members`
                        : `Teams of ${minSize}–${maxSize} members`}
                    </div>

                    {/* CTA button */}
                    {alreadyRegistered ? (
                      <div className="w-full py-3 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-bold text-sm flex items-center justify-center gap-2">
                        <BadgeCheck className="w-4 h-4" />
                        Already Registered
                      </div>
                    ) : (
                      <button
                        onClick={() => setIsRegOpen(true)}
                        disabled={!canRegister}
                        className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                          canRegister
                            ? `bg-gradient-to-r ${grad} text-white shadow-md hover:shadow-lg cursor-pointer`
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {regStatus === "open" ? (
                          <><span>Register Now</span><ArrowRight className="w-4 h-4" /></>
                        ) : regStatus === "upcoming" ? (
                          <><Clock className="w-4 h-4" /><span>Not Open Yet</span></>
                        ) : (
                          <><AlertCircle className="w-4 h-4" /><span>Registration Closed</span></>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* Quick info */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Details</h3>
                  <div className="space-y-3 text-xs">
                    {hackathon.prizePool && (
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <Trophy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Prize Pool</div>
                          <div>{hackathon.prizePool}</div>
                        </div>
                      </div>
                    )}
                    {/* Location: only for In-Person / Hybrid */}
                    {!isOnline && hackathon.location && (
                      <div className="flex items-start gap-2.5 text-slate-600">
                        <MapPin className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                        <div>
                          <div className="font-semibold text-slate-800">Venue</div>
                          <div>{hackathon.location}</div>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <Users className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Participants</div>
                        <div>{hackathon.registeredCount.toLocaleString()} registered</div>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility */}
                  {hackathon.eligibility && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        Eligibility
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{hackathon.eligibility}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {hackathon.tags && hackathon.tags.length > 0 && (
                    <div className="pt-3 border-t border-slate-100">
                      <div className="text-xs font-semibold text-slate-800 mb-2 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-blue-500" />
                        Tags
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {hackathon.tags.map((tag, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white border border-slate-200 text-slate-700">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalType(type)} onJoinClick={() => canRegister && setIsRegOpen(true)} />

      <HackathonRegistrationModal
        isOpen={isRegOpen}
        onClose={(didRegister) => {
          setIsRegOpen(false);
          if (didRegister) setAlreadyRegistered(true);
        }}
        hackathon={hackathon}
      />

      <LegalModal
        isOpen={!!legalType}
        onClose={() => setLegalType(null)}
        type={legalType || "privacy"}
      />
    </div>
  );
}
