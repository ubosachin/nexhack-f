"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, RefreshCw, Plus, Sparkles, ChevronRight, Database } from "lucide-react";
import { useAdminData } from "./AdminDataContext";

interface AdminHeaderProps {
  onOpenMobile: () => void;
  title?: string;
  subtitle?: string;
  actionLabel?: string;
  onActionClick?: () => void;
  actionIcon?: React.ReactNode;
}

export function AdminHeader({
  onOpenMobile,
  title: customTitle,
  subtitle: customSubtitle,
  actionLabel,
  onActionClick,
  actionIcon,
}: AdminHeaderProps) {
  const pathname = usePathname();
  const { isRefreshing, fetchData, stats } = useAdminData();

  const getRouteMeta = () => {
    if (pathname === "/admin") {
      return {
        title: "Executive Dashboard",
        subtitle: "Real-time ecosystem metrics, telemetry & quick operations",
        crumb: "Overview",
      };
    }
    if (pathname.startsWith("/admin/hackathons")) {
      return {
        title: "Hackathons Management",
        subtitle: "Create, configure tracks, set prize pools, and publish editions",
        crumb: "Hackathons",
      };
    }
    if (pathname.startsWith("/admin/users")) {
      return {
        title: "User Profiles & RBAC",
        subtitle: "Manage accounts, promote administrators, and edit user profiles",
        crumb: "User Profiles",
      };
    }
    if (pathname.startsWith("/admin/teams")) {
      return {
        title: "Student Teams Directory",
        subtitle: "Manage active squads, captain privileges, and invite codes",
        crumb: "Student Teams",
      };
    }
    if (pathname.startsWith("/admin/registrations")) {
      return {
        title: "Applicant Registrations",
        subtitle: "Filter participants, verify applications, and export rosters",
        crumb: "Registrations",
      };
    }
    if (pathname.startsWith("/admin/events")) {
      return {
        title: "Workshops & Keynotes",
        subtitle: "Schedule technical sessions, manage speakers, and allocate seats",
        crumb: "Events & Workshops",
      };
    }
    if (pathname.startsWith("/admin/inquiries")) {
      return {
        title: "Campus Partnerships",
        subtitle: "Review incoming institutional inquiries and partnership requests",
        crumb: "Campus Inquiries",
      };
    }
    if (pathname.startsWith("/admin/newsletters")) {
      return {
        title: "Community Subscribers",
        subtitle: "Manage newsletter audience and monitor growth",
        crumb: "Subscribers",
      };
    }
    if (pathname.startsWith("/admin/logs")) {
      return {
        title: "Security & Audit Logs",
        subtitle: "Chronological records of administrator actions and system changes",
        crumb: "Audit Logs",
      };
    }
    if (pathname.startsWith("/admin/settings")) {
      return {
        title: "Platform & Database Settings",
        subtitle: "MongoDB Atlas cluster health, admin whitelist, and configuration",
        crumb: "Settings",
      };
    }
    return {
      title: "Admin Console",
      subtitle: "NexHack Platform Operations",
      crumb: "Console",
    };
  };

  const meta = getRouteMeta();
  const displayTitle = customTitle || meta.title;
  const displaySubtitle = customSubtitle || meta.subtitle;

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden transition-colors cursor-pointer"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          {/* Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-0.5">
            <Link href="/admin" className="hover:text-slate-600 transition-colors">
              Admin
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-300" />
            <span className="text-indigo-600 font-semibold">{meta.crumb}</span>
          </div>

          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            {displayTitle}
          </h1>
          <p className="text-xs text-slate-500 hidden sm:block">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* DB Status Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[11px] font-medium text-slate-600">
          <span
            className={`w-2 h-2 rounded-full ${
              stats.isUsingMongo ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
            }`}
          />
          <span>{stats.isUsingMongo ? "Atlas Live" : "In-Memory"}</span>
        </div>

        {/* Refresh button */}
        <button
          onClick={() => fetchData()}
          disabled={isRefreshing}
          className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-xl text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
          title="Refresh Data from MongoDB"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${
              isRefreshing ? "animate-spin text-indigo-600" : "text-slate-500"
            }`}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* Optional Page-Specific Primary Action */}
        {actionLabel && onActionClick && (
          <button
            onClick={onActionClick}
            className="px-3.5 py-1.5 text-xs font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            {actionIcon || <Plus className="w-3.5 h-3.5" />}
            <span>{actionLabel}</span>
          </button>
        )}
      </div>
    </header>
  );
}
