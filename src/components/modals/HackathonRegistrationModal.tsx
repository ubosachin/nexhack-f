"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  X,
  User,
  Users,
  CheckCircle2,
  Loader2,
  Plus,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  Trophy,
  Crown,
} from "lucide-react";
import type { DbHackathon, DbTeam } from "@/lib/dbTypes";

type Step =
  | "choose-type"     // individual vs team
  | "individual-form" // fill name, email, college
  | "team-select"     // pick a team
  | "team-members"    // select participating members
  | "team-create"     // mini create-team form
  | "success";

interface Props {
  isOpen: boolean;
  onClose: (didRegister?: boolean) => void;
  hackathon: DbHackathon | null;
}

interface IndividualForm {
  fullName: string;
  email: string;
  collegeOrSchool: string;
  degreeOrGrade: string;
  phone: string;
}

const inputCls =
  "w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all";

export function HackathonRegistrationModal({ isOpen, onClose, hackathon }: Props) {
  const { data: session } = useSession();
  const [step, setStep] = useState<Step>("choose-type");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Individual form
  const [indForm, setIndForm] = useState<IndividualForm>({
    fullName: "",
    email: "",
    collegeOrSchool: "",
    degreeOrGrade: "",
    phone: "",
  });

  // Team flow
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<DbTeam | null>(null);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);

  // New team creation
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamTagline, setNewTeamTagline] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep("choose-type");
      setError("");
      setSelectedTeam(null);
      setSelectedMemberIds([]);
      setIndForm({
        fullName: session?.user?.name || "",
        email: session?.user?.email || "",
        collegeOrSchool: "",
        degreeOrGrade: "",
        phone: "",
      });
    }
  }, [isOpen, session]);

  // Pre-fill from session
  useEffect(() => {
    if (session?.user) {
      setIndForm((f) => ({
        ...f,
        fullName: f.fullName || session.user!.name || "",
        email: f.email || session.user!.email || "",
      }));
    }
  }, [session]);

  if (!isOpen || !hackathon) return null;

  const minSize = hackathon.minTeamSize ?? 1;
  const maxSize = hackathon.maxTeamSize ?? 4;
  const allowsIndividual = minSize <= 1;

  // ── Load user teams when entering team-select step ───────────────────────
  const loadTeams = async () => {
    if (!session?.user?.id) return;
    setTeamsLoading(true);
    try {
      const res = await fetch("/api/user/teams");
      const data = await res.json();
      if (data.success) setTeams(data.teams || []);
    } catch {
      // silent
    } finally {
      setTeamsLoading(false);
    }
  };

  const goToTeamSelect = () => {
    setStep("team-select");
    loadTeams();
  };

  // ── Create team ──────────────────────────────────────────────────────────
  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) { setError("Team name is required."); return; }
    setCreatingTeam(true);
    setError("");
    try {
      const res = await fetch("/api/user/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeamName.trim(),
          tagline: newTeamTagline.trim(),
          maxSize,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Failed to create team.");
      setSelectedTeam(data.team);
      setSelectedMemberIds([session!.user!.id!]);
      setTeams((prev) => [data.team, ...prev]);
      setStep("team-members");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setCreatingTeam(false);
    }
  };

  // ── Submit individual registration ───────────────────────────────────────
  const handleIndividualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!indForm.fullName || !indForm.email || !indForm.collegeOrSchool) {
      setError("Name, email, and institution are required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/hackathons/${hackathon.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationType: "individual", ...indForm }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Registration failed.");
      setStep("success");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Submit team registration ─────────────────────────────────────────────
  const handleTeamSubmit = async () => {
    if (!selectedTeam) return;
    if (selectedMemberIds.length < minSize) {
      setError(`Select at least ${minSize} member${minSize !== 1 ? "s" : ""}.`);
      return;
    }
    if (selectedMemberIds.length > maxSize) {
      setError(`Maximum ${maxSize} member${maxSize !== 1 ? "s" : ""} allowed.`);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/hackathons/${hackathon.id}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationType: "team",
          teamId: selectedTeam.id,
          participatingMemberIds: selectedMemberIds,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Registration failed.");
      setStep("success");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleMember = (uid: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  // ── Gradient for accents ──────────────────────────────────────────────────
  const grad = hackathon.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500";

  // ── Registration window check ─────────────────────────────────────────────
  const now = new Date();
  const regStart = hackathon.registrationStartDate ? new Date(hackathon.registrationStartDate) : null;
  const regEnd = hackathon.registrationEndDate ? new Date(hackathon.registrationEndDate) : null;
  const notStarted = regStart && now < regStart;
  const expired = regEnd && now > regEnd;
  const isCompleted = hackathon.status === "Completed";
  const registrationClosed = !!(isCompleted || notStarted || expired);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-250 flex flex-col max-h-[92vh]">

        {/* Accent strip */}
        <div className={`h-1 w-full bg-gradient-to-r ${grad} shrink-0`} />

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            {(step !== "choose-type" && step !== "success") && (
              <button
                onClick={() => {
                  if (step === "individual-form") setStep("choose-type");
                  else if (step === "team-select") setStep("choose-type");
                  else if (step === "team-create") setStep("team-select");
                  else if (step === "team-members") setStep("team-select");
                  setError("");
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {step === "success" ? "You're Registered!" : `Register for ${hackathon.name}`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {step === "choose-type" && "Choose how you want to participate"}
                {step === "individual-form" && "Individual registration"}
                {step === "team-select" && "Select your team"}
                {step === "team-members" && `Select up to ${maxSize} participants`}
                {step === "team-create" && "Create a new team"}
                {step === "success" && hackathon.name}
              </p>
            </div>
          </div>
          <button onClick={() => onClose(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-4">

          {/* Registration closed banner */}
          {registrationClosed && step !== "success" && (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                {isCompleted && "This hackathon is completed — registration is closed."}
                {notStarted && `Registration opens on ${regStart!.toLocaleString()}.`}
                {expired && !isCompleted && `Registration closed on ${regEnd!.toLocaleString()}.`}
              </span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* ── STEP: choose-type ── */}
          {step === "choose-type" && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
                <span className="font-semibold">Team rules:</span>{" "}
                {minSize === 1
                  ? `Individual participation allowed. Teams can have ${minSize}–${maxSize} members.`
                  : `Teams of ${minSize}–${maxSize} members required.`}
              </div>

              {allowsIndividual && (
                <button
                  onClick={() => setStep("individual-form")}
                  disabled={registrationClosed}
                  className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left flex items-center gap-4 transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-blue-100 text-blue-700 group-hover:bg-blue-200 transition-colors">
                    <User className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-slate-900 text-sm">Register Individually</div>
                    <div className="text-xs text-slate-500 mt-0.5">Compete solo — no team required</div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </button>
              )}

              <button
                onClick={session?.user?.id ? goToTeamSelect : () => setError("Sign in to register as a team.")}
                disabled={registrationClosed}
                className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left flex items-center gap-4 transition-all group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-700 group-hover:bg-indigo-200 transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-900 text-sm">Register as a Team</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Choose an existing team or create one (requires sign-in)
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors" />
              </button>
            </div>
          )}

          {/* ── STEP: individual-form ── */}
          {step === "individual-form" && (
            <form id="ind-form" onSubmit={handleIndividualSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
                <input type="text" required value={indForm.fullName} onChange={(e) => setIndForm({ ...indForm, fullName: e.target.value })} placeholder="Your full name" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address *</label>
                <input type="email" required value={indForm.email} onChange={(e) => setIndForm({ ...indForm, email: e.target.value })} placeholder="you@college.edu" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / School *</label>
                <input type="text" required value={indForm.collegeOrSchool} onChange={(e) => setIndForm({ ...indForm, collegeOrSchool: e.target.value })} placeholder="Institution name" className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree / Year</label>
                  <input type="text" value={indForm.degreeOrGrade} onChange={(e) => setIndForm({ ...indForm, degreeOrGrade: e.target.value })} placeholder="e.g. B.Tech 3rd Year" className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone</label>
                  <input type="tel" value={indForm.phone} onChange={(e) => setIndForm({ ...indForm, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" className={inputCls} />
                </div>
              </div>
            </form>
          )}

          {/* ── STEP: team-select ── */}
          {step === "team-select" && (
            <div className="space-y-3">
              {teamsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              ) : teams.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <Users className="w-10 h-10 text-slate-300 mx-auto" />
                  <p className="text-sm font-semibold text-slate-700">You have no teams yet</p>
                  <p className="text-xs text-slate-500">Create one to register as a team.</p>
                  <button
                    onClick={() => { setError(""); setStep("team-create"); }}
                    className={`px-4 py-2 rounded-xl text-white text-xs font-semibold bg-gradient-to-r ${grad} shadow-sm cursor-pointer`}
                  >
                    Create a Team
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs text-slate-500">Select the team you want to register with:</p>
                  {teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => {
                        setSelectedTeam(team);
                        setSelectedMemberIds(team.members.map((m) => m.userId));
                        setStep("team-members");
                      }}
                      className="w-full p-4 rounded-2xl border-2 border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-left flex items-center gap-3 transition-all group cursor-pointer"
                    >
                      <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-slate-900 text-sm truncate">{team.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{team.members.length} member{team.members.length !== 1 ? "s" : ""} · Captain: {team.members.find((m) => m.userId === team.captainId)?.displayName || "Unknown"}</div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 shrink-0" />
                    </button>
                  ))}
                  <button
                    onClick={() => { setError(""); setStep("team-create"); }}
                    className="w-full p-3.5 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-300 text-slate-500 hover:text-indigo-600 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create a New Team
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── STEP: team-create ── */}
          {step === "team-create" && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Your new team will be created and you'll be the captain.</p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Name *</label>
                <input type="text" value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)} placeholder="e.g. ByteForce" className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Team Tagline</label>
                <input type="text" value={newTeamTagline} onChange={(e) => setNewTeamTagline(e.target.value)} placeholder="e.g. We build for impact" className={inputCls} />
              </div>
            </div>
          )}

          {/* ── STEP: team-members ── */}
          {step === "team-members" && selectedTeam && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-700">
                Select {minSize === maxSize ? `exactly ${minSize}` : `${minSize}–${maxSize}`} member{maxSize !== 1 ? "s" : ""} to participate.
                <span className="ml-2 font-bold">{selectedMemberIds.length} selected</span>
              </div>

              {/* Size validation hint */}
              {selectedMemberIds.length < minSize && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                  Need {minSize - selectedMemberIds.length} more member{minSize - selectedMemberIds.length !== 1 ? "s" : ""}.
                </p>
              )}
              {selectedMemberIds.length > maxSize && (
                <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
                  Deselect {selectedMemberIds.length - maxSize} member{selectedMemberIds.length - maxSize !== 1 ? "s" : ""}.
                </p>
              )}

              <div className="space-y-2">
                {selectedTeam.members.map((member) => {
                  const checked = selectedMemberIds.includes(member.userId);
                  const isCaptain = member.userId === selectedTeam.captainId;
                  return (
                    <label
                      key={member.userId}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${checked ? "border-indigo-400 bg-indigo-50/40" : "border-slate-200 hover:border-slate-300"}`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMember(member.userId)}
                        className="w-4 h-4 rounded text-indigo-600 border-slate-300 cursor-pointer focus:ring-0"
                      />
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.displayName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                          {member.displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-slate-900 truncate">{member.displayName}</span>
                          {isCaptain && (
                            <span title="Team Captain" className="inline-flex">
                              <Crown className="w-3 h-3 text-amber-500 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 truncate">{member.email}</p>
                      </div>
                      {checked && <CheckCircle2 className="w-4 h-4 text-indigo-500 shrink-0" />}
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP: success ── */}
          {step === "success" && (
            <div className="text-center py-4 space-y-4">
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center mx-auto shadow-lg`}>
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Registration Confirmed!</h3>
                <p className="text-sm text-slate-600 mt-1">
                  You're registered for <span className="font-semibold text-slate-900">{hackathon.name}</span>.
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  Watch for announcements in the NEXHACK community channels.
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${grad} text-white text-xs font-bold`}>
                <CheckCircle2 className="w-4 h-4" />
                {hackathon.edition}
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        {step !== "success" && step !== "choose-type" && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
            {step === "individual-form" && (
              <button
                type="submit"
                form="ind-form"
                disabled={loading || registrationClosed}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${grad} shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <User className="w-4 h-4" />}
                {loading ? "Registering..." : "Confirm Individual Registration"}
              </button>
            )}

            {step === "team-create" && (
              <button
                onClick={handleCreateTeam}
                disabled={creatingTeam || !newTeamName.trim()}
                className={`w-full py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${grad} shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer`}
              >
                {creatingTeam ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {creatingTeam ? "Creating team..." : "Create Team & Continue"}
              </button>
            )}

            {step === "team-members" && (
              <button
                onClick={handleTeamSubmit}
                disabled={
                  loading ||
                  registrationClosed ||
                  selectedMemberIds.length < minSize ||
                  selectedMemberIds.length > maxSize
                }
                className={`w-full py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${grad} shadow-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer`}
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Users className="w-4 h-4" />}
                {loading ? "Registering team..." : `Register Team (${selectedMemberIds.length} members)`}
              </button>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="px-5 py-4 border-t border-slate-100 bg-white shrink-0">
            <button
              onClick={() => onClose(true)}
              className={`w-full py-2.5 rounded-xl text-white font-bold text-sm bg-gradient-to-r ${grad} shadow-sm cursor-pointer`}
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
