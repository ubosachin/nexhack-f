"use client";

import React, { useState, useEffect } from "react";
import { HackathonItem } from "@/data/nexhackData";
import { SectionHeader } from "../ui/SectionHeader";
import {
  Calendar,
  MapPin,
  Trophy,
  Users,
  ArrowRight,
  Search,
  Sparkles,
} from "lucide-react";

interface HackathonsSectionProps {
  onViewHackathon: (hackathon: HackathonItem) => void;
  onRegisterHackathon: (hackathonName: string) => void;
}

export const HackathonsSection: React.FC<HackathonsSectionProps> = ({
  onViewHackathon,
  onRegisterHackathon,
}) => {
  const [hackathonsList, setHackathonsList] = React.useState<HackathonItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<"All" | "Upcoming" | "Ongoing" | "Completed">("All");
  const [searchQuery, setSearchQuery] = useState("");

  React.useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/hackathons");
        const data = await res.json();
        if (data.success && Array.isArray(data.hackathons)) {
          setHackathonsList(data.hackathons);
        }
      } catch (e) {
        console.error("HackathonsSection fetch error:", e);
      }
    }
    load();
  }, []);

  const filteredHackathons = hackathonsList.filter((hackathon) => {
    const matchesFilter = activeFilter === "All" || hackathon.status === activeFilter;
    const matchesSearch =
      hackathon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hackathon.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <section id="hackathons" className="py-16 sm:py-20 md:py-28 bg-slate-50/60 relative">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        <SectionHeader
          badgeText="HACKATHONS"
          badgeVariant="primary"
          title="HACK. BUILD. WIN."
          highlightText="Real problems. Real teams. Real solutions."
          highlightGradient="blue"
          description="Compete in structured sprints designed for student developers. Solve real-world challenges, form teams, and prototype working software."
          align="center"
        />

        {/* Filter Tabs and Search Bar */}
        <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          {/* Status filters */}
          <div className="flex items-center p-1 sm:p-1.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-x-auto no-scrollbar">
            {(["All", "Upcoming", "Ongoing", "Completed"] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeFilter === filter
                    ? "bg-blue-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {filter}
                {filter === "Upcoming" && (
                  <span className="ml-1 px-1.5 py-0.2 bg-white/20 rounded-full text-[10px]">
                    {hackathonsList.filter((h) => h.status === "Upcoming").length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Keyword Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by track or name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 sm:py-2.5 bg-white border border-slate-200/90 rounded-2xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-2xs"
            />
          </div>
        </div>

        {/* Hackathons Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mt-6 sm:mt-8">
          {filteredHackathons.map((hackathon) => {
            const isLive = hackathon.status === "Ongoing";
            const isUpcoming = hackathon.status === "Upcoming";

            return (
              <div
                key={hackathon.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-xl hover:border-blue-400 transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                {/* Header Banner */}
                <div
                  className={`p-4 sm:p-5 bg-gradient-to-r ${hackathon.bannerGradient} text-white relative overflow-hidden`}
                >
                  {hackathon.bannerUrl && (
                    <img
                      src={hackathon.bannerUrl}
                      alt={hackathon.name}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60 pointer-events-none"
                    />
                  )}
                  <div className="flex items-center justify-between mb-2 sm:mb-3 relative z-10">
                    <span className="px-2.5 py-0.5 sm:py-1 bg-white/20 backdrop-blur-md rounded-lg text-[10px] font-bold tracking-wider uppercase">
                      {hackathon.edition}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 sm:py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider ${
                        isLive
                          ? "bg-emerald-400 text-slate-900 animate-pulse"
                          : isUpcoming
                          ? "bg-white text-blue-700 shadow-xs"
                          : "bg-slate-200/90 text-slate-800"
                      }`}
                    >
                      {hackathon.status}
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black tracking-tight">{hackathon.name}</h3>
                  <p className="text-xs text-white/90 mt-0.5 sm:mt-1 font-medium">{hackathon.tagline}</p>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {hackathon.description}
                  </p>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-2.5 sm:gap-3 py-3 border-y border-slate-100 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">PRIZES</span>
                        <span className="font-bold text-slate-900 truncate block">{hackathon.prizePool}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-blue-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">DATE</span>
                        <span className="font-bold text-slate-900 truncate block">
                          {hackathon.dateRange}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-purple-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">MODE</span>
                        <span className="font-bold text-slate-900 truncate block">
                          {hackathon.mode}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-700">
                      <Users className="w-4 h-4 text-cyan-600 shrink-0" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">ELIGIBILITY</span>
                        <span className="font-bold text-slate-900 truncate block">
                          Students
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {hackathon.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Card Actions */}
                <div className="p-3.5 sm:p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onViewHackathon(hackathon)}
                    className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center gap-1 transition-colors px-2 py-1.5 cursor-pointer"
                  >
                    <span>View Event</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {hackathon.status !== "Completed" ? (
                    <button
                      onClick={() => onRegisterHackathon(hackathon.name)}
                      className="px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                    >
                      Register Now
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 bg-slate-200/60 rounded-lg">
                      Archived
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
