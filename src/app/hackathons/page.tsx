"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HackathonRegistrationModal } from "@/components/modals/HackathonRegistrationModal";
import { LegalModal } from "@/components/modals/LegalModal";
import {
  HACKATHON_EVALUATION_CRITERIA,
  HACKATHON_RULES,
} from "@/data/nexhackData";
import type { DbHackathon } from "@/lib/dbTypes";
import {
  Trophy,
  ShieldCheck,
  Users,
  Code2,
  ArrowRight,
  Search,
  MapPin,
  Clock,
  Terminal,
  Lightbulb,
  Layers,
  Presentation,
  CalendarCheck,
  CalendarX,
  BadgeCheck,
} from "lucide-react";

export default function HackathonsPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [hackathonsList, setHackathonsList] = useState<DbHackathon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [registerHackathon, setRegisterHackathon] = useState<DbHackathon | null>(null);
  // Set of hackathonIds the current user has already registered for
  const [registeredIds, setRegisteredIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<"All" | "Upcoming" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMode, setSelectedMode] = useState<string>("All");
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  // Fetch hackathons
  useEffect(() => {
    async function loadHackathons() {
      try {
        setIsLoading(true);
        const res = await fetch("/api/hackathons");
        const data = await res.json();
        if (data.success && Array.isArray(data.hackathons)) {
          setHackathonsList(data.hackathons);
        }
      } catch (err) {
        console.error("Failed to fetch hackathons:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadHackathons();
  }, []);

  // Fetch user's registered hackathon IDs once session is ready
  useEffect(() => {
    if (!session?.user) return;
    fetch("/api/user/registrations")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && Array.isArray(data.registrations)) {
          const ids = new Set<string>(
            data.registrations
              .filter((r: { hackathonId?: string; status: string }) =>
                r.hackathonId && r.status !== "Cancelled"
              )
              .map((r: { hackathonId: string }) => r.hackathonId)
          );
          setRegisteredIds(ids);
        }
      })
      .catch(() => {/* silent */});
  }, [session?.user]);

  const handleView = (hackathon: DbHackathon) => {
    router.push(`/hackathons/${hackathon.id}`);
  };

  const handleRegister = (hackathon: DbHackathon) => {
    setRegisterHackathon(hackathon);
  };

  // Filtered hackathons from MongoDB data
  const filteredHackathons = useMemo(() => {
    return hackathonsList.filter((item) => {
      if (activeTab !== "All" && item.status !== activeTab) return false;
      if (selectedMode !== "All" && item.mode !== selectedMode) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        const matchesTags = item.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesTags) return false;
      }
      return true;
    });
  }, [hackathonsList, activeTab, selectedMode, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => {}} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">Hackathons & Sprints</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                <Trophy className="w-3.5 h-3.5" />
                <span>NEXHACK COMPETITION PORTAL</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Code. Collaborate. <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Compete.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Explore national and campus hackathons organized by NEXHACK. Form cross-college teams, build original software prototypes, and showcase your skills to industry mentors.
              </p>

              {/* Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Free Entry
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <Users className="w-4 h-4 text-blue-600" />
                  Teams of 1 to 4 Coders
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-xs">
                  <Code2 className="w-4 h-4 text-purple-600" />
                  Beginner to Advanced Tracks
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. SEARCH, FILTER & DIRECTORY */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Filter Controls Bar */}
            <div className="p-4 rounded-3xl bg-slate-50 border border-slate-200/80 mb-10 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
              {/* Tab selector */}
              <div className="flex items-center gap-1 p-1 bg-white rounded-2xl border border-slate-200 shadow-xs w-full md:w-auto">
                {(["All", "Upcoming", "Completed"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 md:flex-none px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === tab
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {tab === "All" ? "All Editions" : tab}
                  </button>
                ))}
              </div>

              {/* Search & Mode selector */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tracks, tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>

                {/* Mode Select */}
                <select
                  value={selectedMode}
                  onChange={(e) => setSelectedMode(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer"
                >
                  <option value="All">All Formats</option>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online / Virtual</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </div>
            </div>

            {/* Hackathon Cards Grid */}
            {filteredHackathons.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-slate-50 border border-slate-200">
                <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="font-bold text-slate-900 text-base">No hackathons match your filters</h3>
                <p className="text-xs text-slate-500 mt-1">Try resetting the search terms or tab selection.</p>
                <button
                  onClick={() => {
                    setActiveTab("All");
                    setSelectedMode("All");
                    setSearchQuery("");
                  }}
                  className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs cursor-pointer"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {filteredHackathons.map((hackathon) => (
                  <div
                    key={hackathon.id}
                    className="rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group hover:border-blue-300"
                  >
                    {/* Banner — image fills with correct aspect ratio */}
                    <div className="relative w-full overflow-hidden bg-slate-100" style={{ aspectRatio: "16/7" }}>
                      {hackathon.bannerUrl ? (
                        <img
                          src={hackathon.bannerUrl}
                          alt={hackathon.name}
                          className="w-full h-full object-cover object-center"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${hackathon.bannerGradient} flex items-end p-4`}>
                          <div>
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80 bg-black/20 px-2 py-0.5 rounded-full">
                              {hackathon.edition}
                            </span>
                            <h3 className="text-xl font-black text-white mt-1">{hackathon.name}</h3>
                          </div>
                        </div>
                      )}
                      {/* Gradient accent strip at bottom */}
                      <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${hackathon.bannerGradient}`} />
                      {/* Status badge */}
                      <div className="absolute top-2.5 right-2.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm ${
                          hackathon.status === "Ongoing" ? "bg-emerald-400 text-emerald-950 animate-pulse" :
                          hackathon.status === "Upcoming" ? "bg-amber-300 text-amber-950" :
                          "bg-white/80 text-slate-700"
                        }`}>
                          {hackathon.status}
                        </span>
                      </div>
                    </div>

                    {/* Name / tagline row — always below banner */}
                    <div className={`px-5 pt-4 pb-1`}>
                      <div className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${hackathon.bannerGradient} text-white mb-1.5`}>
                        {hackathon.edition}
                      </div>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{hackathon.name}</h3>
                      {hackathon.tagline && (
                        <p className="text-[11px] text-slate-400 italic mt-0.5 line-clamp-1">&ldquo;{hackathon.tagline}&rdquo;</p>
                      )}
                    </div>

                    {/* Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-5">
                      <div className="space-y-4">
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                          {hackathon.description.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() || "No description available."}
                        </p>

                        {/* Metadata Rows */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                          {/* Registration dates — shown when available */}
                          {hackathon.registrationStartDate || hackathon.registrationEndDate ? (
                            <>
                              {hackathon.registrationStartDate && (
                                <div className="flex items-center gap-2">
                                  <CalendarCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                  <span>Opens: <span className="font-semibold text-slate-700">{new Date(hackathon.registrationStartDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                                </div>
                              )}
                              {hackathon.registrationEndDate && (
                                <div className="flex items-center gap-2">
                                  <CalendarX className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  <span>Closes: <span className="font-semibold text-slate-700">{new Date(hackathon.registrationEndDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span></span>
                                </div>
                              )}
                            </>
                          ) : (
                            /* No reg dates — just show mode */
                            <div className="flex items-center gap-2 text-slate-500">
                              <span className="w-2 h-2 rounded-full bg-slate-300" />
                              {hackathon.mode} hackathon
                            </div>
                          )}

                          {/* Location — only for non-online */}
                          {hackathon.mode !== "Online" && hackathon.location && (
                            <div className="flex items-center gap-2">
                              <MapPin className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              <span className="truncate">{hackathon.location}</span>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="font-semibold text-slate-900">{hackathon.prizePool}</span>
                          </div>
                        </div>

                        {/* Registration status badge */}
                        <div>
                          {(() => {
                            const now = new Date();
                            const start = hackathon.registrationStartDate ? new Date(hackathon.registrationStartDate) : null;
                            const end = hackathon.registrationEndDate ? new Date(hackathon.registrationEndDate) : null;
                            if (hackathon.status === "Completed") return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 border border-slate-200">
                                Event Completed
                              </span>
                            );
                            if (start && now < start) return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                                <Clock className="w-3 h-3" /> Registration Upcoming
                              </span>
                            );
                            if (end && now > end) return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                                Registration Closed
                              </span>
                            );
                            return (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                Registration Open
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
                        <button
                          onClick={() => handleView(hackathon)}
                          className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-all cursor-pointer"
                        >
                          View Details
                        </button>
                        {hackathon.status === "Completed" ? (
                          <button
                            onClick={() => handleView(hackathon)}
                            className="flex-1 py-2.5 rounded-xl bg-slate-200 text-slate-600 font-bold text-xs cursor-pointer"
                          >
                            View Archive
                          </button>
                        ) : registeredIds.has(hackathon.id) ? (
                          <div className="flex-1 py-2.5 rounded-xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-bold text-xs flex items-center justify-center gap-1.5">
                            <BadgeCheck className="w-3.5 h-3.5" />
                            Registered
                          </div>
                        ) : (
                          <button
                            onClick={() => handleRegister(hackathon)}
                            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
                          >
                            <span>Register</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* 3. EVALUATION CRITERIA MATRIX */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                TRANSPARENT EVALUATION
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                How Projects are Judged at NEXHACK
              </h2>
              <p className="text-sm text-slate-600">
                We believe in objective, execution-first evaluation rubrics so every team knows exactly what judges look for.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {HACKATHON_EVALUATION_CRITERIA.map((criterion, idx) => {
                const iconMap: Record<string, React.ReactNode> = {
                  Terminal: <Terminal className="w-6 h-6" />,
                  Lightbulb: <Lightbulb className="w-6 h-6" />,
                  Layers: <Layers className="w-6 h-6" />,
                  Presentation: <Presentation className="w-6 h-6" />,
                };

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3 hover:border-blue-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-3 rounded-2xl bg-blue-50 text-blue-600">
                        {iconMap[criterion.icon] || <Trophy className="w-6 h-6" />}
                      </div>
                      <span className="text-base font-black text-blue-600 bg-blue-50 px-2.5 py-1 rounded-xl">
                        {criterion.weight}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{criterion.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{criterion.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. HACKATHON RULES & CODE OF CONDUCT */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider">
                FAIR PLAY RULES
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Hackathon Code of Ethics
              </h2>
              <p className="text-sm text-slate-600">
                To maintain a fair, honest, and high-energy environment for every participant.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {HACKATHON_RULES.map((r, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 flex items-start gap-4"
                >
                  <div className="p-2 rounded-xl bg-purple-100 text-purple-700 shrink-0 font-bold text-xs">
                    0{i + 1}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-slate-900 text-sm">{r.rule}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* 6. HOST A HACKATHON AT YOUR CAMPUS CTA */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
              <div className="space-y-3 text-center lg:text-left max-w-2xl">
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                  COLLEGE SOCIETIES & CLUBS
                </span>
                <h3 className="text-2xl sm:text-3xl font-black">
                  Want to Co-Host a NEXHACK Edition on Your Campus?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  We provide the complete Hackathon in a Box — problem statements, judging portals, industry mentors, certificates, and national outreach.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                <Link
                  href="/campus"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all text-center"
                >
                  Bring NEXHACK to Campus
                </Link>
                <button
                  onClick={() => {}}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer text-center"
                >
                  Register as Hacker
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => {}} />

      {/* Modals */}
      <HackathonRegistrationModal
        isOpen={!!registerHackathon}
        onClose={(didRegister) => {
          if (didRegister && registerHackathon) {
            setRegisteredIds((prev) => new Set([...prev, registerHackathon.id]));
          }
          setRegisterHackathon(null);
        }}
        hackathon={registerHackathon}
      />

      <LegalModal
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || "privacy"}
      />
    </div>
  );
}
