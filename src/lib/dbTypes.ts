export interface DbHackathon {
  _id?: string;
  id: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;       // stored as HTML (rich text)
  status: "Upcoming" | "Ongoing" | "Completed";
  mode: "Online" | "In-Person" | "Hybrid";
  location: string;
  dateRange: string;
  /** ISO datetime string for when registration opens */
  registrationStartDate?: string;
  /** ISO datetime string for when registration closes */
  registrationEndDate?: string;
  prizePool: string;
  registeredCount: number;
  tags: string[];
  bannerGradient: string;
  bannerUrl?: string;        // Desktop / default banner
  mobileBannerUrl?: string;  // Mobile-specific banner (optional)
  tracks: { title: string; desc: string; icon: string }[];
  prizes: { place: string; reward: string; perks: string }[];
  eligibility: string;
  /** Minimum team size (1 = individuals allowed) */
  minTeamSize?: number;
  /** Maximum team size */
  maxTeamSize?: number;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbEventSession {
  _id?: string;
  id: string;
  title: string;
  category: "AI & Machine Learning" | "Web Development" | "Cloud & DevOps" | "Startups & Career";
  speaker: {
    name: string;
    role: string;
    company: string;
    avatar: string;
    verified: boolean;
  };
  date: string;
  time: string;
  duration: string;
  mode: "Live Stream" | "Virtual Workshop" | "Campus Keynote";
  seatsLeft: number;
  level: "Beginner" | "Intermediate" | "Advanced";
  highlights: string[];
  isCallForSpeakers?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DbRegistration {
  _id?: string;
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  collegeOrSchool: string;
  degreeOrGrade?: string;
  eventOrHackathon: string;
  /** Foreign key to DbHackathon.id (set when registering for a specific hackathon) */
  hackathonId?: string;
  /** "individual" | "team" — how the participant is registering */
  registrationType?: "individual" | "team";
  role: "Hacker / Participant" | "Volunteer / Organizer" | "Campus Ambassador" | "Mentor / Speaker";
  teamId?: string;
  teamName?: string;
  /** userIds of participating team members (for team registrations) */
  participatingMemberIds?: string[];
  /** userId of the person who completed registration */
  userId?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  status: "Confirmed" | "Waitlisted" | "Approved" | "Cancelled";
  createdAt: string;
}

export interface DbCampusInquiry {
  _id?: string;
  id: string;
  institutionName: string;
  contactName: string;
  contactEmail: string;
  city: string;
  partnershipType: string;
  expectedStudents: string;
  notes: string;
  status: "Pending" | "Contacted" | "Approved" | "Archived";
  createdAt: string;
}

export interface DbNewsletter {
  _id?: string;
  id: string;
  email: string;
  source: string;
  status: "Subscribed" | "Unsubscribed";
  createdAt: string;
}

export interface DbAdminLog {
  _id?: string;
  id: string;
  action: string;
  target: string;
  timestamp: string;
  performedBy: string;
}

export interface DbAdminOtp {
  _id?: string;
  email: string;
  otp: string;
  expiresAt: number;
  verified: boolean;
  createdAt: string;
}


// ── User Profile ─────────────────────────────────────────────────────────────
export interface DbUserProfile {
  _id?: string;
  userId: string;           // JWT sub / session.user.id
  email: string;
  role?: "admin" | "user";  // RBAC permission
  displayName?: string;
  provider?: string;
  lastLoginAt?: string;
  bio?: string;
  college?: string;
  course?: string;
  graduationYear?: string;
  avatarUrl?: string;       // Cloudinary secure_url (overrides OAuth avatar)
  avatarPublicId?: string;  // for Cloudinary deletion
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  skills?: string[];        // e.g. ["React", "Python", "ML"]
  createdAt: string;
  updatedAt: string;
}

// ── Team ─────────────────────────────────────────────────────────────────────
export type TeamMemberRole = "captain" | "member";

export interface DbTeamMember {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  email: string;
  role: TeamMemberRole;
  joinedAt: string;
}

export interface DbTeam {
  _id?: string;
  id: string;
  name: string;
  tagline?: string;
  hackathonId?: string;     // optional link to a specific hackathon
  captainId: string;        // userId of captain
  members: DbTeamMember[];
  maxSize: number;          // default 4
  isOpen: boolean;          // accepting join requests
  inviteCode: string;       // short random code for direct join
  createdAt: string;
  updatedAt: string;
}

// ── Campus Ambassador Application ────────────────────────────────────────────
export interface DbAmbassadorApplication {
  _id?: string;
  id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  city: string;
  yearOfStudy: string;
  course: string;
  linkedinUrl?: string;
  whyAmbassador: string;
  status: "Pending" | "Shortlisted" | "Approved" | "Rejected";
  createdAt: string;
}

export interface DbTeamJoinRequest {
  _id?: string;
  id: string;
  teamId: string;
  teamName: string;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  userAvatarUrl?: string;
  message?: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
  updatedAt: string;
}

// ── Hackathon Round ──────────────────────────────────────────────────────────

export type SubmissionType =
  | "text"          // free-form text / description
  | "file"          // PDF, PPT, ZIP, etc.
  | "links"         // GitHub + demo URLs
  | "video"         // video demo link
  | "combined";     // multiple field types

export interface RoundCustomField {
  id: string;
  label: string;
  type: "text" | "url" | "file" | "textarea";
  required: boolean;
  placeholder?: string;
  acceptedFileTypes?: string;   // e.g. ".pdf,.pptx,.zip"
  maxFileSizeMb?: number;
}

export interface DbRound {
  _id?: string;
  id: string;
  hackathonId: string;
  name: string;                 // "Round 1 – Ideation"
  description: string;
  instructions: string;
  roundNumber: number;          // 1, 2, 3 …
  submissionType: SubmissionType;
  acceptedFileTypes?: string;   // ".pdf,.pptx,.zip"
  maxFileSizeMb?: number;       // default 25
  maxSubmissionsPerTeam?: number; // 1 = one-shot, default
  allowResubmission: boolean;
  startDate?: string;           // ISO
  deadline?: string;            // ISO
  evaluationCriteria?: { criterion: string; maxMarks: number }[];
  customFields: RoundCustomField[];
  status: "Upcoming" | "Open" | "Closed" | "Completed";
  isPublished: boolean;         // false = draft, not visible to participants
  visibleToAll: boolean;        // false = only teams that advanced to this round
  createdAt: string;
  updatedAt: string;
}

// ── Submission ───────────────────────────────────────────────────────────────

export interface SubmissionFile {
  fieldId: string;         // matches RoundCustomField.id or "mainFile"
  fileName: string;
  fileUrl: string;         // Cloudinary / local URL
  fileSize: number;        // bytes
  uploadedAt: string;
}

export interface DbSubmission {
  _id?: string;
  id: string;
  hackathonId: string;
  roundId: string;
  teamId?: string;
  teamName?: string;
  userId: string;           // submitter (team captain or individual)
  registrationId: string;   // links back to DbRegistration

  // Content
  textContent?: string;
  githubUrl?: string;
  demoUrl?: string;
  videoUrl?: string;
  customFieldValues?: Record<string, string>; // fieldId → value
  files?: SubmissionFile[];

  // Meta
  status: "Draft" | "Submitted" | "Under Review" | "Evaluated";
  submittedAt?: string;
  lastUpdatedAt: string;
  createdAt: string;
}

// ── Verification Code (Unstop / external platform) ──────────────────────────

export interface DbVerificationCode {
  _id?: string;
  id: string;
  hackathonId: string;
  code: string;             // unique alphanumeric
  maxUses: number;          // 0 = unlimited
  usedCount: number;
  isActive: boolean;
  note?: string;            // admin note, e.g. "Batch A – IIIT Hyderabad"
  createdAt: string;
  expiresAt?: string;       // ISO, optional
}

export interface DbCodeRedemption {
  _id?: string;
  id: string;
  codeId: string;
  hackathonId: string;
  userId: string;
  email: string;
  redeemedAt: string;
}

// ── Team Email Invitation ────────────────────────────────────────────────────

export interface DbTeamInvitation {
  _id?: string;
  id: string;
  hackathonId: string;
  teamId: string;
  teamName: string;
  invitedEmail: string;       // the email being invited
  invitedByUserId: string;    // team captain
  invitedByName: string;
  token: string;              // secure random 32-char hex token
  status: "Pending" | "Accepted" | "Declined" | "Expired" | "Cancelled";
  expiresAt: string;          // ISO – default 7 days
  acceptedByUserId?: string;
  createdAt: string;
  updatedAt: string;
}
