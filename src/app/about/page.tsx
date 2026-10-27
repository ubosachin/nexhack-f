"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { CampusAmbassadorModal } from "@/components/modals/CampusAmbassadorModal";
import { LegalModal } from "@/components/modals/LegalModal";
import {
  SITE_CONFIG,
  NEXHACK_PILLARS,
  COMMUNITY_STATS,
  COMMUNITY_VALUES,
  ABOUT_LEADERSHIP_ROLES,
  ABOUT_ROADMAP,
  TECH_ECOSYSTEM,
  FAQS_DATA,
} from "@/data/nexhackData";
import {
  Info,
  Sparkles,
  Target,
  Compass,
  Heart,
  ArrowRight,
  ShieldCheck,
  Users,
  Code2,
  Trophy,
  Rocket,
  CheckCircle2,
  BookOpen,
  Flame,
  ChevronDown,
  Layers,
  GraduationCap,
  Globe,
  Terminal,
} from "lucide-react";

export default function AboutPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO SECTION */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">About NEXHACK</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                <Info className="w-3.5 h-3.5" />
                <span>OUR STORY & PHILOSOPHY</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Empowering The Next Generation of <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Tech Builders</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                NEXHACK is a national, youth-driven technology community built to bridge the gap between college classrooms and production-grade software engineering.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                <button
                  onClick={() => setIsJoinOpen(true)}
                  className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Join Our Community</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  href="/hackathons"
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm border border-slate-200 transition-all"
                >
                  Explore Hackathons
                </Link>
              </div>

              {/* Key Quick Facts */}
              <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="block text-xl font-black text-blue-600">10,000+</span>
                  <span className="text-[11px] font-medium text-slate-500">Students Reached</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="block text-xl font-black text-purple-600">100+</span>
                  <span className="text-[11px] font-medium text-slate-500">Partner Campuses</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="block text-xl font-black text-emerald-600">100%</span>
                  <span className="text-[11px] font-medium text-slate-500">Free For Students</span>
                </div>
                <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs text-center">
                  <span className="block text-xl font-black text-cyan-600">Pan-India</span>
                  <span className="text-[11px] font-medium text-slate-500">Active Presence</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. THE GENESIS & MISSION */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 space-y-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono font-bold tracking-wider uppercase">
                  THE NEXHACK ORIGIN
                </div>

                <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
                  From Passive Classrooms to High-Energy Building Sprints
                </h2>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Most computer science and engineering coursework teaches syntax and theory from textbooks written a decade ago. But when students step into the industry, they are expected to build scalable web services, integrate modern AI models, collaborate via Git, and deploy to cloud edge networks.
                </p>

                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  <strong className="text-slate-900 font-semibold">NEXHACK was founded to dismantle that divide.</strong> We believe every student — whether studying in a premier institute, a regional engineering college, or high school — deserves an ambitious peer community, real technical mentors, and transparent hackathon stages to build real software.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Zero Elitism</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">We judge projects on code quality, user impact, and execution — never college pedigree.</p>
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Open Source First</h4>
                      <p className="text-[11px] text-slate-600 mt-0.5">Every hackathon project is published openly to build real student GitHub portfolios.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Mission Card */}
              <div className="lg:col-span-6">
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white shadow-xl relative overflow-hidden space-y-6">
                  <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Target className="w-48 h-48" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-400/30">
                      <Target className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-mono uppercase tracking-wider text-blue-400">Our Charter</span>
                      <h3 className="text-xl font-bold">The NEXHACK Mission</h3>
                    </div>
                  </div>

                  <blockquote className="text-base sm:text-lg font-medium text-slate-200 leading-relaxed border-l-2 border-blue-500 pl-4">
                    “To build a nationwide ecosystem of student software engineers who learn by shipping, solve genuine community problems, and inspire their peers to create rather than consume.”
                  </blockquote>

                  <div className="space-y-3 pt-2 border-t border-slate-700/60 text-xs text-slate-300">
                    <div className="flex items-center justify-between py-1">
                      <span>Community Motto</span>
                      <span className="font-bold text-white">Build. Hack. Learn. Connect.</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Participation Cost</span>
                      <span className="font-bold text-emerald-400">₹0 (Completely Free)</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span>Target Student Builders by 2026</span>
                      <span className="font-bold text-cyan-400">50,000+ Across India</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. THE 4 FOUNDING PILLARS */}
        <section className="py-16 sm:py-24 bg-slate-50/70 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                CORE ARCHITECTURE
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The 4 Pillars That Drive NEXHACK
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Everything we design — from national hackathons to weekend code walkthroughs — is rooted in these four guiding pillars.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {NEXHACK_PILLARS.map((pillar) => {
                const iconMap: Record<string, React.ReactNode> = {
                  Code2: <Code2 className="w-6 h-6" />,
                  BookOpen: <BookOpen className="w-6 h-6" />,
                  Flame: <Flame className="w-6 h-6" />,
                  Sparkles: <Sparkles className="w-6 h-6" />,
                };

                return (
                  <div
                    key={pillar.id}
                    className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-slate-400">{pillar.tag}</span>
                      <div className={`p-3 rounded-2xl bg-gradient-to-br ${pillar.gradient} text-white`}>
                        {iconMap[pillar.iconName] || <Code2 className="w-6 h-6" />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{pillar.title}</h3>
                      <p className="text-xs font-semibold text-blue-600 mt-0.5">{pillar.tagline}</p>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {pillar.description}
                    </p>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {pillar.bulletPoints.map((pt, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{pt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 4. COMMUNITY VALUES & MANIFESTO */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider">
                OUR CODE OF ETHICS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                What the Community Stands For
              </h2>
              <p className="text-sm text-slate-600">
                A shared set of values that every hacker, mentor, and campus ambassador upholds in the NEXHACK ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {COMMUNITY_VALUES.map((val) => (
                <div
                  key={val.id}
                  className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-300 transition-all space-y-3"
                >
                  <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase">
                    {val.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-base">{val.title}</h3>
                  <p className="text-xs font-semibold text-slate-500">{val.subtitle}</p>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. ORGANIZING COUNCIL & LEADERSHIP ROLES */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-indigo-600 uppercase tracking-wider">
                PEOPLE BEHIND THE SPRINT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Our Community Architecture
              </h2>
              <p className="text-sm text-slate-600">
                NEXHACK is powered by volunteer student leaders, technical track mentors, and campus ambassadors across India.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {ABOUT_LEADERSHIP_ROLES.map((team, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {team.badge}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{team.role}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{team.description}</p>
                </div>
              ))}
            </div>

            {/* Volunteer CTA */}
            <div className="mt-12 p-8 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
              <div className="space-y-1 text-center md:text-left">
                <h4 className="text-lg font-bold">Want to join the NEXHACK Organizing Crew?</h4>
                <p className="text-xs sm:text-sm text-blue-100">
                  We are always looking for passionate student designers, developers, and event coordinators to join our team.
                </p>
              </div>
              <button
                onClick={() => setIsAmbassadorOpen(true)}
                className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold text-xs hover:bg-blue-50 transition-all shrink-0 cursor-pointer shadow-md"
              >
                Apply as Volunteer / Lead
              </button>
            </div>
          </div>
        </section>

        {/* 6. TIMELINE ROADMAP */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-emerald-600 uppercase tracking-wider">
                OUR JOURNEY & TRAJECTORY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The Growth Roadmap
              </h2>
              <p className="text-sm text-slate-600">
                How NEXHACK started, where we stand today, and what we are building toward.
              </p>
            </div>

            <div className="space-y-6">
              {ABOUT_ROADMAP.map((item, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
                >
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                        {item.period}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                          item.status === "Completed"
                            ? "bg-slate-200 text-slate-700"
                            : item.status === "Active"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. TECH STACK WE BUILD WITH */}
        <section className="py-14 sm:py-20 bg-slate-50/60 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block mb-2">
              REAL TECHNOLOGIES
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Core Technologies & Tools We Champion
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-3 max-w-4xl mx-auto">
              {TECH_ECOSYSTEM.map((tech, i) => (
                <div
                  key={i}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs flex items-center gap-2"
                >
                  <Code2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>{tech.name}</span>
                  <span className="text-[10px] text-slate-400 font-normal">({tech.category})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. ABOUT FAQS */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                COMMON INQUIRIES
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Frequently Asked Questions About NEXHACK
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS_DATA.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 hover:text-blue-600 cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${
                        openFaqIndex === idx ? "rotate-180 text-blue-600" : ""
                      }`}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. FINAL CTA */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>JOIN 10,000+ STUDENTS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to Build What&apos;s Next?
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
              Become part of a high-energy community that values your code, supports your curiosity, and helps you ship your first production software.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => setIsJoinOpen(true)}
                className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
              >
                Join NEXHACK Today
              </button>
              <Link
                href="/hackathons"
                className="px-8 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm border border-slate-700 transition-all"
              >
                Explore Hackathons
              </Link>
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
