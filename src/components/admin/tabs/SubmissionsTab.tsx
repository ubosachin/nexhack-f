"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, Loader2, ExternalLink, FileText, Users, ChevronDown, ChevronUp } from "lucide-react";
import type { DbSubmission, DbRound, DbHackathon } from "@/lib/dbTypes";

interface SubmissionsTabProps {
  hackathons: DbHackathon[];
}

export function SubmissionsTab({ hackathons }: SubmissionsTabProps) {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [selectedRoundId, setSelectedRoundId] = useState<string>("all");
  const [rounds, setRounds] = useState<DbRound[]>([]);
  const [submissions, setSubmissions] = useState<DbSubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Load rounds when hackathon changes
  useEffect(() => {
    if (!selectedHackathonId) { setRounds([]); setSubmissions([]); return; }
    fetch(`/api/admin/hackathons/${selectedHackathonId}/rounds`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setRounds(d.rounds); });
  }, [selectedHackathonId]);

  // Load submissions when hackathon or round filter changes
  useEffect(() => {
    if (!selectedHackathonId) { setSubmissions([]); return; }
    setLoading(true);
    const url = selectedRoundId !== "all"
      ? `/api/admin/submissions?hackathonId=${selectedHackathonId}&roundId=${selectedRoundId}`
      : `/api/admin/submissions?hackathonId=${selectedHackathonId}`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => { if (d.success) setSubmissions(d.submissions); })
      .finally(() => setLoading(false));
  }, [selectedHackathonId, selectedRoundId]);

  const filtered = useMemo(() => {
    return submissions.filter((s) => {
      if (statusFilter !== "All" && s.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          (s.teamName || "").toLowerCase().includes(q) ||
          s.userId.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [submissions, statusFilter, searchQuery]);

  const getRoundName = (roundId: string) => rounds.find((r) => r.id === roundId)?.name || roundId;

  const handleExportCSV = () => {
    const headers = ["ID", "Round", "Team", "User ID", "GitHub", "Demo", "Video", "Status", "Submitted At"];
    const rows = filtered.map((s) => [
      `"${s.id}"`, `"${getRoundName(s.roundId)}"`, `"${s.teamName || ""}"`,
      `"${s.userId}"`, `"${s.githubUrl || ""}"`, `"${s.demoUrl || ""}"`,
      `"${s.videoUrl || ""}"`, `"${s.status}"`, `"${s.submittedAt || ""}"`,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url;
    a.setAttribute("download", `submissions_${selectedHackathonId}_${Date.now()}.csv`);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  const statusColors: Record<string, string> = {
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    Submitted: "bg-blue-50 text-blue-700 border-blue-200",
    "Under Review": "bg-amber-50 text-amber-700 border-amber-200",
    Evaluated: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Hackathon</label>
            <select
              value={selectedHackathonId}
              onChange={(e) => { setSelectedHackathonId(e.target.value); setSelectedRoundId("all"); }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="">Select a hackathon…</option>
              {hackathons.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Round</label>
            <select
              value={selectedRoundId}
              onChange={(e) => setSelectedRoundId(e.target.value)}
              disabled={!selectedHackathonId}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-50"
            >
              <option value="all">All Rounds</option>
              {rounds.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Status</label>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer">
              {["All", "Draft", "Submitted", "Under Review", "Evaluated"].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search team or user…" className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-500" />
          </div>
          <button onClick={handleExportCSV} disabled={filtered.length === 0} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer">
            <Download className="w-3.5 h-3.5" /> CSV
          </button>
          {selectedHackathonId && <span className="text-xs text-slate-500 font-semibold ml-auto">{filtered.length} submission{filtered.length !== 1 ? "s" : ""}</span>}
        </div>
      </div>

      {/* Table */}
      {!selectedHackathonId ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">Select a hackathon to view submissions</p>
        </div>
      ) : loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : filtered.length === 0 ? (
        <div className="py-14 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-700">No submissions found</p>
          <p className="text-xs text-slate-400 mt-1">Adjust filters or wait for participants to submit.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filtered.map((sub) => (
            <div key={sub.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm overflow-hidden transition-all">
              <div className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 shrink-0">
                  {sub.teamId ? <Users className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">{sub.teamName || `User: ${sub.userId.slice(-8)}`}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColors[sub.status] || "bg-slate-100 text-slate-600 border-slate-200"}`}>{sub.status}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {getRoundName(sub.roundId)} · {sub.submittedAt ? `Submitted ${new Date(sub.submittedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}` : "Not submitted"}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {sub.githubUrl && <a href={sub.githubUrl} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"><ExternalLink className="w-3 h-3" />GitHub</a>}
                  {sub.demoUrl && <a href={sub.demoUrl} target="_blank" rel="noreferrer" className="px-2.5 py-1 rounded-lg border border-slate-200 text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1"><ExternalLink className="w-3 h-3" />Demo</a>}
                  <button onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer">
                    {expandedId === sub.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {expandedId === sub.id && (
                <div className="px-5 pb-5 pt-3 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                  {sub.textContent && (
                    <div><span className="font-semibold text-slate-800 block mb-1">Project Description</span><p className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{sub.textContent}</p></div>
                  )}
                  {sub.videoUrl && <div><span className="font-semibold text-slate-800">Video: </span><a href={sub.videoUrl} target="_blank" rel="noreferrer" className="text-blue-600 underline">{sub.videoUrl}</a></div>}
                  {sub.customFieldValues && Object.keys(sub.customFieldValues).length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">Custom Fields</span>
                      <div className="space-y-1">
                        {Object.entries(sub.customFieldValues).map(([k, v]) => (
                          <div key={k}><span className="font-medium text-slate-700">{k}:</span> {v}</div>
                        ))}
                      </div>
                    </div>
                  )}
                  {sub.files && sub.files.length > 0 && (
                    <div>
                      <span className="font-semibold text-slate-800 block mb-1">Files ({sub.files.length})</span>
                      <div className="flex flex-wrap gap-2">
                        {sub.files.map((f, i) => (
                          <a key={i} href={f.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100">
                            <FileText className="w-3 h-3" />{f.fileName} ({(f.fileSize / 1024).toFixed(0)} KB)
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                  <p className="text-slate-400">Submission ID: {sub.id} · Last updated: {new Date(sub.lastUpdatedAt).toLocaleString("en-IN")}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
