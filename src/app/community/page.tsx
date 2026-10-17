"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { CampusAmbassadorModal } from "@/components/modals/CampusAmbassadorModal";
import { LegalModal } from "@/components/modals/LegalModal";
import {
  SITE_CONFIG,
  COMMUNITY_STATS,
  COMMUNITY_CITY_NODES,
  COMMUNITY_DISCUSSION_SPACES,
  COMMUNITY_CHARTER_RULES,
} from "@/data/nexhackData";
import {
  Users,
  MessageSquare,
  Send,
  MapPin,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Rocket,
  Briefcase,
  Search,
  Sparkles,
  Heart,
  Globe,
  Share2,
} from "lucide-react";
import {
  WhatsAppIcon,
  LinkedInIcon,
  GitHubIcon,
  XTwitterIcon,
  InstagramIcon,
} from "@/components/ui/SocialIcons";export default function CommunityPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [citySearch, setCitySearch] = useState("");
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  const filteredNodes = useMemo(() => {
    if (!citySearch.trim()) return COMMUNITY_CITY_NODES;
    return COMMUNITY_CITY_NODES.filter((n) =>
      n.city.toLowerCase().includes(citySearch.toLowerCase())
    );
  }, [citySearch]);

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">Developer Community</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                <Users className="w-3.5 h-3.5" />
                <span>DECENTRALIZED STUDENT MESH</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Where Student Builders <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Connect & Ship</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                Connect with 10,000+ student developers, open-source contributors, UI designers, and peer mentors across 100+ schools and colleges in India.
              </p>

              {/* Main WhatsApp & LinkedIn CTAs */}
              <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
                <a
                  href={SITE_CONFIG.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Join WhatsApp Community</span>
                </a>

                <button
                  onClick={() => setIsAmbassadorOpen(true)}
                  className="px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs border border-slate-200 transition-all cursor-pointer"
                >
                  Apply as Campus Ambassador
                </button>
              </div>

              {/* Metrics Pills */}
              <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Zero Paid Paywalls
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-blue-600" />
                  12 Active Regional Nodes
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-purple-600" />
                  24/7 Hacker Lounge
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. CITY NODES DIRECTORY */}
        <section className="py-14 sm:py-20 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  REGIONAL HUBS
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  NEXHACK City Nodes Across India
                </h2>
              </div>

              {/* City search */}
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by city name..."
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {filteredNodes.map((node, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded-xl bg-blue-100/60 text-blue-700">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        node.status === "Active Node"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">{node.city}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{node.colleges}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-semibold text-blue-600">{node.students} Students</span>
                    <button
                      onClick={() => setIsJoinOpen(true)}
                      className="text-[11px] font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
                    >
                      Join Node &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. COMMUNITY CHANNELS & SPACES */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider">
                VIRTUAL CAMPUS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Our Community Discussion Spaces
              </h2>
              <p className="text-sm text-slate-600">
                Join focused channels where students share code, debug stack traces, and form hackathon squads in real time.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COMMUNITY_DISCUSSION_SPACES.map((space, idx) => {
                const iconMap: Record<string, React.ReactNode> = {
                  MessageSquare: <MessageSquare className="w-5 h-5" />,
                  Users: <Users className="w-5 h-5" />,
                  Terminal: <Terminal className="w-5 h-5" />,
                  Rocket: <Rocket className="w-5 h-5" />,
                  Briefcase: <Briefcase className="w-5 h-5" />,
                };

                return (
                  <div
                    key={idx}
                    className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:border-purple-300 transition-all space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-2xl bg-purple-50 text-purple-700">
                          {iconMap[space.icon] || <MessageSquare className="w-5 h-5" />}
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-400">
                          {space.members} members
                        </span>
                      </div>

                      <h3 className="font-mono font-bold text-slate-900 text-sm">{space.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed">{space.description}</p>
                    </div>

                    <a
                      href={space.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-600 hover:text-purple-700"
                    >
                      <span>Join Channel</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. SQUAD FINDER FEATURE */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono font-bold text-blue-700 uppercase">
                    TEAM FORMATION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    Looking for a Hackathon Squad?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-xl mt-1">
                    Don&apos;t let not having a team stop you. Over 40% of winning hackathon teams meet for the first time on our community squad finder channel.
                  </p>
                </div>

                <a
                  href="https://chat.whatsapp.com/CwFjSEfDbqj5cIOfTFMn2R"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all shrink-0"
                >
                  Join #hackathon-squad-finder
                </a>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-blue-200/80 text-xs">
                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="font-bold text-blue-600">Step 1</span>
                  <h4 className="font-bold text-slate-900">Post Your Tech Stack</h4>
                  <p className="text-slate-600 text-[11px]">Share your strengths: Frontend, Backend, UI/UX, or Pitch lead.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="font-bold text-purple-600">Step 2</span>
                  <h4 className="font-bold text-slate-900">Match with Complementary Coders</h4>
                  <p className="text-slate-600 text-[11px]">Partner with coders who balance your skills from any Indian campus.</p>
                </div>
                <div className="p-4 rounded-2xl bg-white border border-blue-100 space-y-1">
                  <span className="font-bold text-emerald-600">Step 3</span>
                  <h4 className="font-bold text-slate-900">Sprint & Ship Together</h4>
                  <p className="text-slate-600 text-[11px]">Register as an official 4-person squad for NEXHACK hackathons.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 5. CODE OF CONDUCT / CHARTER */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
                COMMUNITY STANDARDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                The NEXHACK Code of Conduct
              </h2>
              <p className="text-sm text-slate-600">
                To guarantee an encouraging, psychologically safe environment for student builders of every experience level.
              </p>
            </div>

            <div className="space-y-4">
              {COMMUNITY_CHARTER_RULES.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3.5"
                >
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h4 className="font-bold text-slate-900 text-sm">{rule.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. SOCIAL CHANNELS */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                STAY IN SYNC
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Follow NEXHACK Across Platforms
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Get real-time announcements on hackathon registration windows, workshop streams, and open-source bounties.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 max-w-3xl mx-auto">
              <a
                href={SITE_CONFIG.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#25D366] hover:bg-emerald-50/50 text-slate-800 text-xs font-bold transition-all flex items-center gap-2.5"
              >
                <WhatsAppIcon className="w-4 h-4 fill-[#25D366]" />
                <span>WhatsApp Channel</span>
              </a>

              <a
                href={SITE_CONFIG.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-800 text-slate-800 text-xs font-bold transition-all flex items-center gap-2.5"
              >
                <GitHubIcon className="w-4 h-4 fill-slate-900" />
                <span>GitHub Org</span>
              </a>

              <a
                href={SITE_CONFIG.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#0A66C2] text-slate-800 text-xs font-bold transition-all flex items-center gap-2.5"
              >
                <LinkedInIcon className="w-4 h-4 fill-[#0A66C2]" />
                <span>LinkedIn Updates</span>
              </a>

              <a
                href={SITE_CONFIG.xUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-900 text-slate-800 text-xs font-bold transition-all flex items-center gap-2.5"
              >
                <XTwitterIcon className="w-4 h-4 fill-slate-900" />
                <span>X (Twitter)</span>
              </a>

              <a
                href={SITE_CONFIG.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-[#E1306C] text-slate-800 text-xs font-bold transition-all flex items-center gap-2.5"
              >
                <InstagramIcon className="w-4 h-4 fill-[#E1306C]" />
                <span>Instagram Stories</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />

      {/* Modals */}
      <JoinCommunityModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
      />

      <CampusAmbassadorModal
        isOpen={isAmbassadorOpen}
        onClose={() => setIsAmbassadorOpen(false)}
      />

      <LegalModal
        isOpen={!!legalModalType}
        onClose={() => setLegalModalType(null)}
        type={legalModalType || "privacy"}
      />
    </div>
  );
}
