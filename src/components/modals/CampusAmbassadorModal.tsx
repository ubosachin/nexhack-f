"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  X,
  Star,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  GraduationCap,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";

const YEAR_OPTIONS = [
  "1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year",
  "Postgraduate", "PhD", "Other",
];

export function CampusAmbassadorModal({ isOpen, onClose }: Props) {
  const { data: session } = useSession();

  const [form, setForm] = useState({
    fullName: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: "",
    college: "",
    city: "",
    yearOfStudy: "",
    course: "",
    linkedinUrl: "",
    whyAmbassador: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const set = (patch: Partial<typeof form>) =>
    setForm((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/ambassador", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed.");
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    // reset on close
    setForm({
      fullName: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "",
      college: "",
      city: "",
      yearOfStudy: "",
      course: "",
      linkedinUrl: "",
      whyAmbassador: "",
    });
    setError("");
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">

        {/* Accent */}
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {submitted ? "Application Received!" : "Apply as Campus Ambassador"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {submitted
                  ? "We'll review your application and get back to you."
                  : "Lead the tech culture on your campus with NEXHACK"}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5">
          {submitted ? (
            /* Success state */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">You're on the list!</h3>
                <p className="text-sm text-slate-600 mt-1.5 max-w-xs mx-auto leading-relaxed">
                  Thanks <span className="font-semibold">{form.fullName.split(" ")[0]}</span>! We've received your
                  ambassador application and will reach out to <span className="font-semibold">{form.email}</span> within
                  5–7 working days.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-100 text-xs text-purple-700 text-left space-y-1.5">
                <p className="font-semibold text-purple-900">What happens next?</p>
                <p>1. Our team reviews your application</p>
                <p>2. Shortlisted candidates get an email for a brief intro call</p>
                <p>3. Selected ambassadors receive an onboarding kit</p>
              </div>
            </div>
          ) : (
            <form id="ambassador-form" onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Personal details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <User className="w-3 h-3 text-slate-400" /> Full Name *
                  </label>
                  <input
                    type="text" required
                    value={form.fullName}
                    onChange={(e) => set({ fullName: e.target.value })}
                    placeholder="Your full name"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-slate-400" /> Email *
                  </label>
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => set({ email: e.target.value })}
                    placeholder="you@college.edu"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-slate-400" /> Phone Number *
                </label>
                <input
                  type="tel" required
                  value={form.phone}
                  onChange={(e) => set({ phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className={inputCls}
                />
              </div>

              {/* Academic details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <Building2 className="w-3 h-3 text-slate-400" /> College / University *
                </label>
                <input
                  type="text" required
                  value={form.college}
                  onChange={(e) => set({ college: e.target.value })}
                  placeholder="e.g. IIIT Hyderabad"
                  className={inputCls}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-slate-400" /> City *
                  </label>
                  <input
                    type="text" required
                    value={form.city}
                    onChange={(e) => set({ city: e.target.value })}
                    placeholder="e.g. Bengaluru"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                    <GraduationCap className="w-3 h-3 text-slate-400" /> Year of Study *
                  </label>
                  <select
                    required
                    value={form.yearOfStudy}
                    onChange={(e) => set({ yearOfStudy: e.target.value })}
                    className={`${inputCls} cursor-pointer`}
                  >
                    <option value="" disabled>Select year</option>
                    {YEAR_OPTIONS.map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <GraduationCap className="w-3 h-3 text-slate-400" /> Course / Branch *
                </label>
                <input
                  type="text" required
                  value={form.course}
                  onChange={(e) => set({ course: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science"
                  className={inputCls}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <ExternalLink className="w-3 h-3 text-slate-400" /> LinkedIn Profile
                  <span className="font-normal text-slate-400">(optional)</span>
                </label>
                <input
                  type="url"
                  value={form.linkedinUrl}
                  onChange={(e) => set({ linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/your-profile"
                  className={inputCls}
                />
              </div>

              {/* Motivation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                  <MessageSquare className="w-3 h-3 text-slate-400" /> Why do you want to be a Campus Ambassador? *
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.whyAmbassador}
                  onChange={(e) => set({ whyAmbassador: e.target.value })}
                  placeholder="Tell us about your passion for tech communities, your college activities, and how you'd promote NEXHACK on your campus..."
                  className={`${inputCls} resize-none`}
                />
                <p className="text-[11px] text-slate-400 mt-1">{form.whyAmbassador.length} / 500 characters</p>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!submitted && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
            <button
              type="submit"
              form="ambassador-form"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-pink-500 to-rose-500 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer transition-all"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
              ) : (
                <><Star className="w-4 h-4" /> Submit Application</>
              )}
            </button>
            <p className="text-center text-[11px] text-slate-400 mt-2">
              We review all applications personally. No spam, ever.
            </p>
          </div>
        )}

        {submitted && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 to-pink-500 shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
