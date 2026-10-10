"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LegalModal } from "@/components/modals/LegalModal";
import { HackathonRegistrationModal } from "@/components/modals/HackathonRegistrationModal";
import { RichTextDisplay } from "@/components/ui/RichTextEditor";
import type { DbHackathon } from "@/lib/dbTypes";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  Tag,
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronLeft,
  Monitor,
  Smartphone,
} from "lucide-react";

function RegistrationStatusBadge({ hackathon }: { hackathon: DbHackathon }) {
  const now = new Date();
  const regStart = hackathon.registrationStartDate ? new Date(hackathon.registrationStartDate) : null;
  const regEnd = hackathon.registrationEndDate ? new Date(hackathon.registrationEndDate) : null;

  if (hackathon.status === "Completed") {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
        <AlertCircle className="w-3.5 h-3.5" />
        Registration Closed
      </div>
    );
  }
  if (regStart && now < regStart) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
        <Clock className="w-3.5 h-3.5" />
        Opens {regStart.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
      </div>
    );
  }
  if (regEnd && now > regEnd) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 text-xs font-semibold border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5" />
        Deadline Passed
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200 animate-pulse">
      <CheckCircle2 className="w-3.5 h-3.5" />
      Registration Open
    </div>
  );
}

function isRegistrationOpen(hackathon: DbHackathon): boolean {
  if (hackathon.status === "Completed") return false;
  const now = new Date();
  if (hackathon.registrationStartDate && now < new Date(hackathon.registrationStartDate)) return false;
  if (hackathon.registrationEndDate && now > new Date(hackathon.registrationEndDate)) return false;
  return true;
}

export default function HackathonDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [hackathon, setHackathon] = useState<DbHackathon | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [legalType, setLegalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/hackathons/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.hackathon) {
          setHackathon(data.hackathon);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

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
  const registrationOpen = isRegistrationOpen(hackathon);
  const minSize = hackathon.minTeamSize ?? 1;
  const maxSize = hackathon.maxTeamSize ?? 4;

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col">
      <Navbar onJoinClick={() => setIsRegOpen(true)} />

      <main className="flex-1 pt-16 sm:pt-20">

        {/* ── HERO BANNER ── */}
        <section className="relative">
          {/* Banner image */}
          <div className="relative w-full overflow-hidden bg-slate-900" style={{ aspectRatio: isMobile ? "4/3" : "16/5" }}>
            {bannerSrc ? (
              <img
                src={bannerSrc}
                alt={`${hackathon.name} banner`}
                className="w-full h-full object-cover object-center"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${grad}`} />
            )}
            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 lg:p-12">
              {/* Breadcrumb */}
              <Link href="/hackathons" className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold mb-4 transition-colors w-fit">
                <ChevronLeft className="w-3.5 h-3.5" />
                All Hackathons
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className={`text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gradient-to-r ${grad} text-white shadow-sm`}>
                  {hackathon.edition}
                </span>
                <span className="text-[11px] font-semibold uppercase px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white">
                  {hackathon.mode}
                </span>
                <span className={`text-[11px] font-bold uppercase px-2.5 py-1 rounded-full shadow-sm ${
                  hackathon.status === "Ongoing" ? "bg-emerald-400 text-emerald-950" :
                  hackathon.status === "Upcoming" ? "bg-amber-300 text-amber-950" :
                  "bg-white/30 text-white"
                }`}>
                  {hackathon.status}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
                {hackathon.name}
              </h1>
              <p className="text-white/80 text-sm sm:text-base mt-2 max-w-2xl italic">
                "{hackathon.tagline}"
              </p>
            </div>
          </div>

          {/* Gradient accent border at bottom */}
          <div className={`h-1 w-full bg-gradient-to-r ${grad}`} />
        </section>

        {/* ── META STATS BAR ── */}
        <section className="bg-white border-b border-slate-100 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="flex flex-wrap gap-6 items-center justify-between">
              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center gap-2 text-slate-600">
                  <Calendar className="w-4 h-4 text-indigo-500" />
                  <span>{hackathon.dateRange}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-purple-500" />
                  <span>{hackathon.location}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold text-slate-900">{hackathon.prizePool}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Users className="w-4 h-4 text-blue-500" />
                  <span>{hackathon.registeredCount.toLocaleString()} registered</span>
                </div>
              </div>
              <RegistrationStatusBadge hackathon={hackathon} />
            </div>

            {/* Registration dates */}
            {(hackathon.registrationStartDate || hackathon.registrationEndDate) && (
              <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                {hackathon.registrationStartDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Registration opens: <span className="font-semibold text-slate-700">{new Date(hackathon.registrationStartDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></span>
                  </div>
                )}
                {hackathon.registrationEndDate && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-500" />
                    <span>Deadline: <span className="font-semibold text-slate-700">{new Date(hackathon.registrationEndDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span></span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        {/* ── MAIN CONTENT ── */}
        <section className="py-10 sm:py-16 bg-slate-50/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">

              {/* Left: description + tracks */}
              <div className="lg:col-span-2 space-y-8">

                {/* Description */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                  <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${grad} inline-block`} />
                    About this Hackathon
                  </h2>
                  <RichTextDisplay html={hackathon.description} />
                  {!hackathon.description && (
                    <p className="text-sm text-slate-500 italic">No description provided yet.</p>
                  )}
                </div>

                {/* Tracks */}
                {hackathon.tracks && hackathon.tracks.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className={`w-1.5 h-5 rounded-full bg-gradient-to-b ${grad} inline-block`} />
                      Challenge Tracks
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {hackathon.tracks.map((track, i) => (
                        <div key={i} className={`p-4 rounded-xl border border-l-4 bg-slate-50/80 hover:bg-slate-50 transition-colors`} style={{ borderLeftColor: undefined }}>
                          <div className={`inline-block w-1 h-full`} />
                          <div className="font-semibold text-slate-900 text-sm">{track.title}</div>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">{track.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Prizes */}
                {hackathon.prizes && hackathon.prizes.length > 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
                    <h2 className="text-base font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-amber-500" />
                      Prize Breakdown
                    </h2>
                    <div className="space-y-3">
                      {hackathon.prizes.map((prize, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-amber-50/60 to-white border border-amber-100 shadow-sm hover:border-amber-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black border bg-gradient-to-br ${grad} text-white shadow-sm`}>
                              #{i + 1}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-900 text-sm">{prize.place}</div>
                              {prize.perks && <div className="text-xs text-slate-500">{prize.perks}</div>}
                            </div>
                          </div>
                          <div className="font-black text-slate-900 text-base">{prize.reward}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right: registration card + info */}
              <div className="space-y-5">

                {/* Registration CTA */}
                <div className={`rounded-2xl overflow-hidden border-2`} style={{ borderColor: "transparent", background: "white", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }}>
                  <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                  <div className="p-5 sm:p-6">
                    <h3 className="font-bold text-slate-900 text-sm mb-1">Join this Hackathon</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <RegistrationStatusBadge hackathon={hackathon} />
                    </div>

                    {/* Team size info */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 mb-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-800 mb-1">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        Team Rules
                      </div>
                      {minSize <= 1
                        ? `Individual or teams of up to ${maxSize} members`
                        : `Teams of ${minSize}–${maxSize} members required`}
                    </div>

                    <button
                      onClick={() => setIsRegOpen(true)}
                      disabled={!registrationOpen}
                      className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                        registrationOpen
                          ? `bg-gradient-to-r ${grad} text-white shadow-md hover:shadow-lg cursor-pointer`
                          : "bg-slate-100 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      {registrationOpen ? (
                        <><span>Register Now</span><ArrowRight className="w-4 h-4" /></>
                      ) : (
                        <><AlertCircle className="w-4 h-4" /><span>Registration Closed</span></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Quick info card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-3">
                  <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">Quick Info</h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <Calendar className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Event Dates</div>
                        <div>{hackathon.dateRange}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <MapPin className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Location</div>
                        <div>{hackathon.location} ({hackathon.mode})</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5 text-slate-600">
                      <Trophy className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="font-semibold text-slate-800">Prize Pool</div>
                        <div>{hackathon.prizePool}</div>
                      </div>
                    </div>
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
                          <span
                            key={i}
                            className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border bg-white text-slate-700 border-slate-200`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Banner indicator */}
                {(hackathon.bannerUrl || hackathon.mobileBannerUrl) && (
                  <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
                    <div className="font-semibold text-slate-700 uppercase tracking-wider text-[10px]">Banners</div>
                    {hackathon.bannerUrl && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Monitor className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Desktop banner uploaded</span>
                      </div>
                    )}
                    {hackathon.mobileBannerUrl && (
                      <div className="flex items-center gap-2 text-slate-500">
                        <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                        <span>Mobile banner uploaded</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalType(type)} onJoinClick={() => setIsRegOpen(true)} />

      <HackathonRegistrationModal
        isOpen={isRegOpen}
        onClose={() => setIsRegOpen(false)}
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
