"use client";

import React, { useState, useEffect } from "react";
import { X, Trophy, Plus, Trash2, Loader2, Sparkles } from "lucide-react";
import { DbHackathon } from "@/lib/dbTypes";
import { ImageUpload } from "@/components/ui/ImageUpload";

interface CreateHackathonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DbHackathon>) => Promise<void>;
  initialData?: DbHackathon | null;
}

export function CreateHackathonModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: CreateHackathonModalProps) {
  const [formData, setFormData] = useState<Partial<DbHackathon>>({
    name: "",
    edition: "3.0 Flagship",
    tagline: "Build the next frontier of tech",
    description: "",
    status: "Upcoming",
    mode: "Hybrid",
    location: "Bengaluru + Online Track",
    dateRange: "Late 2026",
    prizePool: "Cash Grants & Perks",
    tags: ["AI & ML", "Web3", "Full Stack"],
    bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    tracks: [
      { title: "Artificial Intelligence & Agents", desc: "Build agent workflows and automation", icon: "Bot" },
      { title: "Open Innovation", desc: "Any original software or product prototype", icon: "Lightbulb" },
    ],
    eligibility: "Open to all verified college and high school students.",
    featured: true,
  });

  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      setTagInput(initialData.tags?.join(", ") || "");
    } else {
      setFormData({
        name: "",
        edition: "Campus Edition",
        tagline: "Innovate, build & scale",
        description: "",
        status: "Upcoming",
        mode: "Hybrid",
        location: "Online + Campus",
        dateRange: "Announcing Soon",
        prizePool: "Cash Grants & Swag",
        tags: ["AI", "Web Dev"],
        bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
        tracks: [
          { title: "Open Innovation", desc: "Build any original solution", icon: "Lightbulb" },
        ],
        eligibility: "Open to all verified students.",
        featured: false,
      });
      setTagInput("AI, Web Dev");
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) {
      setError("Please provide a hackathon name.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const cleanTags = tagInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onSubmit({
        ...formData,
        tags: cleanTags,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to save hackathon.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTrack = () => {
    setFormData((prev) => ({
      ...prev,
      tracks: [...(prev.tracks || []), { title: "New Track", desc: "Track description", icon: "Layers" }],
    }));
  };

  const handleRemoveTrack = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tracks: (prev.tracks || []).filter((_, i) => i !== index),
    }));
  };

  const handleUpdateTrack = (index: number, field: "title" | "desc", value: string) => {
    setFormData((prev) => {
      const updated = [...(prev.tracks || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, tracks: updated };
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialData ? "Edit Hackathon" : "Create New Hackathon"}
              </h2>
              <p className="text-xs text-slate-500">
                Configure details, tracks, mode, and timeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Hackathon Name *
              </label>
              <input
                type="text"
                required
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. NEXHACK 3.0"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Edition Label
              </label>
              <input
                type="text"
                value={formData.edition || ""}
                onChange={(e) => setFormData({ ...formData, edition: e.target.value })}
                placeholder="e.g. Flagship Edition / Winter 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={formData.tagline || ""}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              placeholder="e.g. Build the Next Frontier of Tech"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Comprehensive summary of the hackathon theme, goals, and who should participate..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Status
              </label>
              <select
                value={formData.status || "Upcoming"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value as DbHackathon["status"] })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Mode
              </label>
              <select
                value={formData.mode || "Hybrid"}
                onChange={(e) =>
                  setFormData({ ...formData, mode: e.target.value as DbHackathon["mode"] })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Online">Online</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Prize Pool
              </label>
              <input
                type="text"
                value={formData.prizePool || ""}
                onChange={(e) => setFormData({ ...formData, prizePool: e.target.value })}
                placeholder="e.g. ₹5,00,000 / Grants"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Date Range / Timeline
              </label>
              <input
                type="text"
                value={formData.dateRange || ""}
                onChange={(e) => setFormData({ ...formData, dateRange: e.target.value })}
                placeholder="e.g. November 14 - 16, 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={formData.location || ""}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Bengaluru + Virtual"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Tags (Comma separated)
            </label>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. AI & ML, Web3, Full Stack, Robotics"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          {/* Tracks Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Hackathon Tracks ({formData.tracks?.length || 0})
              </label>
              <button
                type="button"
                onClick={handleAddTrack}
                className="px-2.5 py-1 text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Track
              </button>
            </div>

            <div className="space-y-3">
              {(formData.tracks || []).map((track, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3"
                >
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={track.title}
                      onChange={(e) => handleUpdateTrack(idx, "title", e.target.value)}
                      placeholder="Track Title (e.g. AI & Automation)"
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                    <input
                      type="text"
                      value={track.desc}
                      onChange={(e) => handleUpdateTrack(idx, "desc", e.target.value)}
                      placeholder="Brief track description..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTrack(idx)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors mt-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featuredHackathon"
              checked={formData.featured || false}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 rounded text-indigo-600 bg-slate-50 border-slate-300 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="featuredHackathon" className="text-xs font-medium text-slate-700 cursor-pointer">
              Mark as Featured Hackathon on Homepage & Showcase
            </label>
          </div>

          {/* Submit footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
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
