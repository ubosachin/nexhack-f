"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Trophy,
  Plus,
  Trash2,
  Loader2,
  Palette,
  Image as ImageIcon,
  Eye,
  Calendar,
  MapPin,
  Monitor,
  Smartphone,
  Users,
  Info,
} from "lucide-react";
import { DbHackathon } from "@/lib/dbTypes";
import { ImageUpload } from "@/components/ui/ImageUpload";
import { RichTextEditor } from "@/components/ui/RichTextEditor";

interface CreateHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DbHackathon>) => Promise<void>;
  initialData?: DbHackathon | null;
}

const GRADIENT_PRESETS = [
  { name: "Blue Indigo", value: "from-blue-600 via-indigo-600 to-cyan-500", preview: "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" },
  { name: "Violet Purple", value: "from-violet-600 via-purple-600 to-indigo-600", preview: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" },
  { name: "Teal Emerald", value: "from-cyan-600 via-teal-600 to-emerald-500", preview: "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500" },
  { name: "Rose Amber", value: "from-rose-600 via-pink-600 to-amber-500", preview: "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500" },
  { name: "Sunset Orange", value: "from-orange-600 via-amber-600 to-yellow-500", preview: "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500" },
  { name: "Midnight", value: "from-slate-900 via-indigo-950 to-slate-900", preview: "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" },
];

const DEFAULT_FORM: Partial<DbHackathon> = {
  name: "",
  edition: "Campus Edition",
  tagline: "Innovate, build & scale",
  description: "",
  status: "Upcoming",
  mode: "Hybrid",
  location: "Online + Campus",
  dateRange: "Announcing Soon",
  registrationStartDate: "",
  registrationEndDate: "",
  prizePool: "Cash Grants & Swag",
  tags: ["AI", "Web Dev"],
  bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
  bannerUrl: "",
  mobileBannerUrl: "",
  tracks: [{ title: "Open Innovation", desc: "Build any original solution", icon: "Lightbulb" }],
  prizes: [{ place: "1st Place", reward: "₹50,000", perks: "Trophy + Certificates" }],
  eligibility: "Open to all verified students.",
  minTeamSize: 1,
  maxTeamSize: 4,
  featured: false,
};

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100 mb-4">
      <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">{icon}</div>
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">{title}</h4>
        {subtitle && <p className="text-[11px] text-slate-500 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";
const selectCls = `${inputCls} cursor-pointer`;

export function CreateHackathonModal({ isOpen, onClose, onSubmit, initialData }: CreateHackathonModalProps) {
  const [formData, setFormData] = useState<Partial<DbHackathon>>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("AI, Web Dev");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Populate form when editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        bannerUrl: initialData.bannerUrl || "",
        mobileBannerUrl: initialData.mobileBannerUrl || "",
        bannerGradient: initialData.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500",
        registrationStartDate: initialData.registrationStartDate || "",
        registrationEndDate: initialData.registrationEndDate || "",
        minTeamSize: initialData.minTeamSize ?? 1,
        maxTeamSize: initialData.maxTeamSize ?? 4,
      });
      setTagInput(initialData.tags?.join(", ") || "");
    } else {
      setFormData(DEFAULT_FORM);
      setTagInput("AI, Web Dev");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const set = (patch: Partial<DbHackathon>) => setFormData((prev) => ({ ...prev, ...patch }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please provide a hackathon name.");
      return;
    }
    const minSize = Number(formData.minTeamSize ?? 1);
    const maxSize = Number(formData.maxTeamSize ?? 4);
    if (minSize > maxSize) {
      setError("Minimum team size cannot exceed maximum team size.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      const cleanTags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
      await onSubmit({ ...formData, tags: cleanTags, minTeamSize: minSize, maxTeamSize: maxSize });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save hackathon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTrack = () =>
    set({ tracks: [...(formData.tracks || []), { title: "New Track", desc: "Track description", icon: "Layers" }] });

  const removeTrack = (i: number) =>
    set({ tracks: (formData.tracks || []).filter((_, idx) => idx !== i) });

  const updateTrack = (i: number, field: "title" | "desc", value: string) => {
    const updated = [...(formData.tracks || [])];
    updated[i] = { ...updated[i], [field]: value };
    set({ tracks: updated });
  };

  const addPrize = () =>
    set({ prizes: [...(formData.prizes || []), { place: "Runner Up", reward: "₹10,000", perks: "Certificates" }] });

  const removePrize = (i: number) =>
    set({ prizes: (formData.prizes || []).filter((_, idx) => idx !== i) });

  const updatePrize = (i: number, field: "place" | "reward" | "perks", value: string) => {
    const updated = [...(formData.prizes || [])];
    updated[i] = { ...updated[i], [field]: value };
    set({ prizes: updated });
  };

  const selectedGradient = formData.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500";

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl my-6 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">

        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Trophy className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData ? "Edit Hackathon" : "Create Hackathon"}
              </h2>
              <p className="text-[11px] text-slate-500">
                Configure all details, banners, registration window, and team rules
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] divide-y divide-slate-100">

          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* ── Section 1: Basic Info ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader icon={<Info className="w-4 h-4" />} title="Basic Information" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Hackathon Name" required>
                <input type="text" required value={formData.name || ""} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. NEXHACK 3.0" className={inputCls} />
              </Field>
              <Field label="Edition Label">
                <input type="text" value={formData.edition || ""} onChange={(e) => set({ edition: e.target.value })} placeholder="e.g. Flagship Edition" className={inputCls} />
              </Field>
            </div>

            <Field label="Tagline">
              <input type="text" value={formData.tagline || ""} onChange={(e) => set({ tagline: e.target.value })} placeholder="e.g. Build the Next Frontier of Tech" className={inputCls} />
            </Field>

            <Field label="Description (Rich Text)">
              <RichTextEditor
                value={formData.description || ""}
                onChange={(html) => set({ description: html })}
                placeholder="Describe the hackathon theme, goals, tracks, rules, prizes and more. Use headings, bullet points, and bold text to organize content."
                minHeight={180}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                All formatting (bold, lists, headings) will display correctly on the hackathon detail page.
              </p>
            </Field>

            <Field label="Eligibility">
              <input type="text" value={formData.eligibility || ""} onChange={(e) => set({ eligibility: e.target.value })} placeholder="e.g. Open to all verified students" className={inputCls} />
            </Field>

            <Field label="Tags (comma separated)">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="e.g. AI & ML, Web3, Full Stack" className={inputCls} />
            </Field>
          </div>

          {/* ── Section 2: Status, Mode & Logistics ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader icon={<MapPin className="w-4 h-4" />} title="Status, Mode & Logistics" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Status">
                <select value={formData.status || "Upcoming"} onChange={(e) => set({ status: e.target.value as DbHackathon["status"] })} className={selectCls}>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </Field>
              <Field label="Mode">
                <select value={formData.mode || "Hybrid"} onChange={(e) => set({ mode: e.target.value as DbHackathon["mode"] })} className={selectCls}>
                  <option value="Hybrid">Hybrid</option>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </select>
              </Field>
              <Field label="Prize Pool">
                <input type="text" value={formData.prizePool || ""} onChange={(e) => set({ prizePool: e.target.value })} placeholder="e.g. ₹5,00,000" className={inputCls} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Event Date Range">
                <input type="text" value={formData.dateRange || ""} onChange={(e) => set({ dateRange: e.target.value })} placeholder="e.g. November 14–16, 2026" className={inputCls} />
              </Field>
              <Field label="Location">
                <input type="text" value={formData.location || ""} onChange={(e) => set({ location: e.target.value })} placeholder="e.g. Bengaluru + Virtual" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* ── Section 3: Registration Window ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader
              icon={<Calendar className="w-4 h-4" />}
              title="Registration Window"
              subtitle="Leave blank to keep registration always open"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Registration Start Date & Time">
                <input
                  type="datetime-local"
                  value={formData.registrationStartDate ? formData.registrationStartDate.slice(0, 16) : ""}
                  onChange={(e) => set({ registrationStartDate: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                  className={inputCls}
                />
              </Field>
              <Field label="Registration End Date & Time">
                <input
                  type="datetime-local"
                  value={formData.registrationEndDate ? formData.registrationEndDate.slice(0, 16) : ""}
                  onChange={(e) => set({ registrationEndDate: e.target.value ? new Date(e.target.value).toISOString() : "" })}
                  className={inputCls}
                />
              </Field>
            </div>

            {formData.registrationStartDate && formData.registrationEndDate && new Date(formData.registrationStartDate) >= new Date(formData.registrationEndDate) && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                ⚠️ Registration end date must be after the start date.
              </p>
            )}
          </div>

          {/* ── Section 4: Team Size Rules ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader
              icon={<Users className="w-4 h-4" />}
              title="Team Size Rules"
              subtitle="Set min=1 to allow individual participation"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Minimum Team Size">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.minTeamSize ?? 1}
                  onChange={(e) => set({ minTeamSize: Math.max(1, Number(e.target.value)) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Maximum Team Size">
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={formData.maxTeamSize ?? 4}
                  onChange={(e) => set({ maxTeamSize: Math.max(1, Number(e.target.value)) })}
                  className={inputCls}
                />
              </Field>
            </div>
            <p className="text-[11px] text-slate-500 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2">
              If min = 1, participants can register individually or as a team. If min ≥ 2, team registration only.
            </p>
          </div>

          {/* ── Section 5: Banners & Appearance ── */}
          <div className="px-6 py-5 space-y-5">
            <SectionHeader
              icon={<ImageIcon className="w-4 h-4" />}
              title="Banners & Appearance"
              subtitle="Upload separate desktop and mobile banners. The gradient is used for borders and accents."
            />

            {/* Desktop Banner */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Desktop Banner</span>
                <span className="text-[10px] text-slate-400">(16:9 or 3:1 recommended)</span>
              </div>
              <ImageUpload
                value={formData.bannerUrl || ""}
                onChange={(url) => set({ bannerUrl: url })}
                folder="nexhack/banners/desktop"
                label=""
              />
            </div>

            {/* Mobile Banner */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Mobile Banner</span>
                <span className="text-[10px] text-slate-400">(4:3 or 1:1 recommended, optional)</span>
              </div>
              <ImageUpload
                value={formData.mobileBannerUrl || ""}
                onChange={(url) => set({ mobileBannerUrl: url })}
                folder="nexhack/banners/mobile"
                label=""
              />
            </div>

            {/* Gradient accent */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Theme Gradient Accent
                <span className="text-[10px] font-normal text-slate-400">(used on borders, buttons & tags — not the full background)</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((preset) => {
                  const active = formData.bannerGradient === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => set({ bannerGradient: preset.value })}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${active ? "bg-white border-indigo-600 ring-2 ring-indigo-500/20 shadow-sm" : "bg-white/80 border-slate-200 hover:border-slate-300"}`}
                    >
                      <span className={`w-5 h-5 rounded-lg shrink-0 ${preset.preview} shadow-sm`} />
                      <span className="text-[11px] font-semibold text-slate-700 truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preview card — gradient used only on border and tag accents */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                Card Preview
              </label>
              <div className="rounded-2xl border-2 overflow-hidden bg-white shadow-sm" style={{ borderImage: `linear-gradient(to right, var(--tw-gradient-stops)) 1` }}>
                {/* Banner image area */}
                <div className="relative w-full aspect-[3/1] sm:aspect-[4/1] bg-slate-100 overflow-hidden">
                  {/* Show desktop banner if available */}
                  {formData.bannerUrl ? (
                    <img
                      src={formData.bannerUrl}
                      alt="Banner preview"
                      className="w-full h-full object-cover"
                      onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedGradient} flex items-center justify-center`}>
                      <span className="text-white/60 text-xs font-semibold">No banner uploaded — gradient shown</span>
                    </div>
                  )}
                  {/* Gradient overlay strip at bottom */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${selectedGradient}`} />
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm ${formData.status === "Ongoing" ? "bg-emerald-400 text-emerald-950" : formData.status === "Upcoming" ? "bg-amber-300 text-amber-950" : "bg-white/80 text-slate-700"}`}>
                      {formData.status || "Upcoming"}
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div className="px-5 py-4">
                  <div className={`inline-block text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gradient-to-r ${selectedGradient} text-white mb-2`}>
                    {formData.edition || "Campus Edition"}
                  </div>
                  <h3 className="text-lg font-black text-slate-900">{formData.name || "NEXHACK 3.0"}</h3>
                  <p className="text-xs text-slate-500 italic mt-0.5">"{formData.tagline || "Innovate, build & scale"}"</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Section 6: Tracks ── */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<Trophy className="w-4 h-4" />} title={`Hackathon Tracks (${formData.tracks?.length || 0})`} />
              <button type="button" onClick={addTrack} className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1 cursor-pointer shrink-0 -mt-3">
                <Plus className="w-3.5 h-3.5" /> Add Track
              </button>
            </div>
            <div className="space-y-2.5">
              {(formData.tracks || []).map((track, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={track.title} onChange={(e) => updateTrack(idx, "title", e.target.value)} placeholder="Track title" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={track.desc} onChange={(e) => updateTrack(idx, "desc", e.target.value)} placeholder="Brief description" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <button type="button" onClick={() => removeTrack(idx)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(formData.tracks?.length || 0) === 0 && (
                <p className="text-xs text-slate-400 italic px-1">No tracks added yet.</p>
              )}
            </div>
          </div>

          {/* ── Section 7: Prizes ── */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<Trophy className="w-4 h-4" />} title={`Prizes (${formData.prizes?.length || 0})`} />
              <button type="button" onClick={addPrize} className="px-2.5 py-1 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 cursor-pointer shrink-0 -mt-3">
                <Plus className="w-3.5 h-3.5" /> Add Prize
              </button>
            </div>
            <div className="space-y-2.5">
              {(formData.prizes || []).map((prize, idx) => (
                <div key={idx} className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={prize.place} onChange={(e) => updatePrize(idx, "place", e.target.value)} placeholder="Place (e.g. 1st Place)" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={prize.reward} onChange={(e) => updatePrize(idx, "reward", e.target.value)} placeholder="Reward (e.g. ₹50,000)" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={prize.perks} onChange={(e) => updatePrize(idx, "perks", e.target.value)} placeholder="Perks (e.g. Certificate)" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <button type="button" onClick={() => removePrize(idx)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {(formData.prizes?.length || 0) === 0 && (
                <p className="text-xs text-slate-400 italic px-1">No prizes added yet.</p>
              )}
            </div>
          </div>

          {/* ── Section 8: Featured ── */}
          <div className="px-6 py-4">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => set({ featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">
                Mark as Featured Hackathon (shown on homepage and showcase)
              </span>
            </label>
          </div>

          {/* ── Submit Footer ── */}
          <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /><span>Saving...</span></>
              ) : (
                <span>{initialData ? "Update Hackathon" : "Create Hackathon"}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
