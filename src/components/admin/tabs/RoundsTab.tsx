"use client";

import React, { useState, useEffect } from "react";
import {
  Plus, Trash2, Edit2, Loader2, ChevronDown, ChevronUp,
  Clock, CheckCircle2, AlertCircle, Eye, EyeOff, Save, X,
} from "lucide-react";
import type { DbRound, SubmissionType } from "@/lib/dbTypes";

interface RoundsTabProps {
  hackathonId: string;
  hackathonName: string;
}

const SUBMISSION_TYPES: { value: SubmissionType; label: string; hint: string }[] = [
  { value: "text", label: "Text / Description", hint: "Project summary, write-up, answers" },
  { value: "file", label: "File Upload", hint: "PDF, PPT, ZIP" },
  { value: "links", label: "Project Links", hint: "GitHub + live demo URL" },
  { value: "video", label: "Video Demo", hint: "YouTube / Drive link" },
  { value: "combined", label: "Combined (all types)", hint: "Text + file + links" },
];

const STATUS_OPTIONS: DbRound["status"][] = ["Upcoming", "Open", "Closed", "Completed"];

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";
const selectCls = `${inputCls} cursor-pointer`;

const EMPTY_FORM: Omit<DbRound, "id" | "hackathonId" | "createdAt" | "updatedAt"> = {
  name: "",
  description: "",
  instructions: "",
  roundNumber: 1,
  submissionType: "combined",
  acceptedFileTypes: ".pdf,.pptx,.zip,.docx",
  maxFileSizeMb: 25,
  maxSubmissionsPerTeam: 1,
  allowResubmission: false,
  startDate: "",
  deadline: "",
  evaluationCriteria: [],
  customFields: [],
  status: "Upcoming",
  isPublished: false,
  visibleToAll: true,
};

export function RoundsTab({ hackathonId, hackathonName }: RoundsTabProps) {
  const [rounds, setRounds] = useState<DbRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [editingRound, setEditingRound] = useState<DbRound | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadRounds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/hackathons/${hackathonId}/rounds`);
      const data = await res.json();
      if (data.success) setRounds(data.rounds);
    } catch { /* silent */ } finally { setLoading(false); }
  };

  useEffect(() => { loadRounds(); }, [hackathonId]);

  const set = (patch: Partial<typeof formData>) => setFormData((p) => ({ ...p, ...patch }));

  const openCreate = () => {
    setEditingRound(null);
    setFormData({ ...EMPTY_FORM, roundNumber: rounds.length + 1 });
    setShowForm(true);
    setError("");
  };

  const openEdit = (round: DbRound) => {
    setEditingRound(round);
    setFormData({
      name: round.name,
      description: round.description,
      instructions: round.instructions,
      roundNumber: round.roundNumber,
      submissionType: round.submissionType,
      acceptedFileTypes: round.acceptedFileTypes || ".pdf,.pptx,.zip",
      maxFileSizeMb: round.maxFileSizeMb ?? 25,
      maxSubmissionsPerTeam: round.maxSubmissionsPerTeam ?? 1,
      allowResubmission: round.allowResubmission,
      startDate: round.startDate ? round.startDate.slice(0, 16) : "",
      deadline: round.deadline ? round.deadline.slice(0, 16) : "",
      evaluationCriteria: round.evaluationCriteria || [],
      customFields: round.customFields || [],
      status: round.status,
      isPublished: round.isPublished,
      visibleToAll: round.visibleToAll,
    });
    setShowForm(true);
    setError("");
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setError("Round name is required."); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
        deadline: formData.deadline ? new Date(formData.deadline).toISOString() : undefined,
      };
      let res;
      if (editingRound) {
        res = await fetch(`/api/admin/hackathons/${hackathonId}/rounds/${editingRound.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      } else {
        res = await fetch(`/api/admin/hackathons/${hackathonId}/rounds`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      }
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to save round.");
      setShowForm(false);
      loadRounds();
    } catch (err: any) { setError(err.message); }
    finally { setSaving(false); }
  };

  const handleDelete = async (round: DbRound) => {
    if (!window.confirm(`Delete round "${round.name}" and all its submissions?`)) return;
    setDeletingId(round.id);
    try {
      await fetch(`/api/admin/hackathons/${hackathonId}/rounds/${round.id}`, { method: "DELETE" });
      loadRounds();
    } finally { setDeletingId(null); }
  };

  const togglePublish = async (round: DbRound) => {
    await fetch(`/api/admin/hackathons/${hackathonId}/rounds/${round.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished: !round.isPublished }),
    });
    loadRounds();
  };

  const statusColor = (s: DbRound["status"]) => ({
    Upcoming: "bg-amber-50 text-amber-700 border-amber-200",
    Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Closed: "bg-rose-50 text-rose-600 border-rose-200",
    Completed: "bg-slate-100 text-slate-600 border-slate-200",
  }[s]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Rounds — {hackathonName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{rounds.length} round{rounds.length !== 1 ? "s" : ""} configured</p>
        </div>
        <button onClick={openCreate} className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer shadow-sm">
          <Plus className="w-3.5 h-3.5" /> Add Round
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900">{editingRound ? `Edit: ${editingRound.name}` : "New Round"}</h4>
            <button onClick={() => setShowForm(false)} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          {error && <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">{error}</div>}
          <form id="round-form" onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Round Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => set({ name: e.target.value })} placeholder="e.g. Round 1 – Ideation" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Round #</label>
                <input type="number" min={1} value={formData.roundNumber} onChange={(e) => set({ roundNumber: Number(e.target.value) })} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
              <textarea rows={2} value={formData.description} onChange={(e) => set({ description: e.target.value })} placeholder="Brief overview of this round" className={`${inputCls} resize-none`} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Instructions</label>
              <textarea rows={3} value={formData.instructions} onChange={(e) => set({ instructions: e.target.value })} placeholder="Step-by-step instructions for participants..." className={`${inputCls} resize-none`} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Type</label>
                <select value={formData.submissionType} onChange={(e) => set({ submissionType: e.target.value as SubmissionType })} className={selectCls}>
                  {SUBMISSION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label} — {t.hint}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select value={formData.status} onChange={(e) => set({ status: e.target.value as DbRound["status"] })} className={selectCls}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {(formData.submissionType === "file" || formData.submissionType === "combined") && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Accepted File Types</label>
                  <input type="text" value={formData.acceptedFileTypes || ""} onChange={(e) => set({ acceptedFileTypes: e.target.value })} placeholder=".pdf,.pptx,.zip" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max File Size (MB)</label>
                  <input type="number" min={1} max={500} value={formData.maxFileSizeMb ?? 25} onChange={(e) => set({ maxFileSizeMb: Number(e.target.value) })} className={inputCls} />
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date</label>
                <input type="datetime-local" value={formData.startDate || ""} onChange={(e) => set({ startDate: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Submission Deadline</label>
                <input type="datetime-local" value={formData.deadline || ""} onChange={(e) => set({ deadline: e.target.value })} className={inputCls} />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.allowResubmission} onChange={(e) => set({ allowResubmission: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                <span className="font-semibold text-slate-700">Allow resubmission</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.isPublished} onChange={(e) => set({ isPublished: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                <span className="font-semibold text-slate-700">Published (visible to participants)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.visibleToAll} onChange={(e) => set({ visibleToAll: e.target.checked })} className="w-4 h-4 rounded text-indigo-600" />
                <span className="font-semibold text-slate-700">Visible to all registered participants</span>
              </label>
            </div>
          </form>
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 cursor-pointer">Cancel</button>
            <button form="round-form" type="submit" disabled={saving} className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl flex items-center gap-1.5 disabled:opacity-50 cursor-pointer">
              {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
              {editingRound ? "Update Round" : "Create Round"}
            </button>
          </div>
        </div>
      )}

      {/* Round cards */}
      {loading ? (
        <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : rounds.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No rounds yet</h3>
          <p className="text-xs text-slate-500 mt-1">Add the first round to start configuring submissions for this hackathon.</p>
          <button onClick={openCreate} className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer">Add Round</button>
        </div>
      ) : (
        <div className="space-y-3">
          {rounds.map((round) => (
            <div key={round.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-sm overflow-hidden transition-all">
              <div className="flex items-center gap-4 p-4">
                {/* Round number badge */}
                <div className="w-10 h-10 shrink-0 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-sm font-black text-indigo-700">
                  R{round.roundNumber}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-bold text-slate-900 truncate">{round.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor(round.status)}`}>{round.status}</span>
                    {round.isPublished
                      ? <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1"><Eye className="w-3 h-3" />Published</span>
                      : <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1"><EyeOff className="w-3 h-3" />Draft</span>}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{SUBMISSION_TYPES.find((t) => t.value === round.submissionType)?.label}{round.deadline ? ` · Deadline: ${new Date(round.deadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}` : ""}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => togglePublish(round)} title={round.isPublished ? "Unpublish" : "Publish"} className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
                    {round.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button onClick={() => openEdit(round)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(round)} disabled={deletingId === round.id} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-50">
                    {deletingId === round.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setExpandedId(expandedId === round.id ? null : round.id)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer">
                    {expandedId === round.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {expandedId === round.id && (
                <div className="px-5 pb-5 space-y-3 border-t border-slate-100 pt-3 text-xs text-slate-600">
                  {round.description && <p>{round.description}</p>}
                  {round.instructions && <div><span className="font-semibold text-slate-800">Instructions: </span>{round.instructions}</div>}
                  <div className="flex flex-wrap gap-4">
                    {round.startDate && <span><span className="font-semibold text-slate-800">Opens:</span> {new Date(round.startDate).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>}
                    {round.deadline && <span><span className="font-semibold text-slate-800">Deadline:</span> {new Date(round.deadline).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}</span>}
                    {round.acceptedFileTypes && <span><span className="font-semibold text-slate-800">Files:</span> {round.acceptedFileTypes} (max {round.maxFileSizeMb}MB)</span>}
                    <span><span className="font-semibold text-slate-800">Resubmission:</span> {round.allowResubmission ? "Allowed" : "Not allowed"}</span>
                    <span><span className="font-semibold text-slate-800">Visibility:</span> {round.visibleToAll ? "All registered" : "Advanced teams only"}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
