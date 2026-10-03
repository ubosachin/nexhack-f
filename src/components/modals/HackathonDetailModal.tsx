"use client";

import React from "react";
import { Modal } from "../ui/Modal";
import { HackathonItem } from "@/data/nexhackData";
import { Badge } from "../ui/Badge";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Gift,
} from "lucide-react";

interface HackathonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  hackathon: HackathonItem | null;
  onRegisterClick: (hackathonName: string) => void;
}

export const HackathonDetailModal: React.FC<HackathonDetailModalProps> = ({
  isOpen,
  onClose,
  hackathon,
  onRegisterClick,
}) => {
  if (!hackathon) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={hackathon.name}
      subtitle={hackathon.tagline}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Banner with gradient & meta */}
        <div
          className={`p-6 rounded-2xl bg-gradient-to-r ${hackathon.bannerGradient} text-white shadow-md relative overflow-hidden`}
        >
          {hackathon.bannerUrl && (
            <img
              src={hackathon.bannerUrl}
              alt={hackathon.name}
              className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none"
            />
          )}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/10 transform skew-x-12 translate-x-10 pointer-events-none" />

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 bg-white/20 backdrop-blur-md rounded-md text-xs font-semibold uppercase tracking-wider">
              {hackathon.edition}
            </span>
            <span className="px-2.5 py-1 bg-black/25 backdrop-blur-md rounded-md text-xs font-semibold uppercase tracking-wider">
              {hackathon.mode}
            </span>
            <span
              className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                hackathon.status === "Ongoing"
                  ? "bg-emerald-400 text-slate-900"
                  : hackathon.status === "Upcoming"
                  ? "bg-amber-300 text-slate-900"
                  : "bg-slate-200 text-slate-900"
              }`}
            >
              {hackathon.status}
            </span>
          </div>

          <h3 className="text-2xl font-black">{hackathon.name}</h3>
          <p className="text-white/90 text-sm mt-1 max-w-xl">{hackathon.description}</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-white/20 text-xs">
            <div>
              <div className="text-white/70">Prize Pool</div>
              <div className="text-base font-bold text-white">{hackathon.prizePool}</div>
            </div>
            <div>
              <div className="text-white/70">Date</div>
              <div className="text-sm font-semibold text-white">{hackathon.dateRange}</div>
            </div>
            <div>
              <div className="text-white/70">Location</div>
              <div className="text-sm font-semibold text-white truncate">{hackathon.location}</div>
            </div>
            <div>
              <div className="text-white/70">Hackers</div>
              <div className="text-sm font-semibold text-white">
                {hackathon.registeredCount.toLocaleString()} Registered
              </div>
            </div>
          </div>
        </div>

        {/* Tracks & Themes */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            Hackathon Tracks & Problem Domains
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {hackathon.tracks.map((track, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-50 transition-colors"
              >
                <div className="font-semibold text-slate-900 text-sm">{track.title}</div>
                <p className="text-xs text-slate-600 mt-1">{track.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Prizes Breakdown */}
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Prize Breakdown & Perks
          </h4>
          <div className="space-y-2">
            {hackathon.prizes.map((prize, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-colors text-sm shadow-xs"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-xs border border-amber-200">
                    #{idx + 1}
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900">{prize.place}</span>
                    <span className="text-xs text-slate-500 block">{prize.perks}</span>
                  </div>
                </div>
                <div className="font-bold text-blue-600">{prize.reward}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Eligibility & Tags */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="font-bold text-slate-900 block">Eligibility:</span>
            {hackathon.eligibility}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {hackathon.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            Close
          </button>
          {hackathon.status !== "Completed" ? (
            <button
              onClick={() => {
                onClose();
                onRegisterClick(hackathon.name);
              }}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition-all hover:gap-3 cursor-pointer"
            >
              Register for this Hackathon
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs font-semibold text-slate-400 italic">
              Registration closed for this edition
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
