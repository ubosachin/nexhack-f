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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Confirmed", "Approved", "Waitlisted", "Cancelled"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                statusFilter === status
                  ? "bg-indigo-600 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {status}
              {status === "All" && ` (${registrations.length})`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search participant, college, event..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <button
            onClick={handleExportCSV}
            disabled={filtered.length === 0}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
            title="Export filtered registrations to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
          <ClipboardList className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No Registrations Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            {searchQuery || statusFilter !== "All"
              ? "Try adjusting your search query or filters."
              : "Participant registrations submitted through the public portal will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white border border-slate-200 shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                <th className="p-4">Applicant</th>
                <th className="p-4">College / Degree</th>
                <th className="p-4">Event / Hackathon</th>
                <th className="p-4">Team</th>
                <th className="p-4">Status</th>
                <th className="p-4">Links</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-slate-900">{reg.fullName}</p>
                    <p className="text-slate-500 text-[11px]">{reg.email}</p>
                    {reg.phone && <p className="text-slate-400 text-[10px]">{reg.phone}</p>}
                  </td>

                  <td className="p-4">
                    <p className="text-slate-800 font-medium">{reg.collegeOrSchool}</p>
                    <p className="text-slate-500 text-[11px]">{reg.degreeOrGrade || "Student"}</p>
                  </td>

                  <td className="p-4">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
                      {reg.eventOrHackathon}
                    </span>
                    <p className="text-slate-500 text-[10px] mt-1">{reg.role}</p>
                  </td>

                  <td className="p-4 text-slate-700">
                    {reg.teamName ? (
                      <span className="font-medium text-slate-900">{reg.teamName}</span>
                    ) : (
                      <span className="text-slate-400 italic">Solo</span>
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

                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      {reg.githubUrl && (
                        <a
                          href={reg.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-400 hover:text-slate-800"
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
                          className="p-1 rounded text-slate-400 hover:text-blue-600"
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
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
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
