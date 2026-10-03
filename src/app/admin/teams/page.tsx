"use client";

import React, { useState } from "react";
import {
  Users,
  Search,
  Trash2,
  Copy,
  Check,
  Loader2,
  ShieldCheck,
  Lock,
  Unlock,
} from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { DbTeam } from "@/lib/dbTypes";

export default function AdminTeamsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Recruiting" | "Locked">("All");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { teams, handleDeleteTeam } = useAdminData();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const openTeamsCount = teams.filter((t) => t.isOpen).length;
  const lockedTeamsCount = teams.filter((t) => !t.isOpen).length;

  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.inviteCode.toLowerCase().includes(q) ||
      (t.tagline || "").toLowerCase().includes(q) ||
      t.members.some(
        (m) =>
          m.displayName.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q)
      );

    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Recruiting" && t.isOpen) ||
      (statusFilter === "Locked" && !t.isOpen);

    return matchesSearch && matchesStatus;
  });

  const onDisband = async (id: string, name: string) => {
    if (
      !window.confirm(
        `Disband team "${name}"? All ${teams.find((t) => t.id === id)?.members.length || 0} members will be unlinked.`
      )
    ) {
      return;
    }
    setDeletingId(id);
    try {
      await handleDeleteTeam(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />

      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        {/* Top Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Teams
              </p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{teams.length}</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Recruiting Squads
              </p>
              <p className="text-2xl font-bold text-emerald-600 mt-0.5">{openTeamsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <Unlock className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Locked / Full Teams
              </p>
              <p className="text-2xl font-bold text-slate-700 mt-0.5">{lockedTeamsCount}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 text-slate-600 border border-slate-200">
              <Lock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {(["All", "Recruiting", "Locked"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === s
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80"
                }`}
              >
                {s === "All"
                  ? `All Teams (${teams.length})`
                  : s === "Recruiting"
                  ? `Recruiting (${openTeamsCount})`
                  : `Locked (${lockedTeamsCount})`}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team name, invite code, members..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>
        </div>

        {/* Teams Grid */}
        {filteredTeams.length === 0 ? (
          <div className="py-20 text-center rounded-2xl bg-white border border-slate-200 shadow-xs p-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No Student Teams Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchQuery
                ? "No teams match your search keywords."
                : "No student teams have formed yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredTeams.map((team) => (
              <div
                key={team.id}
                className="rounded-2xl bg-white border border-slate-200 hover:border-slate-300 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {team.name}
                      </h3>
                      {team.tagline && (
                        <p className="text-xs text-slate-500 italic mt-0.5">
                          "{team.tagline}"
                        </p>
                      )}
                    </div>

                    {/* Invite Code button */}
                    <button
                      onClick={() => handleCopyCode(team.inviteCode)}
                      className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy Team Invite Code"
                    >
                      {copiedCode === team.inviteCode ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{team.inviteCode}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Team Members List */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                        Members ({team.members.length}/{team.maxSize})
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          team.isOpen
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {team.isOpen ? "Recruiting" : "Locked"}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {team.members.map((member, mIdx) => (
                        <div
                          key={mIdx}
                          className="flex items-center justify-between p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px] shrink-0">
                              {member.displayName.slice(0, 1).toUpperCase()}
                            </div>
                            <div className="truncate">
                              <span className="font-semibold text-slate-800">
                                {member.displayName}
                              </span>
                              <span className="text-[11px] text-slate-500 block truncate">
                                {member.email}
                              </span>
                            </div>
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase ${
                              member.role === "captain"
                                ? "bg-amber-50 text-amber-700 border border-amber-200 font-bold"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {member.role}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Created {new Date(team.createdAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => onDisband(team.id, team.name)}
                    disabled={deletingId === team.id}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId === team.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span>Disband Team</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
