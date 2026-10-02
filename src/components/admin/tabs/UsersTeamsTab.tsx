"use client";

import React, { useState } from "react";
import {
  Users,
  UserCheck,
  Shield,
  Search,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Lock,
  Unlock,
  GraduationCap,
  Sparkles,
  Loader2,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/SocialIcons";
import { DbTeam, DbUserProfile } from "@/lib/dbTypes";

interface UsersTeamsTabProps {
  teams: DbTeam[];
  users: DbUserProfile[];
  onDeleteTeam: (id: string) => Promise<void>;
  onDeleteUser: (userId: string) => Promise<void>;
  onUpdateRole: (userId: string, role: "admin" | "user") => Promise<void>;
}

export function UsersTeamsTab({
  teams,
  users,
  onDeleteTeam,
  onDeleteUser,
  onUpdateRole,
}: UsersTeamsTabProps) {
  const [subTab, setSubTab] = useState<"teams" | "users">("teams");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const filteredTeams = teams.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      t.inviteCode.toLowerCase().includes(q) ||
      t.members.some((m) => m.displayName.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
    );
  });

  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    return (
      (u.displayName || "").toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.college || "").toLowerCase().includes(q) ||
      (u.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  const handleDeleteTeam = async (id: string, name: string) => {
    if (!window.confirm(`Disband team "${name}"? All members will be unlinked.`)) return;
    setDeletingId(id);
    try {
      await onDeleteTeam(id);
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!window.confirm(`Delete profile record for ${email}?`)) return;
    setDeletingId(userId);
    try {
      await onDeleteUser(userId);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar: Subtabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80">
        {/* Toggle subtab */}
        <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl self-start">
          <button
            onClick={() => setSubTab("teams")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === "teams"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Active Teams ({teams.length})</span>
          </button>
          <button
            onClick={() => setSubTab("users")}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              subTab === "users"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User Profiles ({users.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={subTab === "teams" ? "Search team name, code, members..." : "Search user, email, college..."}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* TEAMS SUBTAB */}
      {subTab === "teams" && (
        <>
          {filteredTeams.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No Teams Found</h3>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery
                  ? "No teams match your search criteria."
                  : "No student teams have been formed yet."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredTeams.map((team) => (
                <div
                  key={team.id}
                  className="rounded-2xl bg-slate-900/60 border border-slate-800/80 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg shadow-black/20"
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          {team.name}
                        </h3>
                        {team.tagline && (
                          <p className="text-xs text-slate-400 italic mt-0.5">
                            "{team.tagline}"
                          </p>
                        )}
                      </div>

                      {/* Invite Code button */}
                      <button
                        onClick={() => handleCopyCode(team.inviteCode)}
                        className="px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-colors"
                        title="Copy Team Invite Code"
                      >
                        {copiedCode === team.inviteCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
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
                    <div className="mt-4 pt-4 border-t border-slate-800/60">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Members ({team.members.length}/{team.maxSize})
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            team.isOpen
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {team.isOpen ? "Recruiting" : "Locked"}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {team.members.map((member, mIdx) => (
                          <div
                            key={mIdx}
                            className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/40 text-xs"
                          >
                            <div className="flex items-center gap-2.5 truncate">
                              <div className="w-6 h-6 rounded-full bg-indigo-600/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0">
                                {member.displayName.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <span className="font-semibold text-slate-200">
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
                                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                                  : "bg-slate-800 text-slate-400"
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
                  <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      Created {new Date(team.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      disabled={deletingId === team.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-400 hover:text-white hover:bg-rose-600 border border-rose-500/30 flex items-center gap-1.5 transition-colors disabled:opacity-50"
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
        </>
      )}

      {/* USERS SUBTAB */}
      {subTab === "users" && (
        <>
          {filteredUsers.length === 0 ? (
            <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800/60 p-8">
              <UserCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white">No User Profiles</h3>
              <p className="text-xs text-slate-400 mt-1">
                {searchQuery
                  ? "No profiles match your search."
                  : "Users will appear here once they complete their profile."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl bg-slate-900/60 border border-slate-800/80">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800/80 bg-slate-950/40 text-slate-400 uppercase text-[10px] font-bold tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role & Access</th>
                    <th className="p-4">College & Course</th>
                    <th className="p-4">Skills</th>
                    <th className="p-4">Socials</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.map((user) => (
                    <tr key={user.userId} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shrink-0">
                            {(user.displayName || user.email).slice(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200">
                              {user.displayName || "Anonymous Hacker"}
                            </p>
                            <p className="text-slate-400 text-[11px]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateRole(
                              user.userId,
                              user.role === "admin" ? "user" : "admin"
                            )
                          }
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
                            user.role === "admin"
                              ? "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20 shadow-xs"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:text-white hover:bg-slate-700"
                          }`}
                          title={
                            user.role === "admin"
                              ? "Click to Demote to User"
                              : "Click to Promote to Admin"
                          }
                        >
                          <Shield className="w-3 h-3" />
                          <span className="capitalize">{user.role || "user"}</span>
                        </button>
                      </td>

                      <td className="p-4">
                        <p className="text-slate-300 font-medium">{user.college || "—"}</p>
                        <p className="text-slate-500 text-[11px]">
                          {user.course || ""} {user.graduationYear ? `(${user.graduationYear})` : ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(user.skills || []).map((skill, sIdx) => (
                            <span
                              key={sIdx}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60"
                            >
                              {skill}
                            </span>
                          ))}
                          {(!user.skills || user.skills.length === 0) && (
                            <span className="text-slate-600">—</span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {user.githubUrl && (
                            <a
                              href={user.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 transition-colors"
                              title="GitHub Profile"
                            >
                              <GitHubIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {user.linkedinUrl && (
                            <a
                              href={user.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 bg-slate-800/80 hover:bg-slate-800 transition-colors"
                              title="LinkedIn Profile"
                            >
                              <LinkedInIcon className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(user.userId, user.email)}
                          disabled={deletingId === user.userId}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                          title="Delete User Record"
                        >
                          {deletingId === user.userId ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
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
