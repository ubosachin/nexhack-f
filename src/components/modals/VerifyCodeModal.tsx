"use client";

import React, { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { X, Key, Loader2, CheckCircle2, AlertCircle, LogIn } from "lucide-react";
import type { DbHackathon } from "@/lib/dbTypes";

interface Props {
  isOpen: boolean;
  onClose: (didVerify?: boolean) => void;
  hackathon: DbHackathon | null;
}

const inputCls = "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";

export function VerifyCodeModal({ isOpen, onClose, hackathon }: Props) {
  const { data: session, status } = useSession();
  const [code, setCode] = useState("");
  const [fullName, setFullName] = useState(session?.user?.name || "");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  if (!isOpen || !hackathon) return null;

  const grad = hackathon.bannerGradient || "from-indigo-600 to-purple-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) { setError("Please enter your verification code."); return; }
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/hackathons/${hackathon.id}/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: code.trim().toUpperCase(), fullName, phone, collegeOrSchool: college }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Verification failed.");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        <div className={`h-1 w-full bg-gradient-to-r ${grad} shrink-0`} />
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center">
              <Key className="w-4 h-4 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">{success ? "Verified!" : "Verify Unstop Registration"}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{hackathon.name}</p>
            </div>
          </div>
          <button onClick={() => onClose(success)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-5">
          {status === "unauthenticated" ? (
            <div className="text-center space-y-4 py-4">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
              <p className="text-sm text-slate-700 font-semibold">Sign in required</p>
              <p className="text-xs text-slate-500">You need to be signed in to verify your Unstop registration.</p>
              <button
                onClick={() => signIn(undefined, { callbackUrl: `/hackathons/${hackathon.id}` })}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${grad} flex items-center justify-center gap-2 cursor-pointer shadow-md`}
              >
                <LogIn className="w-4 h-4" /> Sign In to Continue
              </button>
            </div>
          ) : success ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Registration Verified!</h3>
              <p className="text-sm text-slate-600">Your Unstop registration for <span className="font-semibold">{hackathon.name}</span> has been verified on NEXHACK. A confirmation email has been sent.</p>
              <button onClick={() => onClose(true)} className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${grad} cursor-pointer shadow-md`}>
                Continue
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-700">
                Enter the verification code provided to you after registering on Unstop for <strong>{hackathon.name}</strong>.
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Verification Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. NEXHACK-A1B2C3D4"
                  className={`${inputCls} font-mono tracking-widest text-center text-lg font-bold`}
                  autoComplete="off"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / Institution</label>
                  <input type="text" value={college} onChange={(e) => setCollege(e.target.value)} placeholder="Your college" className={inputCls} />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r ${grad} shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer`}
              >
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Verifying…</> : <><Key className="w-4 h-4" />Verify Registration</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
