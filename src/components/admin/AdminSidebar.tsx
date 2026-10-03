"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Trophy,
  Users,
  UserCheck,
  ClipboardList,
  Calendar,
  Building2,
  Mail,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Database,
  ChevronRight,
  Settings,
} from "lucide-react";
import { NexhackLogo } from "@/components/ui/NexhackLogo";
import { useAdminData } from "./AdminDataContext";

export type AdminTab =
  | "overview"
  | "hackathons"
  | "users-teams"
  | "registrations"
  | "events"
  | "inquiries"
  | "newsletters"
  | "logs"
  | "settings";

interface AdminSidebarProps {
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export function AdminSidebar({
  isOpenMobile,
  onCloseMobile,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { stats, adminEmail, adminRole, handleLogout } = useAdminData();

  const navItems = [
    {
      href: "/admin",
      exact: true,
      label: "Dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      href: "/admin/hackathons",
      label: "Hackathons",
      icon: Trophy,
      badge: stats.hackathons || null,
    },
    {
      href: "/admin/users",
      label: "User Profiles",
      icon: UserCheck,
      badge: stats.users || null,
    },
    {
      href: "/admin/teams",
      label: "Student Teams",
      icon: Users,
      badge: stats.teams || null,
    },
    {
      href: "/admin/registrations",
      label: "Registrations",
      icon: ClipboardList,
      badge: stats.registrations || null,
    },
    {
      href: "/admin/events",
      label: "Events & Workshops",
      icon: Calendar,
      badge: stats.events || null,
    },
    {
      href: "/admin/inquiries",
      label: "Campus Inquiries",
      icon: Building2,
      badge: stats.inquiries || null,
    },
    {
      href: "/admin/newsletters",
      label: "Subscribers",
      icon: Mail,
      badge: stats.newsletters || null,
    },
    {
      href: "/admin/logs",
      label: "Audit Logs",
      icon: ShieldAlert,
      badge: null,
    },
    {
      href: "/admin/settings",
      label: "Platform Settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 w-72 bg-white border-r border-slate-200/80 flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand header */}
        <div className="p-6 border-b border-slate-100 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <NexhackLogo />
            </Link>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-indigo-50 text-indigo-700 border border-indigo-200/80">
              OPS v3
            </span>
          </div>

          {/* Database indicator */}
          <div className="flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-slate-600 text-[11px] font-medium">Database</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  stats.isUsingMongo
                    ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse"
                    : "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                }`}
              />
              <span className="text-[11px] font-semibold text-slate-700">
                {stats.isUsingMongo ? "Atlas DB" : "In-Memory"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            Core Modules
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? "bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-200/60 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/80"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge !== null && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? "bg-indigo-100 text-indigo-700"
                          : "bg-slate-100 text-slate-600 border border-slate-200/80"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-indigo-600" />}
                </div>
              </Link>
            );
          })}
        </div>

        {/* User & Footer */}
        <div className="p-4 border-t border-slate-200/80 bg-slate-50/70">
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="truncate pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-1.5 py-0.2 rounded">
                  {adminRole}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Logged in</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 truncate mt-0.5" title={adminEmail}>
                {adminEmail || "Administrator"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign Out of Admin Console"
              className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-medium text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100/80 rounded-xl border border-slate-200 shadow-2xs transition-all"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </aside>
    </>
  );
}
