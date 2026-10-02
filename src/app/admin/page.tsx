"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { AdminLoginScreen } from "@/components/admin/AdminLoginScreen";
import { AdminSidebar, AdminTab } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { OverviewTab } from "@/components/admin/tabs/OverviewTab";
import { HackathonsTab } from "@/components/admin/tabs/HackathonsTab";
import { UsersTeamsTab } from "@/components/admin/tabs/UsersTeamsTab";
import { RegistrationsTab } from "@/components/admin/tabs/RegistrationsTab";
import { EventsTab } from "@/components/admin/tabs/EventsTab";
import { InquiriesTab } from "@/components/admin/tabs/InquiriesTab";
import { NewslettersTab } from "@/components/admin/tabs/NewslettersTab";
import { AuditLogsTab } from "@/components/admin/tabs/AuditLogsTab";
import { CreateHackathonModal } from "@/components/admin/modals/CreateHackathonModal";
import { CreateEventModal } from "@/components/admin/modals/CreateEventModal";
import { EditUserModal } from "@/components/admin/modals/EditUserModal";
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
import { Loader2, ShieldAlert, LogOut, ArrowRight, Shield } from "lucide-react";

export default function AdminPage() {
  const { data: session, status: authStatus } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminEmail, setAdminEmail] = useState("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isCreateHackathonOpen, setIsCreateHackathonOpen] = useState(false);
  const [editingHackathon, setEditingHackathon] = useState<DbHackathon | null>(null);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<DbUserProfile | null>(null);

  // Data states
  const [stats, setStats] = useState({
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

  // Check role-based NextAuth session or emergency local passcode
  useEffect(() => {
    if (authStatus === "loading") return;

    // 1. NextAuth user has admin role in session (case-insensitive)
    const isUserAdmin = String(session?.user?.role || "").toLowerCase().trim() === "admin";
    if (isUserAdmin) {
      setIsAuthenticated(true);
      setAdminEmail(session?.user?.email || "admin@nexhack.com");
      return;
    }

    // 2. Direct real-time database role check via /api/user/role if session exists
    if (session?.user) {
      fetch("/api/user/role")
        .then((res) => res.json())
        .then((data) => {
          if (data?.isAdmin) {
            setIsAuthenticated(true);
            setAdminEmail(data.email || session.user?.email || "admin@nexhack.com");
          } else {
            checkLocalPasscode();
          }
        })
        .catch(() => {
          checkLocalPasscode();
        });
      return;
    }

    checkLocalPasscode();

    function checkLocalPasscode() {
      // 3. Emergency master passcode in sessionStorage
      try {
        const storedToken = sessionStorage.getItem("nexhack_admin_token");
        const storedEmail = sessionStorage.getItem("nexhack_admin_email");
        if (storedToken) {
          setIsAuthenticated(true);
          setAdminEmail(storedEmail || "admin@nexhack.internal");
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }
  }, [session, authStatus]);

  // Fetch all admin data
  const fetchData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const [
        statsRes,
        hackathonsRes,
        teamsRes,
        usersRes,
        registrationsRes,
        eventsRes,
        inquiriesRes,
        newslettersRes,
        logsRes,
      ] = await Promise.allSettled([
        fetch("/api/admin/stats").then((r) => r.json()),
        fetch("/api/admin/hackathons").then((r) => r.json()),
        fetch("/api/admin/teams").then((r) => r.json()),
        fetch("/api/admin/users").then((r) => r.json()),
        fetch("/api/admin/registrations").then((r) => r.json()),
        fetch("/api/admin/events").then((r) => r.json()),
        fetch("/api/admin/inquiries").then((r) => r.json()),
        fetch("/api/admin/newsletters").then((r) => r.json()),
        fetch("/api/admin/logs").then((r) => r.json()),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value?.success) {
        setStats((prev) => ({ ...prev, ...statsRes.value.stats }));
      }
      if (hackathonsRes.status === "fulfilled" && hackathonsRes.value?.success) {
        setHackathons(hackathonsRes.value.hackathons || []);
      }
      if (teamsRes.status === "fulfilled" && teamsRes.value?.success) {
        const tList = teamsRes.value.teams || [];
        setTeams(tList);
        setStats((prev) => ({ ...prev, teams: tList.length }));
      }
      if (usersRes.status === "fulfilled" && usersRes.value?.success) {
        const uList = usersRes.value.users || [];
        setUsers(uList);
        setStats((prev) => ({ ...prev, users: uList.length }));
      }
      if (registrationsRes.status === "fulfilled" && registrationsRes.value?.success) {
        setRegistrations(registrationsRes.value.registrations || []);
      }
      if (eventsRes.status === "fulfilled" && eventsRes.value?.success) {
        setEvents(eventsRes.value.events || []);
      }
      if (inquiriesRes.status === "fulfilled" && inquiriesRes.value?.success) {
        setInquiries(inquiriesRes.value.inquiries || []);
      }
      if (newslettersRes.status === "fulfilled" && newslettersRes.value?.success) {
        setNewsletters(newslettersRes.value.newsletters || []);
      }
      if (logsRes.status === "fulfilled" && logsRes.value?.success) {
        setLogs(logsRes.value.logs || []);
      }
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleLoginSuccess = (token: string, email: string) => {
    sessionStorage.setItem("nexhack_admin_token", token);
    sessionStorage.setItem("nexhack_admin_email", email);
    setAdminEmail(email);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    sessionStorage.removeItem("nexhack_admin_token");
    sessionStorage.removeItem("nexhack_admin_email");
    setIsAuthenticated(false);
    setAdminEmail("");
    if (session?.user) {
      await signOut({ callbackUrl: "/" });
    }
  };

  // Hackathons Actions
  const handleSaveHackathon = async (data: Partial<DbHackathon>) => {
    const isEditing = !!editingHackathon?.id;
    const url = "/api/admin/hackathons";
    const method = isEditing ? "PUT" : "POST";
    const body = isEditing ? { id: editingHackathon!.id, ...data } : data;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.error || "Failed to save hackathon");
    }
    fetchData();
  };

  const handleDeleteHackathon = async (id: string) => {
    const res = await fetch(`/api/admin/hackathons?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || "Failed to delete hackathon");
    }
    fetchData();
  };

  const handleUpdateHackathonStatus = async (
    id: string,
    status: DbHackathon["status"]
  ) => {
    await fetch("/api/admin/hackathons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchData();
  };

  // Teams & Users Actions
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

  // Registrations Actions
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

  // Events Actions
  const handleCreateEvent = async (data: Partial<DbEventSession>) => {
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const resData = await res.json();
    if (!res.ok || !resData.success) {
      throw new Error(resData.error || "Failed to schedule workshop");
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

  // Campus Inquiries Actions
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

  // Newsletters Actions
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

  // Loading initial auth state
  if (isAuthenticated === null || authStatus === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  // Signed in via OAuth but not an administrator
  if (!isAuthenticated && session?.user && session.user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1.5">Admin Permissions Required</h2>
          <p className="text-xs text-slate-600 mb-6 leading-relaxed">
            Signed in as <strong className="text-slate-900">{session.user.email}</strong>.<br />
            Your current platform role is <span className="text-amber-700 font-semibold px-2 py-0.5 rounded bg-amber-100">{session.user.role || "user"}</span>.
            Administrator permissions are required to access this portal.
          </p>

          <div className="space-y-3">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <span>Return to Public Website</span>
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/signin?callbackUrl=/admin" })}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 flex items-center justify-center gap-2 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Switch / Sign Out Account</span>
            </button>
            <div className="pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-xs text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                Use Emergency Master Passcode Instead
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Not authenticated screen
  if (!isAuthenticated) {
    return <AdminLoginScreen onSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar Navigation */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        stats={stats}
        adminEmail={adminEmail}
        onLogout={handleLogout}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          onOpenMobile={() => setIsMobileNavOpen(true)}
          onRefresh={fetchData}
          isRefreshing={isRefreshing}
          actionLabel={
            activeTab === "hackathons"
              ? "Add Hackathon"
              : activeTab === "events"
              ? "New Workshop"
              : undefined
          }
          onActionClick={
            activeTab === "hackathons"
              ? () => {
                  setEditingHackathon(null);
                  setIsCreateHackathonOpen(true);
                }
              : activeTab === "events"
              ? () => setIsCreateEventOpen(true)
              : undefined
          }
        />

        {/* Tab Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              registrations={registrations}
              inquiries={inquiries}
              hackathons={hackathons}
              onSelectTab={setActiveTab}
              onOpenCreateHackathon={() => {
                setEditingHackathon(null);
                setIsCreateHackathonOpen(true);
              }}
              onOpenCreateEvent={() => setIsCreateEventOpen(true)}
            />
          )}

          {activeTab === "hackathons" && (
            <HackathonsTab
              hackathons={hackathons}
              onOpenCreate={() => {
                setEditingHackathon(null);
                setIsCreateHackathonOpen(true);
              }}
              onEdit={(h) => {
                setEditingHackathon(h);
                setIsCreateHackathonOpen(true);
              }}
              onDelete={handleDeleteHackathon}
              onUpdateStatus={handleUpdateHackathonStatus}
            />
          )}

          {activeTab === "users-teams" && (
            <UsersTeamsTab
              teams={teams}
              users={users}
              onDeleteTeam={handleDeleteTeam}
              onDeleteUser={handleDeleteUser}
              onUpdateRole={handleUpdateUserRole}
              onEditUser={(u) => {
                setEditingUser(u);
                setIsEditUserOpen(true);
              }}
            />
          )}

          {activeTab === "registrations" && (
            <RegistrationsTab
              registrations={registrations}
              onUpdateStatus={handleUpdateRegistrationStatus}
              onDelete={handleDeleteRegistration}
            />
          )}

          {activeTab === "events" && (
            <EventsTab
              events={events}
              onOpenCreate={() => setIsCreateEventOpen(true)}
              onDelete={handleDeleteEvent}
            />
          )}

          {activeTab === "inquiries" && (
            <InquiriesTab
              inquiries={inquiries}
              onUpdateStatus={handleUpdateInquiryStatus}
              onDelete={handleDeleteInquiry}
            />
          )}

          {activeTab === "newsletters" && (
            <NewslettersTab
              newsletters={newsletters}
              onDelete={handleDeleteNewsletter}
            />
          )}

          {activeTab === "logs" && <AuditLogsTab logs={logs} />}
        </main>
      </div>

      {/* Modals */}
      <CreateHackathonModal
        isOpen={isCreateHackathonOpen}
        onClose={() => {
          setIsCreateHackathonOpen(false);
          setEditingHackathon(null);
        }}
        onSubmit={handleSaveHackathon}
        initialData={editingHackathon}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={() => setIsCreateEventOpen(false)}
        onSubmit={handleCreateEvent}
      />

      <EditUserModal
        isOpen={isEditUserOpen}
        user={editingUser}
        onClose={() => {
          setIsEditUserOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUpdateUserDetails}
      />
    </div>
  );
}
