"use client";

import React, { useState } from "react";
import {
  Settings,
  Database,
  Shield,
  Server,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Layers,
  LogOut,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";

export default function AdminSettingsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  const {
    stats,
    hackathons,
    teams,
    users,
    registrations,
    events,
    inquiries,
    newsletters,
    logs,
    adminEmail,
    adminRole,
    fetchData,
    handleLogout,
  } = useAdminData();

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncMsg("");
    try {
      await fetchData();
      setSyncMsg("All database collections successfully synchronized.");
      setTimeout(() => setSyncMsg(""), 3500);
    } catch {
      setSyncMsg("Error refreshing database cache.");
    } finally {
      setIsSyncing(false);
    }
  };

  const collections = [
    { name: "hackathons", count: hackathons.length, desc: "Flagship editions & tracks" },
    { name: "user_profiles", count: users.length, desc: "Registered user profiles & RBAC" },
    { name: "teams", count: teams.length, desc: "Student squads & member rosters" },
    { name: "registrations", count: registrations.length, desc: "Event applications & status" },
    { name: "events", count: events.length, desc: "Workshops & keynote sessions" },
    { name: "campus_inquiries", count: inquiries.length, desc: "Institutional partnership requests" },
    { name: "newsletters", count: newsletters.length, desc: "Subscribers & mailing list" },
    { name: "admin_logs", count: logs.length, desc: "Audit trail operations" },
  ];

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />

      <main className="flex-1 p-4 sm:p-8 space-y-8 max-w-7xl w-full mx-auto">
        {/* Sync Success Alert */}
        {syncMsg && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{syncMsg}</span>
          </div>
        )}

        {/* Database Health Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Database Engine & Atlas Sync</h3>
                <p className="text-xs text-slate-500">
                  Real-time document storage for all platform features
                </p>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 shadow-2xs flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              <span>{isSyncing ? "Syncing..." : "Force Cache Resync"}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Connection Status
              </span>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    stats.isUsingMongo
                      ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                      : "bg-amber-500"
                  }`}
                />
                <span className="text-sm font-bold text-slate-900">
                  {stats.isUsingMongo ? "MongoDB Atlas (Online)" : "In-Memory Fallback"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                {stats.isUsingMongo
                  ? "Connected securely to remote Atlas cluster."
                  : "Using ephemeral in-memory storage fallback."}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Database Target
              </span>
              <div className="text-sm font-bold text-slate-900 truncate font-mono">
                nexhack.b3vtgqi.mongodb.net
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Multi-region production cluster.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                Total Documents
              </span>
              <div className="text-sm font-bold text-slate-900">
                {collections.reduce((sum, c) => sum + c.count, 0)} records
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Aggregated across 8 active collections.
              </p>
            </div>
          </div>
        </div>

        {/* Database Collections Table */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">MongoDB Collections</h3>
          </div>

          <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden text-xs">
            {collections.map((col, idx) => (
              <div
                key={idx}
                className="p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
              >
                <div>
                  <span className="font-mono font-bold text-indigo-700">{col.name}</span>
                  <span className="text-slate-500 ml-2 hidden sm:inline">• {col.desc}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{col.count}</span>
                  <span className="text-slate-400">docs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Session & Security */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-600" />
              <h3 className="text-sm font-bold text-slate-900">Security & Access Privileges</h3>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Current Session</p>
                <p className="text-slate-500 text-[11px]">{adminEmail || "admin@nexhack.com"}</p>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200 uppercase">
                {adminRole}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800">Role-Based Database Verification</p>
                <p className="text-slate-500 text-[11px]">
                  Real-time role lookup validates <code className="font-mono">role === "admin"</code> in MongoDB.
                </p>
              </div>
              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Active
              </span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out of Console</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}
