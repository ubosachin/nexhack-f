"use client";

import React from "react";
import {
  Trophy,
  Users,
  ClipboardList,
  Calendar,
  Building2,
  Mail,
  ArrowUpRight,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  Activity,
  Layers,
} from "lucide-react";
import { DbRegistration, DbCampusInquiry, DbHackathon } from "@/lib/dbTypes";
import { AdminTab } from "../AdminSidebar";

interface OverviewTabProps {
  stats: {
    hackathons: number;
    events: number;
    registrations: number;
    inquiries: number;
    newsletters: number;
    users?: number;
    teams?: number;
    isUsingMongo: boolean;
  };
  registrations: DbRegistration[];
  inquiries: DbCampusInquiry[];
  hackathons: DbHackathon[];
  onSelectTab: (tab: AdminTab) => void;
  onOpenCreateHackathon: () => void;
  onOpenCreateEvent: () => void;
}

export function OverviewTab({
  stats,
  registrations,
  inquiries,
  hackathons,
  onSelectTab,
  onOpenCreateHackathon,
  onOpenCreateEvent,
}: OverviewTabProps) {
  const cards = [
    {
      title: "Active Hackathons",
      count: stats.hackathons,
      icon: Trophy,
      color: "from-blue-500 to-indigo-600",
      textColor: "text-blue-400",
      tab: "hackathons" as AdminTab,
      desc: "Live & upcoming hack editions",
    },
    {
      title: "Total Registrations",
      count: stats.registrations,
      icon: ClipboardList,
      color: "from-emerald-500 to-teal-600",
      textColor: "text-emerald-400",
      tab: "registrations" as AdminTab,
      desc: "Verified student applicants",
    },
    {
      title: "Registered Teams",
      count: stats.teams || 0,
      icon: Users,
      color: "from-purple-500 to-indigo-600",
      textColor: "text-purple-400",
      tab: "users-teams" as AdminTab,
      desc: "Hacker squads & rosters",
    },
    {
      title: "Workshops & Sessions",
      count: stats.events,
      icon: Calendar,
      color: "from-amber-500 to-orange-600",
      textColor: "text-amber-400",
      tab: "events" as AdminTab,
      desc: "Technical learning sessions",
    },
    {
      title: "Campus Inquiries",
      count: stats.inquiries,
      icon: Building2,
      color: "from-pink-500 to-rose-600",
      textColor: "text-pink-400",
      tab: "inquiries" as AdminTab,
      desc: "Colleges requesting partnerships",
    },
    {
      title: "Subscribers",
      count: stats.newsletters,
      icon: Mail,
      color: "from-cyan-500 to-blue-600",
      textColor: "text-cyan-400",
      tab: "newsletters" as AdminTab,
      desc: "Active community updates",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Quick Launch & System Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-900 border border-indigo-500/20 p-6 sm:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                NEXHACK Admin Control Center
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                Live Ops
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Manage Flagship Hackathons & Community
            </h2>
            <p className="text-slate-400 text-sm mt-2 leading-relaxed">
              Track real-time registrations, configure competition tracks, evaluate participant rosters, and coordinate institutional university partnerships.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenCreateHackathon}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Create Hackathon</span>
            </button>
            <button
              onClick={onOpenCreateEvent}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Calendar className="w-4 h-4" />
              <span>New Workshop</span>
            </button>
          </div>
        </div>

        {/* Decorative backdrop */}
        <div className="absolute right-0 top-0 w-80 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => onSelectTab(card.tab)}
              className="group cursor-pointer rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 p-5 transition-all duration-200 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    {card.title}
                  </p>
                  <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight">
                    {card.count.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{card.desc}</p>
                </div>
                <div
                  className={`p-3 rounded-xl bg-gradient-to-br ${card.color} text-white shadow-lg shadow-black/20 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-slate-400 group-hover:text-indigo-400 transition-colors font-medium">
                  Open {card.title}
                </span>
                <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Tables Preview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Registrations Preview */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Recent Registrations</h3>
                  <p className="text-xs text-slate-400">Latest students applying for events</p>
                </div>
              </div>
              <button
                onClick={() => onSelectTab("registrations")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View All ({registrations.length})
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {registrations.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No participant registrations yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {registrations.slice(0, 5).map((reg) => (
                  <div key={reg.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {reg.fullName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {reg.collegeOrSchool} • <span className="text-indigo-400">{reg.eventOrHackathon}</span>
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        reg.status === "Approved" || reg.status === "Confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : reg.status === "Waitlisted"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Campus Inquiries Preview */}
        <div className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400 border border-pink-500/20">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Campus Inquiries</h3>
                  <p className="text-xs text-slate-400">Institutional universities & leads</p>
                </div>
              </div>
              <button
                onClick={() => onSelectTab("inquiries")}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
              >
                View All ({inquiries.length})
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {inquiries.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No campus inquiries received yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="truncate">
                      <p className="text-sm font-semibold text-slate-200 truncate">
                        {inq.institutionName}
                      </p>
                      <p className="text-xs text-slate-400 truncate">
                        {inq.contactName} ({inq.city}) • {inq.partnershipType}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        inq.status === "Approved"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : inq.status === "Contacted"
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
