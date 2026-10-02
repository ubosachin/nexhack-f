"use client";

import React, { useState } from "react";
import { X, Calendar, Plus, Loader2 } from "lucide-react";
import { DbEventSession } from "@/lib/dbTypes";

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<DbEventSession>) => Promise<void>;
}

export function CreateEventModal({ isOpen, onClose, onSubmit }: CreateEventModalProps) {
  const [formData, setFormData] = useState<Partial<DbEventSession>>({
    title: "",
    category: "AI & Machine Learning",
    speaker: {
      name: "",
      role: "Lead Engineer",
      company: "Tech Org",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      verified: true,
    },
    date: "Upcoming Weekend",
    time: "6:00 PM IST",
    duration: "60 mins",
    mode: "Virtual Workshop",
    seatsLeft: 100,
    level: "Beginner",
    highlights: ["Interactive code-along", "Live Q&A session"],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title?.trim() || !formData.speaker?.name?.trim()) {
      setError("Please fill out event title and speaker name.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to schedule workshop.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Schedule Community Session</h2>
              <p className="text-xs text-slate-500">Add a hands-on workshop or keynote</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Session Title *
            </label>
            <input
              type="text"
              required
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Master LangGraph & Autonomous AI Agents"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category || "AI & Machine Learning"}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value as any })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Web Development">Web Development</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Startups & Career">Startups & Career</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Audience Level
              </label>
              <select
                value={formData.level || "Beginner"}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value as any })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </div>

          {/* Speaker details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Speaker Profile
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Speaker Name *</label>
                <input
                  type="text"
                  required
                  value={formData.speaker?.name || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker!, name: e.target.value },
                    })
                  }
                  placeholder="e.g. Dr. Priya Nair"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Role / Designation</label>
                <input
                  type="text"
                  value={formData.speaker?.role || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker!, role: e.target.value },
                    })
                  }
                  placeholder="e.g. Senior AI Architect"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Company / Organization</label>
                <input
                  type="text"
                  value={formData.speaker?.company || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker!, company: e.target.value },
                    })
                  }
                  placeholder="e.g. Google / Microsoft"
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={formData.speaker?.avatar || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      speaker: { ...formData.speaker!, avatar: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
              <input
                type="text"
                value={formData.date || ""}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                placeholder="e.g. Nov 22, 2026"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={formData.time || ""}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g. 6:30 PM IST"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Seats Available</label>
              <input
                type="number"
                value={formData.seatsLeft || 100}
                onChange={(e) => setFormData({ ...formData, seatsLeft: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Scheduling...</span>
                </>
              ) : (
                <span>Publish Workshop</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
