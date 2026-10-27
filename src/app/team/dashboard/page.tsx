"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Users, Crown, Mail, Clock, CheckCircle2, XCircle,
  Loader2, Plus, Send, AlertCircle, Trash2, RefreshCw, Trophy,
} from "lucide-react";
import type { DbTeam, DbTeamInvitation } from "@/lib/dbTypes";

const MEMBER_STATUS_COLOR: Record<string, string> = {
  Accepted: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Pending:  "bg-amber-50 text-amber-700 border-amber-200",
  Declined: "bg-rose-50 text-rose-600 border-rose-200",
  Expired:  "bg-slate-100 text-slate-500 border-slate-200",
  Cancelled:"bg-slate-100 text-slate-500 border-slate-200",
};

export default function TeamDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<DbTeam | null>(null);
  const [invitations, setInvitations] = useState<DbTeamInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);
  const [inviteError, setInviteError] = useState("");
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/signin?callbackUrl=/team/dashboard");
  }, [status]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/teams")
      .then((r) => r.json())
      .then((d) => {
        if (d.success && d.teams?.length > 0) {
          setTeams(d.teams);
          setSelectedTeam(d.teams[0]);
        }
      })
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    if (!selectedTeam || selectedTeam.captainId !== session?.user?.id) { setInvitations([]); return; }
    fetch(`/api/teams/${selectedTeam.id}/invite`)
      .then((r) => r.json())
      .then((d) => { if (d.success) setInvitations(d.invitations); });
  }, [selectedTeam?.id]);

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeam || !inviteEmail.trim()) return;
    setInviting(true); setInviteError(""); setInviteSuccess("");
    try {
      const res = await fetch(`/api/teams/${selectedTeam.id}/invite`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to send invite.");
      setInviteSuccess(`Invitation sent to ${inviteEmail.trim()}!`);
      setInviteEmail("");
      // Refresh invitations list
      fetch(`/api/teams/${selectedTeam.id}/invite`).then((r) => r.json()).then((d) => { if (d.success) setInvitations(d.invitations); });
    } catch (err: any) { setInviteError(err.message); }
    finally { setInviting(false); }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar onJoinClick={() => {}} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  const isCaptain = selectedTeam?.captainId === session?.user?.id;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onJoinClick={() => {}} />
      <main className="flex-1 pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Team Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">Manage your teams and track hackathon progress</p>
            </div>
            <Link href="/hackathons" className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5" /> Hackathons
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-white border border-slate-200 shadow-xs">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">You're not in any teams</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">Register for a hackathon as a team to get started.</p>
              <Link href="/hackathons" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">Browse Hackathons</Link>
            </div>
          ) : (
            <>
              {/* Team selector */}
              {teams.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {teams.map((t) => (
                    <button key={t.id} onClick={() => setSelectedTeam(t)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${selectedTeam?.id === t.id ? "bg-indigo-600 text-white shadow-xs" : "bg-white border border-slate-200 text-slate-600 hover:text-slate-900"}`}>
                      {t.name}
                    </button>
                  ))}
                </div>
              )}

              {selectedTeam && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                  {/* Team info */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-black text-slate-900">{selectedTeam.name}</h2>
                        {selectedTeam.tagline && <p className="text-xs text-slate-500 italic mt-0.5">"{selectedTeam.tagline}"</p>}
                      </div>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {selectedTeam.members.length}/{selectedTeam.maxSize} members
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Members</h4>
                      {selectedTeam.members.map((member) => (
                        <div key={member.userId} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                          {member.avatarUrl ? (
                            <img src={member.avatarUrl} alt={member.displayName} className="w-8 h-8 rounded-full object-cover" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                              {member.displayName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-semibold text-slate-900 truncate">{member.displayName}</span>
                              {member.role === "captain" && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                            </div>
                            <p className="text-[11px] text-slate-500 truncate">{member.email}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                            Registered
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Invite section (captain only) */}
                  {isCaptain && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Send className="w-4 h-4 text-indigo-500" /> Invite Teammates
                      </h3>
                      <p className="text-xs text-slate-500">
                        Enter a teammate's email to send them an invitation. They'll receive an email with a secure link to join.
                      </p>
                      <form onSubmit={handleInvite} className="space-y-3">
                        {inviteError && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                            {inviteError}
                          </div>
                        )}
                        {inviteSuccess && (
                          <div className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                            {inviteSuccess}
                          </div>
                        )}
                        <div className="flex gap-2">
                          <input
                            type="email" required
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            placeholder="teammate@college.edu"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition-all"
                          />
                          <button type="submit" disabled={inviting} className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer shrink-0">
                            {inviting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                            Invite
                          </button>
                        </div>
                      </form>

                      {/* Pending invitations */}
                      {invitations.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Sent Invitations</h4>
                          {invitations.map((inv) => (
                            <div key={inv.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                              <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-slate-900 truncate">{inv.invitedEmail}</p>
                                <p className="text-[10px] text-slate-400">Expires {new Date(inv.expiresAt).toLocaleDateString("en-IN")}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${MEMBER_STATUS_COLOR[inv.status] || "bg-slate-100 text-slate-500 border-slate-200"}`}>
                                {inv.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer onOpenLegal={() => {}} onJoinClick={() => {}} />
    </div>
  );
}
