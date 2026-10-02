"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  Award,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Tag,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { DbHackathon } from "@/lib/dbTypes";

interface HackathonsTabProps {
  hackathons: DbHackathon[];
  onOpenCreate: () => void;
  onEdit: (hackathon: DbHackathon) => void;
  onDelete: (id: string) => Promise<void>;
  onUpdateStatus: (id: string, status: DbHackathon["status"]) => Promise<void>;
}

export function HackathonsTab({
  hackathons,
  onOpenCreate,
  onEdit,
  onDelete,
  onUpdateStatus,
}: HackathonsTabProps) {
  const [filter, setFilter] = useState<"All" | "Upcoming" | "Ongoing" | "Completed">("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = hackathons.filter(
    (h) => filter === "All" || h.status === filter
  );

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete hackathon "${name}"? This action cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(["All", "Upcoming", "Ongoing", "Completed"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status}
              {status === "All" && ` (${hackathons.length})`}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hackathon</span>
        </button>
      </div>

      {/* Hackathons Cards */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
          <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Hackathons Found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filter === "All"
              ? "No hackathons have been configured yet. Click above to add your first flagship competition."
              : `No hackathons matching status "${filter}".`}
          </p>
          <button
            onClick={onOpenCreate}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create First Hackathon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filtered.map((hackathon) => (
            <div
              key={hackathon.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all p-6 flex flex-col justify-between group shadow-lg shadow-black/20"
            >
              <div>
                {/* Header row */}
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase">
                        {hackathon.edition || "Flagship"}
                      </span>
                      {hackathon.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors mt-0.5">
                      {hackathon.name}
                    </h3>
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={hackathon.status}
                    onChange={(e) =>
                      onUpdateStatus(hackathon.id, e.target.value as DbHackathon["status"])
                    }
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                      hackathon.status === "Ongoing"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : hackathon.status === "Upcoming"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : "bg-slate-800 text-slate-400 border-slate-700"
                    }`}
                  >
                    <option value="Upcoming" className="bg-slate-900 text-white">Upcoming</option>
                    <option value="Ongoing" className="bg-slate-900 text-white">Ongoing</option>
                    <option value="Completed" className="bg-slate-900 text-white">Completed</option>
                  </select>
                </div>

                <p className="text-xs text-slate-300 font-medium mb-3 italic">
                  "{hackathon.tagline}"
                </p>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                  {hackathon.description}
                </p>

                {/* Key metadata chips */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{hackathon.dateRange || "TBA"}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{hackathon.location || "Online"} ({hackathon.mode})</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-300">
                    <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="truncate font-semibold text-amber-300">{hackathon.prizePool || "Grants"}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60 text-slate-300">
                    <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                    <span>{hackathon.registeredCount || 0} Registered</span>
                  </div>
                </div>

                {/* Tags */}
                {hackathon.tags && hackathon.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hackathon.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-lg text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  href="/hackathons"
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Public Page</span>
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(hackathon)}
                    className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all text-xs flex items-center gap-1.5 font-medium"
                    title="Edit Hackathon Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(hackathon.id, hackathon.name)}
                    disabled={deletingId === hackathon.id}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all text-xs flex items-center gap-1.5 font-medium disabled:opacity-50"
                    title="Delete Hackathon"
                  >
                    {deletingId === hackathon.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
