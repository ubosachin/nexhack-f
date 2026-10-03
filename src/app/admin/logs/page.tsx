"use client";

import React, { useState } from "react";
import { ShieldAlert, Clock, User, Activity, Search } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";

export default function AdminLogsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { logs } = useAdminData();

  const filteredLogs = logs.filter((log) => {
    const q = searchQuery.toLowerCase();
    return (
      log.action.toLowerCase().includes(q) ||
      log.target.toLowerCase().includes(q) ||
      (log.performedBy || "").toLowerCase().includes(q)
    );
  });

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Info & Search Top Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Chronological ledger of administrative operations, logins, and mutations
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by action, target, or admin..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Logs list */}
        {filteredLogs.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
            <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Audit Records Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No logs match your search keywords."
                : "System logs will automatically record when mutations take place."}
            </p>
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-bold text-slate-900 truncate">{log.action}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                      Target: <span className="text-slate-700 font-mono">{log.target}</span>
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-600 font-medium">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>{log.performedBy || "Admin"}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 text-[10px] text-slate-400 mt-0.5">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
