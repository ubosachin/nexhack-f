"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Loader2, ShieldAlert, LogOut, ArrowRight, Shield } from "lucide-react";
import { AdminDataProvider, useAdminData } from "./AdminDataContext";
import { AdminSidebar } from "./AdminSidebar";
import { AdminLoginScreen } from "./AdminLoginScreen";
import { CreateHackathonModal } from "./modals/CreateHackathonModal";
import { CreateEventModal } from "./modals/CreateEventModal";
import { EditUserModal } from "./modals/EditUserModal";

function AdminShellContent({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const {
    isAuthenticated,
    authStatus,
    handleLoginSuccess,
    isCreateHackathonOpen,
    closeCreateHackathon,
    handleSaveHackathon,
    editingHackathon,
    isCreateEventOpen,
    closeCreateEvent,
    handleCreateEvent,
    isEditUserOpen,
    editingUser,
    closeEditUser,
    handleUpdateUserDetails,
  } = useAdminData();

  // 1. Loading state
  if (isAuthenticated === null || authStatus === "loading") {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-500 gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-medium text-slate-400">Verifying administrative credentials...</p>
      </div>
    );
  }

  // 2. Permission Denied screen (Signed in but not admin role)
  if (session?.user && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md w-full text-center shadow-xl shadow-slate-200/50">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center mx-auto mb-6 text-rose-600">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">Access Restricted</h2>
          <p className="text-sm text-slate-600 mb-6 leading-relaxed">
            Your signed-in account{" "}
            <span className="font-semibold text-slate-900">({session.user.email})</span> does
            not have administrator privileges on NexHack.
          </p>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 mb-6 text-left">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-700">Role Requirement</span>
            </div>
            <p className="text-xs text-slate-500">
              Only users with <code className="text-indigo-600 font-mono font-bold bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">admin</code> role in MongoDB or listed in <code className="text-slate-600 font-mono bg-slate-200/60 px-1 rounded">ADMIN_EMAILS</code> can access this console.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center gap-2 shadow-sm shadow-indigo-600/20 transition-all"
            >
              <span>Return to Public Website</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/admin" })}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign In with Different Account</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Not authenticated -> Login Screen (OAuth + Passcode/OTP)
  if (!isAuthenticated) {
    return <AdminLoginScreen onSuccess={handleLoginSuccess} />;
  }

  // 4. Authenticated -> Full Shell with Sidebar, Header & Modals
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Persistent Left Sidebar */}
      <AdminSidebar
        isOpenMobile={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen w-full">
        {children}
      </div>

      {/* Global Modals */}
      <CreateHackathonModal
        isOpen={isCreateHackathonOpen}
        onClose={closeCreateHackathon}
        onSubmit={handleSaveHackathon}
        initialData={editingHackathon}
      />

      <CreateEventModal
        isOpen={isCreateEventOpen}
        onClose={closeCreateEvent}
        onSubmit={handleCreateEvent}
      />

      <EditUserModal
        isOpen={isEditUserOpen}
        user={editingUser}
        onClose={closeEditUser}
        onSubmit={handleUpdateUserDetails}
      />
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AdminDataProvider>
      <AdminShellContent>{children}</AdminShellContent>
    </AdminDataProvider>
  );
}
