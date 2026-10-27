"use client";

import React, { useState, useEffect } from "react";
import { Key, Plus, Trash2, Loader2, Copy, CheckCircle2, ToggleLeft, ToggleRight, Download } from "lucide-react";
import type { DbVerificationCode, DbHackathon } from "@/lib/dbTypes";

interface CodesTabProps {
  hackathons: DbHackathon[];
}

export function CodesTab({ hackathons }: CodesTabProps) {
  const [selectedHackathonId, setSelectedHackathonId] = useState<string>("");
  const [codes, setCodes] = useState<DbVerificationCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Generate form
  const [genCount, setGenCount] = useState(1);
  const [genMaxUses, setGenMaxUses] = useState(1);
  const [genNote, setGenNote] = useState("");
  const [genExpiry, setGenExpiry] = useState("");

  const loadCodes = async () => {
    if (!selectedHackathonId) { setCodes([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hackathons/${selectedHackathonId}/codes`);
      const data = await res.json();
      if (data.success) setCodes(data.codes);
    } finally { setLoading(false); }
  };

  useEffect(() => { loadCodes(); }, [selectedHackathonId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackathonId) return;
    setGenerating(true); setError("");
    try {
      const res = await fetch(`/api/admin/hackathons/${selectedHackathonId}/codes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ count: genCount, maxUses: genMaxUses, note: genNote || undefined, expiresAt: genExpiry ? new Date(genExpiry).toISOString() : undefined }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      loadCodes();
      setGenNote(""); setGenExpiry("");
    } catch (err: any) { setError(err.message); }
    finally { setGenerating(false); }
  };

  const toggleActive = async (code: DbVerificationCode) => {
    await fetch(`/api/admin/hackathons/${selectedHackathonId}/codes/${code.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !code.isActive }),
    });
    loadCodes();
  };

  const handleDelete = async (code: DbVerificationCode) => {
    if (!window.confirm(`Delete code "${code.code}"?`)) return;
    setDeletingId(code.id);
    try {
      await fetch(`/api/admin/hackathons/${selectedHackathonId}/codes/${code.id}`, { method: "DELETE" });
      loadCodes();
    } finally { setDeletingId(null); }
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const exportCSV = () => {
    const headers = ["Code", "Max Uses", "Used Count", "Active", "Note", "Expires", "Created"];
    const rows = codes.map((c) => [`"${c.code}"`, c.maxUses, c.usedCount, c.isActive, `"${c.note || ""}"`, `"${c.expiresAt || ""}"`, `"${c.createdAt}"`]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.setAttribute("download", `codes_${selectedHackathonId}_${Date.now()}.csv`);
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  };

  return (
    <div className="space-y-5">
      {/* Hackathon selector */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">Select Hackathon</label>
        <select
          value={selectedHackathonId}
          onChange={(e) => setSelectedHackathonId(e.target.value)}
          className="w-full max-w-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="">Select…</option>
          {hackathons.map((h) => <option key={h.id} value={h.id}>{h.name}</option>)}
        </select>
      </div>

      {selectedHackathonId && (
        <>
          {/* Generate form */}
          <form onSubmit={handleGenerate} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2 mb-1">
              <Key className="w-4 h-4 text-indigo-500" />
              <h4 className="text-sm font-bold text-slate-900">Generate Verification Codes</h4>
            </div>
            {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{error}</div>}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Count</label>
                <input type="number" min={1} max={100} value={genCount} onChange={(e) => setGenCount(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Max Uses</label>
                <input type="number" min={0} value={genMaxUses} onChange={(e) => setGenMaxUses(Number(e.target.value))} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
                <p className="text-[10px] text-slate-400 mt-0.5">0 = unlimited</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Expiry (optional)</label>
                <input type="datetime-local" value={genExpiry} onChange={(e) => setGenExpiry(e.target.value)} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Note</label>
                <input type="text" value={genNote} onChange={(e) => setGenNote(e.target.value)} placeholder="e.g. Batch A" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={generating} className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 disabled:opacity-50 cursor-pointer">
                {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                Generate {genCount > 1 ? `${genCount} Codes` : "Code"}
              </button>
              {codes.length > 0 && (
                <button type="button" onClick={exportCSV} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                  <Download className="w-3.5 h-3.5" /> Export CSV
                </button>
              )}
              <span className="text-xs text-slate-500 ml-auto">{codes.length} code{codes.length !== 1 ? "s" : ""} total</span>
            </div>
          </form>

          {/* Codes list */}
          {loading ? (
            <div className="flex items-center justify-center py-10"><Loader2 className="w-5 h-5 animate-spin text-slate-400" /></div>
          ) : codes.length === 0 ? (
            <div className="py-14 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
              <Key className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">No codes yet</p>
              <p className="text-xs text-slate-400 mt-1">Generate codes above to distribute to Unstop participants.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <table className="w-full text-xs text-left border-collapse">
                <thead><tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold tracking-wider">
                  <th className="p-3">Code</th>
                  <th className="p-3">Uses</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Note</th>
                  <th className="p-3">Expires</th>
                  <th className="p-3 text-right">Actions</th>
                </tr></thead>
                <tbody className="divide-y divide-slate-100">
                  {codes.map((code) => (
                    <tr key={code.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900 text-sm tracking-wider">{code.code}</span>
                          <button onClick={() => copyCode(code.code, code.id)} className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer rounded">
                            {copiedId === code.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                      <td className="p-3 text-slate-700">{code.usedCount} / {code.maxUses === 0 ? "∞" : code.maxUses}</td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border ${code.isActive ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"}`}>
                          {code.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="p-3 text-slate-500">{code.note || "—"}</td>
                      <td className="p-3 text-slate-500">{code.expiresAt ? new Date(code.expiresAt).toLocaleDateString("en-IN") : "—"}</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button onClick={() => toggleActive(code)} title={code.isActive ? "Deactivate" : "Activate"} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer">
                            {code.isActive ? <ToggleRight className="w-4 h-4 text-emerald-500" /> : <ToggleLeft className="w-4 h-4" />}
                          </button>
                          <button onClick={() => handleDelete(code)} disabled={deletingId === code.id} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer disabled:opacity-50">
                            {deletingId === code.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
