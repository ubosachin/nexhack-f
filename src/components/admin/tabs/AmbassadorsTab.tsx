"use client";

import React, { useState, useMemo } from "react";
import {
  Star,
  Search,
  Trash2,
  Loader2,
  Download,
  Phone,
  Mail,
  Building2,
  MapPin,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import type { DbAmbassadorApplication } from "@/lib/dbTypes";
import { fmtDate } from "@/lib/dateUtils";

interface AmbassadorsTabProps {
  applications: DbAmbassadorApplication[];
  onUpdateStatus: (id: string, status: DbAmbassadorApplication["status"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS_STYLES: Record<DbAmbassadorApplication["status"], string> = {
  Pending:     "bg-amber-50 text-amber-700 border-amber-200",
  Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  Approved:    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected:    "bg-rose-50 text-rose-600 border-rose-200",
};

export function AmbassadorsTab({ applications, onUpdateStatus, onDelete }: AmbassadorsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      if (statusFilter !== "All" && a.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.fullName.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q) ||
          a.college.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [applications, statusFilter, searchQuery]);

  const counts = useMemo(() => ({
    All: applications.length,
    Pending: applications.filter((a) => a.status === "Pending").length,
    Shortlisted: applications.filter((a) => a.status === "Shortlisted").length,
    Approved: applications.filter((a) => a.status === "Approved").length,
    Rejected: applications.filter((a) => a.status === "Rejected").length,
  }), [applications]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "ID", "Full Name", "Email", "Phone",
      "College", "City", "Year", "Course",
      "LinkedIn", "Why Ambassador", "Status", "Applied At",
    ];
    const rows = filtered.map((a) => [
      `"${a.id}"`,
      `"${a.fullName.replace(/"/g, '""')}"`,
      `"${a.email}"`,
      `"${a.phone}"`,
      `"${a.college.replace(/"/g, '""')}"`,
      `"${a.city}"`,
      `"${a.yearOfStudy}"`,
      `"${a.course.replace(/"/g, '""')}"`,
      `"${a.linkedinUrl || ""}"`,
      `"${a.whyAmbassador.replace(/"/g, '""')}"`,
      `"${a.status}"`,
      `"${new Date(a.createdAt).toISOString()}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.setAttribute("download", `nexhack_ambassadors_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete application from "${name}"?`)) return;
    setDeletingId(id);
    try { await onDelete(id); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-5">

      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {(["All", "Pending", "Shortlisted", "Approved", "Rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === s
                  ? "bg-purple-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {s} ({counts[s as keyof typeof counts]})
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-60">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, email, college…"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-purple-500"
            />
          </div>
          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
        </div>
      </div>

      {/* Cards */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Applications Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your filters."
              : "Campus ambassador applications will appear here once submitted."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm hover:border-slate-300 transition-all overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start gap-4 p-5">
                {/* Avatar initial */}
                <div className="shrink-0 w-11 h-11 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center text-purple-700 font-black text-lg">
                  {app.fullName.charAt(0).toUpperCase()}
                </div>

                {/* Main info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{app.fullName}</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${STATUS_STYLES[app.status]}`}>
                      {app.status}
                    </span>
                    <span className="text-[10px] text-slate-400 ml-auto">
                      {fmtDate(app.createdAt)}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-slate-400" /> {app.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" /> {app.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" /> {app.college}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-slate-400" /> {app.city}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="w-3 h-3 text-slate-400" /> {app.yearOfStudy} · {app.course}
                    </span>
                    {app.linkedinUrl && (
                      <a
                        href={app.linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" /> LinkedIn
                      </a>
                    )}
                  </div>

                  {/* Why ambassador — expandable */}
                  <div>
                    <p className={`text-xs text-slate-600 leading-relaxed ${expandedId === app.id ? "" : "line-clamp-2"}`}>
                      {app.whyAmbassador}
                    </p>
                    {app.whyAmbassador.length > 120 && (
                      <button
                        onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                        className="text-[11px] text-purple-600 hover:text-purple-800 font-semibold mt-0.5 cursor-pointer"
                      >
                        {expandedId === app.id ? "Show less" : "Read more"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex sm:flex-col items-center gap-2 shrink-0">
                  <select
                    value={app.status}
                    onChange={(e) => onUpdateStatus(app.id, e.target.value as DbAmbassadorApplication["status"])}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none transition-colors bg-white border-slate-200 text-slate-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Shortlisted">Shortlisted</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => handleDelete(app.id, app.fullName)}
                    disabled={deletingId === app.id}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    title="Delete application"
                  >
                    {deletingId === app.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />
                    }
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
