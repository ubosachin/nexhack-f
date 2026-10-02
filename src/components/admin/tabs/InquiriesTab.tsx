"use client";

import React, { useState } from "react";
import {
  Building2,
  Mail,
  MapPin,
  Users,
  Search,
  Trash2,
  CheckCircle2,
  Clock,
  Archive,
  Loader2,
} from "lucide-react";
import { DbCampusInquiry } from "@/lib/dbTypes";

interface InquiriesTabProps {
  inquiries: DbCampusInquiry[];
  onUpdateStatus: (id: string, status: DbCampusInquiry["status"]) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function InquiriesTab({ inquiries, onUpdateStatus, onDelete }: InquiriesTabProps) {
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    const matchesFilter = filter === "All" || inq.status === filter;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      inq.institutionName.toLowerCase().includes(q) ||
      inq.contactName.toLowerCase().includes(q) ||
      inq.contactEmail.toLowerCase().includes(q) ||
      inq.city.toLowerCase().includes(q) ||
      inq.partnershipType.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete inquiry from "${name}"?`)) return;
    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {["All", "Pending", "Contacted", "Approved", "Archived"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === status
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              {status}
              {status === "All" && ` (${inquiries.length})`}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search university, contact..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Inquiries Cards */}
      {filtered.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">No Inquiries Found</h3>
          <p className="text-xs text-slate-400 mt-1">
            {searchQuery || filter !== "All"
              ? "No campus partnership requests match the filter."
              : "Inquiries submitted via the Campus page will appear here."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
                      {inq.partnershipType}
                    </span>
                    <h4 className="text-base font-bold text-white mt-0.5">
                      {inq.institutionName}
                    </h4>
                  </div>

                  <select
                    value={inq.status}
                    onChange={(e) =>
                      onUpdateStatus(inq.id, e.target.value as DbCampusInquiry["status"])
                    }
                    className={`px-2.5 py-1 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none transition-colors ${
                      inq.status === "Approved"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : inq.status === "Contacted"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
                        : inq.status === "Archived"
                        ? "bg-slate-800 text-slate-400 border-slate-700"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    <option value="Pending" className="bg-slate-900 text-white">Pending</option>
                    <option value="Contacted" className="bg-slate-900 text-white">Contacted</option>
                    <option value="Approved" className="bg-slate-900 text-white">Approved</option>
                    <option value="Archived" className="bg-slate-900 text-white">Archived</option>
                  </select>
                </div>

                {/* Contact details */}
                <div className="space-y-1.5 my-3 text-xs text-slate-300">
                  <p className="flex items-center gap-2">
                    <span className="text-slate-500">Contact:</span>
                    <span className="font-semibold text-slate-200">{inq.contactName}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500" />
                    <a
                      href={`mailto:${inq.contactEmail}`}
                      className="text-indigo-400 hover:underline truncate"
                    >
                      {inq.contactEmail}
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inq.city}</span>
                    <span className="text-slate-500">•</span>
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                    <span>{inq.expectedStudents}</span>
                  </p>
                </div>

                {/* Notes */}
                {inq.notes && (
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 text-xs text-slate-400 leading-relaxed mb-4">
                    "{inq.notes}"
                  </div>
                )}
              </div>

              {/* Bottom */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                <span>Received {new Date(inq.createdAt).toLocaleDateString()}</span>
                <button
                  onClick={() => handleDelete(inq.id, inq.institutionName)}
                  disabled={deletingId === inq.id}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1.5"
                  title="Delete Inquiry"
                >
                  {deletingId === inq.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
