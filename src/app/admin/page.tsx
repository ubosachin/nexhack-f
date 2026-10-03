"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Trophy,
  Users,
  UserCheck,
  ClipboardList,
  Calendar,
  Building2,
  Mail,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Database,
  ExternalLink,
  Plus,
  Activity,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";

export default function AdminDashboardPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    stats,
    hackathons,
    teams,
    users,
    registrations,
    events,
    inquiries,
    adminName,
    openCreateHackathon,
    openCreateEvent,
  } = useAdminData();

  const kpis = [
    {
      title: "Active Hackathons",
      value: stats.hackathons || hackathons.length,
      desc: "Live & upcoming hackathons",
      icon: Trophy,
      color: "text-amber-600 bg-amber-50 border-amber-200",
      href: "/admin/hackathons",
    },
    {
      title: "User Profiles",
      value: stats.users || users.length,
      desc: "Registered hackers & creators",
      icon: UserCheck,
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      href: "/admin/users",
    },
    {
      title: "Formed Teams",
      value: stats.teams || teams.length,
      desc: "Student squads formed",
      icon: Users,
      color: "text-purple-600 bg-purple-50 border-purple-200",
      href: "/admin/teams",
    },
    {
      title: "Applications",
      value: stats.registrations || registrations.length,
      desc: "Total event sign-ups",
      icon: ClipboardList,
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      href: "/admin/registrations",
    },
    {
      title: "Workshops & Events",
      value: stats.events || events.length,
      desc: "Hands-on tech keynotes",
      icon: Calendar,
      color: "text-blue-600 bg-blue-50 border-blue-200",
      href: "/admin/events",
    },
    {
      title: "Campus Partnerships",
      value: stats.inquiries || inquiries.length,
      desc: "College & club inquiries",
      icon: Building2,
      color: "text-rose-600 bg-rose-50 border-rose-200",
      href: "/admin/inquiries",
    },
  ];

  return (
    <>
      <AdminHeader
        onOpenMobile={() => setIsMobileOpen(true)}
        actionLabel="New Hackathon"
        actionIcon={<Plus className="w-3.5 h-3.5" />}
        onActionClick={() => openCreateHackathon()}
      />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-white to-blue-50/50 border border-slate-200/90 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  REAL-TIME ECOSYSTEM
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {new Date().toLocaleDateString(undefined, {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back, {adminName} 👋
              </h2>
              <p className="text-sm text-slate-600 mt-1 max-w-xl">
                NexHack operational telemetry is active. Manage hackathons, review applicant rosters, allocate workshop seats, and configure role-based access.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => openCreateHackathon()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/25 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Hackathon</span>
              </button>
              <button
                onClick={() => openCreateEvent()}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-2 transition-all cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Schedule Workshop</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500">
              Platform Metrics
            </h3>
            <span className="text-xs text-slate-400 font-medium">Auto-updated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kpis.map((kpi, idx) => {
              const Icon = kpi.icon;
              return (
                <Link
                  key={idx}
                  href={kpi.href}
                  className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-600">{kpi.title}</span>
                    <div className={`p-2.5 rounded-xl border ${kpi.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <div className="text-3xl font-extrabold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                      {kpi.value}
                    </div>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{kpi.desc}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Two-column Bottom Section: Registrations & Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Recent Registrations */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <ClipboardList className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Recent Registrations</h3>
                    <p className="text-xs text-slate-500">Latest applicants across hackathons</p>
                  </div>
                </div>
                <Link
                  href="/admin/registrations"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All ({registrations.length})
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {registrations.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No registrations recorded yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {registrations.slice(0, 5).map((reg) => (
                    <div key={reg.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <p className="font-semibold text-slate-800 truncate">{reg.fullName}</p>
                        <p className="text-[11px] text-slate-500 truncate">{reg.email}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-slate-500 truncate max-w-[120px] hidden sm:inline">
                          {reg.eventOrHackathon}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            reg.status === "Approved"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/admin/registrations"
              className="mt-4 pt-3 border-t border-slate-100 w-full text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 block transition-colors"
            >
              Manage all applicant records →
            </Link>
          </div>

          {/* Right: Recent Campus Inquiries */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Campus Inquiries</h3>
                    <p className="text-xs text-slate-500">Incoming partnerships from colleges</p>
                  </div>
                </div>
                <Link
                  href="/admin/inquiries"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  View All ({inquiries.length})
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              {inquiries.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  No campus inquiries yet.
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {inquiries.slice(0, 5).map((inq) => (
                    <div key={inq.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="truncate pr-2">
                        <p className="font-semibold text-slate-800 truncate">
                          {inq.institutionName}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {inq.contactName} • {inq.city}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold shrink-0 ${
                          inq.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : inq.status === "Contacted"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {inq.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/admin/inquiries"
              className="mt-4 pt-3 border-t border-slate-100 w-full text-center text-xs font-semibold text-slate-600 hover:text-indigo-600 block transition-colors"
            >
              Review all partner inquiries →
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
