"use client";

import React from "react";
import { ShieldAlert, Clock, User, Activity } from "lucide-react";
import { DbAdminLog } from "@/lib/dbTypes";

interface AuditLogsTabProps {
  logs: DbAdminLog[];
}

export function AuditLogsTab({ logs }: AuditLogsTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
        <p className="text-xs text-slate-500">
          Immutable chronological activity ledger of administrative events, logins, and mutations
        </p>
      </div>

      {logs.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
          <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Audit Records</h3>
          <p className="text-xs text-slate-500 mt-1">
            System logs will automatically be recorded when actions take place.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl bg-white border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
          {logs.map((log) => (
            <div key={log.id} className="p-4 flex items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors">
              <div className="flex items-center gap-3 truncate">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="truncate">
                  <p className="text-xs font-bold text-slate-900 truncate">
                    {log.action}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate">
                    Target: <span className="text-slate-700 font-mono">{log.target}</span>
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="flex items-center justify-end gap-1.5 text-[11px] text-slate-600">
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
    </div>
  );
}
