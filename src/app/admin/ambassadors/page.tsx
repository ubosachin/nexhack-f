"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAdminData } from "@/components/admin/AdminDataContext";
import { AmbassadorsTab } from "@/components/admin/tabs/AmbassadorsTab";

export default function AdminAmbassadorsPage() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const {
    ambassadorApplications,
    handleUpdateAmbassadorStatus,
    handleDeleteAmbassador,
  } = useAdminData();

  return (
    <>
      <AdminHeader onOpenMobile={() => setIsMobileOpen(true)} />
      <main className="flex-1 p-4 sm:p-8 space-y-6 max-w-7xl w-full mx-auto">
        <div className="space-y-1">
          <h1 className="text-xl font-black text-slate-900">Campus Ambassadors</h1>
          <p className="text-xs text-slate-500">
            Review and manage applications from students who want to lead NEXHACK chapters on their campuses.
          </p>
        </div>
        <AmbassadorsTab
          applications={ambassadorApplications}
          onUpdateStatus={handleUpdateAmbassadorStatus}
          onDelete={handleDeleteAmbassador}
        />
      </main>
    </>
  );
}
