"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, KeyRound, Mail, ArrowRight, Loader2, Sparkles, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { NexhackLogo } from "@/components/ui/NexhackLogo";

interface AdminLoginScreenProps {
  onSuccess: (token: string, email: string) => void;
}

export function AdminLoginScreen({ onSuccess }: AdminLoginScreenProps) {
  const [authMode, setAuthMode] = useState<"passcode" | "otp">("passcode");
  const [passcode, setPasscode] = useState("");
  const [email, setEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [devOtpSnippet, setDevOtpSnippet] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handlePasscodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setError("Please enter the admin master passcode.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/verify-passcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode: passcode.trim(), email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid master passcode.");
      }
      onSuccess(data.token, data.email);
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid administrator email.");
      return;
    }
    setError("");
    setIsLoading(true);
    setSuccessMsg("");

    try {
      const res = await fetch("/api/admin/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to generate security OTP.");
      }

      setOtpStep("code");
      setSuccessMsg(data.message || "Verification code sent.");
      if (data.devOtp) {
        setDevOtpSnippet(data.devOtp);
      }
    } catch (err: any) {
      setError(err.message || "Failed to send code.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim() || otpCode.trim().length < 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), otp: otpCode.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Invalid verification code.");
      }
      onSuccess(data.token, data.email);
    } catch (err: any) {
      setError(err.message || "Failed to verify code.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Top Header Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <NexhackLogo />
            </Link>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              <span>SECURE ACCESS</span>
            </div>
          </div>

          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
              Admin Console
              <Sparkles className="w-5 h-5 text-indigo-600" />
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Authorized personnel only. Manage hackathons, users, and ecosystem telemetry.
            </p>
          </div>

          {/* Direct OAuth Login Option */}
          <div className="mb-6 p-4 rounded-xl bg-indigo-50/70 border border-indigo-100 text-center">
            <p className="text-xs font-semibold text-slate-900 mb-1.5 flex items-center justify-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-600" />
              Role-Based Account Access
            </p>
            <p className="text-[11px] text-slate-500 mb-3">
              Sign in with your authorized admin Google, GitHub or Discord account.
            </p>
            <Link
              href="/signin?callbackUrl=/admin"
              className="w-full py-2 px-3 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01]"
            >
              <span>Sign In with Platform Account</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="relative flex py-1 items-center mb-5">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Or use master credentials
            </span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Mode Switcher */}
          <div className="flex p-1 bg-slate-100 border border-slate-200 rounded-xl mb-6">
            <button
              type="button"
              onClick={() => {
                setAuthMode("passcode");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "passcode"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              Master Passcode
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("otp");
                setError("");
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                authMode === "otp"
                  ? "bg-white text-indigo-700 shadow-sm border border-slate-200/80 font-bold"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email 2FA
            </button>
          </div>

          {/* Error & Info Alerts */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-xs leading-relaxed animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-emerald-700 text-xs leading-relaxed animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{successMsg}</div>
            </div>
          )}

          {/* Form 1: Master Passcode */}
          {authMode === "passcode" ? (
            <form onSubmit={handlePasscodeLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Admin Passcode / Master Key
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    placeholder="Enter admin passcode"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
                    autoFocus
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">
                  Admin Identifier (Optional)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@nexhack.internal"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/25 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Console</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500">
                Default Local Key: <code className="text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">nexhack_admin_2026</code> or <code className="text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded font-mono">admin123</code>
              </div>
            </form>
          ) : (
            /* Form 2: Email OTP */
            <div>
              {otpStep === "email" ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Administrator Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@nexhack.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
                        autoFocus
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Security Code...</span>
                      </>
                    ) : (
                      <>
                        <span>Send 6-Digit OTP</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700">
                        Enter 6-Digit Security OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpStep("email")}
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium"
                      >
                        <ArrowLeft className="w-3 h-3" /> Change Email
                      </button>
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-center text-xl tracking-[0.4em] font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500 transition-colors"
                      autoFocus
                    />
                  </div>

                  {devOtpSnippet && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                      <span className="font-medium">Dev Mode Local OTP:</span>
                      <button
                        type="button"
                        onClick={() => setOtpCode(devOtpSnippet)}
                        className="font-mono font-bold bg-amber-100 border border-amber-200 px-2 py-0.5 rounded text-amber-900 hover:bg-amber-200 transition-colors"
                      >
                        {devOtpSnippet} (Auto-Fill)
                      </button>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/25 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm & Login</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Footer Back Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/"
              className="text-xs text-slate-500 hover:text-slate-900 inline-flex items-center gap-1.5 transition-colors font-medium"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Public Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
