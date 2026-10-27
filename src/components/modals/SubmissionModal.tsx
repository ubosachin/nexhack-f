"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { X, Send, Loader2, CheckCircle2, AlertCircle, Link as LinkIcon, Video, FileText, Clock } from "lucide-react";
import type { DbRound, DbSubmission } from "@/lib/dbTypes";
import { fmtDateTime } from "@/lib/dateUtils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  hackathon: { id: string; name: string; bannerGradient?: string };
  round: DbRound | null;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";

export function SubmissionModal({ isOpen, onClose, hackathon, round }: Props) {
  const { data: session } = useSession();
  const [existing, setExisting] = useState<DbSubmission | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [textContent, setTextContent] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [customValues, setCustomValues] = useState<Record<string, string>>({});

  // Load existing submission
  useEffect(() => {
    if (!isOpen || !round || !session?.user?.id) return;
    setLoadingExisting(true);
    fetch(`/api/hackathons/${hackathon.id}/rounds/${round.id}/submit`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.submission) {
          const s = d.submission as DbSubmission;
          setExisting(s);
          setTextContent(s.textContent || "");
          setGithubUrl(s.githubUrl || "");
          setDemoUrl(s.demoUrl || "");
          setVideoUrl(s.videoUrl || "");
          setCustomValues(s.customFieldValues || {});
        }
      })
      .finally(() => setLoadingExisting(false));
  }, [isOpen, round?.id, session?.user?.id]);

  if (!isOpen || !round) return null;

  const grad = hackathon.bannerGradient || "from-indigo-600 to-blue-600";
  const type = round.submissionType;
  const needsText = type === "text" || type === "combined";
  const needsLinks = type === "links" || type === "combined";
  const needsVideo = type === "video" || type === "combined";
  const deadline = round.deadline ? new Date(round.deadline) : null;
  const isExpired = deadline && new Date() > deadline;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/hackathons/${hackathon.id}/rounds/${round.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ textContent, githubUrl, demoUrl, videoUrl, customFieldValues: customValues }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Submission failed.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        <div className={`h-1 w-full bg-gradient-to-r ${grad} shrink-0`} />
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-slate-900">{success ? "Submitted!" : round.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">{hackathon.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Submission Confirmed!</h3>
              <p className="text-sm text-slate-600">Your submission for <span className="font-semibold">{round.name}</span> has been recorded. A confirmation email has been sent.</p>
              <button onClick={onClose} className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${grad} cursor-pointer`}>Close</button>
            </div>
          ) : loadingExisting ? (
            <div className="flex items-center justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Round info */}
              {round.instructions && (
                <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700 leading-relaxed">
                  <p className="font-semibold text-blue-900 mb-1">Instructions</p>
                  {round.instructions}
                </div>
              )}

              {deadline && (
                <div className={`flex items-center gap-2 text-xs font-semibold ${isExpired ? "text-rose-600" : "text-slate-600"}`}>
                  <Clock className="w-3.5 h-3.5" />
                  {isExpired ? "Deadline passed: " : "Deadline: "}
                  <span>{fmtDateTime(round.deadline!)}</span>
                </div>
              )}

              {existing && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700">
                  ✓ Previous submission found — {round.allowResubmission ? "you can update it below." : "resubmission is not allowed for this round."}
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {isExpired && !existing && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                  The submission deadline has passed.
                </div>
              )}

              {(!isExpired || (existing && round.allowResubmission)) && (
                <>
                  {needsText && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5 text-slate-400" />Project Description *</label>
                      <textarea required={!needsLinks} rows={5} value={textContent} onChange={(e) => setTextContent(e.target.value)} placeholder="Describe your project, approach, and impact…" className={`${inputCls} resize-none`} />
                    </div>
                  )}
                  {needsLinks && (
                    <>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5 text-slate-400" />GitHub Repository</label>
                        <input type="url" value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="https://github.com/your-org/project" className={inputCls} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><LinkIcon className="w-3.5 h-3.5 text-slate-400" />Live Demo URL</label>
                        <input type="url" value={demoUrl} onChange={(e) => setDemoUrl(e.target.value)} placeholder="https://your-project.vercel.app" className={inputCls} />
                      </div>
                    </>
                  )}
                  {needsVideo && (
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5"><Video className="w-3.5 h-3.5 text-slate-400" />Video Demo Link</label>
                      <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className={inputCls} />
                    </div>
                  )}
                  {(round.customFields || []).map((field) => (
                    <div key={field.id}>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        {field.label}{field.required && <span className="text-rose-500 ml-0.5">*</span>}
                      </label>
                      {field.type === "textarea" ? (
                        <textarea required={field.required} rows={3} value={customValues[field.id] || ""} onChange={(e) => setCustomValues((p) => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className={`${inputCls} resize-none`} />
                      ) : (
                        <input type={field.type === "url" ? "url" : "text"} required={field.required} value={customValues[field.id] || ""} onChange={(e) => setCustomValues((p) => ({ ...p, [field.id]: e.target.value }))} placeholder={field.placeholder} className={inputCls} />
                      )}
                    </div>
                  ))}
                  <button type="submit" disabled={loading} className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${grad} shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer`}>
                    {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Submitting…</> : <><Send className="w-4 h-4" />{existing ? "Update Submission" : "Submit"}</>}
                  </button>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
