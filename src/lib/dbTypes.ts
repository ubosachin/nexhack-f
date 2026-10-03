export interface DbHackathon {
  _id?: string;
  id: string;
  name: string;
  edition: string;
  tagline: string;
  description: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  mode: "Online" | "In-Person" | "Hybrid";
  location: string;
  dateRange: string;
  prizePool: string;
  registeredCount: number;
  tags: string[];
  bannerGradient: string;
  bannerUrl?: string;
  tracks: { title: string; desc: string; icon: string }[];
  prizes: { place: string; reward: string; perks: string }[];
  eligibility: string;
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
  role: "Hacker / Participant" | "Volunteer / Organizer" | "Campus Ambassador" | "Mentor / Speaker";
  teamName?: string;
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

// ── Team Join Request ─────────────────────────────────────────────────────────
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
