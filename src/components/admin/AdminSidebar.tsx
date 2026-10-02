"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Trophy,
  Users,
  ClipboardList,
  Calendar,
  Building2,
  Mail,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Database,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { NexhackLogo } from "@/components/ui/NexhackLogo";

export type AdminTab =
  | "overview"
  | "hackathons"
  | "users-teams"
  | "registrations"
  | "events"
  | "inquiries"
  | "newsletters"
  | "logs";

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
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
  adminEmail: string;
  onLogout: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  activeTab,
  onSelectTab,
  stats,
  adminEmail,
  onLogout,
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: "overview" as AdminTab,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "hackathons" as AdminTab,
      label: "Hackathons",
      icon: Trophy,
      badge: stats.hackathons || null,
    },
    {
      id: "users-teams" as AdminTab,
      label: "Users & Teams",
      icon: Users,
      badge: (stats.teams || 0) + (stats.users || 0) || null,
    },
    {
      id: "registrations" as AdminTab,
      label: "Registrations",
      icon: ClipboardList,
      badge: stats.registrations || null,
    },
    {
      id: "events" as AdminTab,
      label: "Events & Workshops",
      icon: Calendar,
      badge: stats.events || null,
    },
    {
      id: "inquiries" as AdminTab,
      label: "Campus Inquiries",
      icon: Building2,
      badge: stats.inquiries || null,
    },
    {
      id: "newsletters" as AdminTab,
      label: "Subscribers",
      icon: Mail,
      badge: stats.newsletters || null,
    },
    {
      id: "logs" as AdminTab,
      label: "Audit Logs",
      icon: ShieldAlert,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-slate-900/95 border-r border-slate-800/80 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-slate-800/80 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block">
              <NexhackLogo />
            </Link>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              OPS v3
            </span>
          </div>

          {/* Database indicator */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800/60 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-300 text-[11px] font-medium">Database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  stats.isUsingMongo
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]"
                    : "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]"
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-300">
                {stats.isUsingMongo ? "Atlas DB" : "In-Memory"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Management
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-indigo-600/90 to-blue-600/90 text-white shadow-lg shadow-indigo-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-white" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-800 text-slate-400 border border-slate-700/60"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/70" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* User & Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="truncate pr-2">
              <p className="text-[11px] text-slate-500 font-medium uppercase tracking-wider">
                Logged in as
              </p>
              <p className="text-xs font-semibold text-slate-300 truncate" title={adminEmail}>
                {adminEmail || "Administrator"}
              </p>
            </div>
            <button
              onClick={onLogout}
              title="Sign Out of Admin Console"
              className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>
    </>
  );
}
