"use client";

import React, { useState, useMemo } from "react";
import {
  ClipboardList,
  Search,
  Download,
  Trash2,
  Filter,
  Loader2,
  Trophy,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { DbRegistration, DbHackathon } from "@/lib/dbTypes";
import { fmtDate } from "@/lib/dateUtils";

interface RegistrationsTabProps {
  registrations: DbRegistration[];
  hackathons: DbHackathon[];
  onUpdateStatus: (id: string, status: DbRegistration["status"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RegistrationsTab({
  registrations,
  hackathons,
  onUpdateStatus,
  onDelete,
}: RegistrationsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [hackathonFilter, setHackathonFilter] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // id → name map for display
  const hackathonMap = useMemo(() => {
    const m: Record<string, string> = {};
    hackathons.forEach((h) => { m[h.id] = h.name; });
    return m;
  }, [hackathons]);

  const filtered = useMemo(() => {
    return registrations.filter((reg) => {
      if (statusFilter !== "All" && reg.status !== statusFilter) return false;
      if (hackathonFilter !== "All" && reg.hackathonId !== hackathonFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          reg.fullName.toLowerCase().includes(q) ||
          reg.email.toLowerCase().includes(q) ||
          reg.collegeOrSchool.toLowerCase().includes(q) ||
          (reg.teamName || "").toLowerCase().includes(q) ||
          reg.eventOrHackathon.toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [registrations, statusFilter, hackathonFilter, searchQuery]);

  const handleExportCSV = () => {
    if (filtered.length === 0) return;
    const headers = [
      "ID", "Full Name", "Email", "Phone",
      "College / School", "Degree / Grade",
      "Hackathon ID", "Event / Hackathon",
      "Registration Type", "Team Name", "Team ID",
      "Role", "Status", "Created At",
    ];
    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone || ""}"`,
      `"${r.collegeOrSchool.replace(/"/g, '""')}"`,
      `"${r.degreeOrGrade || ""}"`,
      `"${r.hackathonId || ""}"`,
      `"${r.eventOrHackathon.replace(/"/g, '""')}"`,
      `"${r.registrationType || "individual"}"`,
      `"${r.teamName || ""}"`,
      `"${r.teamId || ""}"`,
      `"${r.role}"`,
      `"${r.status}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const suffix = hackathonFilter !== "All"
      ? `_${(hackathonMap[hackathonFilter] || hackathonFilter).replace(/\s+/g, "_")}`
      : "";
    a.setAttribute("download", `nexhack_registrations${suffix}_${Date.now()}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete registration for "${name}"?`)) return;
    setDeletingId(id);
    try { await onDelete(id); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="space-y-5">

      {/* ── Control bar ── */}
      <div className="flex flex-col gap-3 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">

        {/* Hackathon filter buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span className="text-xs font-semibold text-slate-700 mr-1">Filter by hackathon:</span>
          <button
            onClick={() => setHackathonFilter("All")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              hackathonFilter === "All"
                ? "bg-indigo-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            All ({registrations.length})
          </button>
          {hackathons.map((h) => {
            const count = registrations.filter((r) => r.hackathonId === h.id).length;
            return (
              <button
                key={h.id}
                onClick={() => setHackathonFilter(h.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  hackathonFilter === h.id
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {h.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Status filter + search + export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            {["All", "Confirmed", "Approved", "Waitlisted", "Cancelled"].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-slate-800 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {s}
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
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
            <button
              onClick={handleExportCSV}
              disabled={filtered.length === 0}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              CSV
            </button>
          </div>
        </div>

        {/* Active filter summary */}
        {(hackathonFilter !== "All" || statusFilter !== "All" || searchQuery) && (
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>
              Showing <span className="font-bold text-slate-800">{filtered.length}</span>{" "}
              result{filtered.length !== 1 ? "s" : ""}
            </span>
            {hackathonFilter !== "All" && (
              <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                {hackathonMap[hackathonFilter] || hackathonFilter}
              </span>
            )}
            <button
              onClick={() => { setHackathonFilter("All"); setStatusFilter("All"); setSearchQuery(""); }}
              className="ml-auto text-xs text-blue-600 hover:underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>

      {/* ── Table ── */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Registrations Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || statusFilter !== "All" || hackathonFilter !== "All"
              ? "Try adjusting your filters."
              : "Registrations submitted through the public portal will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">College</th>
                <th className="p-4">Hackathon</th>
                <th className="p-4">Type / Team</th>
                <th className="p-4">Status</th>
                <th className="p-4">Links</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">

                  {/* Applicant */}
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{reg.fullName}</p>
                    <p className="text-slate-500 text-[11px]">{reg.email}</p>
                    {reg.phone && <p className="text-slate-400 text-[10px]">{reg.phone}</p>}
                    <p className="text-slate-400 text-[10px] mt-0.5">
                      {fmtDate(reg.createdAt)}
                    </p>
                  </td>

                  {/* College */}
                  <td className="p-4">
                    <p className="text-slate-800 font-medium">{reg.collegeOrSchool}</p>
                    <p className="text-slate-500 text-[11px]">{reg.degreeOrGrade || "Student"}</p>
                  </td>

                  {/* Hackathon */}
                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                      {hackathonMap[reg.hackathonId || ""] || reg.eventOrHackathon}
                    </span>
                    {reg.hackathonId && (
                      <p className="text-slate-400 text-[10px] mt-0.5 font-mono">{reg.hackathonId}</p>
                    )}
                  </td>

                  {/* Type / Team */}
                  <td className="p-4">
                    <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold mb-1 ${
                      reg.registrationType === "team"
                        ? "bg-purple-50 text-purple-700 border border-purple-200"
                        : "bg-slate-50 text-slate-600 border border-slate-200"
                    }`}>
                      {reg.registrationType === "team" ? "Team" : "Individual"}
                    </span>
                    {reg.teamName && (
                      <p className="text-slate-700 font-medium text-[11px]">{reg.teamName}</p>
                    )}
                    {reg.participatingMemberIds && reg.participatingMemberIds.length > 0 && (
                      <p className="text-slate-400 text-[10px]">
                        {reg.participatingMemberIds.length} members
                      </p>
                    )}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        onUpdateStatus(reg.id, e.target.value as DbRegistration["status"])
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                        reg.status === "Approved" || reg.status === "Confirmed"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : reg.status === "Waitlisted"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}
                    >
                      <option value="Confirmed" className="bg-white text-slate-900">Confirmed</option>
                      <option value="Approved" className="bg-white text-slate-900">Approved</option>
                      <option value="Waitlisted" className="bg-white text-slate-900">Waitlisted</option>
                      <option value="Cancelled" className="bg-white text-slate-900">Cancelled</option>
                    </select>
                  </td>

                  {/* Links */}
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {reg.githubUrl && (
                        <a href={reg.githubUrl} target="_blank" rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-slate-800" title="GitHub">
                          <GitHubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {reg.linkedinUrl && (
                        <a href={reg.linkedinUrl} target="_blank" rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-blue-600" title="LinkedIn">
                          <LinkedInIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Delete */}
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(reg.id, reg.fullName)}
                      disabled={deletingId === reg.id}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                      title="Delete registration"
                    >
                      {deletingId === reg.id
                        ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        : <Trash2 className="w-3.5 h-3.5" />
                      }
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
