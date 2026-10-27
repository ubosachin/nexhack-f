"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Loader2, Users, CheckCircle2, XCircle, AlertCircle, LogIn } from "lucide-react";

export default function InvitationPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = params?.token as string;
  const action = searchParams.get("action"); // "accept" or "decline"
  const { data: session, status } = useSession();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; error?: string } | null>(null);
  const [invitationInfo, setInvitationInfo] = useState<{ teamName: string; hackathonName?: string; invitedBy: string } | null>(null);

  // Auto-execute action if coming from a signed-in state
  useEffect(() => {
    if (status !== "authenticated" || !action) return;
    handleAction(action as "accept" | "decline");
  }, [status, action]);

  const handleAction = async (act: "accept" | "decline") => {
    if (status !== "authenticated") {
      // Redirect to sign-in then come back
      signIn(undefined, { callbackUrl: `/invitations/${token}?action=${act}` });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/invitations/${token}/${act}`, { method: "POST" });
      const data = await res.json();
      setResult(data);
      if (data.success && act === "accept" && data.teamId) {
        setTimeout(() => router.push("/team/dashboard"), 2000);
      }
    } catch {
      setResult({ success: false, error: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onJoinClick={() => {}} />
      <main className="flex-1 flex items-center justify-center p-4 pt-24">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-purple-500 to-blue-500" />
            <div className="p-8 text-center space-y-5">
              {status === "loading" || loading ? (
                <>
                  <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mx-auto" />
                  <p className="text-sm text-slate-600">Processing…</p>
                </>
              ) : result ? (
                result.success ? (
                  <>
                    <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">{result.message || "Done!"}</h2>
                    <p className="text-sm text-slate-500">Redirecting to your team dashboard…</p>
                  </>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-full bg-rose-100 flex items-center justify-center mx-auto">
                      <XCircle className="w-7 h-7 text-rose-600" />
                    </div>
                    <h2 className="text-lg font-black text-slate-900">Couldn't process invitation</h2>
                    <p className="text-sm text-rose-600">{result.error}</p>
                    <Link href="/" className="inline-block px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold">Go Home</Link>
                  </>
                )
              ) : status === "unauthenticated" ? (
                <>
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Team Invitation</h2>
                  <p className="text-sm text-slate-600">You've been invited to join a team on NEXHACK. Sign in to accept or decline.</p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => signIn(undefined, { callbackUrl: `/invitations/${token}?action=accept` })}
                      className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <LogIn className="w-4 h-4" /> Sign In & Accept
                    </button>
                    <button
                      onClick={() => signIn(undefined, { callbackUrl: `/invitations/${token}?action=decline` })}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      Sign In & Decline
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mx-auto">
                    <Users className="w-7 h-7 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-black text-slate-900">Team Invitation</h2>
                  <p className="text-sm text-slate-600">You've been invited to join a NEXHACK team. What would you like to do?</p>
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => handleAction("accept")}
                      disabled={loading}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Invitation
                    </button>
                    <button
                      onClick={() => handleAction("decline")}
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                    >
                      Decline
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">Signed in as <span className="font-semibold">{session?.user?.email}</span></p>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
