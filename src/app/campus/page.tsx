"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { JoinCommunityModal } from "@/components/modals/JoinCommunityModal";
import { CampusAmbassadorModal } from "@/components/modals/CampusAmbassadorModal";
import { LegalModal } from "@/components/modals/LegalModal";
import {
  SITE_CONFIG,
  CAMPUS_PARTNERS_DATA,
  CAMPUS_CHAPTER_TIERS,
  CAMPUS_ONBOARDING_STEPS,
} from "@/data/nexhackData";
import {
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Send,
  Users,
  Trophy,
  Sparkles,
  BookOpen,
  School,
  FileText,
  Layers,
} from "lucide-react";

export default function CampusPage() {
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isAmbassadorOpen, setIsAmbassadorOpen] = useState(false);
  const [legalModalType, setLegalModalType] = useState<"privacy" | "terms" | "code_of_conduct" | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    institutionName: "",
    contactName: "",
    contactEmail: "",
    city: "",
    partnershipType: "Host Campus Hackathon",
    expectedStudents: "200-500 students",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institutionName || !formData.contactEmail) return;

    setIsSubmitting(true);
    try {
      await fetch("/api/campus-inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setIsSubmitted(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      console.error("Campus inquiry error:", err);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#0A0F1D] flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onJoinClick={() => setIsJoinOpen(true)} />

      <main className="flex-1 pt-20 sm:pt-24">
        {/* 1. HERO HEADER */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50/60 border-b border-slate-200/80 bg-tech-grid overflow-hidden">
          <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-500 mb-6">
              <Link href="/" className="hover:text-blue-600 transition-colors">Home</Link>
              <span>/</span>
              <span className="text-blue-600">Campus Partnerships</span>
            </div>

            <div className="max-w-3xl mx-auto text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-200 shadow-xs">
                <Building2 className="w-3.5 h-3.5" />
                <span>INSTITUTIONAL COLLABORATIONS</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Bring NEXHACK to Your <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">Campus</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
                We collaborate with university administrations, student tech societies, and school computer science clubs to bring structured hackathons, certified workshops, and innovation experiences directly to your students.
              </p>

              <div className="pt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  100% Free for Students
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  100+ Partner Institutions
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-purple-600" />
                  National Certification
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. PARTNERSHIP TIERS & MODELS */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                COLLABORATION PATHWAYS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                Two Ways to Partner with NEXHACK
              </h2>
              <p className="text-sm text-slate-600">
                Choose the model that best matches your campus goals — whether an existing club seeking co-branded hackathons or establishing an official student chapter.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {CAMPUS_CHAPTER_TIERS.map((tier, idx) => (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs hover:border-blue-300 hover:shadow-md transition-all space-y-6 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">
                      Model 0{idx + 1}
                    </span>
                    <h3 className="text-2xl font-black text-slate-900">{tier.title}</h3>
                    <p className="text-xs font-semibold text-slate-500 italic">
                      Best for: {tier.suitableFor}
                    </p>

                    <div className="space-y-2.5 pt-3 border-t border-slate-200/80">
                      {tier.benefits.map((b, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href="#partner-form"
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all text-center block"
                  >
                    Apply for this Model &rarr;
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 3. THE 4-STAGE ONBOARDING BLUEPRINT */}
        <section className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-purple-600 uppercase tracking-wider">
                HOW IT WORKS
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                From Submission to Campus Hackathon in 4 Steps
              </h2>
              <p className="text-sm text-slate-600">
                A streamlined, zero-friction process designed for busy faculty coordinators and student leads.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {CAMPUS_ONBOARDING_STEPS.map((step, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-3"
                >
                  <span className="text-2xl font-black text-blue-600 font-mono">{step.step}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. WHAT THE CAMPUS TOOLKIT INCLUDES */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                COMPREHENSIVE SUPPORT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                The Turnkey &ldquo;Hackathon in a Box&rdquo; Toolkit
              </h2>
              <p className="text-sm text-slate-600">
                Everything your campus team needs to host a world-class technology competition without starting from scratch.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700 w-fit">
                  <FileText className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">20+ Curated Problem Statements</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Real industry challenge prompts across AI, FinTech, EdTech, Smart Campus, and Open Innovation.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700 w-fit">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Judging Rubrics & Sheets</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Objective 100-point scoring matrices covering architecture, UX, originality, and live demo execution.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-700 w-fit">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Co-Branded Certificates</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Verifiable digital certificates of excellence and participation issued under both college and NEXHACK seal.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-amber-100 text-amber-700 w-fit">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Mentor & Speaker Pool</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access to working engineers and open-source contributors who participate as virtual judges and workshop instructors.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-cyan-100 text-cyan-700 w-fit">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">Promotional Media Kit</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-res posters, social media banners, and email templates customized with your institution logo.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-3">
                <div className="p-2.5 rounded-xl bg-pink-100 text-pink-700 w-fit">
                  <Trophy className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm">National League Entry</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your campus winners automatically qualify for NEXHACK National Flagship finals with cash grants.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE PARTNERSHIP FORM */}
        <section id="partner-form" className="py-16 sm:py-24 bg-slate-50/80 border-b border-slate-200/80">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-md space-y-6">
              <div className="space-y-2 text-center">
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">
                  INSTITUTIONAL INQUIRY FORM
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                  Request Campus Partnership Kit
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Fill in your institution details and our Community Team will connect within 24 hours.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-emerald-950">Partnership Request Received!</h4>
                  <p className="text-xs text-emerald-800 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong>{formData.contactName}</strong>. We have logged your request for <strong>{formData.institutionName}</strong>. Our partnership team will email the Campus Toolkit to <strong>{formData.contactEmail}</strong> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        institutionName: "",
                        contactName: "",
                        contactEmail: "",
                        city: "",
                        partnershipType: "Host Campus Hackathon",
                        expectedStudents: "200-500 students",
                        notes: "",
                      });
                    }}
                    className="mt-3 px-5 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Institution / College Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Delhi Technological University"
                        value={formData.institutionName}
                        onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Representative / Faculty Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. Priya Sharma / Aryan Verma"
                        value={formData.contactName}
                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Official Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@institution.edu / student@gmail.com"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">City & State</label>
                      <input
                        type="text"
                        placeholder="e.g. Bengaluru, Karnataka"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Partnership Type</label>
                      <select
                        value={formData.partnershipType}
                        onChange={(e) => setFormData({ ...formData, partnershipType: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer font-medium"
                      >
                        <option value="Host Campus Hackathon">Co-Host Campus Hackathon</option>
                        <option value="Launch Official Chapter">Launch Official NEXHACK Chapter</option>
                        <option value="Technical Workshops">Technical Workshop & Masterclasses</option>
                        <option value="Other Collaboration">Other Institutional Collaboration</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-700">Expected Student Participation</label>
                      <select
                        value={formData.expectedStudents}
                        onChange={(e) => setFormData({ ...formData, expectedStudents: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 cursor-pointer font-medium"
                      >
                        <option value="50-100 students">50 - 100 students</option>
                        <option value="100-250 students">100 - 250 students</option>
                        <option value="250-500 students">250 - 500 students</option>
                        <option value="500+ students">500+ students</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Additional Notes / Ideal Dates</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us about your campus tech society, previous events, or target months..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Sending Request...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Partnership Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* 6. CAMPUS AMBASSADOR CALL */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              FOR PASSIONATE STUDENTS
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Lead the Tech Culture on Your Campus
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
              Become the official NEXHACK Campus Ambassador. Organize local study groups, lead hackathon teams from your college, and receive formal leadership honors.
            </p>
            <button
              onClick={() => setIsAmbassadorOpen(true)}
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer"
            >
              Apply as Campus Lead
            </button>
          </div>
        </section>
      </main>

      <Footer onOpenLegal={(type) => setLegalModalType(type)} onJoinClick={() => setIsJoinOpen(true)} />

      {/* Modals */}
      <JoinCommunityModal
        isOpen={isJoinOpen}
        onClose={() => setIsJoinOpen(false)}
        defaultRole="Campus Lead"
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
