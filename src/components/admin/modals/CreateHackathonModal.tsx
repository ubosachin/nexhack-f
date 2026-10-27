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
import { isoToDatetimeLocal, datetimeLocalToIso } from "@/lib/dateUtils";

interface CreateHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DbHackathon>) => Promise<void>;
  initialData?: DbHackathon | null;
}

const GRADIENT_PRESETS = [
  { name: "Blue Indigo",    value: "from-blue-600 via-indigo-600 to-cyan-500",   preview: "bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500" },
  { name: "Violet Purple",  value: "from-violet-600 via-purple-600 to-indigo-600", preview: "bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600" },
  { name: "Teal Emerald",   value: "from-cyan-600 via-teal-600 to-emerald-500",  preview: "bg-gradient-to-r from-cyan-600 via-teal-600 to-emerald-500" },
  { name: "Rose Amber",     value: "from-rose-600 via-pink-600 to-amber-500",    preview: "bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500" },
  { name: "Sunset Orange",  value: "from-orange-600 via-amber-600 to-yellow-500", preview: "bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-500" },
  { name: "Midnight",       value: "from-slate-900 via-indigo-950 to-slate-900", preview: "bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" },
];

const DEFAULT_FORM: Partial<DbHackathon> = {
  name: "",
  tagline: "",
  description: "",
  status: "Upcoming",
  mode: "Hybrid",
  location: "",
  registrationStartDate: "",
  registrationEndDate: "",
  prizePool: "",
  tags: [],
  bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
  bannerUrl: "",
  mobileBannerUrl: "",
  prizes: [{ place: "1st Place", reward: "₹50,000", perks: "Trophy + Certificate" }],
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

function Field({ label, required, hint, children }: { label: string; required?: boolean; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
        {label}{required && <span className="text-rose-500 ml-0.5">*</span>}
        {hint && <span className="ml-1.5 text-[10px] font-normal text-slate-400">({hint})</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";
const selectCls = `${inputCls} cursor-pointer`;

export function CreateHackathonModal({ isOpen, onClose, onSubmit, initialData }: CreateHackathonModalProps) {
  const [formData, setFormData] = useState<Partial<DbHackathon>>(DEFAULT_FORM);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
      setTagInput("");
    }
    setError("");
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const set = (patch: Partial<DbHackathon>) => setFormData((prev) => ({ ...prev, ...patch }));
  const isOnline = formData.mode === "Online";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) { setError("Hackathon name is required."); return; }
    const minSize = Number(formData.minTeamSize ?? 1);
    const maxSize = Number(formData.maxTeamSize ?? 4);
    if (minSize > maxSize) { setError("Min team size cannot exceed max."); return; }
    if (
      formData.registrationStartDate &&
      formData.registrationEndDate &&
      new Date(formData.registrationStartDate) >= new Date(formData.registrationEndDate)
    ) { setError("Registration end date must be after start date."); return; }

    setError("");
    setIsSubmitting(true);
    try {
      const cleanTags = tagInput.split(",").map((t) => t.trim()).filter(Boolean);
      await onSubmit({
        ...formData,
        tags: cleanTags,
        minTeamSize: minSize,
        maxTeamSize: maxSize,
        // Clear location for online events
        location: isOnline ? "" : (formData.location || ""),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save hackathon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPrize = () =>
    set({ prizes: [...(formData.prizes || []), { place: "Runner Up", reward: "₹10,000", perks: "Certificate" }] });
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

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialData ? "Edit Hackathon" : "Create Hackathon"}
              </h2>
              <p className="text-[11px] text-slate-500">Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[80vh] divide-y divide-slate-100">

          {error && (
            <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* ── 1. Basic Info ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader icon={<Info className="w-4 h-4" />} title="Basic Information" />

            <Field label="Hackathon Name" required>
              <input
                type="text" required
                value={formData.name || ""}
                onChange={(e) => set({ name: e.target.value })}
                placeholder="e.g. NEXHACK 3.0"
                className={inputCls}
              />
            </Field>

            <Field label="Tagline" hint="short inspiring line shown on cards">
              <input
                type="text"
                value={formData.tagline || ""}
                onChange={(e) => set({ tagline: e.target.value })}
                placeholder="e.g. Build the Next Frontier of Tech"
                className={inputCls}
              />
            </Field>

            <Field label="Description" hint="supports bold, lists, headings — describe the hackathon, tracks, rules and more">
              <RichTextEditor
                value={formData.description || ""}
                onChange={(html) => set({ description: html })}
                placeholder="Describe the hackathon theme, goals, tracks, rules, prizes and anything else participants need to know..."
                minHeight={200}
              />
            </Field>

            <Field label="Eligibility">
              <input
                type="text"
                value={formData.eligibility || ""}
                onChange={(e) => set({ eligibility: e.target.value })}
                placeholder="e.g. Open to all verified students"
                className={inputCls}
              />
            </Field>

            <Field label="Tags" hint="comma-separated">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. AI & ML, Web3, Full Stack"
                className={inputCls}
              />
            </Field>
          </div>

          {/* ── 2. Status, Mode & Logistics ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader icon={<MapPin className="w-4 h-4" />} title="Status, Mode & Logistics" />

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <Field label="Status">
                <select
                  value={formData.status || "Upcoming"}
                  onChange={(e) => set({ status: e.target.value as DbHackathon["status"] })}
                  className={selectCls}
                >
                  <option value="Upcoming">Upcoming</option>
                  <option value="Ongoing">Ongoing</option>
                  <option value="Completed">Completed</option>
                </select>
              </Field>
              <Field label="Mode">
                <select
                  value={formData.mode || "Hybrid"}
                  onChange={(e) => set({ mode: e.target.value as DbHackathon["mode"] })}
                  className={selectCls}
                >
                  <option value="Hybrid">Hybrid (Online + Offline)</option>
                  <option value="Online">Online only</option>
                  <option value="In-Person">In-Person / Offline</option>
                </select>
              </Field>
              <Field label="Prize Pool">
                <input
                  type="text"
                  value={formData.prizePool || ""}
                  onChange={(e) => set({ prizePool: e.target.value })}
                  placeholder="e.g. ₹5,00,000"
                  className={inputCls}
                />
              </Field>
            </div>

            {/* Location — only shown for non-online modes */}
            {!isOnline && (
              <Field
                label={formData.mode === "Hybrid" ? "Venue / Location" : "Venue"}
                hint="physical address or city"
              >
                <input
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) => set({ location: e.target.value })}
                  placeholder="e.g. IIIT Bengaluru, Karnataka"
                  className={inputCls}
                />
              </Field>
            )}
            {isOnline && (
              <p className="text-[11px] text-slate-400 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2">
                Online mode — no venue required. Location field will not be shown to participants.
              </p>
            )}
          </div>

          {/* ── 3. Registration Window ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader
              icon={<Calendar className="w-4 h-4" />}
              title="Registration Window"
              subtitle="Leave blank to keep registration always open while the hackathon is active"
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Registration Opens">
                <input
                  type="datetime-local"
                  value={isoToDatetimeLocal(formData.registrationStartDate)}
                  onChange={(e) => set({ registrationStartDate: datetimeLocalToIso(e.target.value) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Registration Closes">
                <input
                  type="datetime-local"
                  value={isoToDatetimeLocal(formData.registrationEndDate)}
                  onChange={(e) => set({ registrationEndDate: datetimeLocalToIso(e.target.value) })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* ── 4. Team Size ── */}
          <div className="px-6 py-5 space-y-4">
            <SectionHeader
              icon={<Users className="w-4 h-4" />}
              title="Team Size Rules"
              subtitle="Min = 1 allows individual participation"
            />
            <div className="grid grid-cols-2 gap-4">
              <Field label="Minimum Team Size">
                <input
                  type="number" min={1} max={10}
                  value={formData.minTeamSize ?? 1}
                  onChange={(e) => set({ minTeamSize: Math.max(1, Number(e.target.value)) })}
                  className={inputCls}
                />
              </Field>
              <Field label="Maximum Team Size">
                <input
                  type="number" min={1} max={10}
                  value={formData.maxTeamSize ?? 4}
                  onChange={(e) => set({ maxTeamSize: Math.max(1, Number(e.target.value)) })}
                  className={inputCls}
                />
              </Field>
            </div>
          </div>

          {/* ── 5. Banners & Theme ── */}
          <div className="px-6 py-5 space-y-5">
            <SectionHeader
              icon={<ImageIcon className="w-4 h-4" />}
              title="Banner & Theme"
              subtitle="Upload a banner image. The gradient accent is used on borders, tags, and buttons."
            />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Monitor className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Desktop Banner</span>
                <span className="text-[10px] text-slate-400">(16:9 or wider recommended)</span>
              </div>
              <ImageUpload
                value={formData.bannerUrl || ""}
                onChange={(url) => set({ bannerUrl: url })}
                folder="nexhack/banners/desktop"
                label=""
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-xs font-semibold text-slate-700">Mobile Banner</span>
                <span className="text-[10px] text-slate-400">(4:3 recommended, optional)</span>
              </div>
              <ImageUpload
                value={formData.mobileBannerUrl || ""}
                onChange={(url) => set({ mobileBannerUrl: url })}
                folder="nexhack/banners/mobile"
                label=""
              />
            </div>

            {/* Gradient picker */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Palette className="w-3.5 h-3.5 text-indigo-500" />
                Theme Accent Colour
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {GRADIENT_PRESETS.map((preset) => {
                  const active = formData.bannerGradient === preset.value;
                  return (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => set({ bannerGradient: preset.value })}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all cursor-pointer ${active ? "border-indigo-500 ring-2 ring-indigo-500/20" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <span className={`w-5 h-5 rounded-lg shrink-0 ${preset.preview}`} />
                      <span className="text-[11px] font-semibold text-slate-700 truncate">{preset.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Card preview */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
                <Eye className="w-3.5 h-3.5 text-indigo-500" />
                Card Preview
              </label>
              <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-sm">
                <div className="relative w-full bg-slate-100 overflow-hidden" style={{ aspectRatio: "16/7" }}>
                  {formData.bannerUrl ? (
                    <img src={formData.bannerUrl} alt="preview" className="w-full h-full object-cover" onError={(e) => ((e.target as HTMLElement).style.display = "none")} />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${selectedGradient} flex items-end p-3`}>
                      <span className="text-white/70 text-[10px] font-semibold">No banner — gradient fallback</span>
                    </div>
                  )}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r ${selectedGradient}`} />
                  <div className="absolute top-2 right-2">
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-sm ${formData.status === "Ongoing" ? "bg-emerald-400 text-emerald-950" : formData.status === "Upcoming" ? "bg-amber-300 text-amber-950" : "bg-white/80 text-slate-600"}`}>
                      {formData.status || "Upcoming"}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3">
                  <div className={`inline-block text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-gradient-to-r ${selectedGradient} text-white mb-1`}>
                    Accent Preview
                  </div>
                  <h3 className="text-base font-black text-slate-900">{formData.name || "Hackathon Name"}</h3>
                  {formData.tagline && <p className="text-xs text-slate-400 italic mt-0.5">"{formData.tagline}"</p>}
                </div>
              </div>
            </div>
          </div>

          {/* ── 6. Prizes ── */}
          <div className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionHeader icon={<Trophy className="w-4 h-4" />} title={`Prizes (${formData.prizes?.length || 0})`} />
              <button
                type="button" onClick={addPrize}
                className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg flex items-center gap-1 cursor-pointer shrink-0 -mt-3"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </div>
            <div className="space-y-2">
              {(formData.prizes || []).map((prize, idx) => (
                <div key={idx} className="p-3 bg-amber-50/50 border border-amber-100 rounded-xl flex items-start gap-3">
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input type="text" value={prize.place} onChange={(e) => updatePrize(idx, "place", e.target.value)} placeholder="Place" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={prize.reward} onChange={(e) => updatePrize(idx, "reward", e.target.value)} placeholder="Reward (e.g. ₹50,000)" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                    <input type="text" value={prize.perks} onChange={(e) => updatePrize(idx, "perks", e.target.value)} placeholder="Perks (e.g. Certificate)" className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <button type="button" onClick={() => removePrize(idx)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-0.5 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {!formData.prizes?.length && <p className="text-xs text-slate-400 italic">No prizes added yet.</p>}
            </div>
          </div>

          {/* ── 7. Featured ── */}
          <div className="px-6 py-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured || false}
                onChange={(e) => set({ featured: e.target.checked })}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-700">
                Feature on homepage and showcase
              </span>
            </label>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button" onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                : <span>{initialData ? "Update Hackathon" : "Create Hackathon"}</span>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
