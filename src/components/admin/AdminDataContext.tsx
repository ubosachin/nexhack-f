"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  DbHackathon,
  DbEventSession,
  DbRegistration,
  DbCampusInquiry,
  DbNewsletter,
  DbAdminLog,
  DbUserProfile,
  DbTeam,
} from "@/lib/dbTypes";

interface AdminStats {
  hackathons: number;
  events: number;
  registrations: number;
  inquiries: number;
  newsletters: number;
  users: number;
  teams: number;
  isUsingMongo: boolean;
}

interface AdminDataContextType {
  // Auth state
  isAuthenticated: boolean | null;
  authStatus: "loading" | "authenticated" | "unauthenticated";
  adminEmail: string;
  adminName: string;
  adminRole: string;
  handleLoginSuccess: (token: string, email: string) => void;
  handleLogout: () => void;

  // Data state
  stats: AdminStats;
  hackathons: DbHackathon[];
  teams: DbTeam[];
  users: DbUserProfile[];
  registrations: DbRegistration[];
  events: DbEventSession[];
  inquiries: DbCampusInquiry[];
  newsletters: DbNewsletter[];
  logs: DbAdminLog[];
  isRefreshing: boolean;
  fetchData: () => Promise<void>;

  // Hackathon actions
  handleSaveHackathon: (data: Partial<DbHackathon>) => Promise<void>;
  handleDeleteHackathon: (id: string) => Promise<void>;
  handleUpdateHackathonStatus: (id: string, status: DbHackathon["status"]) => Promise<void>;

  // User actions
  handleUpdateUserRole: (userId: string, role: "admin" | "user") => Promise<void>;
  handleUpdateUserDetails: (userId: string, data: Partial<DbUserProfile>) => Promise<void>;
  handleDeleteUser: (userId: string) => Promise<void>;

  // Team actions
  handleDeleteTeam: (id: string) => Promise<void>;

  // Event actions
  handleCreateEvent: (data: Partial<DbEventSession>) => Promise<void>;
  handleDeleteEvent: (id: string) => Promise<void>;

  // Registration actions
  handleUpdateRegistrationStatus: (id: string, status: DbRegistration["status"]) => Promise<void>;
  handleDeleteRegistration: (id: string) => Promise<void>;

  // Inquiry actions
  handleUpdateInquiryStatus: (id: string, status: DbCampusInquiry["status"]) => Promise<void>;
  handleDeleteInquiry: (id: string) => Promise<void>;

  // Newsletter actions
  handleDeleteNewsletter: (id: string) => Promise<void>;

  // Modal helpers
  isCreateHackathonOpen: boolean;
  editingHackathon: DbHackathon | null;
  openCreateHackathon: (hackathon?: DbHackathon | null) => void;
  closeCreateHackathon: () => void;

  isCreateEventOpen: boolean;
  openCreateEvent: () => void;
  closeCreateEvent: () => void;

  isEditUserOpen: boolean;
  editingUser: DbUserProfile | null;
  openEditUser: (user: DbUserProfile) => void;
  closeEditUser: () => void;
}

const AdminDataContext = createContext<AdminDataContextType | null>(null);

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status: authStatus } = useSession();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminName, setAdminName] = useState("Administrator");
  const [adminRole, setAdminRole] = useState("admin");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal states
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<DbHackathon | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUserProfile | null>(null);

  // Data states
  const [stats, setStats] = useState<AdminStats>({
    hackathons: 0,
    events: 0,
    registrations: 0,
    inquiries: 0,
    newsletters: 0,
    users: 0,
    teams: 0,
    isUsingMongo: false,
  });

  const [hackathons, setHackathons] = useState<DbHackathon[]>([]);
  const [teams, setTeams] = useState<DbTeam[]>([]);
  const [users, setUsers] = useState<DbUserProfile[]>([]);
  const [registrations, setRegistrations] = useState<DbRegistration[]>([]);
  const [events, setEvents] = useState<DbEventSession[]>([]);
  const [inquiries, setInquiries] = useState<DbCampusInquiry[]>([]);
  const [newsletters, setNewsletters] = useState<DbNewsletter[]>([]);
  const [logs, setLogs] = useState<DbAdminLog[]>([]);

  // Auth checking
  useEffect(() => {
    if (authStatus === "loading") return;

    const isUserAdmin = String(session?.user?.role || "").toLowerCase().trim() === "admin";
    if (isUserAdmin) {
      setIsAuthenticated(true);
      setAdminEmail(session?.user?.email || "admin@nexhack.com");
      setAdminName(session?.user?.name || "Administrator");
      setAdminRole("admin");
      return;
    }

    if (session?.user) {
      fetch("/api/user/role")
        .then((res) => res.json())
        .then((data) => {
          if (data?.isAdmin) {
            setIsAuthenticated(true);
            setAdminEmail(data.email || session.user?.email || "admin@nexhack.com");
            setAdminName(session.user?.name || "Administrator");
            setAdminRole(data.role || "admin");
          } else {
            checkLocalPasscode();
          }
        })
        .catch(() => {
          checkLocalPasscode();
        });
    } else {
      checkLocalPasscode();
    }
  }, [session, authStatus]);

  const checkLocalPasscode = () => {
    const token = typeof window !== "undefined" ? localStorage.getItem("nexhack_admin_token") : null;
    const email = typeof window !== "undefined" ? localStorage.getItem("nexhack_admin_email") : null;
    if (token) {
      setIsAuthenticated(true);
      setAdminEmail(email || "admin@nexhack.internal");
      setAdminName("Emergency Admin");
      setAdminRole("admin");
    } else {
      setIsAuthenticated(false);
    }
  };

  const handleLoginSuccess = (token: string, email: string) => {
    localStorage.setItem("nexhack_admin_token", token);
    localStorage.setItem("nexhack_admin_email", email);
    setIsAuthenticated(true);
    setAdminEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem("nexhack_admin_token");
    localStorage.removeItem("nexhack_admin_email");
    setIsAuthenticated(false);
    if (session) {
      signOut({ callbackUrl: "/admin" });
    }
  };

  // Fetch all collections
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        statsRes,
        hackRes,
        teamRes,
        userRes,
        regRes,
        eventRes,
        inqRes,
        newsRes,
        logRes,
      ] = await Promise.all([
        fetch("/api/admin/stats").catch(() => null),
        fetch("/api/admin/hackathons").catch(() => null),
        fetch("/api/admin/teams").catch(() => null),
        fetch("/api/admin/users").catch(() => null),
        fetch("/api/admin/registrations").catch(() => null),
        fetch("/api/admin/events").catch(() => null),
        fetch("/api/admin/inquiries").catch(() => null),
        fetch("/api/admin/newsletters").catch(() => null),
        fetch("/api/admin/logs").catch(() => null),
      ]);

      if (statsRes && statsRes.ok) {
        const data = await statsRes.json();
        if (data.success) setStats(data.stats);
      }
      if (hackRes && hackRes.ok) {
        const data = await hackRes.json();
        if (data.success) setHackathons(data.hackathons);
      }
      if (teamRes && teamRes.ok) {
        const data = await teamRes.json();
        if (data.success) setTeams(data.teams);
      }
      if (userRes && userRes.ok) {
        const data = await userRes.json();
        if (data.success) setUsers(data.users);
      }
      if (regRes && regRes.ok) {
        const data = await regRes.json();
        if (data.success) setRegistrations(data.registrations);
      }
      if (eventRes && eventRes.ok) {
        const data = await eventRes.json();
        if (data.success) setEvents(data.events);
      }
      if (inqRes && inqRes.ok) {
        const data = await inqRes.json();
        if (data.success) setInquiries(data.inquiries);
      }
      if (newsRes && newsRes.ok) {
        const data = await newsRes.json();
        if (data.success) setNewsletters(data.newsletters);
      }
      if (logRes && logRes.ok) {
        const data = await logRes.json();
        if (data.success) setLogs(data.logs);
      }
    } catch (err) {
      console.error("Admin data fetch error:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  // Hackathon Handlers
  const handleSaveHackathon = async (data: Partial<DbHackathon>) => {
    const isEdit = !!editingHackathon;
    const url = "/api/admin/hackathons";
    const method = isEdit ? "PUT" : "POST";
    const payload = isEdit ? { ...data, id: editingHackathon.id } : data;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to save hackathon");
    }
    fetchData();
  };

  const handleDeleteHackathon = async (id: string) => {
    const res = await fetch(`/api/admin/hackathons?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to delete hackathon");
    }
    fetchData();
  };

  const handleUpdateHackathonStatus = async (
    id: string,
    status: DbHackathon["status"]
  ) => {
    await fetch("/api/admin/hackathons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  // User Handlers
  const handleUpdateUserRole = async (userId: string, role: "admin" | "user") => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to update user role");
    }
    fetchData();
  };

  const handleUpdateUserDetails = async (
    userId: string,
    data: Partial<DbUserProfile>
  ) => {
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...data }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to update user details");
    }
    fetchData();
  };

  const handleDeleteUser = async (userId: string) => {
    const res = await fetch(`/api/admin/users?userId=${encodeURIComponent(userId)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete user profile");
    }
    fetchData();
  };

  // Team Handlers
  const handleDeleteTeam = async (id: string) => {
    const res = await fetch(`/api/admin/teams?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to disband team");
    }
    fetchData();
  };

  // Event Handlers
  const handleCreateEvent = async (data: Partial<DbEventSession>) => {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok || !json.success) {
      throw new Error(json.error || "Failed to create workshop");
    }
    fetchData();
  };

  const handleDeleteEvent = async (id: string) => {
    const res = await fetch(`/api/admin/events?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete workshop");
    }
    fetchData();
  };

  // Registration Handlers
  const handleUpdateRegistrationStatus = async (
    id: string,
    status: DbRegistration["status"]
  ) => {
    await fetch("/api/admin/registrations", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const handleDeleteRegistration = async (id: string) => {
    const res = await fetch(`/api/admin/registrations?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete registration");
    }
    fetchData();
  };

  // Inquiry Handlers
  const handleUpdateInquiryStatus = async (
    id: string,
    status: DbCampusInquiry["status"]
  ) => {
    await fetch("/api/admin/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  const handleDeleteInquiry = async (id: string) => {
    const res = await fetch(`/api/admin/inquiries?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete inquiry");
    }
    fetchData();
  };

  // Newsletter Handlers
  const handleDeleteNewsletter = async (id: string) => {
    const res = await fetch(`/api/admin/newsletters?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to remove subscriber");
    }
    fetchData();
  };

  // Modal actions
  const openCreateHackathon = (hackathon?: DbHackathon | null) => {
    setEditingHackathon(hackathon || null);
    setIsCreateHackathonOpen(true);
  };
  const closeCreateHackathon = () => {
    setIsCreateHackathonOpen(false);
    setEditingHackathon(null);
  };

  const openCreateEvent = () => setIsCreateEventOpen(true);
  const closeCreateEvent = () => setIsCreateEventOpen(false);

  const openEditUser = (user: DbUserProfile) => {
    setEditingUser(user);
    setIsEditUserOpen(true);
  };
  const closeEditUser = () => {
    setIsEditUserOpen(false);
    setEditingUser(null);
  };

  return (
    <AdminDataContext.Provider
      value={{
        isAuthenticated,
        authStatus,
        adminEmail,
        adminName,
        adminRole,
        handleLoginSuccess,
        handleLogout,
        stats,
        hackathons,
        teams,
        users,
        registrations,
        events,
        inquiries,
        newsletters,
        logs,
        isRefreshing,
        fetchData,
        handleSaveHackathon,
        handleDeleteHackathon,
        handleUpdateHackathonStatus,
        handleUpdateUserRole,
        handleUpdateUserDetails,
        handleDeleteUser,
        handleDeleteTeam,
        handleCreateEvent,
        handleDeleteEvent,
        handleUpdateRegistrationStatus,
        handleDeleteRegistration,
        handleUpdateInquiryStatus,
        handleDeleteInquiry,
        handleDeleteNewsletter,
        isCreateHackathonOpen,
        editingHackathon,
        openCreateHackathon,
        closeCreateHackathon,
        isCreateEventOpen,
        openCreateEvent,
        closeCreateEvent,
        isEditUserOpen,
        editingUser,
        openEditUser,
        closeEditUser,
      }}
    >
      {children}
    </AdminDataContext.Provider>
  );
}

export function useAdminData() {
  const context = useContext(AdminDataContext);
  if (!context) {
    throw new Error("useAdminData must be used within an AdminDataProvider");
  }
  return context;
}
