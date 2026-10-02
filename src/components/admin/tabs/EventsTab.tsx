"use client";

import React, { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Plus,
  Trash2,
  Sparkles,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { DbEventSession } from "@/lib/dbTypes";

interface EventsTabProps {
  events: DbEventSession[];
  onOpenCreate: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function EventsTab({ events, onOpenCreate, onDelete }: EventsTabProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div>
          <h3 className="text-sm font-bold text-white">Community Sessions</h3>
          <p className="text-xs text-slate-400">
            {events.length} technical workshops & masterclasses scheduled
          </p>
        </div>

        <button
          onClick={onOpenCreate}
          className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-indigo-600/25 flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Workshop</span>
        </button>
      </div>

      {/* Events Grid */}
      {events.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Events Scheduled</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Schedule live workshops, technical bootcamps, and keynote webinars for the student community.
          </p>
          <button
            onClick={onOpenCreate}
            className="mt-5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Schedule First Workshop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((evt) => (
            <div
              key={evt.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20"
            >
              <div>
                {/* Category & Level badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    {evt.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {evt.level}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white leading-snug mb-3">
                  {evt.title}
                </h4>

                {/* Speaker Info */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/50 mb-4">
                  {evt.speaker?.avatar ? (
                    <img
                      src={evt.speaker.avatar}
                      alt={evt.speaker.name}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm">
                      {evt.speaker?.name?.slice(0, 1) || "S"}
                    </div>
                  )}
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">
                      {evt.speaker?.name || "TBA"}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate">
                      {evt.speaker?.role} • {evt.speaker?.company}
                    </p>
                  </div>
                </div>

                {/* Date & Time chips */}
                <div className="grid grid-cols-2 gap-2 text-xs mb-4 text-slate-300">
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.date}</span>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/40 border border-slate-800/40">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{evt.time} ({evt.duration})</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  <strong className="text-white">{evt.seatsLeft}</strong> seats left ({evt.mode})
                </span>

                <button
                  onClick={() => handleDelete(evt.id, evt.title)}
                  disabled={deletingId === evt.id}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                  title="Delete Workshop"
                >
                  {deletingId === evt.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
