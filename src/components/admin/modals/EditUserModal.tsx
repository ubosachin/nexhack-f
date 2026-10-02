"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Shield,
  GraduationCap,
  Sparkles,
  Loader2,
  Check,
  Globe,
  FileText,
  Code2,
  Link as LinkIcon,
} from "lucide-react";
import { GitHubIcon, LinkedInIcon, XTwitterIcon } from "@/components/ui/SocialIcons";
import { DbUserProfile } from "@/lib/dbTypes";

interface EditUserModalProps {
  isOpen: boolean;
  user: DbUserProfile | null;
  onClose: () => void;
  onSubmit: (userId: string, data: Partial<DbUserProfile>) => Promise<void>;
}

export function EditUserModal({
  isOpen,
  user,
  onClose,
  onSubmit,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<DbUserProfile>>({
    displayName: "",
    email: "",
    role: "user",
    bio: "",
    college: "",
    course: "",
    graduationYear: "",
    avatarUrl: "",
    githubUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    skills: [],
  });

  const [skillsInput, setSkillsInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || "",
        email: user.email || "",
        role: user.role === "admin" ? "admin" : "user",
        bio: user.bio || "",
        college: user.college || "",
        course: user.course || "",
        graduationYear: user.graduationYear || "",
        avatarUrl: user.avatarUrl || "",
        githubUrl: user.githubUrl || "",
        linkedinUrl: user.linkedinUrl || "",
        twitterUrl: user.twitterUrl || "",
        skills: user.skills || [],
      });
      setSkillsInput((user.skills || []).join(", "));
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email?.trim()) {
      setError("Email address is required.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const parsedSkills = skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await onSubmit(user.userId, {
        ...formData,
        skills: parsedSkills,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to update user profile.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                Edit User Profile
                <span className="text-xs font-mono font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                  {user.userId.slice(0, 10)}...
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Update account credentials, RBAC role, academic info, and social profiles
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Section 1: Role & Access Rights */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              System Role & Access Privileges *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "user" })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  formData.role === "user"
                    ? "bg-indigo-50/70 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    formData.role === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-slate-900">Standard User</span>
                    {formData.role === "user" && (
                      <span className="text-[10px] font-bold bg-indigo-600 text-white px-1.5 py-0.2 rounded-full">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Can participate in hackathons, join teams, and register for workshops.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: "admin" })}
                className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${
                  formData.role === "admin"
                    ? "bg-purple-50/70 border-purple-400 ring-2 ring-purple-500/20 shadow-xs"
                    : "bg-slate-50 border-slate-200 hover:bg-slate-100/70"
                }`}
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    formData.role === "admin"
                      ? "bg-purple-600 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-purple-900">Administrator</span>
                    {formData.role === "admin" && (
                      <span className="text-[10px] font-bold bg-purple-600 text-white px-1.5 py-0.2 rounded-full">
                        ADMIN
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Full access to Admin Panel, hackathon controls, telemetry, and user management.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Basic Identity */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-indigo-600" />
              Account & Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Display / Full Name
                </label>
                <input
                  type="text"
                  value={formData.displayName || ""}
                  onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                  placeholder="e.g. John Doe"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Avatar Image URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  value={formData.avatarUrl || ""}
                  onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
                {formData.avatarUrl ? (
                  <img
                    src={formData.avatarUrl}
                    alt="Preview"
                    className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    onError={(e) => ((e.target as HTMLElement).style.display = "none")}
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 shrink-0">
                    {(formData.displayName || formData.email || "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bio / About User
              </label>
              <textarea
                rows={2}
                value={formData.bio || ""}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief summary or bio about the user..."
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Section 3: Academic Details */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
              Academic & Education
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  College / University / School
                </label>
                <input
                  type="text"
                  value={formData.college || ""}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  placeholder="e.g. Stanford University / IIT Delhi"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Graduation Year
                </label>
                <input
                  type="text"
                  value={formData.graduationYear || ""}
                  onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                  placeholder="e.g. 2026"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Course / Major / Degree
              </label>
              <input
                type="text"
                value={formData.course || ""}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                placeholder="e.g. B.Tech Computer Science & Engineering"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Section 4: Skills & Tech Stack */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-3.5 h-3.5 text-indigo-600" />
              Skills & Expertise
            </h4>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skills (Comma Separated)
              </label>
              <input
                type="text"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                placeholder="React, TypeScript, Python, Next.js, Docker, PyTorch"
                className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Separate skills with commas.</p>
            </div>
            {/* Live tags preview */}
            {skillsInput && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skillsInput
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200"
                    >
                      {skill}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Section 5: Social & Profiles */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              Social Profiles & Links
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                  <GitHubIcon className="w-3.5 h-3.5" /> GitHub URL
                </label>
                <input
                  type="url"
                  value={formData.githubUrl || ""}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" /> LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.linkedinUrl || ""}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 mb-1 flex items-center gap-1.5">
                  <XTwitterIcon className="w-3.5 h-3.5" /> Twitter / X URL
                </label>
                <input
                  type="url"
                  value={formData.twitterUrl || ""}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://x.com/..."
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-600/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
