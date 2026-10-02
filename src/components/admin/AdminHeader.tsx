"use client";

import React from "react";
import { Menu, RefreshCw, Plus, Download, Sparkles } from "lucide-react";
import { AdminTab } from "./AdminSidebar";

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobile: () => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  onActionClick?: () => void;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
}

export function AdminHeader({
  activeTab,
  onOpenMobile,
  onRefresh,
  isRefreshing,
  onActionClick,
  actionLabel,
  actionIcon,
}: AdminHeaderProps) {
  const getTabMeta = () => {
    switch (activeTab) {
      case "overview":
        return {
          title: "System Overview",
          subtitle: "Real-time metrics, platform health & quick operations",
        };
      case "hackathons":
        return {
          title: "Hackathon Management",
          subtitle: "Publish editions, configure tracks, and monitor timelines",
        };
      case "users-teams":
        return {
          title: "Users & Teams Directory",
          subtitle: "View member profiles, active rosters, and manage student teams",
        };
      case "registrations":
        return {
          title: "Applicant Registrations",
          subtitle: "Filter participants, verify applications, and export rosters",
        };
      case "events":
        return {
          title: "Workshops & Keynotes",
          subtitle: "Schedule technical sessions, manage speakers, and allocate seats",
        };
      case "inquiries":
        return {
          title: "Campus Partnerships",
          subtitle: "Review incoming institutional inquiries and partnership requests",
        };
      case "newsletters":
        return {
          title: "Community Subscribers",
          subtitle: "Manage newsletter audience and download mailing lists",
        };
      case "logs":
        return {
          title: "Security & Audit Logs",
          subtitle: "Chronological audit records of system actions and administrator logins",
        };
      default:
        return {
          title: "Admin Console",
          subtitle: "Platform management suite",
        };
    }
  };

  const meta = getTabMeta();

  return (
    <header className="sticky top-0 z-30 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/80 px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            {meta.title}
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block mt-0.5">
            {meta.subtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 flex items-center gap-2 transition-all disabled:opacity-50"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Tab-specific primary action */}
        {actionLabel && onActionClick && (
          <button
            onClick={onActionClick}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-indigo-600/25 flex items-center gap-1.5 transition-all"
          >
            {actionIcon || <Plus className="w-4 h-4" />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
