"use client";

import React, { useState } from "react";
import {
  ClipboardList,
  Search,
  Download,
  Trash2,
  ExternalLink,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { DbRegistration } from "@/lib/dbTypes";

interface RegistrationsTabProps {
  registrations: DbRegistration[];
  onUpdateStatus: (id: string, status: DbRegistration["status"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function RegistrationsTab({
  registrations,
  onUpdateStatus,
  onDelete,
}: RegistrationsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = registrations.filter((reg) => {
    const matchesStatus = statusFilter === "All" || reg.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      reg.fullName.toLowerCase().includes(q) ||
      reg.email.toLowerCase().includes(q) ||
      reg.collegeOrSchool.toLowerCase().includes(q) ||
      (reg.teamName || "").toLowerCase().includes(q) ||
      reg.eventOrHackathon.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleExportCSV = () => {
    if (filtered.length === 0) return;

    const headers = [
      "ID",
      "Full Name",
      "Email",
      "Phone",
      "College / School",
      "Degree / Grade",
      "Event / Hackathon",
      "Role",
      "Team Name",
      "Status",
      "Created At",
    ];

    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email}"`,
      `"${r.phone || ""}"`,
      `"${r.collegeOrSchool.replace(/"/g, '""')}"`,
      `"${r.degreeOrGrade || ""}"`,
      `"${r.eventOrHackathon.replace(/"/g, '""')}"`,
      `"${r.role}"`,
      `"${r.teamName || ""}"`,
      `"${r.status}"`,
      `"${new Date(r.createdAt).toISOString()}"`,
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `nexhack_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete registration for "${name}"?`)) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Confirmed", "Approved", "Waitlisted", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status}
              {status === "All" && ` (${registrations.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant, college, event..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 border border-slate-700 flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0"
            title="Export filtered registrations to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
          <ClipboardList className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Registrations Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search query or filters."
              : "Participant registrations submitted through the public portal will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-slate-900/60 border border-slate-800/80">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">College / Degree</th>
                <th className="p-4">Event / Hackathon</th>
                <th className="p-4">Team</th>
                <th className="p-4">Status</th>
                <th className="p-4">Links</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-200">{reg.fullName}</p>
                    <p className="text-slate-400 text-[11px]">{reg.email}</p>
                    {reg.phone && <p className="text-slate-500 text-[10px]">{reg.phone}</p>}
                  </td>

                  <td className="p-4">
                    <p className="text-slate-300 font-medium">{reg.collegeOrSchool}</p>
                    <p className="text-slate-500 text-[11px]">{reg.degreeOrGrade || "Student"}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-medium">
                      {reg.eventOrHackathon}
                    </span>
                    <p className="text-slate-500 text-[10px] mt-1">{reg.role}</p>
                  </td>

                  <td className="p-4 text-slate-300">
                    {reg.teamName ? (
                      <span className="font-medium text-slate-200">{reg.teamName}</span>
                    ) : (
                      <span className="text-slate-500 italic">Solo</span>
                    )}
                  </td>

                  <td className="p-4">
                    <select
                      value={reg.status}
                      onChange={(e) =>
                        onUpdateStatus(reg.id, e.target.value as DbRegistration["status"])
                      }
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                        reg.status === "Approved" || reg.status === "Confirmed"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                          : reg.status === "Waitlisted"
                          ? "bg-amber-500/10 text-amber-400 border-amber-500/30"
                          : "bg-rose-500/10 text-rose-400 border-rose-500/30"
                      }`}
                    >
                      <option value="Confirmed" className="bg-slate-900 text-white">Confirmed</option>
                      <option value="Approved" className="bg-slate-900 text-white">Approved</option>
                      <option value="Waitlisted" className="bg-slate-900 text-white">Waitlisted</option>
                      <option value="Cancelled" className="bg-slate-900 text-white">Cancelled</option>
                    </select>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {reg.githubUrl && (
                        <a
                          href={reg.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-white"
                          title="GitHub Profile"
                        >
                          <GitHubIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {reg.linkedinUrl && (
                        <a
                          href={reg.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-blue-400"
                          title="LinkedIn Profile"
                        >
                          <LinkedInIcon className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(reg.id, reg.fullName)}
                      disabled={deletingId === reg.id}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      title="Delete Application"
                    >
                      {deletingId === reg.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="w-3.5 h-3.5" />
                      )}
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
